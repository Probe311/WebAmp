#pragma once

#include "audio_driver.h"
#include <cstdint>
#include <string>
#include <vector>

#ifdef __linux__
// PipeWire headers (nécessite libpipewire)
#include <pipewire/pipewire.h>
#include <spa/param/audio/format-utils.h>
#include <spa/param/audio/raw.h>
#endif

namespace webamp {

// Driver PipeWire (Linux)
class PipeWireDriver : public AudioDriver {
public:
    PipeWireDriver();
    ~PipeWireDriver();
    
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
    
    // PipeWire spécifique
    static std::vector<std::string> getAvailableDevices();
    bool selectDevice(const std::string& deviceId);
    bool supportsJACK() const;
    
private:
#ifdef __linux__
    // Callbacks PipeWire
    static void onStateChanged(void* data, enum pw_stream_state old, enum pw_stream_state state, const char* error);
    static void onProcess(void* userData);
    
    void processAudio(uint32_t nFrames);
    
    // Helpers
    bool initializePipeWire();
    void cleanupPipeWire();
    bool createStream();
    void setupAudioFormat();
    void updateLatency();
    
    // PipeWire
    struct pw_context* context_ = nullptr;
    struct pw_core* core_ = nullptr;
    struct pw_stream* stream_ = nullptr;
    struct pw_main_loop* main_loop_ = nullptr;
    struct pw_thread_loop* thread_loop_ = nullptr;
    
    // Format audio
    struct spa_audio_info_raw audio_info_;
    
    // Buffers
    std::vector<float> work_buffer_;
    std::vector<float*> input_buffers_;
    std::vector<float*> output_buffers_;
    
    // Latence
    double input_latency_seconds_ = 0.0;
    double output_latency_seconds_ = 0.0;
    
    // Thread
    std::thread audio_thread_;
    std::atomic<bool> running_;
    
    // Configuration
    bool jack_support_ = false;
    std::string selected_device_id_;
#endif
    
    bool initialized_ = false;
    bool running_ = false;
    
    uint32_t sample_rate_;
    uint32_t buffer_size_;
    uint32_t input_channels_;
    uint32_t output_channels_;
};

} // namespace webamp

