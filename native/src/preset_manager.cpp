#include "../include/preset_manager.h"
#include <fstream>
#include <sstream>
#include <algorithm>
#include <filesystem>

namespace webamp {

PresetManager::PresetManager()
    : storage_path_("presets")
{
    // Créer le répertoire s'il n'existe pas
    try {
        std::filesystem::create_directories(storage_path_);
    } catch (...) {
        // Ignorer les erreurs
    }
}

PresetManager::~PresetManager() {
}

bool PresetManager::savePreset(const std::string& name, std::shared_ptr<EffectChain> chain, const std::string& description) {
    if (!chain) {
        return false;
    }
    
    Preset preset;
    preset.name = name;
    preset.description = description;
    
    // Sauvegarder depuis la chaîne d'effets
    auto chainPreset = chain->savePreset(name);
    preset.effectTypes = chainPreset.effectTypes;
    preset.parameters = chainPreset.parameters;
    
    // Supprimer l'ancien preset s'il existe
    deletePreset(name);
    
    // Ajouter le nouveau preset
    presets_.push_back(preset);
    
    // Sauvegarder dans un fichier
    std::string filePath = storage_path_ + "/" + name + ".json";
    return savePresetToFile(filePath, preset);
}

bool PresetManager::savePresetToFile(const std::string& filePath, const Preset& preset) {
    try {
        std::ofstream file(filePath);
        if (!file.is_open()) {
            return false;
        }
        
        file << presetToJSON(preset);
        file.close();
        return true;
    } catch (...) {
        return false;
    }
}

bool PresetManager::loadPreset(const std::string& name, std::shared_ptr<EffectChain> chain) {
    if (!chain) {
        return false;
    }
    
    // Chercher dans la liste en mémoire
    auto it = std::find_if(presets_.begin(), presets_.end(),
        [&name](const Preset& p) { return p.name == name; });
    
    if (it != presets_.end()) {
        EffectChain::Preset chainPreset;
        chainPreset.name = it->name;
        chainPreset.effectTypes = it->effectTypes;
        chainPreset.parameters = it->parameters;
        chain->loadPreset(chainPreset);
        return true;
    }
    
    // Essayer de charger depuis un fichier
    std::string filePath = storage_path_ + "/" + name + ".json";
    Preset preset;
    if (loadPresetFromFile(filePath, preset)) {
        presets_.push_back(preset);
        EffectChain::Preset chainPreset;
        chainPreset.name = preset.name;
        chainPreset.effectTypes = preset.effectTypes;
        chainPreset.parameters = preset.parameters;
        chain->loadPreset(chainPreset);
        return true;
    }
    
    return false;
}

bool PresetManager::loadPresetFromFile(const std::string& filePath, Preset& preset) {
    try {
        std::ifstream file(filePath);
        if (!file.is_open()) {
            return false;
        }
        
        std::stringstream buffer;
        buffer << file.rdbuf();
        file.close();
        
        return presetFromJSON(buffer.str(), preset);
    } catch (...) {
        return false;
    }
}

std::vector<std::string> PresetManager::getPresetNames() const {
    std::vector<std::string> names;
    for (const auto& preset : presets_) {
        names.push_back(preset.name);
    }
    return names;
}

PresetManager::Preset PresetManager::getPreset(const std::string& name) const {
    auto it = std::find_if(presets_.begin(), presets_.end(),
        [&name](const Preset& p) { return p.name == name; });
    
    if (it != presets_.end()) {
        return *it;
    }
    
    return Preset{};
}

bool PresetManager::deletePreset(const std::string& name) {
    // Supprimer de la liste
    auto it = std::remove_if(presets_.begin(), presets_.end(),
        [&name](const Preset& p) { return p.name == name; });
    
    if (it != presets_.end()) {
        presets_.erase(it, presets_.end());
    }
    
    // Supprimer le fichier
    std::string filePath = storage_path_ + "/" + name + ".json";
    try {
        std::filesystem::remove(filePath);
        return true;
    } catch (...) {
        return false;
    }
}

std::string PresetManager::presetToJSON(const Preset& preset) const {
    std::ostringstream json;
    json << "{\n";
    json << "  \"name\": \"" << preset.name << "\",\n";
    json << "  \"description\": \"" << preset.description << "\",\n";
    json << "  \"effects\": [\n";
    
    for (size_t i = 0; i < preset.effectTypes.size(); ++i) {
        json << "    {\n";
        json << "      \"type\": \"" << preset.effectTypes[i] << "\",\n";
        json << "      \"parameters\": {\n";
        
        if (i < preset.parameters.size()) {
            const auto& params = preset.parameters[i];
            for (size_t j = 0; j < params.size(); ++j) {
                json << "        \"" << params[j].first << "\": " << params[j].second;
                if (j < params.size() - 1) {
                    json << ",";
                }
                json << "\n";
            }
        }
        
        json << "      }\n";
        json << "    }";
        if (i < preset.effectTypes.size() - 1) {
            json << ",";
        }
        json << "\n";
    }
    
    json << "  ]\n";
    json << "}\n";
    
    return json.str();
}

bool PresetManager::presetFromJSON(const std::string& json, Preset& preset) const {
    // Parser JSON simplifié (pour MVP)
    // En production, utiliser une lib JSON (rapidjson, nlohmann/json...)
    
    // Chercher le nom
    size_t namePos = json.find("\"name\"");
    if (namePos != std::string::npos) {
        size_t start = json.find("\"", namePos + 6) + 1;
        size_t end = json.find("\"", start);
        if (end != std::string::npos) {
            preset.name = json.substr(start, end - start);
        }
    }
    
    // Chercher la description
    size_t descPos = json.find("\"description\"");
    if (descPos != std::string::npos) {
        size_t start = json.find("\"", descPos + 13) + 1;
        size_t end = json.find("\"", start);
        if (end != std::string::npos) {
            preset.description = json.substr(start, end - start);
        }
    }
    
    // Parser les effets (simplifié)
    size_t effectsPos = json.find("\"effects\"");
    if (effectsPos == std::string::npos) {
        return false;
    }
    
    // Pour MVP, on fait un parsing basique
    // En production, utiliser une vraie lib JSON
    size_t pos = effectsPos;
    while ((pos = json.find("\"type\"", pos)) != std::string::npos) {
        size_t start = json.find("\"", pos + 6) + 1;
        size_t end = json.find("\"", start);
        if (end != std::string::npos) {
            std::string type = json.substr(start, end - start);
            preset.effectTypes.push_back(type);
            
            // Parser les paramètres pour cet effet
            std::vector<std::pair<std::string, float>> params;
            size_t paramsPos = json.find("\"parameters\"", pos);
            if (paramsPos != std::string::npos) {
                // Parser simplifié des paramètres
                // TODO: Parser complet avec une lib JSON
            }
            preset.parameters.push_back(params);
        }
        pos = end;
    }
    
    return !preset.effectTypes.empty();
}

} // namespace webamp

