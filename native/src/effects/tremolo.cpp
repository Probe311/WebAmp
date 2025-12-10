#include "../include/effects/tremolo.h"
#include <algorithm>
#include <cmath>

namespace webamp {

TremoloEffect::TremoloEffect()
    : rate_(2.0f), depth_(0.5f), volume_(0.5f), wave_(0.0f),
      lfo_phase_(0.0f), lfo_increment_(0.0f) {
}

void TremoloEffect::setSampleRate(uint32_t sampleRate) {
    EffectBase::setSampleRate(sampleRate);
    updateLFO();
}

void TremoloEffect::process(float* input, float* output, uint32_t frameCount) {
    if (bypass_) {
        for (uint32_t i = 0; i < frameCount; ++i) {
            output[i] = input[i];
        }
        return;
    }
    
    const float volumeGain = volume_ * 2.0f;
    
    for (uint32_t i = 0; i < frameCount; ++i) {
        float lfo = getLFOValue();
        
        // Modulation d'amplitude
        float mod = 1.0f - (depth_ * lfo);
        mod = std::max(0.0f, std::min(1.0f, mod));
        
        output[i] = input[i] * mod * volumeGain;
        
        updateLFO();
    }
}

void TremoloEffect::updateLFO() {
    lfo_increment_ = (2.0f * 3.14159f * rate_) / sample_rate_;
    lfo_phase_ += lfo_increment_;
    if (lfo_phase_ >= 2.0f * 3.14159f) {
        lfo_phase_ -= 2.0f * 3.14159f;
    }
}

float TremoloEffect::getLFOValue() const {
    // Mix entre sine (0) et square (1)
    float sine = sinf(lfo_phase_);
    float square = (lfo_phase_ < 3.14159f) ? 1.0f : -1.0f;
    return sine * (1.0f - wave_) + square * wave_;
}

std::vector<EffectBase::Parameter> TremoloEffect::getParameters() const {
    return {
        {"rate", "Rate", 0.1f, 20.0f, 2.0f, rate_},
        {"depth", "Depth", 0.0f, 1.0f, 0.5f, depth_},
        {"volume", "Volume", 0.0f, 1.0f, 0.5f, volume_},
        {"wave", "Wave", 0.0f, 1.0f, 0.0f, wave_}
    };
}

void TremoloEffect::setParameter(const std::string& name, float value) {
    if (name == "rate") {
        rate_ = std::max(0.1f, std::min(20.0f, value));
        updateLFO();
    } else if (name == "depth") {
        depth_ = std::max(0.0f, std::min(1.0f, value));
    } else if (name == "volume") {
        volume_ = std::max(0.0f, std::min(1.0f, value));
    } else if (name == "wave") {
        wave_ = std::max(0.0f, std::min(1.0f, value));
    }
}

float TremoloEffect::getParameter(const std::string& name) const {
    if (name == "rate") return rate_;
    if (name == "depth") return depth_;
    if (name == "volume") return volume_;
    if (name == "wave") return wave_;
    return 0.0f;
}

} // namespace webamp

