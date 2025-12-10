#pragma once

#include "../effect_base.h"
#include <cstdint>
#include <vector>

namespace webamp {

// Effet de reverb (comb filters + allpass)
class ReverbEffect : public EffectBase {
public:
    ReverbEffect();
    ~ReverbEffect() override;
    
    void process(float* input, float* output, uint32_t frameCount) override;
    
    std::vector<Parameter> getParameters() const override;
    void setParameter(const std::string& name, float value) override;
    float getParameter(const std::string& name) const override;
    
    std::string getName() const override { return "Reverb"; }
    std::string getType() const override { return "reverb"; }
    
    void setSampleRate(uint32_t sampleRate) override;
    
private:
    float room_;   // 0-100 (taille de la pièce)
    float decay_; // 0-100 (durée de la réverb)
    float mix_;   // 0-100 (%)
    
    // Comb filters (4 par canal)
    static constexpr int NUM_COMBS = 4;
    std::vector<float> comb_buffers_[2][NUM_COMBS];
    size_t comb_delays_[NUM_COMBS];
    size_t comb_write_pos_[2][NUM_COMBS];
    float comb_feedback_[NUM_COMBS];
    
    // Allpass filters (2 par canal)
    static constexpr int NUM_ALLPASS = 2;
    std::vector<float> allpass_buffers_[2][NUM_ALLPASS];
    size_t allpass_delays_[NUM_ALLPASS];
    size_t allpass_write_pos_[2][NUM_ALLPASS];
    
    void updateReverbParameters();
};

} // namespace webamp

