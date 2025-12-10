#include "../include/effects/eq.h"
#include <algorithm>
#include <cmath>

namespace webamp {

EQEffect::EQEffect()
    : low_(0.0f), mid_(0.0f), high_(0.0f), level_(0.5f) {
    // Initialiser les filtres
    low_filter_ = {};
    mid_filter_ = {};
    high_filter_ = {};
}

void EQEffect::setSampleRate(uint32_t sampleRate) {
    EffectBase::setSampleRate(sampleRate);
    updateFilters();
}

void EQEffect::process(float* input, float* output, uint32_t frameCount) {
    if (bypass_) {
        for (uint32_t i = 0; i < frameCount; ++i) {
            output[i] = input[i];
        }
        return;
    }
    
    // Copier l'input
    std::vector<float> workBuffer(frameCount);
    for (uint32_t i = 0; i < frameCount; ++i) {
        workBuffer[i] = input[i];
    }
    
    // Appliquer les filtres EQ
    processBiquad(low_filter_, workBuffer.data(), workBuffer.data(), frameCount);
    processBiquad(mid_filter_, workBuffer.data(), workBuffer.data(), frameCount);
    processBiquad(high_filter_, workBuffer.data(), workBuffer.data(), frameCount);
    
    // Appliquer le niveau
    const float levelGain = level_ * 2.0f;
    for (uint32_t i = 0; i < frameCount; ++i) {
        output[i] = workBuffer[i] * levelGain;
    }
}

void EQEffect::processBiquad(BiquadFilter& filter, float* input, float* output, uint32_t frameCount) {
    for (uint32_t i = 0; i < frameCount; ++i) {
        float x = input[i];
        float y = filter.b0 * x + filter.b1 * filter.x1 + filter.b2 * filter.x2
                 - filter.a1 * filter.y1 - filter.a2 * filter.y2;
        
        filter.x2 = filter.x1;
        filter.x1 = x;
        filter.y2 = filter.y1;
        filter.y1 = y;
        
        output[i] = y;
    }
}

void EQEffect::setBiquadPeak(BiquadFilter& filter, float freq, float gain, float q, float sampleRate) {
    float A = powf(10.0f, gain / 40.0f);
    float w = 2.0f * 3.14159f * freq / sampleRate;
    float s = sinf(w);
    float c = cosf(w);
    float alpha = s / (2.0f * q);
    
    float b0 = 1.0f + alpha * A;
    float b1 = -2.0f * c;
    float b2 = 1.0f - alpha * A;
    float a0 = 1.0f + alpha / A;
    float a1 = -2.0f * c;
    float a2 = 1.0f - alpha / A;
    
    filter.b0 = b0 / a0;
    filter.b1 = b1 / a0;
    filter.b2 = b2 / a0;
    filter.a1 = a1 / a0;
    filter.a2 = a2 / a0;
    
    filter.x1 = filter.x2 = 0.0f;
    filter.y1 = filter.y2 = 0.0f;
}

void EQEffect::updateFilters() {
    // Low: 100Hz, Q=1.0
    setBiquadPeak(low_filter_, 100.0f, low_, 1.0f, sample_rate_);
    
    // Mid: 1000Hz, Q=1.0
    setBiquadPeak(mid_filter_, 1000.0f, mid_, 1.0f, sample_rate_);
    
    // High: 5000Hz, Q=1.0
    setBiquadPeak(high_filter_, 5000.0f, high_, 1.0f, sample_rate_);
}

std::vector<EffectBase::Parameter> EQEffect::getParameters() const {
    return {
        {"low", "Low", -12.0f, 12.0f, 0.0f, low_},
        {"mid", "Mid", -12.0f, 12.0f, 0.0f, mid_},
        {"high", "High", -12.0f, 12.0f, 0.0f, high_},
        {"level", "Level", 0.0f, 1.0f, 0.5f, level_}
    };
}

void EQEffect::setParameter(const std::string& name, float value) {
    if (name == "low") {
        low_ = std::max(-12.0f, std::min(12.0f, value));
        updateFilters();
    } else if (name == "mid") {
        mid_ = std::max(-12.0f, std::min(12.0f, value));
        updateFilters();
    } else if (name == "high") {
        high_ = std::max(-12.0f, std::min(12.0f, value));
        updateFilters();
    } else if (name == "level") {
        level_ = std::max(0.0f, std::min(1.0f, value));
    }
}

float EQEffect::getParameter(const std::string& name) const {
    if (name == "low") return low_;
    if (name == "mid") return mid_;
    if (name == "high") return high_;
    if (name == "level") return level_;
    return 0.0f;
}

} // namespace webamp

