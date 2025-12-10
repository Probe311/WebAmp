#include "../include/effects/chorus.h"
#include <algorithm>
#include <cmath>

namespace webamp {

ChorusEffect::ChorusEffect()
    : rate_(1.0f), depth_(0.5f), mix_(0.5f),
      delay_buffer_size_(0), write_index_(0),
      lfo_phase_(0.0f), lfo_increment_(0.0f) {
}

void ChorusEffect::setSampleRate(uint32_t sampleRate) {
    EffectBase::setSampleRate(sampleRate);
    
    // Buffer de delay pour ~50ms max
    delay_buffer_size_ = static_cast<size_t>(sampleRate * 0.05f);
    delay_buffer_.resize(delay_buffer_size_, 0.0f);
    write_index_ = 0;
    
    updateLFO();
}

void ChorusEffect::process(float* input, float* output, uint32_t frameCount) {
    if (bypass_) {
        for (uint32_t i = 0; i < frameCount; ++i) {
            output[i] = input[i];
        }
        return;
    }
    
    for (uint32_t i = 0; i < frameCount; ++i) {
        float delayTime = getDelayTime();
        float delaySamples = delayTime * sample_rate_;
        
        // Lire depuis le buffer de delay avec interpolation
        float readIndex = write_index_ - delaySamples;
        if (readIndex < 0) readIndex += delay_buffer_size_;
        
        size_t index1 = static_cast<size_t>(readIndex);
        size_t index2 = (index1 + 1) % delay_buffer_size_;
        float frac = readIndex - index1;
        
        float delayed = delay_buffer_[index1] * (1.0f - frac) + delay_buffer_[index2] * frac;
        
        // Écrire dans le buffer
        delay_buffer_[write_index_] = input[i];
        write_index_ = (write_index_ + 1) % delay_buffer_size_;
        
        // Mix dry/wet
        output[i] = input[i] * (1.0f - mix_) + delayed * mix_;
        
        updateLFO();
    }
}

void ChorusEffect::updateLFO() {
    lfo_increment_ = (2.0f * 3.14159f * rate_) / sample_rate_;
    lfo_phase_ += lfo_increment_;
    if (lfo_phase_ >= 2.0f * 3.14159f) {
        lfo_phase_ -= 2.0f * 3.14159f;
    }
}

float ChorusEffect::getLFOValue() const {
    return sinf(lfo_phase_);
}

float ChorusEffect::getDelayTime() const {
    // Delay de base: 10ms, modulation: ±5ms
    float baseDelay = 0.010f; // 10ms
    float modRange = 0.005f * depth_; // ±5ms
    return baseDelay + modRange * getLFOValue();
}

std::vector<EffectBase::Parameter> ChorusEffect::getParameters() const {
    return {
        {"rate", "Rate", 0.1f, 10.0f, 1.0f, rate_},
        {"depth", "Depth", 0.0f, 1.0f, 0.5f, depth_},
        {"mix", "Mix", 0.0f, 1.0f, 0.5f, mix_}
    };
}

void ChorusEffect::setParameter(const std::string& name, float value) {
    if (name == "rate") {
        rate_ = std::max(0.1f, std::min(10.0f, value));
        updateLFO();
    } else if (name == "depth") {
        depth_ = std::max(0.0f, std::min(1.0f, value));
    } else if (name == "mix") {
        mix_ = std::max(0.0f, std::min(1.0f, value));
    }
}

float ChorusEffect::getParameter(const std::string& name) const {
    if (name == "rate") return rate_;
    if (name == "depth") return depth_;
    if (name == "mix") return mix_;
    return 0.0f;
}

} // namespace webamp

