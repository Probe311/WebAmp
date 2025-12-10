#include "test_tone_generator.h"
#include <random>
#include <algorithm>
#include <cmath>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

namespace webamp {

TestToneGenerator::TestToneGenerator()
    : enabled_(false)
    , frequency_(440.0f)  // La4
    , amplitude_(0.3f)     // 30% pour éviter la saturation
    , sample_rate_(44100)
    , wave_type_(WaveType::Sine)
    , phase_(0.0)
    , phase_increment_(0.0)
    , noise_seed_(12345)
{
    updatePhaseIncrement();
}

void TestToneGenerator::updatePhaseIncrement() {
    if (sample_rate_ > 0) {
        phase_increment_ = 2.0 * M_PI * frequency_ / static_cast<double>(sample_rate_);
    }
}

void TestToneGenerator::setFrequency(float frequency) {
    frequency_ = frequency;
    updatePhaseIncrement();
}

void TestToneGenerator::setSampleRate(uint32_t sampleRate) {
    sample_rate_ = sampleRate;
    updatePhaseIncrement();
}

void TestToneGenerator::generate(float* output, uint32_t frameCount, uint32_t channels) {
    if (!enabled_ || frameCount == 0 || !output) {
        return;
    }
    
    for (uint32_t i = 0; i < frameCount; ++i) {
        float sample = generateSample() * amplitude_;
        
        // Dupliquer sur tous les canaux
        for (uint32_t ch = 0; ch < channels; ++ch) {
            output[i * channels + ch] = sample;
        }
        
        // Mettre à jour la phase
        if (wave_type_ != WaveType::Noise) {
            phase_ += phase_increment_;
            if (phase_ >= 2.0 * M_PI) {
                phase_ -= 2.0 * M_PI;
            }
        }
    }
}

float TestToneGenerator::generateSample() {
    switch (wave_type_) {
        case WaveType::Sine:
            return static_cast<float>(std::sin(phase_));
            
        case WaveType::Square:
            return (std::sin(phase_) >= 0.0) ? 1.0f : -1.0f;
            
        case WaveType::Sawtooth:
            return static_cast<float>((phase_ / (2.0 * M_PI)) * 2.0 - 1.0);
            
        case WaveType::Triangle: {
            double normalized = phase_ / (2.0 * M_PI);
            if (normalized < 0.5) {
                return static_cast<float>(normalized * 4.0 - 1.0);
            } else {
                return static_cast<float>(3.0 - normalized * 4.0);
            }
        }
        
        case WaveType::Noise: {
            // Générateur de bruit simple (LFSR)
            noise_seed_ = (noise_seed_ * 1103515245 + 12345) & 0x7fffffff;
            return static_cast<float>((noise_seed_ / 2147483648.0) - 1.0);
        }
        
        default:
            return 0.0f;
    }
}

} // namespace webamp

