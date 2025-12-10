#include <gtest/gtest.h>
#include "effect_chain.h"
#include "effects/distortion.h"
#include "effects/chorus.h"
#include "effects/delay.h"
#include <vector>
#include <cmath>

namespace webamp {
namespace tests {

class EffectChainTest : public ::testing::Test {
protected:
    void SetUp() override {
        sample_rate_ = 44100;
        buffer_size_ = 128;
        test_buffer_.resize(buffer_size_ * 2);
        output_buffer_.resize(buffer_size_ * 2);
        
        // Générer un signal de test
        for (size_t i = 0; i < buffer_size_ * 2; ++i) {
            test_buffer_[i] = 0.3f * std::sin(2.0f * 3.14159f * 440.0f * i / sample_rate_);
        }
    }

    uint32_t sample_rate_;
    uint32_t buffer_size_;
    std::vector<float> test_buffer_;
    std::vector<float> output_buffer_;
};

TEST_F(EffectChainTest, EmptyChain) {
    EffectChain chain;
    
    chain.process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    // Sans effets, la sortie devrait être identique à l'entrée
    for (size_t i = 0; i < buffer_size_ * 2; ++i) {
        EXPECT_FLOAT_EQ(output_buffer_[i], test_buffer_[i]);
    }
}

TEST_F(EffectChainTest, SingleEffect) {
    EffectChain chain;
    auto effect = std::make_shared<DistortionEffect>();
    effect->setSampleRate(sample_rate_);
    effect->setParameter("distortion", 50.0f);
    effect->setParameter("tone", 50.0f);
    effect->setParameter("level", 50.0f);
    
    chain.addEffect(effect);
    chain.process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    // La sortie devrait être modifiée
    EXPECT_NE(output_buffer_[0], test_buffer_[0]);
}

TEST_F(EffectChainTest, MultipleEffects) {
    EffectChain chain;
    
    // Ajouter plusieurs effets
    auto distortion = std::make_shared<DistortionEffect>();
    distortion->setSampleRate(sample_rate_);
    distortion->setParameter("distortion", 50.0f);
    chain.addEffect(distortion);
    
    auto chorus = std::make_shared<ChorusEffect>();
    chorus->setSampleRate(sample_rate_);
    chorus->setParameter("rate", 1.0f);
    chain.addEffect(chorus);
    
    auto delay = std::make_shared<DelayEffect>();
    delay->setSampleRate(sample_rate_);
    delay->setParameter("time", 250.0f);
    chain.addEffect(delay);
    
    chain.process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    EXPECT_NE(output_buffer_[0], test_buffer_[0]);
    EXPECT_EQ(chain.getEffectCount(), 3);
}

TEST_F(EffectChainTest, MaximumEffects) {
    EffectChain chain;
    
    // Ajouter jusqu'à 20 effets
    for (int i = 0; i < 20; ++i) {
        auto effect = std::make_shared<DistortionEffect>();
        effect->setSampleRate(sample_rate_);
        chain.addEffect(effect);
    }
    
    EXPECT_EQ(chain.getEffectCount(), 20);
    
    chain.process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    // Devrait traiter sans erreur
    EXPECT_NE(output_buffer_[0], 0.0f);
}

TEST_F(EffectChainTest, AddRemoveEffects) {
    EffectChain chain;
    
    auto effect1 = std::make_shared<DistortionEffect>();
    effect1->setSampleRate(sample_rate_);
    chain.addEffect(effect1);
    
    EXPECT_EQ(chain.getEffectCount(), 1);
    
    chain.removeEffect(0);
    EXPECT_EQ(chain.getEffectCount(), 0);
}

TEST_F(EffectChainTest, MoveEffect) {
    EffectChain chain;
    
    auto effect1 = std::make_shared<DistortionEffect>();
    effect1->setSampleRate(sample_rate_);
    chain.addEffect(effect1);
    
    auto effect2 = std::make_shared<ChorusEffect>();
    effect2->setSampleRate(sample_rate_);
    chain.addEffect(effect2);
    
    // Déplacer effect2 à la position 0
    chain.moveEffect(1, 0);
    
    EXPECT_EQ(chain.getEffectCount(), 2);
    // L'effet à la position 0 devrait maintenant être le chorus
    auto effectAt0 = chain.getEffect(0);
    EXPECT_EQ(effectAt0->getType(), "chorus");
}

TEST_F(EffectChainTest, SwapEffects) {
    EffectChain chain;
    
    auto effect1 = std::make_shared<DistortionEffect>();
    effect1->setSampleRate(sample_rate_);
    chain.addEffect(effect1);
    
    auto effect2 = std::make_shared<ChorusEffect>();
    effect2->setSampleRate(sample_rate_);
    chain.addEffect(effect2);
    
    chain.swapEffects(0, 1);
    
    EXPECT_EQ(chain.getEffect(0)->getType(), "chorus");
    EXPECT_EQ(chain.getEffect(1)->getType(), "distortion");
}

TEST_F(EffectChainTest, BypassedEffects) {
    EffectChain chain;
    
    auto effect = std::make_shared<DistortionEffect>();
    effect->setSampleRate(sample_rate_);
    effect->setParameter("distortion", 100.0f);
    effect->setBypass(true);
    chain.addEffect(effect);
    
    chain.process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    // Avec bypass, le signal devrait être identique
    EXPECT_FLOAT_EQ(output_buffer_[0], test_buffer_[0]);
}

TEST_F(EffectChainTest, PresetSaveLoad) {
    EffectChain chain;
    
    auto effect = std::make_shared<DistortionEffect>();
    effect->setSampleRate(sample_rate_);
    effect->setParameter("distortion", 75.0f);
    effect->setParameter("tone", 60.0f);
    chain.addEffect(effect);
    
    // Sauvegarder le preset
    auto preset = chain.savePreset("test_preset");
    EXPECT_EQ(preset.name, "test_preset");
    EXPECT_EQ(preset.effectTypes.size(), 1);
    EXPECT_EQ(preset.effectTypes[0], "distortion");
    
    // Charger le preset
    chain.clear();
    chain.loadPreset(preset);
    EXPECT_EQ(chain.getEffectCount(), 1);
    
    auto loadedEffect = chain.getEffect(0);
    EXPECT_FLOAT_EQ(loadedEffect->getParameter("distortion"), 75.0f);
    EXPECT_FLOAT_EQ(loadedEffect->getParameter("tone"), 60.0f);
}

} // namespace tests
} // namespace webamp

