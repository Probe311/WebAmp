#include "asio_driver.h"
#include <iostream>
#include <vector>
#include <cstring>
#include <algorithm>
#include <thread>
#include <atomic>

// Note: ASIO SDK doit être dans native/third_party/asio/
// Structure attendue:
//   native/third_party/asio/
//     - asio.h
//     - asiodrvr.h
//     - asiosys.h
//     - asio.cpp (implémentation)
#ifdef HAS_ASIO_SDK
#include "asio.h"
#include "asiodrvr.h"
#endif

namespace webamp {

ASIODriver::ASIODriver()
    : initialized_(false)
    , running_(false)
    , sample_rate_(48000)
    , buffer_size_(128)
    , input_channels_(2)
    , output_channels_(2)
    , selected_driver_index_(-1)
#ifdef HAS_ASIO_SDK
    , asio_driver_(nullptr)
    , asio_callbacks_{}
    , asio_buffer_infos_(nullptr)
    , asio_channel_infos_(nullptr)
    , num_input_channels_(0)
    , num_output_channels_(0)
    , buffer_size_samples_(0)
    , preferred_buffer_size_(128)
    , preferred_sample_rate_(48000)
#endif
{
}

ASIODriver::~ASIODriver() {
    shutdown();
}

bool ASIODriver::initialize(uint32_t sampleRate, uint32_t bufferSize) {
    if (initialized_) {
        shutdown();
    }
    
    sample_rate_ = sampleRate;
    buffer_size_ = bufferSize;
    preferred_sample_rate_ = sampleRate;
    preferred_buffer_size_ = bufferSize;
    
#ifdef HAS_ASIO_SDK
    // Énumérer les drivers disponibles
    if (available_drivers_.empty()) {
        enumerateDrivers();
    }
    
    if (available_drivers_.empty()) {
        std::cerr << "Aucun driver ASIO disponible\n";
        return false;
    }
    
    // Sélectionner le premier driver par défaut si aucun n'est sélectionné
    if (selected_driver_index_ < 0) {
        selected_driver_index_ = 0;
    }
    
    // Charger le driver ASIO
    if (!loadDriver(available_drivers_[selected_driver_index_])) {
        std::cerr << "Impossible de charger le driver ASIO\n";
        return false;
    }
    
    // Initialiser ASIO
    ASIOError result = ASIOInit(&asio_driver_info_);
    if (result != ASE_OK) {
        std::cerr << "Erreur ASIOInit: " << result << "\n";
        return false;
    }
    
    // Obtenir les informations du driver
    if (ASIOGetChannels(&num_input_channels_, &num_output_channels_) != ASE_OK) {
        std::cerr << "Erreur ASIOGetChannels\n";
        ASIOExit();
        return false;
    }
    
    // Limiter aux canaux stéréo pour l'instant
    input_channels_ = std::min(num_input_channels_, 2u);
    output_channels_ = std::min(num_output_channels_, 2u);
    
    // Obtenir les tailles de buffer supportées
    long minSize, maxSize, preferredSize, granularity;
    if (ASIOGetBufferSize(&minSize, &maxSize, &preferredSize, &granularity) != ASE_OK) {
        std::cerr << "Erreur ASIOGetBufferSize\n";
        ASIOExit();
        return false;
    }
    
    // Utiliser la taille préférée ou la plus proche
    buffer_size_samples_ = preferredSize;
    if (buffer_size_samples_ < minSize) buffer_size_samples_ = minSize;
    if (buffer_size_samples_ > maxSize) buffer_size_samples_ = maxSize;
    
    // Vérifier le sample rate
    double currentRate;
    if (ASIOGetSampleRate(&currentRate) != ASE_OK) {
        std::cerr << "Erreur ASIOGetSampleRate\n";
        ASIOExit();
        return false;
    }
    
    if (std::abs(currentRate - preferred_sample_rate_) > 0.1) {
        if (ASIOSetSampleRate(preferred_sample_rate_) != ASE_OK) {
            std::cerr << "Impossible de définir le sample rate à " << preferred_sample_rate_ << "\n";
            ASIOExit();
            return false;
        }
    }
    
    // Créer les buffers
    if (!createBuffers()) {
        ASIOExit();
        return false;
    }
    
    // Configurer les callbacks
    setupCallbacks();
    
    // Allouer les buffers de travail
    work_buffer_.resize(buffer_size_samples_ * (input_channels_ + output_channels_));
    std::fill(work_buffer_.begin(), work_buffer_.end(), 0.0f);
    
    initialized_ = true;
    return true;
#else
    std::cerr << "ASIO driver nécessite ASIO SDK (définir HAS_ASIO_SDK et inclure asio.h)\n";
    return false;
#endif
}

void ASIODriver::shutdown() {
    stop();
    
#ifdef HAS_ASIO_SDK
    if (initialized_) {
        // Désallouer les buffers
        if (asio_buffer_infos_) {
            ASIODisposeBuffers();
            delete[] asio_buffer_infos_;
            asio_buffer_infos_ = nullptr;
        }
        
        if (asio_channel_infos_) {
            delete[] asio_channel_infos_;
            asio_channel_infos_ = nullptr;
        }
        
        // Fermer ASIO
        if (asio_driver_) {
            ASIOExit();
            asio_driver_ = nullptr;
        }
    }
#endif
    
    initialized_ = false;
}

bool ASIODriver::start() {
    if (!initialized_ || running_) {
        return false;
    }
    
#ifdef HAS_ASIO_SDK
    ASIOError result = ASIOStart();
    if (result != ASE_OK) {
        std::cerr << "Erreur ASIOStart: " << result << "\n";
        return false;
    }
    
    running_ = true;
    return true;
#else
    return false;
#endif
}

bool ASIODriver::stop() {
    if (!running_) {
        return true;
    }
    
#ifdef HAS_ASIO_SDK
    ASIOError result = ASIOStop();
    if (result != ASE_OK) {
        std::cerr << "Erreur ASIOStop: " << result << "\n";
    }
#endif
    
    running_ = false;
    return true;
}

#ifdef HAS_ASIO_SDK
void ASIODriver::enumerateDrivers() {
    available_drivers_.clear();
    
    // ASIO SDK fournit généralement une fonction pour énumérer les drivers
    // Note: L'implémentation exacte dépend de la version du SDK
    char driverNames[256][32];
    long numDrivers = 0;
    
    // Tentative d'énumération (méthode dépend de l'implémentation du SDK)
    // Pour l'instant, on suppose que les drivers sont dans le registre Windows
    // ou dans un fichier de configuration
    
    // Exemple de structure attendue (peut varier selon le SDK):
    // if (ASIOGetDriverNames(driverNames, &numDrivers) == ASE_OK) {
    //     for (long i = 0; i < numDrivers; ++i) {
    //         available_drivers_.push_back(std::string(driverNames[i]));
    //     }
    // }
    
    // Fallback: essayer de charger les drivers connus
    const char* commonDrivers[] = {
        "ASIO4ALL",
        "ASIO DirectX Full Duplex Driver",
        "Focusrite USB ASIO",
        "Steinberg ASIO",
        nullptr
    };
    
    for (int i = 0; commonDrivers[i] != nullptr; ++i) {
        // Tester si le driver peut être chargé
        if (testDriver(commonDrivers[i])) {
            available_drivers_.push_back(commonDrivers[i]);
        }
    }
}

bool ASIODriver::testDriver(const std::string& driverName) {
    // Tester si un driver peut être chargé (sans l'initialiser complètement)
    // Cette fonction dépend de l'implémentation du SDK ASIO
    return true; // Placeholder
}

bool ASIODriver::loadDriver(const std::string& driverName) {
    // Charger un driver ASIO spécifique
    // Note: L'implémentation exacte dépend de la version du SDK ASIO
    // Généralement, cela implique de charger une DLL ou un fichier de configuration
    
    // Exemple de structure (peut varier):
    // ASIOError result = loadAsioDriver(driverName.c_str());
    // return (result == ASE_OK);
    
    return true; // Placeholder - nécessite l'implémentation du SDK
}

bool ASIODriver::createBuffers() {
    // Allouer les structures de buffers
    long totalChannels = input_channels_ + output_channels_;
    asio_buffer_infos_ = new ASIOBufferInfo[totalChannels];
    asio_channel_infos_ = new ASIOChannelInfo[totalChannels];
    
    // Configurer les buffers d'entrée
    for (long i = 0; i < input_channels_; ++i) {
        asio_buffer_infos_[i].isInput = ASIOTrue;
        asio_buffer_infos_[i].channelNum = i;
        asio_buffer_infos_[i].buffers[0] = nullptr;
        asio_buffer_infos_[i].buffers[1] = nullptr;
    }
    
    // Configurer les buffers de sortie
    for (long i = 0; i < output_channels_; ++i) {
        long idx = input_channels_ + i;
        asio_buffer_infos_[idx].isInput = ASIOFalse;
        asio_buffer_infos_[idx].channelNum = i;
        asio_buffer_infos_[idx].buffers[0] = nullptr;
        asio_buffer_infos_[idx].buffers[1] = nullptr;
    }
    
    // Créer les buffers
    ASIOError result = ASIOCreateBuffers(asio_buffer_infos_, totalChannels, buffer_size_samples_, &asio_callbacks_);
    if (result != ASE_OK) {
        std::cerr << "Erreur ASIOCreateBuffers: " << result << "\n";
        return false;
    }
    
    // Obtenir les informations des canaux
    for (long i = 0; i < totalChannels; ++i) {
        asio_channel_infos_[i].channel = asio_buffer_infos_[i].channelNum;
        asio_channel_infos_[i].isInput = asio_buffer_infos_[i].isInput;
        if (ASIOGetChannelInfo(&asio_channel_infos_[i]) != ASE_OK) {
            std::cerr << "Erreur ASIOGetChannelInfo pour canal " << i << "\n";
            return false;
        }
    }
    
    return true;
}

void ASIODriver::setupCallbacks() {
    // Configurer les callbacks ASIO
    asio_callbacks_.bufferSwitch = &bufferSwitchCallback;
    asio_callbacks_.sampleRateDidChange = &sampleRateChangedCallback;
    asio_callbacks_.asioMessage = &asioMessageCallback;
    asio_callbacks_.bufferSwitchTimeInfo = &bufferSwitchTimeInfoCallback;
    
    // Passer le pointeur vers cette instance
    asio_callbacks_.userData = this;
}

    // Callbacks ASIO statiques
ASIOTime* ASIODriver::bufferSwitchTimeInfoCallback(ASIOTime* timeInfo, long index, ASIOBool processNow) {
    // Cette fonction est appelée par ASIO avec des informations de timing précises
    ASIODriver* driver = static_cast<ASIODriver*>(timeInfo->userData);
    if (driver && driver->running_) {
        driver->processAudio(timeInfo, index, processNow);
    }
    return nullptr;
}

void ASIODriver::bufferSwitchCallback(long doubleBufferIndex, ASIOBool directProcess) {
    // Callback simple (utilisé si bufferSwitchTimeInfo est nullptr)
    // Cette implémentation est moins précise mais plus simple
    // Note: Cette fonction n'est pas utilisée si bufferSwitchTimeInfoCallback est défini
}

ASIOSampleRate ASIODriver::sampleRateChangedCallback(ASIOSampleRate sRate) {
    // Appelé quand le sample rate change
    ASIODriver* driver = static_cast<ASIODriver*>(asio_callbacks_.userData);
    if (driver) {
        driver->sample_rate_ = static_cast<uint32_t>(sRate);
        std::cout << "Sample rate changé à " << sRate << " Hz\n";
    }
    return 0; // 0 = accepté
}

long ASIODriver::asioMessageCallback(long selector, long value, void* message, double* opt) {
    // Gérer les messages ASIO
    ASIODriver* driver = nullptr;
    if (asio_callbacks_.userData) {
        driver = static_cast<ASIODriver*>(asio_callbacks_.userData);
    }
    if (!driver) return 0;
    
    switch (selector) {
        case kAsioSelectorSupported:
            // Vérifier si un sélecteur est supporté
            return 1;
            
        case kAsioEngineVersion:
            // Retourner la version du moteur ASIO
            return 2; // ASIO 2.0
            
        case kAsioResetRequest:
            // Demande de réinitialisation
            driver->stop();
            driver->start();
            return 1;
            
        case kAsioBufferSizeChange:
            // Taille de buffer changée
            driver->buffer_size_samples_ = value;
            return 1;
            
        case kAsioResyncRequest:
            // Demande de resynchronisation
            return 1;
            
        case kAsioLatenciesChanged:
            // Latences changées
            return 1;
            
        default:
            return 0;
    }
}

void ASIODriver::processAudio(ASIOTime* timeInfo, long index, ASIOBool processNow) {
    if (!callback_ || !running_ || !asio_buffer_infos_) {
        return;
    }
    
    // Déterminer quel buffer utiliser (double buffering)
    long bufferIndex = (index == 0) ? 0 : 1;
    
    // Lire depuis les buffers d'entrée et convertir en float
    float* inputPtr = work_buffer_.data();
    for (long i = 0; i < input_channels_; ++i) {
        void* asioBuffer = asio_buffer_infos_[i].buffers[bufferIndex];
        if (asioBuffer) {
            convertFromASIOFormat(asioBuffer, inputPtr + i * buffer_size_samples_, 
                                buffer_size_samples_, asio_channel_infos_[i].type);
        }
    }
    
    // Préparer le buffer de sortie
    float* outputPtr = work_buffer_.data() + input_channels_ * buffer_size_samples_;
    
    // Appeler le callback audio
    callback_(inputPtr, outputPtr, buffer_size_samples_, sample_rate_);
    
    // Écrire dans les buffers de sortie et convertir depuis float
    for (long i = 0; i < output_channels_; ++i) {
        long idx = input_channels_ + i;
        void* asioBuffer = asio_buffer_infos_[idx].buffers[bufferIndex];
        if (asioBuffer) {
            convertToASIOFormat(outputPtr + i * buffer_size_samples_, asioBuffer,
                              buffer_size_samples_, asio_channel_infos_[idx].type);
        }
    }
}

void ASIODriver::convertFromASIOFormat(void* asioBuffer, float* floatBuffer, long samples, ASIOSampleType type) {
    switch (type) {
        case ASIOSTInt16LSB:
            {
                int16_t* src = static_cast<int16_t*>(asioBuffer);
                for (long i = 0; i < samples; ++i) {
                    floatBuffer[i] = src[i] / 32768.0f;
                }
            }
            break;
            
        case ASIOSTInt24LSB:
            {
                int8_t* src = static_cast<int8_t*>(asioBuffer);
                for (long i = 0; i < samples; ++i) {
                    int32_t sample = (src[i * 3] | (src[i * 3 + 1] << 8) | (src[i * 3 + 2] << 16));
                    if (sample & 0x800000) sample |= 0xFF000000; // Sign extension
                    floatBuffer[i] = sample / 8388608.0f;
                }
            }
            break;
            
        case ASIOSTInt32LSB:
            {
                int32_t* src = static_cast<int32_t*>(asioBuffer);
                for (long i = 0; i < samples; ++i) {
                    floatBuffer[i] = src[i] / 2147483648.0f;
                }
            }
            break;
            
        case ASIOSTFloat32LSB:
            {
                float* src = static_cast<float*>(asioBuffer);
                std::copy(src, src + samples, floatBuffer);
            }
            break;
            
        case ASIOSTFloat64LSB:
            {
                double* src = static_cast<double*>(asioBuffer);
                for (long i = 0; i < samples; ++i) {
                    floatBuffer[i] = static_cast<float>(src[i]);
                }
            }
            break;
            
        default:
            std::fill(floatBuffer, floatBuffer + samples, 0.0f);
            break;
    }
}

void ASIODriver::convertToASIOFormat(float* floatBuffer, void* asioBuffer, long samples, ASIOSampleType type) {
    switch (type) {
        case ASIOSTInt16LSB:
            {
                int16_t* dst = static_cast<int16_t*>(asioBuffer);
                for (long i = 0; i < samples; ++i) {
                    float sample = std::max(-1.0f, std::min(1.0f, floatBuffer[i]));
                    dst[i] = static_cast<int16_t>(sample * 32767.0f);
                }
            }
            break;
            
        case ASIOSTInt24LSB:
            {
                int8_t* dst = static_cast<int8_t*>(asioBuffer);
                for (long i = 0; i < samples; ++i) {
                    float sample = std::max(-1.0f, std::min(1.0f, floatBuffer[i]));
                    int32_t intSample = static_cast<int32_t>(sample * 8388607.0f);
                    dst[i * 3] = intSample & 0xFF;
                    dst[i * 3 + 1] = (intSample >> 8) & 0xFF;
                    dst[i * 3 + 2] = (intSample >> 16) & 0xFF;
                }
            }
            break;
            
        case ASIOSTInt32LSB:
            {
                int32_t* dst = static_cast<int32_t*>(asioBuffer);
                for (long i = 0; i < samples; ++i) {
                    float sample = std::max(-1.0f, std::min(1.0f, floatBuffer[i]));
                    dst[i] = static_cast<int32_t>(sample * 2147483647.0f);
                }
            }
            break;
            
        case ASIOSTFloat32LSB:
            {
                float* dst = static_cast<float*>(asioBuffer);
                for (long i = 0; i < samples; ++i) {
                    dst[i] = std::max(-1.0f, std::min(1.0f, floatBuffer[i]));
                }
            }
            break;
            
        case ASIOSTFloat64LSB:
            {
                double* dst = static_cast<double*>(asioBuffer);
                for (long i = 0; i < samples; ++i) {
                    dst[i] = std::max(-1.0, std::min(1.0, static_cast<double>(floatBuffer[i])));
                }
            }
            break;
            
        default:
            std::memset(asioBuffer, 0, samples * 4); // Fallback: zéro
            break;
    }
}
#endif

uint32_t ASIODriver::getSampleRate() const {
    return sample_rate_;
}

uint32_t ASIODriver::getBufferSize() const {
    return buffer_size_samples_;
}

uint32_t ASIODriver::getInputChannels() const {
    return input_channels_;
}

uint32_t ASIODriver::getOutputChannels() const {
    return output_channels_;
}

double ASIODriver::getInputLatency() const {
    if (sample_rate_ > 0) {
        return static_cast<double>(buffer_size_samples_) / sample_rate_;
    }
    return 0.0;
}

double ASIODriver::getOutputLatency() const {
    if (sample_rate_ > 0) {
        return static_cast<double>(buffer_size_samples_) / sample_rate_;
    }
    return 0.0;
}

std::vector<std::string> ASIODriver::getAvailableDrivers() {
    std::vector<std::string> drivers;
    
#ifdef HAS_ASIO_SDK
    ASIODriver instance;
    instance.enumerateDrivers();
    drivers = instance.available_drivers_;
#endif
    
    return drivers;
}

bool ASIODriver::selectDriver(const std::string& driverName) {
#ifdef HAS_ASIO_SDK
    enumerateDrivers();
    for (size_t i = 0; i < available_drivers_.size(); ++i) {
        if (available_drivers_[i] == driverName) {
            selected_driver_index_ = static_cast<long>(i);
            return true;
        }
    }
#endif
    return false;
}

bool ASIODriver::handleDeviceChange() {
    // Gérer les changements de périphérique à chaud
    if (running_) {
        stop();
    }
    
    // Réinitialiser avec les nouveaux paramètres
    return initialize(preferred_sample_rate_, preferred_buffer_size_);
}

} // namespace webamp
