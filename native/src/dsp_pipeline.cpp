#include "dsp_pipeline.h"
#include "buffer_pool.h"
#include "../include/simd_helper.h"
#include <algorithm>
#include <cmath>
#include <chrono>
#include <iostream>
#include <memory>

namespace webamp {

DSPPipeline::DSPPipeline()
    : input_gain_(0.0f)
    , output_gain_(0.0f)
    , sample_rate_(48000)  // Support jusqu'à 192kHz
    , buffer_size_(64)      // Optimisé pour latence < 5ms
{
    stats_ = Stats{};
    // Initialiser le pool de buffers (taille pour stéréo)
    buffer_pool_ = std::make_unique<BufferPool>(buffer_size_ * 2, 4);
}

DSPPipeline::~DSPPipeline() {
    shutdown();
}

bool DSPPipeline::initialize(uint32_t sampleRate, uint32_t bufferSize) {
    sample_rate_ = sampleRate;
    buffer_size_ = bufferSize;
    
    // Allocation du buffer de travail (taille maximale)
    work_buffer_.resize(buffer_size_ * 2); // Stéréo
    
    // Réinitialiser le pool de buffers avec la nouvelle taille
    buffer_pool_ = std::make_unique<BufferPool>(buffer_size_ * 2, 4);
    
    // Initialisation du générateur de signal de test
    test_tone_generator_.setSampleRate(sampleRate);
    test_tone_generator_.setFrequency(440.0f);  // La4
    test_tone_generator_.setAmplitude(0.3f);    // 30%
    test_tone_generator_.setEnabled(false);
    
    // Initialisation de la chaîne d'effets si elle existe
    if (effect_chain_) {
        // Les effets seront initialisés individuellement
    }
    
    resetStats();
    return true;
}

void DSPPipeline::shutdown() {
    std::lock_guard<std::mutex> lock(chain_mutex_);
    effect_chain_.reset();
    work_buffer_.clear();
    buffer_pool_.reset();
}

void DSPPipeline::process(float* input, float* output, uint32_t frameCount) {
    if (frameCount == 0 || !input || !output) {
        return;
    }
    
    auto startTime = std::chrono::high_resolution_clock::now();
    
    // Générer un signal de test si activé, sinon utiliser l'entrée
    if (test_tone_generator_.isEnabled()) {
        // Générer le signal de test dans le buffer de travail
        test_tone_generator_.generate(work_buffer_.data(), frameCount, 2);
        
        // Application du gain d'entrée sur le signal généré
        float inputGainLinear = dbToLinear(input_gain_.load());
        for (uint32_t i = 0; i < frameCount * 2; ++i) {
            work_buffer_[i] *= inputGainLinear;
        }
    } else {
        // Application du gain d'entrée sur l'entrée réelle (optimisé avec SIMD si disponible)
        float inputGainLinear = dbToLinear(input_gain_.load());
        if (SIMDHelper::isAvailable()) {
            SIMDHelper::multiplyScalar(input, inputGainLinear, work_buffer_.data(), frameCount * 2);
        } else {
            for (uint32_t i = 0; i < frameCount * 2; ++i) { // Stéréo
                work_buffer_[i] = input[i] * inputGainLinear;
            }
        }
    }
    
    // Traitement par la chaîne d'effets
    {
        std::lock_guard<std::mutex> lock(chain_mutex_);
        if (effect_chain_) {
            effect_chain_->process(work_buffer_.data(), output, frameCount);
        } else {
            // Pas d'effets : copie directe
            std::copy(work_buffer_.begin(), work_buffer_.begin() + frameCount * 2, output);
        }
    }
    
    // Application du gain de sortie (optimisé avec SIMD si disponible)
    float outputGainLinear = dbToLinear(output_gain_.load());
    if (SIMDHelper::isAvailable()) {
        SIMDHelper::multiplyScalar(output, outputGainLinear, output, frameCount * 2);
    } else {
        for (uint32_t i = 0; i < frameCount * 2; ++i) {
            output[i] *= outputGainLinear;
        }
    }
    
    // Mise à jour des stats
    updateStats(input, output, frameCount);
    
    // Calcul CPU (optimisé avec moyenne glissante pour stabilité)
    auto endTime = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(endTime - startTime).count();
    double cpuTime = (duration / 1000.0) / (frameCount / (double)sample_rate_ * 1000.0);
    
    {
        std::lock_guard<std::mutex> lock(stats_mutex_);
        // Moyenne glissante pour lisser les variations (facteur 0.9)
        stats_.cpuUsage = stats_.cpuUsage * 0.9 + (cpuTime * 100.0) * 0.1;
        stats_.samplesProcessed += frameCount;
    }
}

void DSPPipeline::setEffectChain(std::shared_ptr<EffectChain> chain) {
    std::lock_guard<std::mutex> lock(chain_mutex_);
    effect_chain_ = chain;
}

std::shared_ptr<EffectChain> DSPPipeline::getEffectChain() const {
    std::lock_guard<std::mutex> lock(chain_mutex_);
    return effect_chain_;
}

DSPPipeline::Stats DSPPipeline::getStats() const {
    std::lock_guard<std::mutex> lock(stats_mutex_);
    return stats_;
}

void DSPPipeline::resetStats() {
    std::lock_guard<std::mutex> lock(stats_mutex_);
    stats_ = Stats{};
}

void DSPPipeline::setInputGain(float gain) {
    input_gain_.store(gain);
}

void DSPPipeline::setOutputGain(float gain) {
    output_gain_.store(gain);
}

float DSPPipeline::getInputGain() const {
    return input_gain_.load();
}

float DSPPipeline::getOutputGain() const {
    return output_gain_.load();
}

float DSPPipeline::dbToLinear(float db) const {
    return std::pow(10.0f, db / 20.0f);
}

float DSPPipeline::linearToDb(float linear) const {
    if (linear <= 0.0f) {
        return -96.0f; // Silence
    }
    return 20.0f * std::log10(linear);
}

void DSPPipeline::updateStats(const float* input, const float* output, uint32_t frameCount) {
    float peakIn = 0.0f;
    float peakOut = 0.0f;
    
    for (uint32_t i = 0; i < frameCount * 2; ++i) {
        peakIn = std::max(peakIn, std::abs(input[i]));
        peakOut = std::max(peakOut, std::abs(output[i]));
    }
    
    std::lock_guard<std::mutex> lock(stats_mutex_);
    stats_.peakInput = linearToDb(peakIn);
    stats_.peakOutput = linearToDb(peakOut);
    stats_.latency = (buffer_size_ / (double)sample_rate_) * 1000.0; // ms
}

void DSPPipeline::enableTestTone(bool enabled) {
    test_tone_generator_.setEnabled(enabled);
}

void DSPPipeline::setTestToneFrequency(float frequency) {
    test_tone_generator_.setFrequency(frequency);
}

void DSPPipeline::setTestToneAmplitude(float amplitude) {
    test_tone_generator_.setAmplitude(amplitude);
}

bool DSPPipeline::isTestToneEnabled() const {
    return test_tone_generator_.isEnabled();
}

} // namespace webamp

