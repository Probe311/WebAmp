#pragma once

#include <cstdint>
#include <string>
#include <vector>
#include <memory>

namespace webamp {

// Chargeur d'Impulse Responses (IR) pour simulation de cabinets
class IRLoader {
public:
    IRLoader();
    ~IRLoader();
    
    // Charger un fichier IR (WAV)
    bool loadIR(const std::string& filePath);
    bool loadIRFromMemory(const void* data, size_t size);
    
    // Charger depuis un buffer de samples
    void loadIRFromSamples(const float* samples, size_t sampleCount, uint32_t sampleRate);
    
    // Vérifier si un IR est chargé
    bool isLoaded() const { return !ir_samples_.empty(); }
    
    // Obtenir les données IR
    const std::vector<float>& getIRSamples() const { return ir_samples_; }
    uint32_t getSampleRate() const { return ir_sample_rate_; }
    size_t getLength() const { return ir_samples_.size(); }
    
    // Réinitialiser
    void clear();
    
    // Normaliser l'IR
    void normalize();
    
private:
    std::vector<float> ir_samples_;
    uint32_t ir_sample_rate_;
    
    // Helpers pour parser WAV
    bool parseWAV(const void* data, size_t size);
    bool parseWAVFile(const std::string& filePath);
};

} // namespace webamp

