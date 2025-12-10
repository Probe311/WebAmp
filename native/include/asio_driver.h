#pragma once

#include "audio_driver.h"
#include <cstdint>
#include <string>
#include <vector>

#ifdef HAS_ASIO_SDK
#include "asio.h"
#endif

namespace webamp {

// Driver ASIO (Windows) - nécessite ASIO SDK
class ASIODriver : public AudioDriver {
public:
    ASIODriver();
    ~ASIODriver();
    
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
    
    // ASIO spécifique
    static std::vector<std::string> getAvailableDrivers();
    bool selectDriver(const std::string& driverName);
    bool handleDeviceChange(); // Gestion des changements de périphérique à chaud
    
private:
#ifdef HAS_ASIO_SDK
    // Callbacks ASIO statiques
    static ASIOTime* bufferSwitchTimeInfoCallback(ASIOTime* timeInfo, long index, ASIOBool processNow);
    static void bufferSwitchCallback(long doubleBufferIndex, ASIOBool directProcess);
    static ASIOSampleRate sampleRateChangedCallback(ASIOSampleRate sRate);
    static long asioMessageCallback(long selector, long value, void* message, double* opt);
    
    // Traitement audio
    void processAudio(ASIOTime* timeInfo, long index, ASIOBool processNow);
    
    // Helpers
    void enumerateDrivers();
    bool testDriver(const std::string& driverName);
    bool loadDriver(const std::string& driverName);
    bool createBuffers();
    void setupCallbacks();
    void convertFromASIOFormat(void* asioBuffer, float* floatBuffer, long samples, ASIOSampleType type);
    void convertToASIOFormat(float* floatBuffer, void* asioBuffer, long samples, ASIOSampleType type);
    
    // Structures ASIO
    ASIODriverInfo asio_driver_info_;
    ASIOCallbacks asio_callbacks_;
    ASIOBufferInfo* asio_buffer_infos_ = nullptr;
    ASIOChannelInfo* asio_channel_infos_ = nullptr;
    
    // Configuration ASIO
    long num_input_channels_;
    long num_output_channels_;
    long buffer_size_samples_;
    uint32_t preferred_buffer_size_;
    uint32_t preferred_sample_rate_;
    
    // Gestion des drivers
    std::vector<std::string> available_drivers_;
    long selected_driver_index_;
    void* asio_driver_ = nullptr;
#else
    // Placeholders pour compilation sans SDK
    void* asio_driver_ = nullptr;
#endif
    
    bool initialized_ = false;
    bool running_ = false;
    
    uint32_t sample_rate_;
    uint32_t buffer_size_;
    uint32_t input_channels_;
    uint32_t output_channels_;
    
    // Buffers
    std::vector<float> work_buffer_;
};

} // namespace webamp

