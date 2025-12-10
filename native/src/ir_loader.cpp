#include "../include/ir_loader.h"
#include <fstream>
#include <cstring>
#include <algorithm>

namespace webamp {

IRLoader::IRLoader()
    : ir_sample_rate_(44100)
{
}

IRLoader::~IRLoader() {
    clear();
}

void IRLoader::clear() {
    ir_samples_.clear();
    ir_sample_rate_ = 44100;
}

bool IRLoader::loadIR(const std::string& filePath) {
    clear();
    return parseWAVFile(filePath);
}

bool IRLoader::loadIRFromMemory(const void* data, size_t size) {
    clear();
    return parseWAV(data, size);
}

void IRLoader::loadIRFromSamples(const float* samples, size_t sampleCount, uint32_t sampleRate) {
    clear();
    ir_samples_.assign(samples, samples + sampleCount);
    ir_sample_rate_ = sampleRate;
}

void IRLoader::normalize() {
    if (ir_samples_.empty()) {
        return;
    }
    
    // Trouver le peak
    float peak = 0.0f;
    for (float sample : ir_samples_) {
        peak = std::max(peak, std::abs(sample));
    }
    
    if (peak > 0.0f && peak < 1.0f) {
        // Normaliser à 0.95 pour éviter le clipping
        float scale = 0.95f / peak;
        for (float& sample : ir_samples_) {
            sample *= scale;
        }
    }
}

bool IRLoader::parseWAVFile(const std::string& filePath) {
    std::ifstream file(filePath, std::ios::binary);
    if (!file.is_open()) {
        return false;
    }
    
    // Lire le fichier entier
    file.seekg(0, std::ios::end);
    size_t fileSize = file.tellg();
    file.seekg(0, std::ios::beg);
    
    std::vector<uint8_t> buffer(fileSize);
    file.read(reinterpret_cast<char*>(buffer.data()), fileSize);
    file.close();
    
    return parseWAV(buffer.data(), fileSize);
}

bool IRLoader::parseWAV(const void* data, size_t size) {
    if (size < 44) { // Header WAV minimum
        return false;
    }
    
    const uint8_t* bytes = static_cast<const uint8_t*>(data);
    
    // Vérifier "RIFF"
    if (std::memcmp(bytes, "RIFF", 4) != 0) {
        return false;
    }
    
    // Vérifier "WAVE"
    if (std::memcmp(bytes + 8, "WAVE", 4) != 0) {
        return false;
    }
    
    // Chercher le chunk "fmt "
    size_t offset = 12;
    bool foundFmt = false;
    uint16_t channels = 1;
    uint32_t sampleRate = 44100;
    uint16_t bitsPerSample = 16;
    uint16_t blockAlign = 2;
    
    while (offset + 8 < size) {
        uint32_t chunkSize = *reinterpret_cast<const uint32_t*>(bytes + offset + 4);
        chunkSize = (chunkSize >> 24) | ((chunkSize >> 8) & 0xFF00) | ((chunkSize << 8) & 0xFF0000) | (chunkSize << 24); // Little endian
        
        if (std::memcmp(bytes + offset, "fmt ", 4) == 0) {
            foundFmt = true;
            if (offset + 16 < size) {
                uint16_t audioFormat = bytes[offset + 8] | (bytes[offset + 9] << 8);
                channels = bytes[offset + 10] | (bytes[offset + 11] << 8);
                sampleRate = bytes[offset + 12] | (bytes[offset + 13] << 8) | 
                            (bytes[offset + 14] << 16) | (bytes[offset + 15] << 24);
                bitsPerSample = bytes[offset + 22] | (bytes[offset + 23] << 8);
                blockAlign = bytes[offset + 20] | (bytes[offset + 21] << 8);
            }
            break;
        }
        offset += 8 + chunkSize;
    }
    
    if (!foundFmt) {
        return false;
    }
    
    // Chercher le chunk "data"
    offset = 12;
    bool foundData = false;
    size_t dataOffset = 0;
    size_t dataSize = 0;
    
    while (offset + 8 < size) {
        uint32_t chunkSize = *reinterpret_cast<const uint32_t*>(bytes + offset + 4);
        chunkSize = (chunkSize >> 24) | ((chunkSize >> 8) & 0xFF00) | ((chunkSize << 8) & 0xFF0000) | (chunkSize << 24);
        
        if (std::memcmp(bytes + offset, "data", 4) == 0) {
            foundData = true;
            dataOffset = offset + 8;
            dataSize = chunkSize;
            break;
        }
        offset += 8 + chunkSize;
    }
    
    if (!foundData || dataOffset + dataSize > size) {
        return false;
    }
    
    // Convertir les samples
    ir_sample_rate_ = sampleRate;
    size_t sampleCount = dataSize / blockAlign;
    ir_samples_.reserve(sampleCount);
    
    const uint8_t* sampleData = bytes + dataOffset;
    
    if (bitsPerSample == 16) {
        for (size_t i = 0; i < sampleCount; ++i) {
            int16_t sample = sampleData[i * blockAlign] | (sampleData[i * blockAlign + 1] << 8);
            float normalized = static_cast<float>(sample) / 32768.0f;
            ir_samples_.push_back(normalized);
        }
    } else if (bitsPerSample == 24) {
        for (size_t i = 0; i < sampleCount; ++i) {
            int32_t sample = sampleData[i * blockAlign] | 
                           (sampleData[i * blockAlign + 1] << 8) |
                           (sampleData[i * blockAlign + 2] << 16);
            if (sample & 0x800000) {
                sample |= 0xFF000000; // Sign extension
            }
            float normalized = static_cast<float>(sample) / 8388608.0f;
            ir_samples_.push_back(normalized);
        }
    } else if (bitsPerSample == 32) {
        for (size_t i = 0; i < sampleCount; ++i) {
            int32_t sample = *reinterpret_cast<const int32_t*>(sampleData + i * blockAlign);
            float normalized = static_cast<float>(sample) / 2147483648.0f;
            ir_samples_.push_back(normalized);
        }
    } else {
        return false; // Format non supporté
    }
    
    // Si stéréo, prendre seulement le canal gauche
    if (channels == 2) {
        std::vector<float> mono;
        mono.reserve(sampleCount / 2);
        for (size_t i = 0; i < sampleCount; i += 2) {
            mono.push_back(ir_samples_[i]);
        }
        ir_samples_ = mono;
    }
    
    normalize();
    return true;
}

} // namespace webamp

