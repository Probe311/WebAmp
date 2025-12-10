#pragma once

#include <cstdint>
#include <cstddef>

namespace webamp {

// Helper SIMD pour optimiser le traitement DSP
// Utilise les intrinsics SSE/AVX sur x86, NEON sur ARM
class SIMDHelper {
public:
    // Vérifier si SIMD est disponible
    static bool isAvailable();
    
    // Multiplier deux buffers (output = a * b)
    static void multiplyBuffers(
        const float* a,
        const float* b,
        float* output,
        size_t count
    );
    
    // Ajouter deux buffers (output = a + b)
    static void addBuffers(
        const float* a,
        const float* b,
        float* output,
        size_t count
    );
    
    // Multiplier par un scalaire (output = input * scalar)
    static void multiplyScalar(
        const float* input,
        float scalar,
        float* output,
        size_t count
    );
    
    // Appliquer un gain (output = input * gain)
    static void applyGain(
        const float* input,
        float gain,
        float* output,
        size_t count
    );
    
    // Mixer deux buffers avec facteur (output = a * (1-mix) + b * mix)
    static void mixBuffers(
        const float* a,
        const float* b,
        float mix,
        float* output,
        size_t count
    );
    
private:
    // Détection des capacités CPU
    static bool hasSSE();
    static bool hasAVX();
    static bool hasNEON();
    
    // Implémentations spécifiques
    static void multiplyBuffersSSE(const float* a, const float* b, float* output, size_t count);
    static void multiplyBuffersAVX(const float* a, const float* b, float* output, size_t count);
    static void multiplyBuffersNEON(const float* a, const float* b, float* output, size_t count);
    static void multiplyBuffersScalar(const float* a, const float* b, float* output, size_t count);
};

} // namespace webamp

