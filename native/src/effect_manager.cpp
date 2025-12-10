#include "effect_manager.h"
#include "../include/effects/distortion.h"
#include "../include/effects/overdrive.h"
#include "../include/effects/fuzz.h"
#include "../include/effects/chorus.h"
#include "../include/effects/flanger.h"
#include "../include/effects/tremolo.h"
#include "../include/effects/eq.h"
#include "../include/effects/delay.h"
#include "../include/effects/reverb.h"
#include <random>
#include <sstream>
#include <algorithm>
#include <atomic>

namespace webamp {

EffectManager::EffectManager() {
}

EffectManager::~EffectManager() {
    shutdown();
}

void EffectManager::initialize(std::shared_ptr<EffectChain> chain) {
    std::lock_guard<std::mutex> lock(mutex_);
    chain_ = chain;
    effects_by_id_.clear();
    effect_positions_.clear();
}

void EffectManager::shutdown() {
    std::lock_guard<std::mutex> lock(mutex_);
    effects_by_id_.clear();
    effect_positions_.clear();
    chain_.reset();
}

std::string EffectManager::generateEffectId() const {
    static std::random_device rd;
    static std::mt19937 gen(rd());
    static std::uniform_int_distribution<> dis(0, 15);
    static std::atomic<uint64_t> counter{0};
    
    std::ostringstream oss;
    oss << "effect-";
    for (int i = 0; i < 8; ++i) {
        oss << std::hex << dis(gen);
    }
    oss << "-" << counter.fetch_add(1);
    return oss.str();
}

std::shared_ptr<EffectBase> EffectManager::createEffect(const std::string& type) const {
    if (type == "distortion") {
        return std::make_shared<DistortionEffect>();
    } else if (type == "overdrive") {
        return std::make_shared<OverdriveEffect>();
    } else if (type == "fuzz") {
        return std::make_shared<FuzzEffect>();
    } else if (type == "chorus") {
        return std::make_shared<ChorusEffect>();
    } else if (type == "flanger") {
        return std::make_shared<FlangerEffect>();
    } else if (type == "tremolo") {
        return std::make_shared<TremoloEffect>();
    } else if (type == "eq") {
        return std::make_shared<EQEffect>();
    } else if (type == "delay") {
        return std::make_shared<DelayEffect>();
    } else if (type == "reverb") {
        return std::make_shared<ReverbEffect>();
    }
    return nullptr;
}

std::string EffectManager::addEffect(const std::string& effectType, const std::string& pedalId, size_t position, const std::string& requestedId) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (!chain_) {
        return "";
    }
    
    auto effect = createEffect(effectType);
    if (!effect) {
        return "";
    }
    
    // Initialiser l'effet avec le sample rate par défaut
    // Le sample rate sera mis à jour lors de l'initialisation du pipeline
    effect->setSampleRate(44100);
    
    // Utiliser l'ID demandé s'il est fourni et unique, sinon générer un nouveau
    std::string effectId;
    if (!requestedId.empty() && effects_by_id_.find(requestedId) == effects_by_id_.end()) {
        effectId = requestedId;
    } else {
        effectId = generateEffectId();
    }
    
    // Ajouter à la chaîne
    chain_->addEffect(effect, position);
    
    // Mettre à jour les positions
    size_t actualPosition = (position == static_cast<size_t>(-1) || position >= chain_->getEffectCount() - 1) 
        ? chain_->getEffectCount() - 1 
        : position;
    
    // Réindexer toutes les positions
    effect_positions_.clear();
    for (size_t i = 0; i < chain_->getEffectCount(); ++i) {
        auto e = chain_->getEffect(i);
        if (e == effect) {
            effect_positions_[effectId] = i;
        } else {
            // Trouver l'ID de l'effet existant
            for (const auto& [id, eff] : effects_by_id_) {
                if (eff == e) {
                    effect_positions_[id] = i;
                    break;
                }
            }
        }
    }
    
    // Stocker l'effet avec son ID
    effects_by_id_[effectId] = effect;
    
    return effectId;
}

bool EffectManager::removeEffect(const std::string& effectId) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    auto it = effects_by_id_.find(effectId);
    if (it == effects_by_id_.end() || !chain_) {
        return false;
    }
    
    // Trouver l'index de l'effet dans la chaîne
    size_t index = getEffectIndex(effectId);
    if (index == static_cast<size_t>(-1)) {
        return false;
    }
    
    // Retirer de la chaîne
    chain_->removeEffect(index);
    
    // Retirer du mapping
    effects_by_id_.erase(it);
    effect_positions_.erase(effectId);
    
    // Réindexer les positions restantes
    for (size_t i = 0; i < chain_->getEffectCount(); ++i) {
        auto e = chain_->getEffect(i);
        for (const auto& [id, eff] : effects_by_id_) {
            if (eff == e) {
                effect_positions_[id] = i;
                break;
            }
        }
    }
    
    return true;
}

bool EffectManager::setParameter(const std::string& effectId, const std::string& parameter, float value) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    auto it = effects_by_id_.find(effectId);
    if (it == effects_by_id_.end()) {
        return false;
    }
    
    it->second->setParameter(parameter, value);
    return true;
}

bool EffectManager::moveEffect(const std::string& effectId, size_t toPosition) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (!chain_) {
        return false;
    }
    
    size_t fromIndex = getEffectIndex(effectId);
    if (fromIndex == static_cast<size_t>(-1)) {
        return false;
    }
    
    size_t effectCount = chain_->getEffectCount();
    if (toPosition >= effectCount) {
        toPosition = effectCount - 1;
    }
    
    if (fromIndex == toPosition) {
        return true;
    }
    
    chain_->moveEffect(fromIndex, toPosition);
    
    // Réindexer toutes les positions
    effect_positions_.clear();
    for (size_t i = 0; i < chain_->getEffectCount(); ++i) {
        auto e = chain_->getEffect(i);
        for (const auto& [id, eff] : effects_by_id_) {
            if (eff == e) {
                effect_positions_[id] = i;
                break;
            }
        }
    }
    
    return true;
}

bool EffectManager::toggleBypass(const std::string& effectId, bool bypassed) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    auto it = effects_by_id_.find(effectId);
    if (it == effects_by_id_.end()) {
        return false;
    }
    
    it->second->setBypass(bypassed);
    return true;
}

std::shared_ptr<EffectBase> EffectManager::getEffect(const std::string& effectId) const {
    std::lock_guard<std::mutex> lock(mutex_);
    
    auto it = effects_by_id_.find(effectId);
    if (it == effects_by_id_.end()) {
        return nullptr;
    }
    
    return it->second;
}

size_t EffectManager::getEffectIndex(const std::string& effectId) const {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (!chain_) {
        return static_cast<size_t>(-1);
    }
    
    auto posIt = effect_positions_.find(effectId);
    if (posIt != effect_positions_.end()) {
        // Vérifier que l'index est toujours valide
        if (posIt->second < chain_->getEffectCount()) {
            auto effect = chain_->getEffect(posIt->second);
            auto it = effects_by_id_.find(effectId);
            if (it != effects_by_id_.end() && effect == it->second) {
                return posIt->second;
            }
        }
    }
    
    // Si le cache est invalide, chercher dans la chaîne
    for (size_t i = 0; i < chain_->getEffectCount(); ++i) {
        auto e = chain_->getEffect(i);
        auto it = effects_by_id_.find(effectId);
        if (it != effects_by_id_.end() && e == it->second) {
            return i;
        }
    }
    
    return static_cast<size_t>(-1);
}

} // namespace webamp

