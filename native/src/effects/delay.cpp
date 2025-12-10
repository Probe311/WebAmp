#include "../include/effects/delay.h"
#include <algorithm>
#include <cmath>
#include <cstring>

namespace webamp {

DelayEffect::DelayEffect()
    : time_(50.0f)
    , feedback_(50.0f)
    , mix_(50.0f)
    , delay_buffer_size_(0)
{
    write_pos_[0] = 0;
    write_pos_[1] = 0;
    delay_buffer_[0].resize(44100 * 2); // Max 2 secondes @ 44.1kHz
    delay_buffer_[1].resize(44100 * 2);
    std::fill(delay_buffer_[0].begin(), delay_buffer_[0].end(), 0.0f);
    std::fill(delay_buffer_[1].begin(), delay_buffer_[1].end(), 0.0f);
}

DelayEffect::~DelayEffect() {
}

void DelayEffect::setSampleRate(uint32_t sampleRate) {
    EffectBase::setSampleRate(sampleRate);
    updateDelayBuffer();
}

void DelayEffect::updateDelayBuffer() {
    // Time: 0-100 correspond à 0-2000ms
    float delayMs = (time_ / 100.0f) * 2000.0f;
    delay_buffer_size_ = static_cast<size_t>((delayMs / 1000.0f) * sample_rate_);
    
    if (delay_buffer_size_ > delay_buffer_[0].size()) {
        delay_buffer_size_ = delay_buffer_[0].size();
    }
    
    if (delay_buffer_size_ == 0) {
        delay_buffer_size_ = 1;
    }
}

void DelayEffect::process(float* input, float* output, uint32_t frameCount) {
    if (bypass_) {
        std::copy(input, input + frameCount * 2, output);
        return;
    }
    
    float feedbackLinear = feedback_ / 100.0f;
    float mixLinear = mix_ / 100.0f;
    float dryMix = 1.0f - mixLinear;
    
    for (uint32_t i = 0; i < frameCount; ++i) {
        for (int ch = 0; ch < 2; ++ch) {
            int idx = i * 2 + ch;
            
            // Lire depuis le buffer de delay (readPos = writePos - delaySize)
            size_t readPos;
            if (write_pos_[ch] >= delay_buffer_size_) {
                readPos = write_pos_[ch] - delay_buffer_size_;
            } else {
                readPos = delay_buffer_[ch].size() + write_pos_[ch] - delay_buffer_size_;
            }
            readPos = readPos % delay_buffer_[ch].size();
            float delayed = delay_buffer_[ch][readPos];
            
            // Mix dry/wet
            float sample = input[idx];
            output[idx] = sample * dryMix + delayed * mixLinear;
            
            // Écrire dans le buffer avec feedback
            delay_buffer_[ch][write_pos_[ch]] = sample + delayed * feedbackLinear;
            
            // Avancer les pointeurs (modulo sur la taille du buffer)
            write_pos_[ch] = (write_pos_[ch] + 1) % delay_buffer_[ch].size();
        }
    }
}

std::vector<EffectBase::Parameter> DelayEffect::getParameters() const {
    return {
        {"time", "Time", 0.0f, 100.0f, 50.0f, time_},
        {"feedback", "Feedback", 0.0f, 100.0f, 50.0f, feedback_},
        {"mix", "Mix", 0.0f, 100.0f, 50.0f, mix_}
    };
}

void DelayEffect::setParameter(const std::string& name, float value) {
    if (name == "time") {
        time_ = std::max(0.0f, std::min(100.0f, value));
        updateDelayBuffer();
    } else if (name == "feedback") {
        feedback_ = std::max(0.0f, std::min(100.0f, value));
    } else if (name == "mix") {
        mix_ = std::max(0.0f, std::min(100.0f, value));
    }
}

float DelayEffect::getParameter(const std::string& name) const {
    if (name == "time") return time_;
    if (name == "feedback") return feedback_;
    if (name == "mix") return mix_;
    return 0.0f;
}

} // namespace webamp

