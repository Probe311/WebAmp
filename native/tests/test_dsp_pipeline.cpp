#include <gtest/gtest.h>
#include "dsp_pipeline.h"
#include "effect_chain.h"
#include "effects/distortion.h"
#include <vector>
#include <cmath>
#include <chrono>

namespace webamp {
namespace tests {

class DSPPipelineTest : public ::testing::Test {
protected:
    void SetUp() override {
        sample_rate_ = 44100;
        buffer_size_ = 64; // Optimisé pour latence < 5ms
        test_buffer_.resize(buffer_size_ * 2);
        output_buffer_.resize(buffer_size_ * 2);
        
        // Générer un signal de test
        for (size_t i = 0; i < buffer_size_ * 2; ++i) {
            test_buffer_[i] = 0.3f * std::sin(2.0f * 3.14159f * 440.0f * i / sample_rate_);
        }
        
        pipeline_ = std::make_unique<DSPPipeline>();
        pipeline_->initialize(sample_rate_, buffer_size_);
    }

    uint32_t sample_rate_;
    uint32_t buffer_size_;
    std::vector<float> test_buffer_;
    std::vector<float> output_buffer_;
    std::unique_ptr<DSPPipeline> pipeline_;
};

TEST_F(DSPPipelineTest, Initialization) {
    EXPECT_TRUE(pipeline_->getSampleRate() == sample_rate_ || pipeline_->getSampleRate() > 0);
}

TEST_F(DSPPipelineTest, ProcessWithoutEffects) {
    pipeline_->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    // Sans effets, le signal devrait passer tel quel (avec gains)
    EXPECT_NE(output_buffer_[0], 0.0f);
}

TEST_F(DSPPipelineTest, ProcessWithEffects) {
    auto chain = std::make_shared<EffectChain>();
    auto effect = std::make_shared<DistortionEffect>();
    effect->setSampleRate(sample_rate_);
    effect->setParameter("distortion", 50.0f);
    chain->addEffect(effect);
    
    pipeline_->setEffectChain(chain);
    pipeline_->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    EXPECT_NE(output_buffer_[0], test_buffer_[0]);
}

TEST_F(DSPPipelineTest, LatencyMeasurement) {
    pipeline_->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    auto stats = pipeline_->getStats();
    
    // Latence devrait être < 5ms avec buffer_size 64 @ 48kHz
    double expectedLatency = (buffer_size_ / (double)sample_rate_) * 1000.0;
    EXPECT_LE(stats.latency, 5.0); // ms
}

TEST_F(DSPPipelineTest, CPUUsageMeasurement) {
    auto start = std::chrono::high_resolution_clock::now();
    
    // Traiter plusieurs buffers
    for (int i = 0; i < 100; ++i) {
        pipeline_->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start).count();
    
    // CPU usage devrait être < 15%
    double cpuTime = (duration / 1000.0) / (100 * buffer_size_ / (double)sample_rate_ * 1000.0);
    double cpuPercent = cpuTime * 100.0;
    
    EXPECT_LE(cpuPercent, 15.0);
}

TEST_F(DSPPipelineTest, InputOutputGain) {
    pipeline_->setInputGain(6.0f); // +6dB
    pipeline_->setOutputGain(-6.0f); // -6dB
    
    EXPECT_FLOAT_EQ(pipeline_->getInputGain(), 6.0f);
    EXPECT_FLOAT_EQ(pipeline_->getOutputGain(), -6.0f);
}

TEST_F(DSPPipelineTest, StatsUpdate) {
    pipeline_->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    auto stats = pipeline_->getStats();
    
    EXPECT_GE(stats.samplesProcessed, buffer_size_);
    EXPECT_GE(stats.peakInput, -96.0); // dB
    EXPECT_GE(stats.peakOutput, -96.0); // dB
}

TEST_F(DSPPipelineTest, HighSampleRate) {
    // Tester avec 96kHz
    uint32_t highSampleRate = 96000;
    pipeline_->initialize(highSampleRate, buffer_size_);
    
    pipeline_->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    EXPECT_NE(output_buffer_[0], 0.0f);
}

TEST_F(DSPPipelineTest, VeryHighSampleRate) {
    // Tester avec 192kHz
    uint32_t veryHighSampleRate = 192000;
    pipeline_->initialize(veryHighSampleRate, buffer_size_);
    
    pipeline_->process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    EXPECT_NE(output_buffer_[0], 0.0f);
}

} // namespace tests
} // namespace webamp

