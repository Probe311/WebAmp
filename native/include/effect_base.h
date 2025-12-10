#pragma once

#include <cstdint>
#include <string>
#include <vector>
#include <memory>

namespace webamp {

// Interface de base pour tous les effets
class EffectBase {
public:
    virtual ~EffectBase() = default;
    
    // Traitement audio (appelé dans le callback audio)
    virtual void process(float* input, float* output, uint32_t frameCount) = 0;
    
    // Configuration
    virtual void setBypass(bool bypass) { bypass_ = bypass; }
    virtual bool isBypassed() const { return bypass_; }
    
    virtual void setSampleRate(uint32_t sampleRate) { sample_rate_ = sampleRate; }
    virtual uint32_t getSampleRate() const { return sample_rate_; }
    
    // Paramètres
    struct Parameter {
        std::string name;
        std::string label;
        float min;
        float max;
        float defaultValue;
        float currentValue;
    };
    
    virtual std::vector<Parameter> getParameters() const = 0;
    virtual void setParameter(const std::string& name, float value) = 0;
    virtual float getParameter(const std::string& name) const = 0;
    
    // Métadonnées
    virtual std::string getName() const = 0;
    virtual std::string getType() const = 0;
    
protected:
    bool bypass_ = false;
    uint32_t sample_rate_ = 44100;
};

} // namespace webamp

