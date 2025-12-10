#pragma once

#include "../effect_base.h"
#include <cstdint>
#include <vector>
#include <cmath>

namespace webamp {

// Effet de chorus (modulation avec delay variable)
class ChorusEffect : public EffectBase {
public:
    ChorusEffect();
    ~ChorusEffect() override = default;
    
    void process(float* input, float* output, uint32_t frameCount) override;
    
    std::vector<Parameter> getParameters() const override;
    void setParameter(const std::string& name, float value) override;
    float getParameter(const std::string& name) const override;
    
    std::string getName() const override { return "Chorus"; }
    std::string getType() const override { return "chorus"; }
    
    void setSampleRate(uint32_t sampleRate) override;
    
private:
    float rate_;      // Hz (0.1 - 10)
    float depth_;     // 0-1
    float mix_;       // 0-1 (dry/wet)
    
    // Buffer de delay
    std::vector<float> delay_buffer_;
    size_t delay_buffer_size_;
    size_t write_index_;
    
    // LFO pour la modulation
    float lfo_phase_;
    float lfo_increment_;
    
    void updateLFO();
    float getLFOValue() const;
    float getDelayTime() const;
};

} // namespace webamp

