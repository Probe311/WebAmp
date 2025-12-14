/**
 * Neural Amp Modeler (NAM) Loader Implementation
 * 
 * Implémentation du chargement et de la gestion des modèles NAM (.nam)
 */

#include "nam_loader.h"
#include "json_parser.h"
#include <fstream>
#include <sstream>
#include <iostream>
#include <regex>

using namespace webamp;

namespace webamp {

// NAMModel Implementation

NAMModel::NAMModel() : valid_(false) {
    metadata_.sampleRate = 48000;
    metadata_.inputGain = 1.0f;
    metadata_.outputGain = 1.0f;
}

NAMModel::~NAMModel() {
    // Cleanup si nécessaire
}

bool NAMModel::loadFromFile(const std::string& filePath) {
    std::ifstream file(filePath, std::ios::binary);
    if (!file.is_open()) {
        std::cerr << "Failed to open NAM file: " << filePath << std::endl;
        return false;
    }

    // Lire le fichier entier
    file.seekg(0, std::ios::end);
    size_t fileSize = file.tellg();
    file.seekg(0, std::ios::beg);

    std::vector<uint8_t> fileData(fileSize);
    file.read(reinterpret_cast<char*>(fileData.data()), fileSize);
    file.close();

    return loadFromMemory(fileData.data(), fileSize);
}

bool NAMModel::loadFromMemory(const uint8_t* data, size_t size) {
    if (!data || size == 0) {
        return false;
    }

    // Parser les métadonnées
    if (!parseMetadata(data, size)) {
        std::cerr << "Failed to parse NAM metadata" << std::endl;
        return false;
    }

    // Copier les données du modèle
    modelData_.assign(data, data + size);
    valid_ = true;

    return true;
}

bool NAMModel::parseMetadata(const uint8_t* data, size_t size) {
    // Les fichiers NAM commencent généralement par un header JSON
    // Chercher le début du JSON
    size_t jsonStart = 0;
    for (size_t i = 0; i < size && i < 1024; ++i) {
        if (data[i] == '{') {
            jsonStart = i;
            break;
        }
    }

    // Chercher la fin du JSON
    size_t jsonEnd = jsonStart;
    int braceCount = 0;
    for (size_t i = jsonStart; i < size && i < jsonStart + 2048; ++i) {
        if (data[i] == '{') braceCount++;
        if (data[i] == '}') {
            braceCount--;
            if (braceCount == 0) {
                jsonEnd = i + 1;
                break;
            }
        }
    }

    if (jsonEnd <= jsonStart) {
        // Pas de JSON trouvé, utiliser des valeurs par défaut
        metadata_.name = "Unknown Model";
        metadata_.modelType = "amp";
        metadata_.sampleRate = 48000;
        return true;
    }

    // Parser le JSON avec JsonParser
    try {
        std::string jsonStr(reinterpret_cast<const char*>(data + jsonStart), jsonEnd - jsonStart);
        
        // Utiliser JsonParser pour parser le JSON
        auto jsonData = JsonParser::parse(jsonStr);
        
        // Extraire les métadonnées avec JsonParser
        metadata_.name = JsonParser::getString(jsonData, "name", "Unknown Model");
        metadata_.author = JsonParser::getString(jsonData, "author", "");
        metadata_.description = JsonParser::getString(jsonData, "description", "");
        
        // Essayer model_type puis modelType
        std::string modelType = JsonParser::getString(jsonData, "model_type", "");
        if (modelType.empty()) {
            modelType = JsonParser::getString(jsonData, "modelType", "amp");
        }
        metadata_.modelType = modelType.empty() ? "amp" : modelType;
        
        metadata_.version = JsonParser::getString(jsonData, "version", "");
        
        // Essayer sample_rate puis sampleRate
        int sampleRate = JsonParser::getInt(jsonData, "sample_rate", 0);
        if (sampleRate == 0) {
            sampleRate = JsonParser::getInt(jsonData, "sampleRate", 48000);
        }
        metadata_.sampleRate = sampleRate;
        
        // Essayer input_gain puis inputGain
        float inputGain = static_cast<float>(JsonParser::getDouble(jsonData, "input_gain", 0.0));
        if (inputGain == 0.0) {
            inputGain = static_cast<float>(JsonParser::getDouble(jsonData, "inputGain", 1.0));
        }
        metadata_.inputGain = inputGain;
        
        // Essayer output_gain puis outputGain
        float outputGain = static_cast<float>(JsonParser::getDouble(jsonData, "output_gain", 0.0));
        if (outputGain == 0.0) {
            outputGain = static_cast<float>(JsonParser::getDouble(jsonData, "outputGain", 1.0));
        }
        metadata_.outputGain = outputGain;
        
        // Essayer tone_stack puis toneStack
        std::string toneStack = JsonParser::getString(jsonData, "tone_stack", "");
        if (toneStack.empty()) {
            toneStack = JsonParser::getString(jsonData, "toneStack", "");
        }
        metadata_.toneStack = toneStack;

        // Tags (simplifié - nécessiterait un parser de tableau JSON plus avancé)
        // Pour l'instant, on laisse vide
        metadata_.tags.clear();

        return true;
    } catch (const std::exception& e) {
        std::cerr << "Failed to parse NAM JSON metadata: " << e.what() << std::endl;
        // Utiliser des valeurs par défaut
        metadata_.name = "Unknown Model";
        metadata_.modelType = "amp";
        metadata_.sampleRate = 48000;
        return true;
    }
}

void NAMModel::processAudio(float* input, float* output, size_t numSamples, int sampleRate) {
    // TODO: Implémenter le traitement audio avec le moteur NAM
    // Pour l'instant, copier l'input vers l'output
    for (size_t i = 0; i < numSamples; ++i) {
        output[i] = input[i] * metadata_.inputGain * metadata_.outputGain;
    }
}

// NAMLoader Implementation

NAMLoader::NAMLoader() {
    // Initialisation
}

NAMLoader::~NAMLoader() {
    clearCache();
}

std::shared_ptr<NAMModel> NAMLoader::loadModel(const std::string& filePath) {
    // Vérifier le cache
    for (auto& model : modelCache_) {
        // TODO: Comparer les chemins de fichiers
    }

    // Charger le modèle
    auto model = std::make_shared<NAMModel>();
    if (!model->loadFromFile(filePath)) {
        return nullptr;
    }

    // Ajouter au cache
    modelCache_.push_back(model);
    return model;
}

std::shared_ptr<NAMModel> NAMLoader::loadModelFromMemory(const uint8_t* data, size_t size) {
    auto model = std::make_shared<NAMModel>();
    if (!model->loadFromMemory(data, size)) {
        return nullptr;
    }

    modelCache_.push_back(model);
    return model;
}

void NAMLoader::clearCache() {
    modelCache_.clear();
}

bool NAMLoader::loadLibrary(const std::string& libraryPath) {
    libraryPath_ = libraryPath;
    
    // TODO: Implémenter le chargement d'une bibliothèque de modèles
    // Format attendu : JSON avec liste de modèles et leurs chemins
    
    std::ifstream file(libraryPath);
    if (!file.is_open()) {
        std::cerr << "Failed to open library file: " << libraryPath << std::endl;
        return false;
    }

    try {
        std::string fileContent((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
        file.close();

        // Parser le JSON avec JsonParser
        // Chercher le tableau "models"
        std::regex modelsRegex(R"("models"\s*:\s*\[)");
        std::smatch match;
        
        if (std::regex_search(fileContent, match, modelsRegex)) {
            // Parser simplifié - chercher les chemins de modèles
            std::regex pathRegex(R"("path"\s*:\s*"([^"]+)")");
            std::sregex_iterator iter(fileContent.begin(), fileContent.end(), pathRegex);
            std::sregex_iterator end;
            
            for (; iter != end; ++iter) {
                std::string modelPath = (*iter)[1].str();
                if (!modelPath.empty()) {
                    auto model = loadModel(modelPath);
                    if (model) {
                        // Modèle chargé avec succès
                    }
                }
            }
        }

        return true;
    } catch (const std::exception& e) {
        std::cerr << "Failed to load library: " << e.what() << std::endl;
        return false;
    }
}

std::vector<std::shared_ptr<NAMModel>> NAMLoader::getModelsByType(const std::string& type) {
    std::vector<std::shared_ptr<NAMModel>> result;
    
    for (const auto& model : modelCache_) {
        if (model->getMetadata().modelType == type) {
            result.push_back(model);
        }
    }
    
    return result;
}

std::shared_ptr<NAMModel> NAMLoader::getModelByName(const std::string& name) {
    for (const auto& model : modelCache_) {
        if (model->getMetadata().name == name) {
            return model;
        }
    }
    
    return nullptr;
}

} // namespace webamp

