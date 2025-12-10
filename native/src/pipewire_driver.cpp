#include "pipewire_driver.h"
#include <iostream>
#include <algorithm>
#include <cstring>
#include <thread>
#include <atomic>

#ifdef __linux__

namespace webamp {

PipeWireDriver::PipeWireDriver()
    : initialized_(false)
    , running_(false)
    , sample_rate_(48000)
    , buffer_size_(128)
    , input_channels_(2)
    , output_channels_(2)
    , jack_support_(false)
{
    std::memset(&audio_info_, 0, sizeof(audio_info_));
}

PipeWireDriver::~PipeWireDriver() {
    shutdown();
}

bool PipeWireDriver::initialize(uint32_t sampleRate, uint32_t bufferSize) {
    if (initialized_) {
        shutdown();
    }
    
    sample_rate_ = sampleRate;
    buffer_size_ = bufferSize;
    
    if (!initializePipeWire()) {
        cleanupPipeWire();
        return false;
    }
    
    if (!createStream()) {
        cleanupPipeWire();
        return false;
    }
    
    // Allouer les buffers de travail
    work_buffer_.resize(buffer_size_ * (input_channels_ + output_channels_));
    std::fill(work_buffer_.begin(), work_buffer_.end(), 0.0f);
    
    input_buffers_.resize(input_channels_);
    output_buffers_.resize(output_channels_);
    
    for (uint32_t i = 0; i < input_channels_; ++i) {
        input_buffers_[i] = work_buffer_.data() + i * buffer_size_;
    }
    for (uint32_t i = 0; i < output_channels_; ++i) {
        output_buffers_[i] = work_buffer_.data() + (input_channels_ + i) * buffer_size_;
    }
    
    initialized_ = true;
    return true;
}

void PipeWireDriver::shutdown() {
    stop();
    cleanupPipeWire();
    initialized_ = false;
}

bool PipeWireDriver::start() {
    if (!initialized_ || running_) {
        return false;
    }
    
    if (pw_stream_set_active(stream_, true) < 0) {
        std::cerr << "Erreur activation stream PipeWire\n";
        return false;
    }
    
    running_ = true;
    
    // Démarrer le thread audio si nécessaire
    if (thread_loop_) {
        pw_thread_loop_start(thread_loop_);
    }
    
    return true;
}

bool PipeWireDriver::stop() {
    if (!running_) {
        return true;
    }
    
    if (stream_) {
        pw_stream_set_active(stream_, false);
    }
    
    if (thread_loop_) {
        pw_thread_loop_stop(thread_loop_);
    }
    
    running_ = false;
    return true;
}

bool PipeWireDriver::initializePipeWire() {
    // Initialiser PipeWire
    pw_init(nullptr, nullptr);
    
    // Créer le contexte
    context_ = pw_context_new(nullptr, nullptr, 0);
    if (!context_) {
        std::cerr << "Erreur création contexte PipeWire\n";
        return false;
    }
    
    // Créer le core
    core_ = pw_context_connect(context_, nullptr, 0);
    if (!core_) {
        std::cerr << "Erreur connexion core PipeWire\n";
        return false;
    }
    
    // Créer le thread loop
    thread_loop_ = pw_thread_loop_new("webamp-audio", nullptr);
    if (!thread_loop_) {
        std::cerr << "Erreur création thread loop PipeWire\n";
        return false;
    }
    
    // Vérifier le support JACK
    // PipeWire peut émuler JACK si configuré
    const char* jackServer = getenv("JACK_SERVER");
    jack_support_ = (jackServer != nullptr);
    
    return true;
}

bool PipeWireDriver::createStream() {
    // Configurer le format audio
    setupAudioFormat();
    
    // Définir les propriétés du stream
    const struct spa_pod* params[1];
    uint8_t buffer[1024];
    struct spa_pod_builder b = SPA_POD_BUILDER_INIT(buffer, sizeof(buffer));
    
    struct spa_audio_info_raw info = audio_info_;
    params[0] = spa_format_audio_raw_build(&b, SPA_PARAM_EnumFormat, &info);
    
    // Créer le stream
    stream_ = pw_stream_new(core_, "webamp-audio", nullptr);
    if (!stream_) {
        std::cerr << "Erreur création stream PipeWire\n";
        return false;
    }
    
    // Configurer les callbacks
    static const struct pw_stream_events stream_events = {
        PW_VERSION_STREAM_EVENTS,
        .state_changed = onStateChanged,
        .process = onProcess,
    };
    
    pw_stream_add_listener(stream_, nullptr, &stream_events, this);
    
    // Connecter le stream
    uint32_t flags = PW_STREAM_FLAG_AUTOCONNECT | PW_STREAM_FLAG_MAP_BUFFERS;
    if (pw_stream_connect(stream_,
                         PW_DIRECTION_INPUT | PW_DIRECTION_OUTPUT,
                         PW_ID_ANY,
                         flags,
                         params,
                         1) < 0) {
        std::cerr << "Erreur connexion stream PipeWire\n";
        return false;
    }
    
    return true;
}

void PipeWireDriver::setupAudioFormat() {
    audio_info_.format = SPA_AUDIO_FORMAT_F32;
    audio_info_.flags = SPA_AUDIO_FLAG_NONE;
    audio_info_.rate = sample_rate_;
    audio_info_.channels = std::max(input_channels_, output_channels_);
    audio_info_.position[0] = SPA_AUDIO_CHANNEL_FL;
    audio_info_.position[1] = SPA_AUDIO_CHANNEL_FR;
    
    // Position des canaux supplémentaires si nécessaire
    for (uint32_t i = 2; i < audio_info_.channels; ++i) {
        audio_info_.position[i] = SPA_AUDIO_CHANNEL_UNKNOWN;
    }
}

void PipeWireDriver::updateLatency() {
    if (!stream_) {
        return;
    }
    
    // Obtenir la latence depuis PipeWire
    struct pw_time time;
    if (pw_stream_get_time(stream_, &time) == 0) {
        input_latency_seconds_ = static_cast<double>(time.delay) / SPA_USEC_PER_SEC;
        output_latency_seconds_ = static_cast<double>(time.delay) / SPA_USEC_PER_SEC;
    } else {
        // Estimation basée sur la taille du buffer
        input_latency_seconds_ = static_cast<double>(buffer_size_) / sample_rate_;
        output_latency_seconds_ = static_cast<double>(buffer_size_) / sample_rate_;
    }
}

void PipeWireDriver::cleanupPipeWire() {
    if (stream_) {
        pw_stream_destroy(stream_);
        stream_ = nullptr;
    }
    
    if (thread_loop_) {
        pw_thread_loop_destroy(thread_loop_);
        thread_loop_ = nullptr;
    }
    
    if (core_) {
        pw_core_disconnect(core_);
        core_ = nullptr;
    }
    
    if (context_) {
        pw_context_destroy(context_);
        context_ = nullptr;
    }
    
    pw_deinit();
}

void PipeWireDriver::onStateChanged(void* data, enum pw_stream_state old,
                                   enum pw_stream_state state,
                                   const char* error) {
    PipeWireDriver* driver = static_cast<PipeWireDriver*>(data);
    if (!driver) return;
    
    switch (state) {
        case PW_STREAM_STATE_ERROR:
            std::cerr << "Erreur stream PipeWire: " << (error ? error : "unknown") << "\n";
            break;
        case PW_STREAM_STATE_PAUSED:
            std::cout << "Stream PipeWire en pause\n";
            break;
        case PW_STREAM_STATE_STREAMING:
            std::cout << "Stream PipeWire actif\n";
            driver->updateLatency();
            break;
        default:
            break;
    }
}

void PipeWireDriver::onProcess(void* userData) {
    PipeWireDriver* driver = static_cast<PipeWireDriver*>(userData);
    if (driver && driver->running_) {
        struct pw_buffer* buffer = pw_stream_dequeue_buffer(driver->stream_);
        if (buffer) {
            struct spa_buffer* spaBuffer = buffer->buffer;
            uint32_t nFrames = spaBuffer->datas[0].maxsize / (sizeof(float) * driver->audio_info_.channels);
            driver->processAudio(nFrames);
            pw_stream_queue_buffer(driver->stream_, buffer);
        }
    }
}

void PipeWireDriver::processAudio(uint32_t nFrames) {
    if (!callback_ || !running_) {
        return;
    }
    
    // Lire depuis les buffers PipeWire
    struct pw_buffer* buffer = pw_stream_dequeue_buffer(stream_);
    if (!buffer) {
        return;
    }
    
    struct spa_buffer* spaBuffer = buffer->buffer;
    struct spa_data* data = &spaBuffer->datas[0];
    
    // Convertir depuis le format PipeWire vers float
    float* inputPtr = work_buffer_.data();
    float* outputPtr = work_buffer_.data() + input_channels_ * nFrames;
    
    if (data->data && input_channels_ > 0) {
        // Copier les données d'entrée
        float* src = static_cast<float*>(data->data);
        for (uint32_t ch = 0; ch < input_channels_; ++ch) {
            float* dst = inputPtr + ch * nFrames;
            for (uint32_t i = 0; i < nFrames; ++i) {
                dst[i] = src[i * audio_info_.channels + ch];
            }
        }
    }
    
    // Appeler le callback audio
    callback_(inputPtr, outputPtr, nFrames, sample_rate_);
    
    // Écrire dans les buffers PipeWire
    if (data->data && output_channels_ > 0) {
        float* dst = static_cast<float*>(data->data);
        for (uint32_t ch = 0; ch < output_channels_; ++ch) {
            float* src = outputPtr + ch * nFrames;
            for (uint32_t i = 0; i < nFrames; ++i) {
                dst[i * audio_info_.channels + ch] = src[i];
            }
        }
    }
    
    data->chunk->offset = 0;
    data->chunk->stride = sizeof(float) * audio_info_.channels;
    data->chunk->size = nFrames * data->chunk->stride;
    
    pw_stream_queue_buffer(stream_, buffer);
}

uint32_t PipeWireDriver::getSampleRate() const {
    return sample_rate_;
}

uint32_t PipeWireDriver::getBufferSize() const {
    return buffer_size_;
}

uint32_t PipeWireDriver::getInputChannels() const {
    return input_channels_;
}

uint32_t PipeWireDriver::getOutputChannels() const {
    return output_channels_;
}

double PipeWireDriver::getInputLatency() const {
    return input_latency_seconds_;
}

double PipeWireDriver::getOutputLatency() const {
    return output_latency_seconds_;
}

std::vector<std::string> PipeWireDriver::getAvailableDevices() {
    std::vector<std::string> devices;
    
    // Énumérer les devices PipeWire
    // Note: Cela nécessite l'utilisation de l'API PipeWire pour lister les nodes
    // Pour l'instant, on retourne une liste vide (peut être étendue)
    
    return devices;
}

bool PipeWireDriver::selectDevice(const std::string& deviceId) {
    selected_device_id_ = deviceId;
    // Réinitialiser avec le nouveau device
    if (initialized_) {
        stop();
        return initialize(sample_rate_, buffer_size_);
    }
    return true;
}

bool PipeWireDriver::supportsJACK() const {
    return jack_support_;
}

} // namespace webamp

#else
// Stub pour les plateformes non-Linux
namespace webamp {

PipeWireDriver::PipeWireDriver() {}
PipeWireDriver::~PipeWireDriver() {}
bool PipeWireDriver::initialize(uint32_t, uint32_t) { return false; }
void PipeWireDriver::shutdown() {}
bool PipeWireDriver::start() { return false; }
bool PipeWireDriver::stop() { return false; }
uint32_t PipeWireDriver::getSampleRate() const { return 0; }
uint32_t PipeWireDriver::getBufferSize() const { return 0; }
uint32_t PipeWireDriver::getInputChannels() const { return 0; }
uint32_t PipeWireDriver::getOutputChannels() const { return 0; }
double PipeWireDriver::getInputLatency() const { return 0.0; }
double PipeWireDriver::getOutputLatency() const { return 0.0; }
std::vector<std::string> PipeWireDriver::getAvailableDevices() { return {}; }
bool PipeWireDriver::selectDevice(const std::string&) { return false; }
bool PipeWireDriver::supportsJACK() const { return false; }

} // namespace webamp
#endif

