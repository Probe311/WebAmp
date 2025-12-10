#include "../include/effects/overdrive.h"
#include <algorithm>
#include <cmath>

namespace webamp {

OverdriveEffect::OverdriveEffect()
    : drive_(0.5f), tone_(0.5f), level_(0.5f),
      lowpass_state_{0.0f, 0.0f}, lowpass_coeff_(0.0f) {
}

void OverdriveEffect::setSampleRate(uint32_t sampleRate) {
    EffectBase::setSampleRate(sampleRate);
    updateToneFilter();
}

void OverdriveEffect::process(float* input, float* output, uint32_t frameCount) {
    if (bypass_) {
        for (uint32_t i = 0; i < frameCount; ++i) {
            output[i] = input[i];
        }
        return;
    }
    
    const float driveGain = drive_ * 3.0f + 1.0f; // 1x à 4x
    const float levelGain = level_ * 2.0f;
    
    for (uint32_t i = 0; i < frameCount; ++i) {
        float sample = input[i] * driveGain;
        
        // Soft clipping avec tanh
        sample = softClip(sample);
        
        // Filtre tone (passe-bas)
        float filtered = sample;
        filtered = filtered + lowpass_coeff_ * (lowpass_state_[0] - filtered);
        lowpass_state_[0] = filtered;
        filtered = filtered + lowpass_coeff_ * (lowpass_state_[1] - filtered);
        lowpass_state_[1] = filtered;
        
        // Mix tone
        sample = sample * (1.0f - tone_) + filtered * tone_;
        
        output[i] = sample * levelGain;
    }
}

float OverdriveEffect::softClip(float x) const {
    // Soft clipping avec tanh (plus doux que hard clipping)
    return tanhf(x * 2.0f) * 0.5f;
}

void OverdriveEffect::updateToneFilter() {
    // Filtre passe-bas pour le tone control
    // Tone = 0: pas de filtre, Tone = 1: filtre très bas
    float cutoff = 20000.0f - (tone_ * 18000.0f); // 2kHz à 20kHz
    float rc = 1.0f / (2.0f * 3.14159f * cutoff);
    float dt = 1.0f / sample_rate_;
    lowpass_coeff_ = dt / (rc + dt);
}

std::vector<EffectBase::Parameter> OverdriveEffect::getParameters() const {
    return {
        {"drive", "Drive", 0.0f, 1.0f, 0.5f, drive_},
        {"tone", "Tone", 0.0f, 1.0f, 0.5f, tone_},
        {"level", "Level", 0.0f, 1.0f, 0.5f, level_}
    };
}

void OverdriveEffect::setParameter(const std::string& name, float value) {
    if (name == "drive") {
        drive_ = std::max(0.0f, std::min(1.0f, value));
    } else if (name == "tone") {
        tone_ = std::max(0.0f, std::min(1.0f, value));
        updateToneFilter();
    } else if (name == "level") {
        level_ = std::max(0.0f, std::min(1.0f, value));
    }
}

float OverdriveEffect::getParameter(const std::string& name) const {
    if (name == "drive") return drive_;
    if (name == "tone") return tone_;
    if (name == "level") return level_;
    return 0.0f;
}

} // namespace webamp

