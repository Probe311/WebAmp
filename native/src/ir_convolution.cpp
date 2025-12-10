#include "../include/ir_convolution.h"
#include "../include/fft_helper.h"
#include "../include/simd_helper.h"
#include <algorithm>
#include <cmath>

namespace webamp {

IRConvolution::IRConvolution()
    : mix_(100.0f)
{
    buffer_pos_[0] = 0;
    buffer_pos_[1] = 0;
    input_buffer_[0].resize(4096);
    input_buffer_[1].resize(4096);
    output_buffer_[0].resize(4096);
    output_buffer_[1].resize(4096);
    std::fill(input_buffer_[0].begin(), input_buffer_[0].end(), 0.0f);
    std::fill(input_buffer_[1].begin(), input_buffer_[1].end(), 0.0f);
    std::fill(output_buffer_[0].begin(), output_buffer_[0].end(), 0.0f);
    std::fill(output_buffer_[1].begin(), output_buffer_[1].end(), 0.0f);
}

IRConvolution::~IRConvolution() {
}

void IRConvolution::setSampleRate(uint32_t sampleRate) {
    EffectBase::setSampleRate(sampleRate);
    // Réinitialiser les buffers si nécessaire
}

bool IRConvolution::loadIR(const std::string& filePath) {
    auto loader = std::make_shared<IRLoader>();
    if (loader->loadIR(filePath)) {
        ir_loader_ = loader;
        return true;
    }
    return false;
}

bool IRConvolution::loadIR(std::shared_ptr<IRLoader> irLoader) {
    if (irLoader && irLoader->isLoaded()) {
        ir_loader_ = irLoader;
        return true;
    }
    return false;
}

void IRConvolution::process(float* input, float* output, uint32_t frameCount) {
    if (bypass_ || !ir_loader_ || !ir_loader_->isLoaded()) {
        std::copy(input, input + frameCount * 2, output);
        return;
    }
    
    float mixLinear = mix_ / 100.0f;
    float dryMix = 1.0f - mixLinear;
    
    const auto& irSamples = ir_loader_->getIRSamples();
    if (irSamples.empty()) {
        std::copy(input, input + frameCount * 2, output);
        return;
    }
    
    // Convolution optimisée : utiliser FFT pour les IR longs, directe pour les courts
    // Seuil réduit pour utiliser FFT plus souvent (meilleure performance)
    const size_t fftThreshold = 128; // Utiliser FFT si IR > 128 samples
    
    if (irSamples.size() > fftThreshold) {
        // Convolution FFT (overlap-add)
        for (uint32_t i = 0; i < frameCount; ++i) {
            for (int ch = 0; ch < 2; ++ch) {
                int idx = i * 2 + ch;
                float sample = input[idx];
                
                // Ajouter au buffer d'entrée
                input_buffer_[ch][buffer_pos_[ch]] = sample;
                buffer_pos_[ch] = (buffer_pos_[ch] + 1) % input_buffer_[ch].size();
            }
        }
        
        // Traiter par blocs avec FFT
        processConvolutionFFT(0, frameCount, dryMix, mixLinear);
        processConvolutionFFT(1, frameCount, dryMix, mixLinear);
        
        // Copier les résultats
        for (uint32_t i = 0; i < frameCount; ++i) {
            for (int ch = 0; ch < 2; ++ch) {
                int idx = i * 2 + ch;
                size_t readPos = (buffer_pos_[ch] + output_buffer_[ch].size() - frameCount + i) % output_buffer_[ch].size();
                float convolved = output_buffer_[ch][readPos];
                output[idx] = input[idx] * dryMix + convolved * mixLinear;
            }
        }
    } else {
        // Convolution directe pour IR courts (plus rapide)
        for (uint32_t i = 0; i < frameCount; ++i) {
            for (int ch = 0; ch < 2; ++ch) {
                int idx = i * 2 + ch;
                float sample = input[idx];
                
                // Ajouter au buffer d'entrée
                input_buffer_[ch][buffer_pos_[ch]] = sample;
                
                // Convolution directe
                float convolved = 0.0f;
                size_t irLen = irSamples.size();
                for (size_t j = 0; j < irLen; ++j) {
                    size_t readPos = (buffer_pos_[ch] + input_buffer_[ch].size() - j) % input_buffer_[ch].size();
                    convolved += input_buffer_[ch][readPos] * irSamples[j];
                }
                
                // Mix dry/wet (peut être optimisé avec SIMD si plusieurs samples)
                output[idx] = sample * dryMix + convolved * mixLinear;
                
                // Avancer le buffer
                buffer_pos_[ch] = (buffer_pos_[ch] + 1) % input_buffer_[ch].size();
            }
        }
    }
}

void IRConvolution::processConvolutionFFT(int channel, uint32_t frameCount, float dryMix, float mixLinear) {
    const auto& irSamples = ir_loader_->getIRSamples();
    if (irSamples.empty()) {
        return;
    }
    
    // Extraire un bloc du buffer d'entrée
    size_t blockSize = std::min(static_cast<size_t>(512), input_buffer_[channel].size());
    std::vector<float> inputBlock(blockSize);
    
    size_t startPos = (buffer_pos_[channel] + input_buffer_[channel].size() - blockSize) % input_buffer_[channel].size();
    for (size_t i = 0; i < blockSize; ++i) {
        size_t pos = (startPos + i) % input_buffer_[channel].size();
        inputBlock[i] = input_buffer_[channel][pos];
    }
    
    // Convolution FFT
    std::vector<float> convolved;
    FFTHelper::convolveFFT(inputBlock, irSamples, convolved);
    
    // Ajouter au buffer de sortie avec overlap
    size_t outputStart = (buffer_pos_[channel] + output_buffer_[channel].size() - blockSize) % output_buffer_[channel].size();
    for (size_t i = 0; i < convolved.size() && i < output_buffer_[channel].size(); ++i) {
        size_t pos = (outputStart + i) % output_buffer_[channel].size();
        output_buffer_[channel][pos] += convolved[i] * mixLinear;
    }
}

void IRConvolution::processDirectConvolution(int channel, uint32_t frameCount, float dryMix, float mixLinear) {
    const auto& irSamples = ir_loader_->getIRSamples();
    if (irSamples.empty()) {
        return;
    }
    
    // Convolution directe simple
    for (uint32_t i = 0; i < frameCount; ++i) {
        float sample = input_buffer_[channel][(buffer_pos_[channel] + input_buffer_[channel].size() - frameCount + i) % input_buffer_[channel].size()];
        
        float convolved = 0.0f;
        size_t irLen = irSamples.size();
        for (size_t j = 0; j < irLen; ++j) {
            size_t readPos = (buffer_pos_[channel] + input_buffer_[channel].size() - frameCount + i - j) % input_buffer_[channel].size();
            convolved += input_buffer_[channel][readPos] * irSamples[j];
        }
        
        size_t outputPos = (buffer_pos_[channel] + output_buffer_[channel].size() - frameCount + i) % output_buffer_[channel].size();
        output_buffer_[channel][outputPos] = sample * dryMix + convolved * mixLinear;
    }
}

std::vector<EffectBase::Parameter> IRConvolution::getParameters() const {
    return {
        {"mix", "Mix", 0.0f, 100.0f, 100.0f, mix_}
    };
}

void IRConvolution::setParameter(const std::string& name, float value) {
    if (name == "mix") {
        mix_ = std::max(0.0f, std::min(100.0f, value));
    }
}

float IRConvolution::getParameter(const std::string& name) const {
    if (name == "mix") return mix_;
    return 0.0f;
}

} // namespace webamp
