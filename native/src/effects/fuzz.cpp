#include "../include/effects/fuzz.h"
#include <algorithm>
#include <cmath>

namespace webamp {

FuzzEffect::FuzzEffect()
    : fuzz_(0.5f), tone_(0.5f), volume_(0.5f),
      lowpass_state_{0.0f, 0.0f}, lowpass_coeff_(0.0f) {
}

void FuzzEffect::setSampleRate(uint32_t sampleRate) {
    EffectBase::setSampleRate(sampleRate);
    updateToneFilter();
}

void FuzzEffect::process(float* input, float* output, uint32_t frameCount) {
    if (bypass_) {
        for (uint32_t i = 0; i < frameCount; ++i) {
            output[i] = input[i];
        }
        return;
    }
    
    const float fuzzGain = fuzz_ * 10.0f + 1.0f; // 1x à 11x
    const float volumeGain = volume_ * 2.0f;
    
    for (uint32_t i = 0; i < frameCount; ++i) {
        float sample = input[i] * fuzzGain;
        
        // Fuzz avec hard clipping extrême
        sample = fuzzClip(sample);
        
        // Filtre tone (passe-bas)
        float filtered = sample;
        filtered = filtered + lowpass_coeff_ * (lowpass_state_[0] - filtered);
        lowpass_state_[0] = filtered;
        filtered = filtered + lowpass_coeff_ * (lowpass_state_[1] - filtered);
        lowpass_state_[1] = filtered;
        
        // Mix tone
        sample = sample * (1.0f - tone_) + filtered * tone_;
        
        output[i] = sample * volumeGain;
    }
}

float FuzzEffect::fuzzClip(float x) const {
    // Hard clipping extrême avec saturation
    x = std::max(-1.0f, std::min(1.0f, x));
    // Compression supplémentaire pour le caractère fuzz
    return x * (1.0f - 0.3f * fabsf(x));
}

void FuzzEffect::updateToneFilter() {
    // Filtre passe-bas pour le tone control
    float cutoff = 20000.0f - (tone_ * 15000.0f); // 5kHz à 20kHz
    float rc = 1.0f / (2.0f * 3.14159f * cutoff);
    float dt = 1.0f / sample_rate_;
    lowpass_coeff_ = dt / (rc + dt);
}

std::vector<EffectBase::Parameter> FuzzEffect::getParameters() const {
    return {
        {"fuzz", "Fuzz", 0.0f, 1.0f, 0.5f, fuzz_},
        {"tone", "Tone", 0.0f, 1.0f, 0.5f, tone_},
        {"volume", "Volume", 0.0f, 1.0f, 0.5f, volume_}
    };
}

void FuzzEffect::setParameter(const std::string& name, float value) {
    if (name == "fuzz") {
        fuzz_ = std::max(0.0f, std::min(1.0f, value));
    } else if (name == "tone") {
        tone_ = std::max(0.0f, std::min(1.0f, value));
        updateToneFilter();
    } else if (name == "volume") {
        volume_ = std::max(0.0f, std::min(1.0f, value));
    }
}

float FuzzEffect::getParameter(const std::string& name) const {
    if (name == "fuzz") return fuzz_;
    if (name == "tone") return tone_;
    if (name == "volume") return volume_;
    return 0.0f;
}

} // namespace webamp

