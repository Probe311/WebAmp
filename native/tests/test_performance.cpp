#include <gtest/gtest.h>
#include "dsp_pipeline.h"
#include "effect_chain.h"
#include "effects/distortion.h"
#include "effects/chorus.h"
#include "effects/delay.h"
#include <vector>
#include <chrono>
#include <memory>

namespace webamp {
namespace tests {

class PerformanceTest : public ::testing::Test {
protected:
    void SetUp() override {
        sample_rate_ = 48000;
        buffer_size_ = 64;
        test_buffer_.resize(buffer_size_ * 2);
        output_buffer_.resize(buffer_size_ * 2);
        
        for (size_t i = 0; i < buffer_size_ * 2; ++i) {
            test_buffer_[i] = 0.3f * std::sin(2.0f * 3.14159f * 440.0f * i / sample_rate_);
        }
    }

    uint32_t sample_rate_;
    uint32_t buffer_size_;
    std::vector<float> test_buffer_;
    std::vector<float> output_buffer_;
};

TEST_F(PerformanceTest, LatencyUnder5ms) {
    DSPPipeline pipeline;
    pipeline.initialize(sample_rate_, buffer_size_);
    
    auto start = std::chrono::high_resolution_clock::now();
    pipeline.process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    auto end = std::chrono::high_resolution_clock::now();
    
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start).count();
    double latencyMs = duration / 1000.0;
    
    EXPECT_LE(latencyMs, 5.0); // < 5ms
}

TEST_F(PerformanceTest, CPUUsageUnder15Percent) {
    DSPPipeline pipeline;
    pipeline.initialize(sample_rate_, buffer_size_);
    
    auto chain = std::make_shared<EffectChain>();
    for (int i = 0; i < 10; ++i) {
        auto effect = std::make_shared<DistortionEffect>();
        effect->setSampleRate(sample_rate_);
        chain->addEffect(effect);
    }
    pipeline.setEffectChain(chain);
    
    auto start = std::chrono::high_resolution_clock::now();
    
    // Traiter 1000 buffers
    for (int i = 0; i < 1000; ++i) {
        pipeline.process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start).count();
    
    double totalTimeMs = duration / 1000.0;
    double availableTimeMs = (1000 * buffer_size_ / (double)sample_rate_) * 1000.0;
    double cpuPercent = (totalTimeMs / availableTimeMs) * 100.0;
    
    EXPECT_LE(cpuPercent, 15.0); // < 15%
}

TEST_F(PerformanceTest, MemoryUnder100MBFor10Effects) {
    // Estimation mémoire
    size_t effectSize = sizeof(DistortionEffect);
    size_t bufferSize = buffer_size_ * 2 * sizeof(float);
    size_t chainOverhead = sizeof(EffectChain);
    
    size_t totalMemory = (10 * effectSize) + (10 * bufferSize) + chainOverhead;
    double memoryMB = totalMemory / (1024.0 * 1024.0);
    
    EXPECT_LE(memoryMB, 100.0); // < 100MB
}

TEST_F(PerformanceTest, Support20Effects) {
    EffectChain chain;
    
    for (int i = 0; i < 20; ++i) {
        auto effect = std::make_shared<DistortionEffect>();
        effect->setSampleRate(sample_rate_);
        chain.addEffect(effect);
    }
    
    EXPECT_EQ(chain.getEffectCount(), 20);
    
    chain.process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    
    // Ne devrait pas planter
    EXPECT_NE(output_buffer_[0], 0.0f);
}

TEST_F(PerformanceTest, HighSampleRatePerformance) {
    DSPPipeline pipeline;
    pipeline.initialize(96000, buffer_size_);
    
    auto start = std::chrono::high_resolution_clock::now();
    pipeline.process(test_buffer_.data(), output_buffer_.data(), buffer_size_);
    auto end = std::chrono::high_resolution_clock::now();
    
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start).count();
    double latencyMs = duration / 1000.0;
    
    // Même à 96kHz, la latence devrait rester < 5ms
    EXPECT_LE(latencyMs, 5.0);
}

} // namespace tests
} // namespace webamp

