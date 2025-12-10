#include "../include/effects/reverb.h"
#include <algorithm>
#include <cmath>
#include <cstring>

namespace webamp {

// Délais des comb filters (en samples @ 44.1kHz, ajustés par sample rate)
static constexpr size_t COMB_DELAYS_44K[NUM_COMBS] = {
    1116, 1188, 1277, 1356
};

// Délais des allpass filters
static constexpr size_t ALLPASS_DELAYS_44K[NUM_ALLPASS] = {
    556, 441
};

ReverbEffect::ReverbEffect()
    : room_(50.0f)
    , decay_(50.0f)
    , mix_(50.0f)
{
    for (int ch = 0; ch < 2; ++ch) {
        for (int i = 0; i < NUM_COMBS; ++i) {
            comb_buffers_[ch][i].resize(2000); // Taille max
            std::fill(comb_buffers_[ch][i].begin(), comb_buffers_[ch][i].end(), 0.0f);
            comb_write_pos_[ch][i] = 0;
        }
        for (int i = 0; i < NUM_ALLPASS; ++i) {
            allpass_buffers_[ch][i].resize(1000);
            std::fill(allpass_buffers_[ch][i].begin(), allpass_buffers_[ch][i].end(), 0.0f);
            allpass_write_pos_[ch][i] = 0;
        }
    }
    
    std::copy(COMB_DELAYS_44K, COMB_DELAYS_44K + NUM_COMBS, comb_delays_);
    std::copy(ALLPASS_DELAYS_44K, ALLPASS_DELAYS_44K + NUM_ALLPASS, allpass_delays_);
}

ReverbEffect::~ReverbEffect() {
}

void ReverbEffect::setSampleRate(uint32_t sampleRate) {
    EffectBase::setSampleRate(sampleRate);
    updateReverbParameters();
}

void ReverbEffect::updateReverbParameters() {
    // Ajuster les délais selon le sample rate
    float rateScale = sample_rate_ / 44100.0f;
    
    for (int i = 0; i < NUM_COMBS; ++i) {
        comb_delays_[i] = static_cast<size_t>(COMB_DELAYS_44K[i] * rateScale);
        if (comb_delays_[i] >= comb_buffers_[0][i].size()) {
            comb_delays_[i] = comb_buffers_[0][i].size() - 1;
        }
    }
    
    for (int i = 0; i < NUM_ALLPASS; ++i) {
        allpass_delays_[i] = static_cast<size_t>(ALLPASS_DELAYS_44K[i] * rateScale);
        if (allpass_delays_[i] >= allpass_buffers_[0][i].size()) {
            allpass_delays_[i] = allpass_buffers_[0][i].size() - 1;
        }
    }
    
    // Feedback des comb filters selon decay
    float decayLinear = decay_ / 100.0f;
    for (int i = 0; i < NUM_COMBS; ++i) {
        comb_feedback_[i] = decayLinear * 0.7f; // Limiter à 0.7 pour stabilité
    }
}

void ReverbEffect::process(float* input, float* output, uint32_t frameCount) {
    if (bypass_) {
        std::copy(input, input + frameCount * 2, output);
        return;
    }
    
    float mixLinear = mix_ / 100.0f;
    float dryMix = 1.0f - mixLinear;
    float roomScale = room_ / 100.0f;
    
    for (uint32_t i = 0; i < frameCount; ++i) {
        for (int ch = 0; ch < 2; ++ch) {
            int idx = i * 2 + ch;
            float sample = input[idx] * roomScale;
            
            // Comb filters
            float combOut = 0.0f;
            for (int comb = 0; comb < NUM_COMBS; ++comb) {
                size_t readPos = (comb_write_pos_[ch][comb] + comb_buffers_[ch][comb].size() - comb_delays_[comb]) % comb_buffers_[ch][comb].size();
                float delayed = comb_buffers_[ch][comb][readPos];
                combOut += delayed;
                
                // Écrire avec feedback
                comb_buffers_[ch][comb][comb_write_pos_[ch][comb]] = sample + delayed * comb_feedback_[comb];
                comb_write_pos_[ch][comb] = (comb_write_pos_[ch][comb] + 1) % comb_buffers_[ch][comb].size();
            }
            combOut /= NUM_COMBS;
            
            // Allpass filters
            float allpassOut = combOut;
            for (int ap = 0; ap < NUM_ALLPASS; ++ap) {
                size_t readPos = (allpass_write_pos_[ch][ap] + allpass_buffers_[ch][ap].size() - allpass_delays_[ap]) % allpass_buffers_[ch][ap].size();
                float delayed = allpass_buffers_[ch][ap][readPos];
                allpassOut = delayed + allpassOut * 0.5f;
                allpass_buffers_[ch][ap][allpass_write_pos_[ch][ap]] = allpassOut;
                allpass_write_pos_[ch][ap] = (allpass_write_pos_[ch][ap] + 1) % allpass_buffers_[ch][ap].size();
            }
            
            // Mix dry/wet
            output[idx] = input[idx] * dryMix + allpassOut * mixLinear;
        }
    }
}

std::vector<EffectBase::Parameter> ReverbEffect::getParameters() const {
    return {
        {"room", "Room", 0.0f, 100.0f, 50.0f, room_},
        {"decay", "Decay", 0.0f, 100.0f, 50.0f, decay_},
        {"mix", "Mix", 0.0f, 100.0f, 50.0f, mix_}
    };
}

void ReverbEffect::setParameter(const std::string& name, float value) {
    if (name == "room") {
        room_ = std::max(0.0f, std::min(100.0f, value));
    } else if (name == "decay") {
        decay_ = std::max(0.0f, std::min(100.0f, value));
        updateReverbParameters();
    } else if (name == "mix") {
        mix_ = std::max(0.0f, std::min(100.0f, value));
    }
}

float ReverbEffect::getParameter(const std::string& name) const {
    if (name == "room") return room_;
    if (name == "decay") return decay_;
    if (name == "mix") return mix_;
    return 0.0f;
}

} // namespace webamp

