#include "audio_engine.h"
#include "websocket_server.h"
#include "dsp_pipeline.h"
#include "effect_chain.h"
#include "effect_manager.h"
#include "json_parser.h"
#include <iostream>
#include <string>
#include <csignal>
#include <atomic>
#include <thread>
#include <chrono>
#include <sstream>

using namespace webamp;

// Signal handler pour arrêt propre
std::atomic<bool> g_running{true};

void signalHandler(int signal) {
    std::cout << "\nSignal reçu (" << signal << "), arrêt en cours...\n";
    g_running = false;
}

// Parser de messages WebSocket avec gestion complète des effets
void handleWebSocketMessage(const std::string& message, AudioEngine& engine, WebSocketServer& server, EffectManager& effectManager) {
    auto data = JsonParser::parse(message);
    std::string type = JsonParser::getString(data, "type");
    
    if (type == "start") {
        engine.start();
        server.sendMessage("{\"type\":\"status\",\"running\":true}");
    }
    else if (type == "stop") {
        engine.stop();
        server.sendMessage("{\"type\":\"status\",\"running\":false}");
    }
    else if (type == "getStats") {
        auto stats = engine.getStats();
        std::ostringstream response;
        response << "{\"type\":\"stats\",\"cpu\":" << stats.cpuUsage
                 << ",\"latency\":" << stats.latency
                 << ",\"peakInput\":" << stats.peakInput
                 << ",\"peakOutput\":" << stats.peakOutput << "}";
        server.sendMessage(response.str());
    }
    else if (type == "addEffect") {
        std::string effectType = JsonParser::getString(data, "effectType");
        std::string pedalId = JsonParser::getString(data, "pedalId");
        int position = JsonParser::getInt(data, "position", -1);
        std::string requestedId = JsonParser::getString(data, "effectId", "");
        
        if (effectType.empty()) {
            server.sendMessage("{\"type\":\"error\",\"message\":\"effectType manquant\"}");
            return;
        }
        
        size_t pos = (position == -1) ? static_cast<size_t>(-1) : static_cast<size_t>(position);
        std::string effectId = effectManager.addEffect(effectType, pedalId, pos, requestedId);
        
        if (effectId.empty()) {
            server.sendMessage("{\"type\":\"error\",\"message\":\"Impossible de créer l'effet\"}");
        } else {
            // Si c'est une prévisualisation (ID commence par "preview-"), activer le générateur de test
            if (requestedId.find("preview-") == 0) {
                auto pipeline = engine.getPipeline();
                if (pipeline) {
                    pipeline->enableTestTone(true);
                    pipeline->setTestToneFrequency(440.0f);  // La4
                    pipeline->setTestToneAmplitude(0.3f);    // 30%
                }
            }
            
            std::ostringstream response;
            response << "{\"type\":\"ack\",\"effectId\":\"" << effectId << "\"}";
            server.sendMessage(response.str());
        }
    }
    else if (type == "removeEffect") {
        std::string effectId = JsonParser::getString(data, "effectId");
        
        if (effectId.empty()) {
            server.sendMessage("{\"type\":\"error\",\"message\":\"effectId manquant\"}");
            return;
        }
        
        // Vérifier si c'était une prévisualisation
        bool wasPreview = (effectId.find("preview-") == 0);
        
        if (effectManager.removeEffect(effectId)) {
            // Si c'était une prévisualisation, vérifier s'il reste d'autres effets de prévisualisation
            if (wasPreview) {
                auto chain = effectManager.getChain();
                bool hasPreviewEffects = false;
                if (chain) {
                    // Vérifier s'il reste des effets de prévisualisation
                    // (simplifié : on désactive toujours le générateur si on retire une prévisualisation)
                    auto pipeline = engine.getPipeline();
                    if (pipeline) {
                        pipeline->enableTestTone(false);
                    }
                }
            }
            
            server.sendMessage("{\"type\":\"ack\"}");
        } else {
            server.sendMessage("{\"type\":\"error\",\"message\":\"Effet non trouvé\"}");
        }
    }
    else if (type == "setParameter") {
        std::string effectId = JsonParser::getString(data, "effectId");
        std::string parameter = JsonParser::getString(data, "parameter");
        double value = JsonParser::getDouble(data, "value");
        
        if (effectId.empty() || parameter.empty()) {
            server.sendMessage("{\"type\":\"error\",\"message\":\"effectId ou parameter manquant\"}");
            return;
        }
        
        if (effectManager.setParameter(effectId, parameter, static_cast<float>(value))) {
            server.sendMessage("{\"type\":\"ack\"}");
        } else {
            server.sendMessage("{\"type\":\"error\",\"message\":\"Impossible de définir le paramètre\"}");
        }
    }
    else if (type == "moveEffect") {
        std::string effectId = JsonParser::getString(data, "effectId");
        int toPosition = JsonParser::getInt(data, "toPosition", -1);
        
        if (effectId.empty() || toPosition < 0) {
            server.sendMessage("{\"type\":\"error\",\"message\":\"effectId ou toPosition invalide\"}");
            return;
        }
        
        if (effectManager.moveEffect(effectId, static_cast<size_t>(toPosition))) {
            server.sendMessage("{\"type\":\"ack\"}");
        } else {
            server.sendMessage("{\"type\":\"error\",\"message\":\"Impossible de déplacer l'effet\"}");
        }
    }
    else if (type == "toggleBypass") {
        std::string effectId = JsonParser::getString(data, "effectId");
        bool bypassed = JsonParser::getBool(data, "bypassed", false);
        
        if (effectId.empty()) {
            server.sendMessage("{\"type\":\"error\",\"message\":\"effectId manquant\"}");
            return;
        }
        
        if (effectManager.toggleBypass(effectId, bypassed)) {
            server.sendMessage("{\"type\":\"ack\"}");
        } else {
            server.sendMessage("{\"type\":\"error\",\"message\":\"Impossible de changer le bypass\"}");
        }
    }
    else if (type == "setAmplifier") {
        std::string amplifierId = JsonParser::getString(data, "amplifierId");
        // Les amplificateurs sont principalement gérés côté frontend avec Web Audio API
        // Le backend peut être utilisé pour des traitements avancés (ex: modèles NAM)
        server.sendMessage("{\"type\":\"ack\"}");
    }
    else if (type == "setAmplifierParameter") {
        std::string amplifierId = JsonParser::getString(data, "amplifierId");
        std::string parameter = JsonParser::getString(data, "parameter");
        double value = JsonParser::getDouble(data, "value");
        // Les paramètres d'amplificateur sont principalement gérés côté frontend
        // Le backend peut être utilisé pour des traitements avancés (ex: modèles NAM)
        server.sendMessage("{\"type\":\"ack\"}");
    }
    else if (type == "loadNAMModel") {
        std::string filePath = JsonParser::getString(data, "filePath");
        auto pipeline = engine.getPipeline();
        if (pipeline) {
            bool success = pipeline->loadNAMModel(filePath);
            if (success) {
                server.sendMessage("{\"type\":\"ack\"}");
            } else {
                server.sendMessage("{\"type\":\"error\",\"message\":\"Échec du chargement du modèle NAM\"}");
            }
        } else {
            server.sendMessage("{\"type\":\"error\",\"message\":\"DSP pipeline non disponible\"}");
        }
    }
    else if (type == "setNAMModelActive") {
        bool active = JsonParser::getBool(data, "active", false);
        auto pipeline = engine.getPipeline();
        if (pipeline) {
            pipeline->setNAMModelActive(active);
            server.sendMessage("{\"type\":\"ack\"}");
        } else {
            server.sendMessage("{\"type\":\"error\",\"message\":\"DSP pipeline non disponible\"}");
        }
    }
    else if (type == "setEqualizerParameter") {
        std::string parameter = JsonParser::getString(data, "parameter");
        // L'égaliseur est géré côté frontend avec Web Audio API
        // On envoie juste un ack pour confirmer la réception
        // TODO: Si besoin, implémenter un égaliseur global côté native
        server.sendMessage("{\"type\":\"ack\"}");
    }
    else {
        std::ostringstream response;
        response << "{\"type\":\"error\",\"message\":\"Type de message inconnu: " << type << "\"}";
        server.sendMessage(response.str());
    }
}

int main(int argc, char* argv[]) {
    std::cout << "=== WebAmp Native Helper ===\n";
    std::cout << "Initialisation...\n";
    
    // Signal handlers
    std::signal(SIGINT, signalHandler);
    std::signal(SIGTERM, signalHandler);
    
    // Audio Engine
    AudioEngine engine;
    std::string driverName = "auto";
    
    if (argc > 1) {
        driverName = argv[1];
    }
    
    if (!engine.initialize(driverName)) {
        std::cerr << "Erreur: Impossible d'initialiser l'engine audio\n";
        return 1;
    }
    
    std::cout << "Sample rate: " << engine.getSampleRate() << " Hz\n";
    std::cout << "Buffer size: " << engine.getBufferSize() << " samples\n";
    std::cout << "Latence totale: " << (engine.getTotalLatency() * 1000.0) << " ms\n";
    
    // Effect Chain et Manager
    auto effectChain = std::make_shared<EffectChain>();
    auto pipeline = engine.getPipeline();
    if (pipeline) {
        pipeline->setEffectChain(effectChain);
    }
    
    EffectManager effectManager;
    effectManager.initialize(effectChain);
    
    // WebSocket Server
    WebSocketServer server;
    server.setMessageHandler([&engine, &server, &effectManager](const std::string& msg) {
        handleWebSocketMessage(msg, engine, server, effectManager);
    });
    
    server.setConnectionHandler([](bool connected) {
        std::cout << "Client " << (connected ? "connecté" : "déconnecté") << "\n";
    });
    
    if (!server.initialize(8765)) {
        std::cerr << "Erreur: Impossible d'initialiser le serveur WebSocket\n";
        engine.shutdown();
        return 1;
    }
    
    if (!server.start()) {
        std::cerr << "Erreur: Impossible de démarrer le serveur WebSocket\n";
        server.shutdown();
        engine.shutdown();
        return 1;
    }
    
    std::cout << "Serveur WebSocket démarré sur le port " << server.getPort() << "\n";
    std::cout << "En attente de connexions...\n";
    
    // Boucle principale
    while (g_running) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        
        // Envoi périodique des stats
        static auto lastStats = std::chrono::steady_clock::now();
        auto now = std::chrono::steady_clock::now();
        if (std::chrono::duration_cast<std::chrono::milliseconds>(now - lastStats).count() > 100) {
            if (engine.isRunning()) {
                auto stats = engine.getStats();
                std::ostringstream statsMsg;
                statsMsg << "{\"type\":\"stats\",\"cpu\":" << stats.cpuUsage
                         << ",\"latency\":" << stats.latency
                         << ",\"peakInput\":" << stats.peakInput
                         << ",\"peakOutput\":" << stats.peakOutput << "}";
                server.sendMessage(statsMsg.str());
            }
            lastStats = now;
        }
    }
    
    // Arrêt propre
    std::cout << "\nArrêt en cours...\n";
    effectManager.shutdown();
    server.stop();
    server.shutdown();
    engine.stop();
    engine.shutdown();
    
    std::cout << "Arrêt terminé.\n";
    return 0;
}

