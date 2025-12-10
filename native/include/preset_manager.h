#pragma once

#include "effect_chain.h"
#include <string>
#include <vector>
#include <memory>

namespace webamp {

// Gestionnaire de presets pour sauvegarder/charger des configurations
class PresetManager {
public:
    struct Preset {
        std::string name;
        std::string description;
        std::vector<std::string> effectTypes;
        std::vector<std::vector<std::pair<std::string, float>>> parameters;
        std::string irPath; // Chemin vers l'IR si applicable
    };
    
    PresetManager();
    ~PresetManager();
    
    // Sauvegarder un preset
    bool savePreset(const std::string& name, std::shared_ptr<EffectChain> chain, const std::string& description = "");
    bool savePresetToFile(const std::string& filePath, const Preset& preset);
    
    // Charger un preset
    bool loadPreset(const std::string& name, std::shared_ptr<EffectChain> chain);
    bool loadPresetFromFile(const std::string& filePath, Preset& preset);
    
    // Liste des presets
    std::vector<std::string> getPresetNames() const;
    Preset getPreset(const std::string& name) const;
    
    // Supprimer un preset
    bool deletePreset(const std::string& name);
    
    // Répertoire de stockage
    void setStoragePath(const std::string& path) { storage_path_ = path; }
    std::string getStoragePath() const { return storage_path_; }
    
private:
    std::vector<Preset> presets_;
    std::string storage_path_;
    
    // Helpers pour JSON
    std::string presetToJSON(const Preset& preset) const;
    bool presetFromJSON(const std::string& json, Preset& preset) const;
};

} // namespace webamp

