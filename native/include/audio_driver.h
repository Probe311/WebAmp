#pragma once

#include <cstdint>
#include <functional>
#include <memory>

namespace webamp {

// Types audio
using AudioCallback = std::function<void(float* input, float* output, uint32_t frameCount, double sampleRate)>;

// Interface abstraite pour les drivers audio
class AudioDriver {
public:
    virtual ~AudioDriver() = default;
    
    // Initialisation
    virtual bool initialize(uint32_t sampleRate, uint32_t bufferSize) = 0;
    virtual void shutdown() = 0;
    
    // Contrôle
    virtual bool start() = 0;
    virtual bool stop() = 0;
    
    // Configuration
    virtual uint32_t getSampleRate() const = 0;
    virtual uint32_t getBufferSize() const = 0;
    virtual uint32_t getInputChannels() const = 0;
    virtual uint32_t getOutputChannels() const = 0;
    
    // Latence
    virtual double getInputLatency() const = 0;  // en secondes
    virtual double getOutputLatency() const = 0; // en secondes
    
    // Callback
    void setCallback(AudioCallback callback) {
        callback_ = callback;
    }
    
protected:
    AudioCallback callback_;
};

} // namespace webamp

