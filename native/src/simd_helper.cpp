#include "../include/simd_helper.h"
#include <algorithm>
#include <cstring>

#ifdef __SSE__
#include <xmmintrin.h>
#endif

#ifdef __AVX__
#include <immintrin.h>
#endif

#ifdef __ARM_NEON
#include <arm_neon.h>
#endif

namespace webamp {

bool SIMDHelper::isAvailable() {
    return hasSSE() || hasAVX() || hasNEON();
}

bool SIMDHelper::hasSSE() {
#ifdef __SSE__
    return true;
#else
    return false;
#endif
}

bool SIMDHelper::hasAVX() {
#ifdef __AVX__
    return true;
#else
    return false;
#endif
}

bool SIMDHelper::hasNEON() {
#ifdef __ARM_NEON
    return true;
#else
    return false;
#endif
}

void SIMDHelper::multiplyBuffers(
    const float* a,
    const float* b,
    float* output,
    size_t count
) {
    if (!a || !b || !output || count == 0) {
        return;
    }
    
    // Utiliser la meilleure implémentation disponible
    if (hasAVX()) {
        multiplyBuffersAVX(a, b, output, count);
    } else if (hasSSE()) {
        multiplyBuffersSSE(a, b, output, count);
    } else if (hasNEON()) {
        multiplyBuffersNEON(a, b, output, count);
    } else {
        multiplyBuffersScalar(a, b, output, count);
    }
}

void SIMDHelper::multiplyBuffersAVX(const float* a, const float* b, float* output, size_t count) {
#ifdef __AVX__
    size_t simdCount = count & ~7; // Multiple de 8
    
    for (size_t i = 0; i < simdCount; i += 8) {
        __m256 va = _mm256_loadu_ps(&a[i]);
        __m256 vb = _mm256_loadu_ps(&b[i]);
        __m256 result = _mm256_mul_ps(va, vb);
        _mm256_storeu_ps(&output[i], result);
    }
    
    // Traiter les éléments restants
    for (size_t i = simdCount; i < count; ++i) {
        output[i] = a[i] * b[i];
    }
#else
    multiplyBuffersScalar(a, b, output, count);
#endif
}

void SIMDHelper::multiplyBuffersSSE(const float* a, const float* b, float* output, size_t count) {
#ifdef __SSE__
    size_t simdCount = count & ~3; // Multiple de 4
    
    for (size_t i = 0; i < simdCount; i += 4) {
        __m128 va = _mm_loadu_ps(&a[i]);
        __m128 vb = _mm_loadu_ps(&b[i]);
        __m128 result = _mm_mul_ps(va, vb);
        _mm_storeu_ps(&output[i], result);
    }
    
    // Traiter les éléments restants
    for (size_t i = simdCount; i < count; ++i) {
        output[i] = a[i] * b[i];
    }
#else
    multiplyBuffersScalar(a, b, output, count);
#endif
}

void SIMDHelper::multiplyBuffersNEON(const float* a, const float* b, float* output, size_t count) {
#ifdef __ARM_NEON
    size_t simdCount = count & ~3; // Multiple de 4
    
    for (size_t i = 0; i < simdCount; i += 4) {
        float32x4_t va = vld1q_f32(&a[i]);
        float32x4_t vb = vld1q_f32(&b[i]);
        float32x4_t result = vmulq_f32(va, vb);
        vst1q_f32(&output[i], result);
    }
    
    // Traiter les éléments restants
    for (size_t i = simdCount; i < count; ++i) {
        output[i] = a[i] * b[i];
    }
#else
    multiplyBuffersScalar(a, b, output, count);
#endif
}

void SIMDHelper::multiplyBuffersScalar(const float* a, const float* b, float* output, size_t count) {
    for (size_t i = 0; i < count; ++i) {
        output[i] = a[i] * b[i];
    }
}

void SIMDHelper::addBuffers(
    const float* a,
    const float* b,
    float* output,
    size_t count
) {
    if (!a || !b || !output || count == 0) {
        return;
    }
    
    // Implémentation scalaire pour l'instant (peut être optimisée avec SIMD)
    for (size_t i = 0; i < count; ++i) {
        output[i] = a[i] + b[i];
    }
}

void SIMDHelper::multiplyScalar(
    const float* input,
    float scalar,
    float* output,
    size_t count
) {
    if (!input || !output || count == 0) {
        return;
    }
    
    // Implémentation scalaire pour l'instant (peut être optimisée avec SIMD)
    for (size_t i = 0; i < count; ++i) {
        output[i] = input[i] * scalar;
    }
}

void SIMDHelper::applyGain(
    const float* input,
    float gain,
    float* output,
    size_t count
) {
    multiplyScalar(input, gain, output, count);
}

void SIMDHelper::mixBuffers(
    const float* a,
    const float* b,
    float mix,
    float* output,
    size_t count
) {
    if (!a || !b || !output || count == 0) {
        return;
    }
    
    float dryMix = 1.0f - mix;
    for (size_t i = 0; i < count; ++i) {
        output[i] = a[i] * dryMix + b[i] * mix;
    }
}

} // namespace webamp

