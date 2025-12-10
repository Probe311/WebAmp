#pragma once

#include "audio_engine.h"
#include <string>
#include <thread>
#include <atomic>
#include <functional>
#include <memory>

namespace webamp {

// Serveur WebSocket TLS pour communication avec le frontend
class WebSocketServer {
public:
    using MessageHandler = std::function<void(const std::string& message)>;
    
    WebSocketServer();
    ~WebSocketServer();
    
    // Initialisation
    bool initialize(uint16_t port = 8765, const std::string& certPath = "", const std::string& keyPath = "");
    void shutdown();
    
    // Contrôle
    bool start();
    bool stop();
    bool isRunning() const { return running_; }
    
    // Envoi de messages
    bool sendMessage(const std::string& message);
    bool sendBinary(const void* data, size_t size);
    
    // Handlers
    void setMessageHandler(MessageHandler handler) { message_handler_ = handler; }
    void setConnectionHandler(std::function<void(bool connected)> handler) { connection_handler_ = handler; }
    
    // Port
    uint16_t getPort() const { return port_; }
    
private:
    // Thread de serveur
    void serverThread();
    
    // Gestion des connexions
    void handleConnection();
    void handleMessage(const std::string& message);
    
    // Implémentation WebSocket (simplifiée pour MVP)
    // En production, utiliser libwebsockets ou Boost.Beast
    class Impl;
    std::unique_ptr<Impl> impl_;
    
    uint16_t port_;
    std::string cert_path_;
    std::string key_path_;
    
    std::atomic<bool> running_;
    std::atomic<bool> initialized_;
    std::thread server_thread_;
    
    MessageHandler message_handler_;
    std::function<void(bool)> connection_handler_;
};

} // namespace webamp

