#pragma once

#include "../effect_base.h"
#include <cstdint>
#include <vector>

namespace webamp {

// Effet de distortion (hard clipping)
class DistortionEffect : public EffectBase {
public:
    DistortionEffect();
    ~DistortionEffect() override = default;
    
    void process(float* input, float* output, uint32_t frameCount) override;
    
    std::vector<Parameter> getParameters() const override;
    void setParameter(const std::string& name, float value) override;
    float getParameter(const std::string& name) const override;
    
    std::string getName() const override { return "Distortion"; }
    std::string getType() const override { return "distortion"; }
    
    void setSampleRate(uint32_t sampleRate) override;
    
private:
    float gain_;
    float tone_;
    float level_;
    
    // Filtre passe-bas pour le tone
    float lowpass_state_[2];
    float lowpass_coeff_;
    
    void updateToneFilter();
};

} // namespace webamp

