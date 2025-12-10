#include "../include/effects/flanger.h"
#include <algorithm>
#include <cmath>

namespace webamp {

FlangerEffect::FlangerEffect()
    : rate_(0.5f), depth_(0.5f), feedback_(0.3f), manual_(0.5f), resonance_(0.5f),
      delay_buffer_size_(0), write_index_(0),
      lfo_phase_(0.0f), lfo_increment_(0.0f) {
}

void FlangerEffect::setSampleRate(uint32_t sampleRate) {
    EffectBase::setSampleRate(sampleRate);
    
    // Buffer de delay pour ~10ms max
    delay_buffer_size_ = static_cast<size_t>(sampleRate * 0.01f);
    delay_buffer_.resize(delay_buffer_size_, 0.0f);
    write_index_ = 0;
    
    updateLFO();
}

void FlangerEffect::process(float* input, float* output, uint32_t frameCount) {
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
        
        // Feedback
        float feedbackSample = delayed * feedback_;
        
        // Écrire dans le buffer (input + feedback)
        delay_buffer_[write_index_] = input[i] + feedbackSample;
        write_index_ = (write_index_ + 1) % delay_buffer_size_;
        
        // Mix dry/wet
        output[i] = input[i] + delayed * depth_;
        
        updateLFO();
    }
}

void FlangerEffect::updateLFO() {
    lfo_increment_ = (2.0f * 3.14159f * rate_) / sample_rate_;
    lfo_phase_ += lfo_increment_;
    if (lfo_phase_ >= 2.0f * 3.14159f) {
        lfo_phase_ -= 2.0f * 3.14159f;
    }
}

float FlangerEffect::getLFOValue() const {
    return sinf(lfo_phase_);
}

float FlangerEffect::getDelayTime() const {
    // Delay de base: 1-5ms selon manual, modulation: ±2ms
    float baseDelay = 0.001f + manual_ * 0.004f; // 1-5ms
    float modRange = 0.002f * depth_; // ±2ms
    return baseDelay + modRange * getLFOValue();
}

std::vector<EffectBase::Parameter> FlangerEffect::getParameters() const {
    return {
        {"rate", "Rate", 0.1f, 5.0f, 0.5f, rate_},
        {"depth", "Depth", 0.0f, 1.0f, 0.5f, depth_},
        {"feedback", "Feedback", 0.0f, 1.0f, 0.3f, feedback_},
        {"manual", "Manual", 0.0f, 1.0f, 0.5f, manual_},
        {"resonance", "Resonance", 0.0f, 1.0f, 0.5f, resonance_}
    };
}

void FlangerEffect::setParameter(const std::string& name, float value) {
    if (name == "rate") {
        rate_ = std::max(0.1f, std::min(5.0f, value));
        updateLFO();
    } else if (name == "depth") {
        depth_ = std::max(0.0f, std::min(1.0f, value));
    } else if (name == "feedback") {
        feedback_ = std::max(0.0f, std::min(1.0f, value));
    } else if (name == "manual") {
        manual_ = std::max(0.0f, std::min(1.0f, value));
    } else if (name == "resonance") {
        resonance_ = std::max(0.0f, std::min(1.0f, value));
    }
}

float FlangerEffect::getParameter(const std::string& name) const {
    if (name == "rate") return rate_;
    if (name == "depth") return depth_;
    if (name == "feedback") return feedback_;
    if (name == "manual") return manual_;
    if (name == "resonance") return resonance_;
    return 0.0f;
}

} // namespace webamp

