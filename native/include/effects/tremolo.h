#pragma once

#include "../effect_base.h"
#include <cstdint>
#include <cmath>

namespace webamp {

// Effet de tremolo (modulation d'amplitude)
class TremoloEffect : public EffectBase {
public:
    TremoloEffect();
    ~TremoloEffect() override = default;
    
    void process(float* input, float* output, uint32_t frameCount) override;
    
    std::vector<Parameter> getParameters() const override;
    void setParameter(const std::string& name, float value) override;
    float getParameter(const std::string& name) const override;
    
    std::string getName() const override { return "Tremolo"; }
    std::string getType() const override { return "tremolo"; }
    
    void setSampleRate(uint32_t sampleRate) override;
    
private:
    float rate_;      // Hz (0.1 - 20)
    float depth_;     // 0-1
    float volume_;    // 0-1
    float wave_;      // 0-1 (sine/square)
    
    // LFO pour la modulation
    float lfo_phase_;
    float lfo_increment_;
    
    void updateLFO();
    float getLFOValue() const;
};

} // namespace webamp

