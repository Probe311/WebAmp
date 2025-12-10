#pragma once

#include "effect_chain.h"
#include "ring_buffer.h"
#include "test_tone_generator.h"
#include "buffer_pool.h"
#include <cstdint>
#include <vector>
#include <atomic>
#include <mutex>
#include <memory>

namespace webamp {

// Pipeline DSP principal : gère la chaîne d'effets et le traitement audio
class DSPPipeline {
public:
    DSPPipeline();
    ~DSPPipeline();
    
    // Initialisation
    bool initialize(uint32_t sampleRate, uint32_t bufferSize);
    void shutdown();
    
    // Traitement audio (appelé depuis le callback audio)
    void process(float* input, float* output, uint32_t frameCount);
    
    // Gestion de la chaîne d'effets
    void setEffectChain(std::shared_ptr<EffectChain> chain);
    std::shared_ptr<EffectChain> getEffectChain() const;
    
    // Monitoring
    struct Stats {
        double cpuUsage = 0.0;        // % CPU
        double peakInput = 0.0;       // dB
        double peakOutput = 0.0;      // dB
        double latency = 0.0;         // ms
        uint64_t samplesProcessed = 0;
    };
    
    Stats getStats() const;
    void resetStats();
    
    // Configuration
    void setInputGain(float gain);    // dB
    void setOutputGain(float gain);   // dB
    float getInputGain() const;
    float getOutputGain() const;
    
    // Générateur de signal de test
    void enableTestTone(bool enabled);
    void setTestToneFrequency(float frequency);
    void setTestToneAmplitude(float amplitude);
    bool isTestToneEnabled() const;
    
private:
    // Buffer de travail (alloué une fois, réutilisé)
    std::vector<float> work_buffer_;
    
    // Pool de buffers pour éviter les allocations
    std::unique_ptr<BufferPool> buffer_pool_;
    
    // Chaîne d'effets
    std::shared_ptr<EffectChain> effect_chain_;
    mutable std::mutex chain_mutex_;
    
    // Gains
    std::atomic<float> input_gain_;
    std::atomic<float> output_gain_;
    
    // Stats
    mutable std::mutex stats_mutex_;
    Stats stats_;
    
    // Configuration
    uint32_t sample_rate_;
    uint32_t buffer_size_;
    
    // Générateur de signal de test
    TestToneGenerator test_tone_generator_;
    
    // Helpers
    float dbToLinear(float db) const;
    float linearToDb(float linear) const;
    void updateStats(const float* input, const float* output, uint32_t frameCount);
};

} // namespace webamp

