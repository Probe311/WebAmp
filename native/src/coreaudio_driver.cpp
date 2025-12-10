#include "coreaudio_driver.h"
#include <iostream>
#include <algorithm>
#include <cstring>

#ifdef __APPLE__

namespace webamp {

CoreAudioDriver::CoreAudioDriver()
    : initialized_(false)
    , running_(false)
    , sample_rate_(48000)
    , buffer_size_(128)
    , input_channels_(2)
    , output_channels_(2)
    , use_aggregate_device_(false)
    , high_resolution_enabled_(false)
{
    std::memset(&input_format_, 0, sizeof(AudioStreamBasicDescription));
    std::memset(&output_format_, 0, sizeof(AudioStreamBasicDescription));
}

CoreAudioDriver::~CoreAudioDriver() {
    shutdown();
}

bool CoreAudioDriver::initialize(uint32_t sampleRate, uint32_t bufferSize) {
    if (initialized_) {
        shutdown();
    }
    
    sample_rate_ = sampleRate;
    buffer_size_ = bufferSize;
    
    if (!initializeCoreAudio()) {
        cleanupCoreAudio();
        return false;
    }
    
    // Allouer les buffers de travail
    work_buffer_.resize(buffer_size_ * (input_channels_ + output_channels_));
    std::fill(work_buffer_.begin(), work_buffer_.end(), 0.0f);
    
    initialized_ = true;
    return true;
}

void CoreAudioDriver::shutdown() {
    stop();
    cleanupCoreAudio();
    initialized_ = false;
}

bool CoreAudioDriver::start() {
    if (!initialized_ || running_) {
        return false;
    }
    
    OSStatus status = AudioOutputUnitStart(audio_unit_);
    if (status != noErr) {
        std::cerr << "Erreur AudioOutputUnitStart: " << status << "\n";
        return false;
    }
    
    running_ = true;
    return true;
}

bool CoreAudioDriver::stop() {
    if (!running_) {
        return true;
    }
    
    if (audio_unit_) {
        OSStatus status = AudioOutputUnitStop(audio_unit_);
        if (status != noErr) {
            std::cerr << "Erreur AudioOutputUnitStop: " << status << "\n";
        }
    }
    
    running_ = false;
    return true;
}

bool CoreAudioDriver::initializeCoreAudio() {
    // Décrire le composant audio
    AudioComponentDescription desc;
    desc.componentType = kAudioUnitType_Output;
    desc.componentSubType = kAudioUnitSubType_HALOutput;
    desc.componentManufacturer = kAudioUnitManufacturer_Apple;
    desc.componentFlags = 0;
    desc.componentFlagsMask = 0;
    
    // Trouver le composant
    audio_component_ = AudioComponentFindNext(nullptr, &desc);
    if (!audio_component_) {
        std::cerr << "Impossible de trouver le composant audio HAL\n";
        return false;
    }
    
    // Créer l'instance
    OSStatus status = AudioComponentInstanceNew(audio_component_, &audio_unit_);
    if (status != noErr) {
        std::cerr << "Erreur AudioComponentInstanceNew: " << status << "\n";
        return false;
    }
    
    // Configurer l'AudioUnit
    if (!setupAudioUnit()) {
        return false;
    }
    
    // Configurer les devices
    if (!setupInputDevice() || !setupOutputDevice()) {
        return false;
    }
    
    // Initialiser l'AudioUnit
    status = AudioUnitInitialize(audio_unit_);
    if (status != noErr) {
        std::cerr << "Erreur AudioUnitInitialize: " << status << "\n";
        return false;
    }
    
    updateLatency();
    return true;
}

bool CoreAudioDriver::setupAudioUnit() {
    // Activer l'entrée
    UInt32 enableInput = 1;
    OSStatus status = AudioUnitSetProperty(audio_unit_,
                                           kAudioOutputUnitProperty_EnableIO,
                                           kAudioUnitScope_Input,
                                           1, // Input element
                                           &enableInput,
                                           sizeof(enableInput));
    if (status != noErr) {
        std::cerr << "Erreur activation entrée: " << status << "\n";
        return false;
    }
    
    // Activer la sortie
    UInt32 enableOutput = 1;
    status = AudioUnitSetProperty(audio_unit_,
                                  kAudioOutputUnitProperty_EnableIO,
                                  kAudioUnitScope_Output,
                                  0, // Output element
                                  &enableOutput,
                                  sizeof(enableOutput));
    if (status != noErr) {
        std::cerr << "Erreur activation sortie: " << status << "\n";
        return false;
    }
    
    // Configurer le format de sortie
    output_format_.mSampleRate = static_cast<Float64>(sample_rate_);
    output_format_.mFormatID = kAudioFormatLinearPCM;
    output_format_.mFormatFlags = kAudioFormatFlagIsFloat | kAudioFormatFlagIsPacked | kAudioFormatFlagIsNonInterleaved;
    output_format_.mBytesPerPacket = sizeof(float);
    output_format_.mFramesPerPacket = 1;
    output_format_.mBytesPerFrame = sizeof(float);
    output_format_.mChannelsPerFrame = output_channels_;
    output_format_.mBitsPerChannel = 32;
    
    status = AudioUnitSetProperty(audio_unit_,
                                 kAudioUnitProperty_StreamFormat,
                                 kAudioUnitScope_Output,
                                 0,
                                 &output_format_,
                                 sizeof(output_format_));
    if (status != noErr) {
        std::cerr << "Erreur configuration format sortie: " << status << "\n";
        return false;
    }
    
    // Configurer le format d'entrée
    input_format_ = output_format_;
    input_format_.mChannelsPerFrame = input_channels_;
    
    status = AudioUnitSetProperty(audio_unit_,
                                 kAudioUnitProperty_StreamFormat,
                                 kAudioUnitScope_Input,
                                 1,
                                 &input_format_,
                                 sizeof(input_format_));
    if (status != noErr) {
        std::cerr << "Erreur configuration format entrée: " << status << "\n";
        return false;
    }
    
    // Configurer le callback
    AURenderCallbackStruct callbackStruct;
    callbackStruct.inputProc = audioCallback;
    callbackStruct.inputProcRefCon = this;
    
    status = AudioUnitSetProperty(audio_unit_,
                                 kAudioUnitProperty_SetRenderCallback,
                                 kAudioUnitScope_Input,
                                 0,
                                 &callbackStruct,
                                 sizeof(callbackStruct));
    if (status != noErr) {
        std::cerr << "Erreur configuration callback: " << status << "\n";
        return false;
    }
    
    // Configurer la taille de buffer
    UInt32 bufferSizeFrames = buffer_size_;
    status = AudioUnitSetProperty(audio_unit_,
                                 kAudioDevicePropertyBufferFrameSize,
                                 kAudioUnitScope_Global,
                                 0,
                                 &bufferSizeFrames,
                                 sizeof(bufferSizeFrames));
    if (status != noErr) {
        std::cerr << "Avertissement: Impossible de définir la taille de buffer, utilisation de la valeur par défaut\n";
    }
    
    return true;
}

bool CoreAudioDriver::setupInputDevice() {
    // Obtenir le device d'entrée par défaut
    AudioObjectPropertyAddress propAddr;
    propAddr.mSelector = kAudioHardwarePropertyDefaultInputDevice;
    propAddr.mScope = kAudioObjectPropertyScopeGlobal;
    propAddr.mElement = kAudioObjectPropertyElementMain;
    
    UInt32 dataSize = sizeof(AudioDeviceID);
    OSStatus status = AudioObjectGetPropertyData(kAudioObjectSystemObject,
                                                 &propAddr,
                                                 0,
                                                 nullptr,
                                                 &dataSize,
                                                 &input_device_id_);
    if (status != noErr) {
        std::cerr << "Erreur obtention device entrée: " << status << "\n";
        return false;
    }
    
    // Définir le device d'entrée
    status = AudioUnitSetProperty(audio_unit_,
                                 kAudioOutputUnitProperty_CurrentDevice,
                                 kAudioUnitScope_Global,
                                 1,
                                 &input_device_id_,
                                 sizeof(input_device_id_));
    if (status != noErr) {
        std::cerr << "Erreur définition device entrée: " << status << "\n";
        return false;
    }
    
    return true;
}

bool CoreAudioDriver::setupOutputDevice() {
    // Obtenir le device de sortie par défaut
    AudioObjectPropertyAddress propAddr;
    propAddr.mSelector = kAudioHardwarePropertyDefaultOutputDevice;
    propAddr.mScope = kAudioObjectPropertyScopeGlobal;
    propAddr.mElement = kAudioObjectPropertyElementMain;
    
    UInt32 dataSize = sizeof(AudioDeviceID);
    OSStatus status = AudioObjectGetPropertyData(kAudioObjectSystemObject,
                                                 &propAddr,
                                                 0,
                                                 nullptr,
                                                 &dataSize,
                                                 &output_device_id_);
    if (status != noErr) {
        std::cerr << "Erreur obtention device sortie: " << status << "\n";
        return false;
    }
    
    // Définir le device de sortie
    status = AudioUnitSetProperty(audio_unit_,
                                 kAudioOutputUnitProperty_CurrentDevice,
                                 kAudioUnitScope_Global,
                                 0,
                                 &output_device_id_,
                                 sizeof(output_device_id_));
    if (status != noErr) {
        std::cerr << "Erreur définition device sortie: " << status << "\n";
        return false;
    }
    
    return true;
}

void CoreAudioDriver::updateLatency() {
    // Obtenir la latence d'entrée
    AudioObjectPropertyAddress propAddr;
    propAddr.mSelector = kAudioDevicePropertyLatency;
    propAddr.mScope = kAudioDevicePropertyScopeInput;
    propAddr.mElement = kAudioObjectPropertyElementMain;
    
    UInt32 dataSize = sizeof(UInt32);
    UInt32 latencyFrames = 0;
    OSStatus status = AudioObjectGetPropertyData(input_device_id_,
                                                 &propAddr,
                                                 0,
                                                 nullptr,
                                                 &dataSize,
                                                 &latencyFrames);
    if (status == noErr) {
        input_latency_seconds_ = static_cast<Float64>(latencyFrames) / sample_rate_;
    }
    
    // Obtenir la latence de sortie
    propAddr.mScope = kAudioDevicePropertyScopeOutput;
    status = AudioObjectGetPropertyData(output_device_id_,
                                       &propAddr,
                                       0,
                                       nullptr,
                                       &dataSize,
                                       &latencyFrames);
    if (status == noErr) {
        output_latency_seconds_ = static_cast<Float64>(latencyFrames) / sample_rate_;
    }
}

void CoreAudioDriver::cleanupCoreAudio() {
    if (audio_unit_) {
        AudioUnitUninitialize(audio_unit_);
        AudioComponentInstanceDispose(audio_unit_);
        audio_unit_ = nullptr;
    }
    
    if (input_buffer_list_) {
        free(input_buffer_list_);
        input_buffer_list_ = nullptr;
    }
    
    audio_component_ = nullptr;
    input_device_id_ = kAudioObjectUnknown;
    output_device_id_ = kAudioObjectUnknown;
}

OSStatus CoreAudioDriver::audioCallback(void* inRefCon,
                                        AudioUnitRenderActionFlags* ioActionFlags,
                                        const AudioTimeStamp* inTimeStamp,
                                        UInt32 inBusNumber,
                                        UInt32 inNumberFrames,
                                        AudioBufferList* ioData) {
    CoreAudioDriver* driver = static_cast<CoreAudioDriver*>(inRefCon);
    if (driver) {
        return driver->processAudio(ioActionFlags, inTimeStamp, inBusNumber, inNumberFrames, ioData);
    }
    return noErr;
}

OSStatus CoreAudioDriver::processAudio(AudioUnitRenderActionFlags* ioActionFlags,
                                      const AudioTimeStamp* inTimeStamp,
                                      UInt32 inBusNumber,
                                      UInt32 inNumberFrames,
                                      AudioBufferList* ioData) {
    if (!callback_ || !running_) {
        // Remplir avec du silence
        for (UInt32 i = 0; i < ioData->mNumberBuffers; ++i) {
            std::memset(ioData->mBuffers[i].mData, 0, ioData->mBuffers[i].mDataByteSize);
        }
        return noErr;
    }
    
    // Lire l'entrée
    if (input_channels_ > 0) {
        if (!input_buffer_list_) {
            input_buffer_list_ = (AudioBufferList*)malloc(sizeof(AudioBufferList) + 
                                                         sizeof(AudioBuffer) * (input_channels_ - 1));
            input_buffer_list_->mNumberBuffers = input_channels_;
            for (UInt32 i = 0; i < input_channels_; ++i) {
                input_buffer_list_->mBuffers[i].mNumberChannels = 1;
                input_buffer_list_->mBuffers[i].mDataByteSize = inNumberFrames * sizeof(float);
                input_buffer_list_->mBuffers[i].mData = work_buffer_.data() + i * inNumberFrames;
            }
        }
        
        OSStatus status = AudioUnitRender(audio_unit_,
                                         ioActionFlags,
                                         inTimeStamp,
                                         1, // Input bus
                                         inNumberFrames,
                                         input_buffer_list_);
        if (status != noErr) {
            std::cerr << "Erreur AudioUnitRender: " << status << "\n";
        }
    }
    
    // Préparer les buffers de sortie
    float* inputPtr = work_buffer_.data();
    float* outputPtr = work_buffer_.data() + input_channels_ * inNumberFrames;
    
    // Appeler le callback audio
    callback_(inputPtr, outputPtr, inNumberFrames, sample_rate_);
    
    // Copier vers les buffers de sortie
    for (UInt32 i = 0; i < ioData->mNumberBuffers && i < output_channels_; ++i) {
        float* src = outputPtr + i * inNumberFrames;
        float* dst = static_cast<float*>(ioData->mBuffers[i].mData);
        std::copy(src, src + inNumberFrames, dst);
    }
    
    return noErr;
}

uint32_t CoreAudioDriver::getSampleRate() const {
    return sample_rate_;
}

uint32_t CoreAudioDriver::getBufferSize() const {
    return buffer_size_;
}

uint32_t CoreAudioDriver::getInputChannels() const {
    return input_channels_;
}

uint32_t CoreAudioDriver::getOutputChannels() const {
    return output_channels_;
}

double CoreAudioDriver::getInputLatency() const {
    return input_latency_seconds_;
}

double CoreAudioDriver::getOutputLatency() const {
    return output_latency_seconds_;
}

std::vector<std::string> CoreAudioDriver::getAvailableDevices() {
    std::vector<std::string> devices;
    
#ifdef __APPLE__
    AudioObjectPropertyAddress propAddr;
    propAddr.mSelector = kAudioHardwarePropertyDevices;
    propAddr.mScope = kAudioObjectPropertyScopeGlobal;
    propAddr.mElement = kAudioObjectPropertyElementMain;
    
    UInt32 dataSize = 0;
    OSStatus status = AudioObjectGetPropertyDataSize(kAudioObjectSystemObject,
                                                     &propAddr,
                                                     0,
                                                     nullptr,
                                                     &dataSize);
    if (status != noErr) {
        return devices;
    }
    
    UInt32 deviceCount = dataSize / sizeof(AudioDeviceID);
    std::vector<AudioDeviceID> deviceIDs(deviceCount);
    
    status = AudioObjectGetPropertyData(kAudioObjectSystemObject,
                                       &propAddr,
                                       0,
                                       nullptr,
                                       &dataSize,
                                       deviceIDs.data());
    if (status != noErr) {
        return devices;
    }
    
    for (UInt32 i = 0; i < deviceCount; ++i) {
        // Obtenir le nom du device
        CFStringRef deviceName = nullptr;
        propAddr.mSelector = kAudioDevicePropertyDeviceNameCFString;
        dataSize = sizeof(CFStringRef);
        status = AudioObjectGetPropertyData(deviceIDs[i],
                                           &propAddr,
                                           0,
                                           nullptr,
                                           &dataSize,
                                           &deviceName);
        if (status == noErr && deviceName) {
            char name[256];
            CFStringGetCString(deviceName, name, sizeof(name), kCFStringEncodingUTF8);
            devices.push_back(std::string(name));
            CFRelease(deviceName);
        }
    }
#endif
    
    return devices;
}

bool CoreAudioDriver::selectDevice(const std::string& deviceId) {
    selected_device_id_ = deviceId;
    // Réinitialiser avec le nouveau device
    if (initialized_) {
        stop();
        return initialize(sample_rate_, buffer_size_);
    }
    return true;
}

bool CoreAudioDriver::createAggregateDevice(const std::vector<std::string>& deviceIds) {
    // Créer un Aggregate Device CoreAudio
    // Note: Cette fonctionnalité nécessite des permissions spéciales sur macOS
    use_aggregate_device_ = true;
    // Implémentation complète nécessiterait l'utilisation de AudioHardware APIs
    return false; // Placeholder
}

bool CoreAudioDriver::supportsHighResolution() const {
    return high_resolution_enabled_;
}

} // namespace webamp

#else
// Stub pour les plateformes non-Apple
namespace webamp {

CoreAudioDriver::CoreAudioDriver() {}
CoreAudioDriver::~CoreAudioDriver() {}
bool CoreAudioDriver::initialize(uint32_t, uint32_t) { return false; }
void CoreAudioDriver::shutdown() {}
bool CoreAudioDriver::start() { return false; }
bool CoreAudioDriver::stop() { return false; }
uint32_t CoreAudioDriver::getSampleRate() const { return 0; }
uint32_t CoreAudioDriver::getBufferSize() const { return 0; }
uint32_t CoreAudioDriver::getInputChannels() const { return 0; }
uint32_t CoreAudioDriver::getOutputChannels() const { return 0; }
double CoreAudioDriver::getInputLatency() const { return 0.0; }
double CoreAudioDriver::getOutputLatency() const { return 0.0; }
std::vector<std::string> CoreAudioDriver::getAvailableDevices() { return {}; }
bool CoreAudioDriver::selectDevice(const std::string&) { return false; }
bool CoreAudioDriver::createAggregateDevice(const std::vector<std::string>&) { return false; }
bool CoreAudioDriver::supportsHighResolution() const { return false; }

} // namespace webamp
#endif

