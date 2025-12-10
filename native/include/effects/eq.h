#pragma once

#include "../effect_base.h"
#include <cstdint>
#include <vector>

namespace webamp {

// Effet d'equalizer (filtres paramétriques)
class EQEffect : public EffectBase {
public:
    EQEffect();
    ~EQEffect() override = default;
    
    void process(float* input, float* output, uint32_t frameCount) override;
    
    std::vector<Parameter> getParameters() const override;
    void setParameter(const std::string& name, float value) override;
    float getParameter(const std::string& name) const override;
    
    std::string getName() const override { return "EQ"; }
    std::string getType() const override { return "eq"; }
    
    void setSampleRate(uint32_t sampleRate) override;
    
private:
    // Bands EQ (peut être étendu pour plus de bandes)
    float low_;       // dB (-12 à +12)
    float mid_;       // dB (-12 à +12)
    float high_;      // dB (-12 à +12)
    float level_;     // 0-1
    
    // Filtres biquad simples
    struct BiquadFilter {
        float b0, b1, b2, a1, a2;
        float x1, x2, y1, y2;
    };
    
    BiquadFilter low_filter_;
    BiquadFilter mid_filter_;
    BiquadFilter high_filter_;
    
    void updateFilters();
    void processBiquad(BiquadFilter& filter, float* input, float* output, uint32_t frameCount);
    void setBiquadPeak(BiquadFilter& filter, float freq, float gain, float q, float sampleRate);
};

} // namespace webamp

