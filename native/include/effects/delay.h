#pragma once

#include "../effect_base.h"
#include <cstdint>
#include <vector>

namespace webamp {

// Effet de delay (echo)
class DelayEffect : public EffectBase {
public:
    DelayEffect();
    ~DelayEffect() override;
    
    void process(float* input, float* output, uint32_t frameCount) override;
    
    std::vector<Parameter> getParameters() const override;
    void setParameter(const std::string& name, float value) override;
    float getParameter(const std::string& name) const override;
    
    std::string getName() const override { return "Delay"; }
    std::string getType() const override { return "delay"; }
    
    void setSampleRate(uint32_t sampleRate) override;
    
private:
    float time_;      // 0-100 (ms)
    float feedback_;  // 0-100 (%)
    float mix_;       // 0-100 (%)
    
    std::vector<float> delay_buffer_[2]; // Stéréo
    size_t delay_buffer_size_;
    size_t write_pos_[2];
    
    void updateDelayBuffer();
};

} // namespace webamp

