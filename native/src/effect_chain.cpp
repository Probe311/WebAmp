#include "effect_chain.h"
#include "../include/effects/distortion.h"
#include "../include/effects/overdrive.h"
#include "../include/effects/fuzz.h"
#include "../include/effects/chorus.h"
#include "../include/effects/flanger.h"
#include "../include/effects/tremolo.h"
#include "../include/effects/eq.h"
#include "../include/effects/delay.h"
#include "../include/effects/reverb.h"
#include "../include/simd_helper.h"
#include <algorithm>
#include <cstddef>
#include <climits>

namespace webamp {

EffectChain::EffectChain() {
}

EffectChain::~EffectChain() {
    clear();
}

void EffectChain::addEffect(std::shared_ptr<EffectBase> effect, size_t position) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (!effect) {
        return;
    }
    
    if (position == static_cast<size_t>(-1) || position >= effects_.size()) {
        effects_.push_back(effect);
    } else {
        effects_.insert(effects_.begin() + position, effect);
    }
}

void EffectChain::removeEffect(size_t index) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (index < effects_.size()) {
        effects_.erase(effects_.begin() + index);
    }
}

void EffectChain::clear() {
    std::lock_guard<std::mutex> lock(mutex_);
    effects_.clear();
}

void EffectChain::moveEffect(size_t from, size_t to) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (from >= effects_.size() || to >= effects_.size()) {
        return;
    }
    
    if (from == to) {
        return;
    }
    
    auto effect = effects_[from];
    effects_.erase(effects_.begin() + from);
    
    if (to > from) {
        --to;
    }
    
    effects_.insert(effects_.begin() + to, effect);
}

void EffectChain::swapEffects(size_t index1, size_t index2) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (index1 >= effects_.size() || index2 >= effects_.size()) {
        return;
    }
    
    if (index1 == index2) {
        return;
    }
    
    std::swap(effects_[index1], effects_[index2]);
}

std::shared_ptr<EffectBase> EffectChain::getEffect(size_t index) const {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (index < effects_.size()) {
        return effects_[index];
    }
    return nullptr;
}

size_t EffectChain::getEffectCount() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return effects_.size();
}

void EffectChain::process(float* input, float* output, uint32_t frameCount) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (effects_.empty()) {
        // Pas d'effets : copie directe (optimisé avec SIMD si disponible)
        #ifdef USE_SIMD
        if (SIMDHelper::isAvailable()) {
            SIMDHelper::copy(input, output, frameCount * 2);
        } else {
            std::copy(input, input + frameCount * 2, output);
        }
        #else
        std::copy(input, input + frameCount * 2, output);
        #endif
        return;
    }
    
    // Optimisation : utiliser buffers alternés pour éviter allocations
    // Support jusqu'à 20 effets avec seulement 2 buffers de travail
    static thread_local std::vector<float> workBuffer1;
    static thread_local std::vector<float> workBuffer2;
    
    if (workBuffer1.size() < frameCount * 2) {
        workBuffer1.resize(frameCount * 2);
        workBuffer2.resize(frameCount * 2);
    }
    
    float* currentInput = input;
    float* currentOutput = workBuffer1.data();
    bool useBuffer1 = true;
    
    // Application de chaque effet dans l'ordre (optimisé pour 20 effets max)
    size_t activeEffects = 0;
    for (size_t i = 0; i < effects_.size() && i < 20; ++i) {  // Limite à 20 effets
        auto& effect = effects_[i];
        
        if (!effect->isBypassed()) {
            effect->process(currentInput, currentOutput, frameCount);
            activeEffects++;
        } else {
            // Bypass : copie directe (optimisé)
            #ifdef USE_SIMD
            if (SIMDHelper::isAvailable()) {
                SIMDHelper::copy(currentInput, currentOutput, frameCount * 2);
            } else {
                std::copy(currentInput, currentInput + frameCount * 2, currentOutput);
            }
            #else
            std::copy(currentInput, currentInput + frameCount * 2, currentOutput);
            #endif
        }
        
        // Échange des buffers pour l'effet suivant
        if (useBuffer1) {
            currentInput = workBuffer1.data();
            currentOutput = workBuffer2.data();
        } else {
            currentInput = workBuffer2.data();
            currentOutput = workBuffer1.data();
        }
        useBuffer1 = !useBuffer1;
    }
    
    // Copie finale vers la sortie
    std::copy(currentInput, currentInput + frameCount * 2, output);
}

EffectChain::Preset EffectChain::savePreset(const std::string& name) const {
    std::lock_guard<std::mutex> lock(mutex_);
    
    Preset preset;
    preset.name = name;
    
    for (const auto& effect : effects_) {
        preset.effectTypes.push_back(effect->getType());
        
        std::vector<std::pair<std::string, float>> params;
        auto parameters = effect->getParameters();
        for (const auto& param : parameters) {
            params.push_back({param.name, param.currentValue});
        }
        preset.parameters.push_back(params);
    }
    
    return preset;
}

void EffectChain::loadPreset(const Preset& preset) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    clear();
    
    for (size_t i = 0; i < preset.effectTypes.size(); ++i) {
        auto effect = createEffect(preset.effectTypes[i]);
        if (effect && i < preset.parameters.size()) {
            for (const auto& param : preset.parameters[i]) {
                effect->setParameter(param.first, param.second);
            }
            effects_.push_back(effect);
        }
    }
}

std::shared_ptr<EffectBase> EffectChain::createEffect(const std::string& type) const {
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

} // namespace webamp

