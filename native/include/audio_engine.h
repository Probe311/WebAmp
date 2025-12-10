#pragma once

#include "audio_driver.h"
#include "dsp_pipeline.h"
#include <memory>
#include <thread>
#include <atomic>
#include <string>

namespace webamp {

// Moteur audio principal : coordonne driver audio + pipeline DSP
class AudioEngine {
public:
    AudioEngine();
    ~AudioEngine();
    
    // Initialisation
    bool initialize(const std::string& driverName = "auto");
    void shutdown();
    
    // Contrôle
    bool start();
    bool stop();
    bool isRunning() const { return running_; }
    
    // Configuration audio
    bool setSampleRate(uint32_t sampleRate);
    bool setBufferSize(uint32_t bufferSize);
    uint32_t getSampleRate() const;
    uint32_t getBufferSize() const;
    
    // Driver audio
    std::vector<std::string> getAvailableDrivers() const;
    bool setDriver(const std::string& driverName);
    
    // Pipeline DSP
    std::shared_ptr<DSPPipeline> getPipeline() const { return pipeline_; }
    
    // Latence
    double getTotalLatency() const;  // en secondes
    
    // Stats
    DSPPipeline::Stats getStats() const;
    
private:
    // Callback audio (appelé par le driver)
    void audioCallback(float* input, float* output, uint32_t frameCount, double sampleRate);
    
    // Driver audio
    std::unique_ptr<AudioDriver> driver_;
    std::string current_driver_name_;
    
    // Pipeline DSP
    std::shared_ptr<DSPPipeline> pipeline_;
    
    // État
    std::atomic<bool> running_;
    std::atomic<bool> initialized_;
    
    // Configuration
    uint32_t sample_rate_;
    uint32_t buffer_size_;
};

} // namespace webamp

