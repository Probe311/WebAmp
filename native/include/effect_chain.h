#pragma once

#include "effect_base.h"
#include <vector>
#include <memory>
#include <mutex>
#include <cstdint>

namespace webamp {

// Chaîne d'effets : ordre modifiable, gestion des presets
class EffectChain {
public:
    EffectChain();
    ~EffectChain();
    
    // Ajout/suppression d'effets
    void addEffect(std::shared_ptr<EffectBase> effect, size_t position = static_cast<size_t>(-1));
    void removeEffect(size_t index);
    void clear();
    
    // Réordonnancement
    void moveEffect(size_t from, size_t to);
    void swapEffects(size_t index1, size_t index2);
    
    // Accès
    std::shared_ptr<EffectBase> getEffect(size_t index) const;
    size_t getEffectCount() const;
    
    // Traitement (applique tous les effets dans l'ordre)
    // Optimisé pour supporter jusqu'à 20 effets simultanés
    void process(float* input, float* output, uint32_t frameCount);
    
    // Limite maximale d'effets pour performance
    static constexpr size_t MAX_EFFECTS = 20;
    
    // Presets
    struct Preset {
        std::string name;
        std::vector<std::string> effectTypes;  // Types d'effets dans l'ordre
        std::vector<std::vector<std::pair<std::string, float>>> parameters;  // Paramètres par effet
    };
    
    Preset savePreset(const std::string& name) const;
    void loadPreset(const Preset& preset);
    
    // Thread-safety
    void lock() const { mutex_.lock(); }
    void unlock() const { mutex_.unlock(); }
    
private:
    std::vector<std::shared_ptr<EffectBase>> effects_;
    mutable std::mutex mutex_;
    
    // Factory pour créer des effets
    std::shared_ptr<EffectBase> createEffect(const std::string& type) const;
};

} // namespace webamp

