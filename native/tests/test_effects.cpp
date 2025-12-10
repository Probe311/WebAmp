#include <gtest/gtest.h>
#include "effects/distortion.h"
#include "effects/overdrive.h"
#include "effects/fuzz.h"
#include "effects/chorus.h"
#include "effects/flanger.h"
#include "effects/tremolo.h"
#include "effects/eq.h"
#include "effects/delay.h"
#include "effects/reverb.h"
#include <vector>
#include <cmath>

namespace webamp {
namespace tests {

class EffectTest : public ::testing::Test {
protected:
    void SetUp() override {
        sample_rate_ = 44100;
        buffer_size_ = 128;
        test_buffer_.resize(buffer_size_ * 2); // Stéréo
        
        // Générer un signal de test (sine wave)
        for (size_t i = 0; i < buffer_size_ * 2; ++i) {
            test_buffer_[i] = 0.3f * std::sin(2.0f * 3.14159f * 440.0f * i / sample_rate_);
        }
    }

    uint32_t sample_rate_;
    uint32_t buffer_size_;
    std::vector<float> test_buffer_;
    std::vector<float> output_buffer_;
};

TEST_F(EffectTest, DistortionEffect) {
    auto effect = std::make_shared<DistortionEffect>();
    effect->setSampleRate(sample_rate_);
    effect->setParameter("distortion", 50.0f);
    effect->setParameter("tone", 50.0f);
    effect->setParameter("level", 50.0f);
    
    output_buffer_.resize(buffer_size_ * 2);
    effect->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    // Vérifier que le signal est traité
    bool hasOutput = false;
    for (size_t i = 0; i < output_buffer_.size(); ++i) {
        if (std::abs(output_buffer_[i]) > 0.001f) {
            hasOutput = true;
            break;
        }
    }
    EXPECT_TRUE(hasOutput);
}

TEST_F(EffectTest, OverdriveEffect) {
    auto effect = std::make_shared<OverdriveEffect>();
    effect->setSampleRate(sample_rate_);
    effect->setParameter("drive", 50.0f);
    effect->setParameter("tone", 50.0f);
    effect->setParameter("level", 50.0f);
    
    output_buffer_.resize(buffer_size_ * 2);
    effect->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    EXPECT_NE(output_buffer_[0], 0.0f);
}

TEST_F(EffectTest, FuzzEffect) {
    auto effect = std::make_shared<FuzzEffect>();
    effect->setSampleRate(sample_rate_);
    effect->setParameter("fuzz", 75.0f);
    effect->setParameter("tone", 50.0f);
    effect->setParameter("volume", 50.0f);
    
    output_buffer_.resize(buffer_size_ * 2);
    effect->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    EXPECT_NE(output_buffer_[0], 0.0f);
}

TEST_F(EffectTest, ChorusEffect) {
    auto effect = std::make_shared<ChorusEffect>();
    effect->setSampleRate(sample_rate_);
    effect->setParameter("rate", 1.0f);
    effect->setParameter("depth", 50.0f);
    effect->setParameter("level", 50.0f);
    
    output_buffer_.resize(buffer_size_ * 2);
    effect->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    EXPECT_NE(output_buffer_[0], 0.0f);
}

TEST_F(EffectTest, DelayEffect) {
    auto effect = std::make_shared<DelayEffect>();
    effect->setSampleRate(sample_rate_);
    effect->setParameter("time", 250.0f); // 250ms
    effect->setParameter("feedback", 50.0f);
    effect->setParameter("mix", 50.0f);
    
    output_buffer_.resize(buffer_size_ * 2);
    
    // Traiter plusieurs buffers pour voir l'écho
    effect->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    // Deuxième buffer (devrait avoir l'écho)
    std::vector<float> secondBuffer(buffer_size_ * 2, 0.0f);
    effect->process(secondBuffer.data(), secondBuffer.data(), buffer_size_);
    
    EXPECT_NE(secondBuffer[0], 0.0f);
}

TEST_F(EffectTest, ReverbEffect) {
    auto effect = std::make_shared<ReverbEffect>();
    effect->setSampleRate(sample_rate_);
    effect->setParameter("decay", 2.0f);
    effect->setParameter("tone", 50.0f);
    effect->setParameter("mix", 50.0f);
    
    output_buffer_.resize(buffer_size_ * 2);
    effect->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    EXPECT_NE(output_buffer_[0], 0.0f);
}

TEST_F(EffectTest, EQEffect) {
    auto effect = std::make_shared<EQEffect>();
    effect->setSampleRate(sample_rate_);
    effect->setParameter("low", 6.0f);
    effect->setParameter("mid", 0.0f);
    effect->setParameter("high", -6.0f);
    effect->setParameter("level", 50.0f);
    
    output_buffer_.resize(buffer_size_ * 2);
    effect->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    EXPECT_NE(output_buffer_[0], 0.0f);
}

TEST_F(EffectTest, BypassFunctionality) {
    auto effect = std::make_shared<DistortionEffect>();
    effect->setSampleRate(sample_rate_);
    effect->setParameter("distortion", 100.0f);
    
    output_buffer_.resize(buffer_size_ * 2);
    
    // Traiter avec bypass OFF
    effect->setBypass(false);
    effect->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    float outputWithEffect = output_buffer_[0];
    
    // Traiter avec bypass ON
    effect->setBypass(true);
    effect->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    float outputBypassed = output_buffer_[0];
    
    // Avec bypass, le signal devrait être identique à l'entrée
    EXPECT_FLOAT_EQ(outputBypassed, test_buffer_[0]);
    // Sans bypass, le signal devrait être modifié
    EXPECT_NE(outputWithEffect, test_buffer_[0]);
}

TEST_F(EffectTest, ParameterRanges) {
    auto effect = std::make_shared<DistortionEffect>();
    effect->setSampleRate(sample_rate_);
    
    // Tester les limites des paramètres
    EXPECT_NO_THROW(effect->setParameter("distortion", 0.0f));
    EXPECT_NO_THROW(effect->setParameter("distortion", 100.0f));
    EXPECT_NO_THROW(effect->setParameter("distortion", -10.0f)); // Valeur invalide mais gérée
    EXPECT_NO_THROW(effect->setParameter("distortion", 150.0f)); // Valeur invalide mais gérée
}

} // namespace tests
} // namespace webamp

