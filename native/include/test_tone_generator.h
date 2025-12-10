#pragma once

#include <cstdint>
#include <cmath>

namespace webamp {

// Générateur de signal de test pour les prévisualisations
class TestToneGenerator {
public:
    TestToneGenerator();
    
    // Configuration
    void setEnabled(bool enabled) { enabled_ = enabled; }
    bool isEnabled() const { return enabled_; }
    
    void setFrequency(float frequency);
    void setAmplitude(float amplitude) { amplitude_ = amplitude; }
    void setSampleRate(uint32_t sampleRate);
    
    // Génération de signal
    void generate(float* output, uint32_t frameCount, uint32_t channels = 2);
    
    // Types de signaux
    enum class WaveType {
        Sine,      // Sinus pur
        Square,    // Carré
        Sawtooth,  // Dents de scie
        Triangle,  // Triangle
        Noise      // Bruit blanc
    };
    
    void setWaveType(WaveType type) { wave_type_ = type; }
    
private:
    bool enabled_;
    float frequency_;
    float amplitude_;
    uint32_t sample_rate_;
    WaveType wave_type_;
    
    // État pour la génération
    double phase_;
    double phase_increment_;
    
    // Pour le bruit
    uint32_t noise_seed_;
    
    void updatePhaseIncrement();
    float generateSample();
};

} // namespace webamp

