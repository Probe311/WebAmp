#include "../include/effects/distortion.h"
#include <algorithm>
#include <cmath>

namespace webamp {

DistortionEffect::DistortionEffect()
    : gain_(50.0f)
    , tone_(50.0f)
    , level_(50.0f)
{
    lowpass_state_[0] = 0.0f;
    lowpass_state_[1] = 0.0f;
    lowpass_coeff_ = 0.5f;
}

void DistortionEffect::setSampleRate(uint32_t sampleRate) {
    EffectBase::setSampleRate(sampleRate);
    updateToneFilter();
}

void DistortionEffect::updateToneFilter() {
    // Filtre passe-bas simple (1-pole)
    // Tone: 0 = dark, 100 = bright
    float cutoff = 2000.0f + (tone_ / 100.0f) * 18000.0f; // 2kHz à 20kHz
    float rc = 1.0f / (2.0f * 3.14159f * cutoff);
    float dt = 1.0f / sample_rate_;
    lowpass_coeff_ = dt / (rc + dt);
}

void DistortionEffect::process(float* input, float* output, uint32_t frameCount) {
    if (bypass_) {
        for (uint32_t i = 0; i < frameCount; ++i) {
            output[i] = input[i];
        }
        return;
    }
    
    float gainLinear = gain_ / 50.0f * 10.0f; // 0-10x
    float levelLinear = level_ / 100.0f;
    
    for (uint32_t i = 0; i < frameCount; ++i) {
        float sample = input[i] * gainLinear;
        
        // Hard clipping
        sample = std::max(-1.0f, std::min(1.0f, sample));
        
        // Filtre tone (passe-bas)
        float filtered = sample;
        filtered = filtered + lowpass_coeff_ * (lowpass_state_[0] - filtered);
        lowpass_state_[0] = filtered;
        filtered = filtered + lowpass_coeff_ * (lowpass_state_[1] - filtered);
        lowpass_state_[1] = filtered;
        
        // Mix tone
        sample = sample * (1.0f - tone_ / 100.0f) + filtered * (tone_ / 100.0f);
        
        // Level
        output[i] = sample * levelLinear;
    }
}

std::vector<EffectBase::Parameter> DistortionEffect::getParameters() const {
    return {
        {"gain", "Gain", 0.0f, 100.0f, 50.0f, gain_},
        {"tone", "Tone", 0.0f, 100.0f, 50.0f, tone_},
        {"level", "Level", 0.0f, 100.0f, 50.0f, level_}
    };
}

void DistortionEffect::setParameter(const std::string& name, float value) {
    if (name == "gain") {
        gain_ = std::max(0.0f, std::min(100.0f, value));
    } else if (name == "tone") {
        tone_ = std::max(0.0f, std::min(100.0f, value));
        updateToneFilter();
    } else if (name == "level") {
        level_ = std::max(0.0f, std::min(100.0f, value));
    }
}

float DistortionEffect::getParameter(const std::string& name) const {
    if (name == "gain") return gain_;
    if (name == "tone") return tone_;
    if (name == "level") return level_;
    return 0.0f;
}

} // namespace webamp

