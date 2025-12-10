#pragma once

#include "audio_driver.h"
#include <cstdint>
#include <string>
#include <vector>

#ifdef __APPLE__
#include <AudioToolbox/AudioToolbox.h>
#include <CoreAudio/CoreAudio.h>
#include <CoreFoundation/CoreFoundation.h>
#endif

namespace webamp {

// Driver CoreAudio (macOS/iOS)
class CoreAudioDriver : public AudioDriver {
public:
    CoreAudioDriver();
    ~CoreAudioDriver();
    
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
    
    // CoreAudio spécifique
    static std::vector<std::string> getAvailableDevices();
    bool selectDevice(const std::string& deviceId);
    bool createAggregateDevice(const std::vector<std::string>& deviceIds);
    bool supportsHighResolution() const;
    
private:
#ifdef __APPLE__
    // Callback CoreAudio
    static OSStatus audioCallback(void* inRefCon,
                                  AudioUnitRenderActionFlags* ioActionFlags,
                                  const AudioTimeStamp* inTimeStamp,
                                  UInt32 inBusNumber,
                                  UInt32 inNumberFrames,
                                  AudioBufferList* ioData);
    
    OSStatus processAudio(AudioUnitRenderActionFlags* ioActionFlags,
                         const AudioTimeStamp* inTimeStamp,
                         UInt32 inBusNumber,
                         UInt32 inNumberFrames,
                         AudioBufferList* ioData);
    
    // Helpers
    bool initializeCoreAudio();
    void cleanupCoreAudio();
    bool setupAudioUnit();
    bool setupInputDevice();
    bool setupOutputDevice();
    void updateLatency();
    
    // AudioUnit
    AudioUnit audio_unit_ = nullptr;
    AudioComponent audio_component_ = nullptr;
    
    // Devices
    AudioDeviceID input_device_id_ = kAudioObjectUnknown;
    AudioDeviceID output_device_id_ = kAudioObjectUnknown;
    AudioDeviceID aggregate_device_id_ = kAudioObjectUnknown;
    
    // Format audio
    AudioStreamBasicDescription input_format_;
    AudioStreamBasicDescription output_format_;
    
    // Latence
    Float64 input_latency_seconds_ = 0.0;
    Float64 output_latency_seconds_ = 0.0;
    
    // Buffers
    AudioBufferList* input_buffer_list_ = nullptr;
    std::vector<float> work_buffer_;
    
    // Configuration
    bool use_aggregate_device_ = false;
    bool high_resolution_enabled_ = false;
#endif
    
    bool initialized_ = false;
    bool running_ = false;
    
    uint32_t sample_rate_;
    uint32_t buffer_size_;
    uint32_t input_channels_;
    uint32_t output_channels_;
    
    std::string selected_device_id_;
};

} // namespace webamp

