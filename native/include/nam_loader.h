/**
 * Neural Amp Modeler (NAM) Loader
 * 
 * Header pour le chargement et la gestion des modèles NAM (.nam)
 * Support des modèles NAM pour modélisation d'amplis/pédales par IA
 * 
 * Documentation : https://neuralampmodeler.com
 */

#ifndef NAM_LOADER_H
#define NAM_LOADER_H

#include <string>
#include <vector>
#include <memory>
#include <cstdint>

namespace webamp {

/**
 * Métadonnées d'un modèle NAM
 */
struct NAMModelMetadata {
    std::string name;
    std::string author;
    std::string description;
    std::string modelType;  // "amp", "pedal", "cabinet"
    std::string version;
    int sampleRate;
    float inputGain;
    float outputGain;
    std::string toneStack;
    std::vector<std::string> tags;
};

/**
 * Modèle NAM chargé en mémoire
 */
class NAMModel {
public:
    NAMModel();
    ~NAMModel();

    // Chargement
    bool loadFromFile(const std::string& filePath);
    bool loadFromMemory(const uint8_t* data, size_t size);
    
    // Accès aux données
    const NAMModelMetadata& getMetadata() const { return metadata_; }
    const uint8_t* getModelData() const { return modelData_.data(); }
    size_t getModelDataSize() const { return modelData_.size(); }
    
    // Validation
    bool isValid() const { return valid_; }
    
    // Traitement audio (à implémenter avec le moteur NAM)
    void processAudio(float* input, float* output, size_t numSamples, int sampleRate);

private:
    NAMModelMetadata metadata_;
    std::vector<uint8_t> modelData_;
    bool valid_;
    
    bool parseMetadata(const uint8_t* data, size_t size);
};

/**
 * Gestionnaire de modèles NAM
 */
class NAMLoader {
public:
    NAMLoader();
    ~NAMLoader();

    // Chargement de modèles
    std::shared_ptr<NAMModel> loadModel(const std::string& filePath);
    std::shared_ptr<NAMModel> loadModelFromMemory(const uint8_t* data, size_t size);
    
    // Gestion du cache
    void clearCache();
    size_t getCacheSize() const { return modelCache_.size(); }
    
    // Bibliothèque de modèles pré-chargés
    bool loadLibrary(const std::string& libraryPath);
    std::vector<std::shared_ptr<NAMModel>> getModelsByType(const std::string& type);
    std::shared_ptr<NAMModel> getModelByName(const std::string& name);

private:
    std::vector<std::shared_ptr<NAMModel>> modelCache_;
    std::string libraryPath_;
    
    bool parseNAMFile(const std::string& filePath, NAMModelMetadata& metadata, std::vector<uint8_t>& modelData);
};

} // namespace webamp

#endif // NAM_LOADER_H

