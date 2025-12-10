#pragma once

#include "effect_chain.h"
#include "effect_base.h"
#include <string>
#include <unordered_map>
#include <memory>
#include <mutex>

namespace webamp {

// Gestionnaire d'effets avec mapping ID -> effet
class EffectManager {
public:
    EffectManager();
    ~EffectManager();
    
    // Initialisation
    void initialize(std::shared_ptr<EffectChain> chain);
    void shutdown();
    
    // Gestion des effets par ID
    std::string addEffect(const std::string& effectType, const std::string& pedalId, size_t position = static_cast<size_t>(-1), const std::string& requestedId = "");
    bool removeEffect(const std::string& effectId);
    bool setParameter(const std::string& effectId, const std::string& parameter, float value);
    bool moveEffect(const std::string& effectId, size_t toPosition);
    bool toggleBypass(const std::string& effectId, bool bypassed);
    
    // Accès
    std::shared_ptr<EffectBase> getEffect(const std::string& effectId) const;
    size_t getEffectIndex(const std::string& effectId) const;
    std::shared_ptr<EffectChain> getChain() const { return chain_; }
    
private:
    std::shared_ptr<EffectChain> chain_;
    std::unordered_map<std::string, std::shared_ptr<EffectBase>> effects_by_id_;
    std::unordered_map<std::string, size_t> effect_positions_;
    mutable std::mutex mutex_;
    
    // Factory pour créer des effets
    std::shared_ptr<EffectBase> createEffect(const std::string& type) const;
    std::string generateEffectId() const;
};

} // namespace webamp

