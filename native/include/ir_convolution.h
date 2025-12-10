#pragma once

#include "ir_loader.h"
#include "effect_base.h"
#include "fft_helper.h"
#include <cstdint>
#include <vector>
#include <memory>

namespace webamp {

// Convolution en temps réel pour appliquer un IR
class IRConvolution : public EffectBase {
public:
    IRConvolution();
    ~IRConvolution() override;
    
    void process(float* input, float* output, uint32_t frameCount) override;
    
    std::vector<Parameter> getParameters() const override;
    void setParameter(const std::string& name, float value) override;
    float getParameter(const std::string& name) const override;
    
    std::string getName() const override { return "IR Convolution"; }
    std::string getType() const override { return "ir_convolution"; }
    
    void setSampleRate(uint32_t sampleRate) override;
    
    // Charger un IR
    bool loadIR(const std::string& filePath);
    bool loadIR(std::shared_ptr<IRLoader> irLoader);
    
    // Mix dry/wet
    void setMix(float mix) { mix_ = mix; }
    float getMix() const { return mix_; }
    
private:
    std::shared_ptr<IRLoader> ir_loader_;
    float mix_; // 0-100
    
    // Buffers de convolution (overlap-add)
    std::vector<float> input_buffer_[2];
    std::vector<float> output_buffer_[2];
    size_t buffer_pos_[2];
    
    // Convolution FFT optimisée (overlap-add)
    void processConvolutionFFT(int channel, uint32_t frameCount, float dryMix, float mixLinear);
    
    // Convolution directe (fallback)
    void processDirectConvolution(int channel, uint32_t frameCount, float dryMix, float mixLinear);
};

} // namespace webamp

