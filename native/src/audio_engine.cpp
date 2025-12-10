#include "audio_engine.h"
#include "wasapi_driver.h"
#include "asio_driver.h"
#include "coreaudio_driver.h"
#include "pipewire_driver.h"
#include <algorithm>
#include <chrono>
#include <iostream>
#include <thread>

namespace webamp {

AudioEngine::AudioEngine()
    : running_(false)
    , initialized_(false)
    , sample_rate_(48000)
    , buffer_size_(64)  // Optimisé pour latence < 5ms (64 samples @ 48kHz = 1.33ms)
{
    pipeline_ = std::make_shared<DSPPipeline>();
}

AudioEngine::~AudioEngine() {
    shutdown();
}

bool AudioEngine::initialize(const std::string& driverName) {
    if (initialized_) {
        shutdown();
    }
    
    // Sélection du driver
    if (driverName == "auto" || driverName.empty()) {
        // Essayer les drivers selon la plateforme
        #ifdef _WIN32
        // Windows: ASIO puis WASAPI
        driver_ = std::make_unique<ASIODriver>();
        if (!driver_->initialize(sample_rate_, buffer_size_)) {
            driver_.reset();
            driver_ = std::make_unique<WASAPIDriver>();
            if (!driver_->initialize(sample_rate_, buffer_size_)) {
                std::cerr << "Erreur: Aucun driver audio disponible\n";
                return false;
            }
            current_driver_name_ = "WASAPI";
        } else {
            current_driver_name_ = "ASIO";
        }
        #elif __APPLE__
        // macOS: CoreAudio
        driver_ = std::make_unique<CoreAudioDriver>();
        if (!driver_->initialize(sample_rate_, buffer_size_)) {
            std::cerr << "Erreur: Impossible d'initialiser CoreAudio\n";
            return false;
        }
        current_driver_name_ = "CoreAudio";
        #elif __linux__
        // Linux: PipeWire puis ALSA (fallback)
        driver_ = std::make_unique<PipeWireDriver>();
        if (!driver_->initialize(sample_rate_, buffer_size_)) {
            std::cerr << "Avertissement: PipeWire non disponible, fallback nécessaire\n";
            // TODO: Implémenter fallback ALSA si nécessaire
            return false;
        }
        current_driver_name_ = "PipeWire";
        #else
        std::cerr << "Plateforme non supportée\n";
        return false;
        #endif
    } else {
        if (driverName == "WASAPI") {
            #ifdef _WIN32
            driver_ = std::make_unique<WASAPIDriver>();
            #else
            std::cerr << "WASAPI uniquement disponible sur Windows\n";
            return false;
            #endif
        } else if (driverName == "ASIO") {
            #ifdef _WIN32
            driver_ = std::make_unique<ASIODriver>();
            #else
            std::cerr << "ASIO uniquement disponible sur Windows\n";
            return false;
            #endif
        } else if (driverName == "CoreAudio") {
            #ifdef __APPLE__
            driver_ = std::make_unique<CoreAudioDriver>();
            #else
            std::cerr << "CoreAudio uniquement disponible sur macOS/iOS\n";
            return false;
            #endif
        } else if (driverName == "PipeWire") {
            #ifdef __linux__
            driver_ = std::make_unique<PipeWireDriver>();
            #else
            std::cerr << "PipeWire uniquement disponible sur Linux\n";
            return false;
            #endif
        } else {
            std::cerr << "Driver inconnu: " << driverName << "\n";
            return false;
        }
        
        if (!driver_->initialize(sample_rate_, buffer_size_)) {
            std::cerr << "Erreur: Impossible d'initialiser le driver " << driverName << "\n";
            return false;
        }
        current_driver_name_ = driverName;
    }
    
    // Mise à jour de la config depuis le driver
    sample_rate_ = driver_->getSampleRate();
    buffer_size_ = driver_->getBufferSize();
    
    // Initialisation du pipeline
    if (!pipeline_->initialize(sample_rate_, buffer_size_)) {
        std::cerr << "Erreur: Impossible d'initialiser le pipeline DSP\n";
        driver_->shutdown();
        driver_.reset();
        return false;
    }
    
    // Configuration du callback
    driver_->setCallback([this](float* input, float* output, uint32_t frameCount, double sampleRate) {
        this->audioCallback(input, output, frameCount, sampleRate);
    });
    
    initialized_ = true;
    return true;
}

void AudioEngine::shutdown() {
    if (running_) {
        stop();
    }
    
    if (pipeline_) {
        pipeline_->shutdown();
    }
    
    if (driver_) {
        driver_->shutdown();
        driver_.reset();
    }
    
    initialized_ = false;
}

bool AudioEngine::start() {
    if (!initialized_) {
        return false;
    }
    
    if (running_) {
        return true;
    }
    
    if (!driver_->start()) {
        return false;
    }
    
    running_ = true;
    return true;
}

bool AudioEngine::stop() {
    if (!running_) {
        return true;
    }
    
    if (!driver_->stop()) {
        return false;
    }
    
    running_ = false;
    return true;
}

void AudioEngine::audioCallback(float* input, float* output, uint32_t frameCount, double sampleRate) {
    // Traitement dans le pipeline DSP
    pipeline_->process(input, output, frameCount);
}

double AudioEngine::getTotalLatency() const {
    if (!driver_) {
        return 0.0;
    }
    return driver_->getInputLatency() + driver_->getOutputLatency();
}

DSPPipeline::Stats AudioEngine::getStats() const {
    if (pipeline_) {
        return pipeline_->getStats();
    }
    return DSPPipeline::Stats{};
}

std::vector<std::string> AudioEngine::getAvailableDrivers() const {
    std::vector<std::string> drivers;
    #ifdef _WIN32
    drivers.push_back("WASAPI");
    auto asioDrivers = ASIODriver::getAvailableDrivers();
    drivers.insert(drivers.end(), asioDrivers.begin(), asioDrivers.end());
    #endif
    return drivers;
}

bool AudioEngine::setDriver(const std::string& driverName) {
    if (running_) {
        stop();
    }
    return initialize(driverName);
}

bool AudioEngine::setSampleRate(uint32_t sampleRate) {
    if (running_) {
        return false;
    }
    sample_rate_ = sampleRate;
    if (initialized_) {
        return initialize(current_driver_name_);
    }
    return true;
}

bool AudioEngine::setBufferSize(uint32_t bufferSize) {
    if (running_) {
        return false;
    }
    buffer_size_ = bufferSize;
    if (initialized_) {
        return initialize(current_driver_name_);
    }
    return true;
}

uint32_t AudioEngine::getSampleRate() const {
    if (driver_) {
        return driver_->getSampleRate();
    }
    return sample_rate_;
}

uint32_t AudioEngine::getBufferSize() const {
    if (driver_) {
        return driver_->getBufferSize();
    }
    return buffer_size_;
}

} // namespace webamp

