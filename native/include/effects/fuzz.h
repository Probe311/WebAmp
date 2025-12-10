#pragma once

#include "../effect_base.h"
#include <cstdint>
#include <vector>
#include <algorithm>

namespace webamp {

// Effet de fuzz (distortion extrême)
class FuzzEffect : public EffectBase {
public:
    FuzzEffect();
    ~FuzzEffect() override = default;
    
    void process(float* input, float* output, uint32_t frameCount) override;
    
    std::vector<Parameter> getParameters() const override;
    void setParameter(const std::string& name, float value) override;
    float getParameter(const std::string& name) const override;
    
    std::string getName() const override { return "Fuzz"; }
    std::string getType() const override { return "fuzz"; }
    
    void setSampleRate(uint32_t sampleRate) override;
    
private:
    float fuzz_;      // 0-1
    float tone_;      // 0-1
    float volume_;    // 0-1
    
    // Filtre passe-bas pour le tone
    float lowpass_state_[2];
    float lowpass_coeff_;
    
    void updateToneFilter();
    
    // Fuzz avec hard clipping extrême
    float fuzzClip(float x) const;
};

} // namespace webamp

