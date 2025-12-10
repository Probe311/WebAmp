#pragma once

#include "audio_driver.h"
#include <cstdint>
#include <string>
#include <vector>
#include <windows.h>
#include <mmdeviceapi.h>
#include <audioclient.h>
#include <thread>
#include <atomic>

namespace webamp {

// Driver WASAPI (Windows) - Exclusive mode pour latence minimale
class WASAPIDriver : public AudioDriver {
public:
    WASAPIDriver();
    ~WASAPIDriver();
    
    bool initialize(uint32_t sampleRate, uint32_t bufferSize) override;
    void shutdown() override;
    
    bool start() override;
    bool stop() override;
    
    uint32_t getSampleRate() const override;
    uint32_t getBufferSize() const override;
    uint32_t getInputChannels() const override;
    uint32_t getOutputChannels() const override;
    
    double getInputLatency() const override;
    double getOutputLatency() const override;
    
    // WASAPI spécifique
    static std::vector<std::string> getAvailableDevices();
    bool selectDevice(const std::string& deviceId);
    
private:
    // Thread audio
    void audioThread();
    
    // Helpers WASAPI
    bool initializeWASAPI();
    void cleanupWASAPI();
    
    // COM
    IMMDeviceEnumerator* enumerator_ = nullptr;
    IMMDevice* device_ = nullptr;
    IAudioClient* audio_client_ = nullptr;
    IAudioCaptureClient* capture_client_ = nullptr;
    IAudioRenderClient* render_client_ = nullptr;
    
    // Thread
    std::thread audio_thread_;
    std::atomic<bool> running_;
    bool initialized_ = false;
    
    // Configuration
    uint32_t sample_rate_;
    uint32_t buffer_size_;
    uint32_t input_channels_;
    uint32_t output_channels_;
    uint32_t frame_size_;
    
    // Latence
    REFERENCE_TIME buffer_duration_;
    double input_latency_;
    double output_latency_;
    
    // Buffers
    std::vector<float> input_buffer_;
    std::vector<float> output_buffer_;
    std::vector<float> work_buffer_;
};

} // namespace webamp

