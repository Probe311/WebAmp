#include "wasapi_driver.h"
#include <iostream>
#include <comdef.h>
#include <functiondiscoverykeys_devpkey.h>

#pragma comment(lib, "ole32.lib")
#pragma comment(lib, "oleaut32.lib")
#pragma comment(lib, "uuid.lib")

namespace webamp {

WASAPIDriver::WASAPIDriver()
    : running_(false)
    , sample_rate_(48000)
    , buffer_size_(128)
    , input_channels_(2)
    , output_channels_(2)
    , frame_size_(0)
    , buffer_duration_(0)
    , input_latency_(0.0)
    , output_latency_(0.0)
{
}

WASAPIDriver::~WASAPIDriver() {
    shutdown();
}

bool WASAPIDriver::initialize(uint32_t sampleRate, uint32_t bufferSize) {
    if (initialized_) {
        shutdown();
    }
    
    sample_rate_ = sampleRate;
    buffer_size_ = bufferSize;
    
    // Initialisation COM
    HRESULT hr = CoInitializeEx(nullptr, COINIT_MULTITHREADED);
    if (FAILED(hr) && hr != RPC_E_CHANGED_MODE) {
        std::cerr << "Erreur COM: " << hr << "\n";
        return false;
    }
    
    if (!initializeWASAPI()) {
        cleanupWASAPI();
        CoUninitialize();
        return false;
    }
    
    // Allocation des buffers
    input_buffer_.resize(buffer_size_ * input_channels_);
    output_buffer_.resize(buffer_size_ * output_channels_);
    work_buffer_.resize(buffer_size_ * output_channels_);
    
    initialized_ = true;
    return true;
}

void WASAPIDriver::shutdown() {
    stop();
    cleanupWASAPI();
    CoUninitialize();
    initialized_ = false;
}

bool WASAPIDriver::start() {
    if (!initialized_ || running_) {
        return false;
    }
    
    running_ = true;
    audio_thread_ = std::thread(&WASAPIDriver::audioThread, this);
    
    return true;
}

bool WASAPIDriver::stop() {
    if (!running_) {
        return true;
    }
    
    running_ = false;
    
    if (audio_thread_.joinable()) {
        audio_thread_.join();
    }
    
    return true;
}

bool WASAPIDriver::initializeWASAPI() {
    HRESULT hr;
    
    // Enumerator
    hr = CoCreateInstance(
        __uuidof(MMDeviceEnumerator),
        nullptr,
        CLSCTX_ALL,
        __uuidof(IMMDeviceEnumerator),
        (void**)&enumerator_
    );
    
    if (FAILED(hr)) {
        std::cerr << "Erreur: Impossible de créer l'enumerator\n";
        return false;
    }
    
    // Device par défaut (TODO: permettre la sélection)
    hr = enumerator_->GetDefaultAudioEndpoint(
        eRender,
        eConsole,
        &device_
    );
    
    if (FAILED(hr)) {
        std::cerr << "Erreur: Impossible d'obtenir le device par défaut\n";
        return false;
    }
    
    // Audio Client
    hr = device_->Activate(
        __uuidof(IAudioClient),
        CLSCTX_ALL,
        nullptr,
        (void**)&audio_client_
    );
    
    if (FAILED(hr)) {
        std::cerr << "Erreur: Impossible d'activer l'audio client\n";
        return false;
    }
    
    // Format WAVEFORMATEX (support 96kHz/192kHz)
    WAVEFORMATEX format = {};
    format.wFormatTag = WAVE_FORMAT_IEEE_FLOAT;
    format.nChannels = output_channels_;
    format.nSamplesPerSec = sample_rate_;  // Support jusqu'à 192kHz
    format.wBitsPerSample = 32;
    format.nBlockAlign = format.nChannels * (format.wBitsPerSample / 8);
    format.nAvgBytesPerSec = format.nSamplesPerSec * format.nBlockAlign;
    format.cbSize = 0;
    
    // Vérifier que le sample rate est supporté (44100, 48000, 96000, 192000)
    if (sample_rate_ != 44100 && sample_rate_ != 48000 && 
        sample_rate_ != 96000 && sample_rate_ != 192000) {
        std::cerr << "Avertissement: Sample rate " << sample_rate_ 
                  << " peut ne pas être supporté, utilisation de 48000\n";
        sample_rate_ = 48000;
        format.nSamplesPerSec = sample_rate_;
        format.nAvgBytesPerSec = format.nSamplesPerSec * format.nBlockAlign;
    }
    
    // Durée du buffer (en 100-nanosecond units)
    REFERENCE_TIME bufferDuration = (REFERENCE_TIME)((double)buffer_size_ / sample_rate_ * 10000000.0);
    
    // Initialisation en mode exclusif pour latence minimale
    hr = audio_client_->Initialize(
        AUDCLNT_SHAREMODE_EXCLUSIVE,
        AUDCLNT_STREAMFLAGS_EVENTCALLBACK,
        bufferDuration,
        bufferDuration,
        &format,
        nullptr
    );
    
    if (FAILED(hr)) {
        std::cerr << "Erreur: Impossible d'initialiser l'audio client (hr=" << hr << ")\n";
        std::cerr << "Tentative en mode partagé...\n";
        
        // Fallback en mode partagé
        hr = audio_client_->Initialize(
            AUDCLNT_SHAREMODE_SHARED,
            0,
            bufferDuration,
            0,
            &format,
            nullptr
        );
        
        if (FAILED(hr)) {
            std::cerr << "Erreur: Impossible d'initialiser même en mode partagé\n";
            return false;
        }
    }
    
    // Render Client
    hr = audio_client_->GetService(
        __uuidof(IAudioRenderClient),
        (void**)&render_client_
    );
    
    if (FAILED(hr)) {
        std::cerr << "Erreur: Impossible d'obtenir le render client\n";
        return false;
    }
    
    // Latence
    UINT32 bufferFrameCount;
    audio_client_->GetBufferSize(&bufferFrameCount);
    buffer_duration_ = (REFERENCE_TIME)((double)bufferFrameCount / sample_rate_ * 10000000.0);
    output_latency_ = (double)bufferFrameCount / sample_rate_;
    input_latency_ = 0.0; // Pas d'entrée pour l'instant
    
    frame_size_ = format.nBlockAlign;
    
    return true;
}

void WASAPIDriver::cleanupWASAPI() {
    if (render_client_) {
        render_client_->Release();
        render_client_ = nullptr;
    }
    
    if (capture_client_) {
        capture_client_->Release();
        capture_client_ = nullptr;
    }
    
    if (audio_client_) {
        audio_client_->Release();
        audio_client_ = nullptr;
    }
    
    if (device_) {
        device_->Release();
        device_ = nullptr;
    }
    
    if (enumerator_) {
        enumerator_->Release();
        enumerator_ = nullptr;
    }
}

void WASAPIDriver::audioThread() {
    if (!audio_client_ || !render_client_) {
        return;
    }
    
    audio_client_->Start();
    
    UINT32 bufferFrameCount;
    audio_client_->GetBufferSize(&bufferFrameCount);
    
    while (running_) {
        UINT32 numFramesPadding;
        HRESULT hr = audio_client_->GetCurrentPadding(&numFramesPadding);
        
        if (FAILED(hr)) {
            break;
        }
        
        UINT32 numFramesAvailable = bufferFrameCount - numFramesPadding;
        
        if (numFramesAvailable > 0) {
            // Obtenir le buffer de sortie
            BYTE* pData;
            hr = render_client_->GetBuffer(numFramesAvailable, &pData);
            
            if (SUCCEEDED(hr)) {
                float* output = (float*)pData;
                
                // Générer du silence ou appeler le callback
                if (callback_) {
                    // Pour l'instant, on génère du silence en entrée
                    std::fill(input_buffer_.begin(), input_buffer_.end(), 0.0f);
                    callback_(input_buffer_.data(), output, numFramesAvailable, sample_rate_);
                } else {
                    // Silence
                    std::fill(output, output + numFramesAvailable * output_channels_, 0.0f);
                }
                
                render_client_->ReleaseBuffer(numFramesAvailable, 0);
            }
        }
        
        // Sleep pour éviter de consommer trop de CPU
        std::this_thread::sleep_for(std::chrono::milliseconds(1));
    }
    
    audio_client_->Stop();
}

uint32_t WASAPIDriver::getSampleRate() const {
    return sample_rate_;
}

uint32_t WASAPIDriver::getBufferSize() const {
    return buffer_size_;
}

uint32_t WASAPIDriver::getInputChannels() const {
    return input_channels_;
}

uint32_t WASAPIDriver::getOutputChannels() const {
    return output_channels_;
}

double WASAPIDriver::getInputLatency() const {
    return input_latency_;
}

double WASAPIDriver::getOutputLatency() const {
    return output_latency_;
}

std::vector<std::string> WASAPIDriver::getAvailableDevices() {
    // TODO: Implémenter l'énumération des devices
    return {"Default"};
}

bool WASAPIDriver::selectDevice(const std::string& deviceId) {
    // TODO: Implémenter la sélection de device
    return false;
}

} // namespace webamp

