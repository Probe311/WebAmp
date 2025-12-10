#include "../include/fft_helper.h"
#include <algorithm>
#include <cstring>

namespace webamp {

size_t FFTHelper::nextPowerOf2(size_t n) {
    if (n == 0) return 1;
    n--;
    n |= n >> 1;
    n |= n >> 2;
    n |= n >> 4;
    n |= n >> 8;
    n |= n >> 16;
    if (sizeof(size_t) > 4) {
        n |= n >> 32;
    }
    return n + 1;
}

void FFTHelper::bitReverse(std::vector<std::complex<float>>& data) {
    size_t n = data.size();
    size_t j = 0;
    
    for (size_t i = 1; i < n; ++i) {
        size_t bit = n >> 1;
        for (; j & bit; bit >>= 1) {
            j ^= bit;
        }
        j ^= bit;
        
        if (i < j) {
            std::swap(data[i], data[j]);
        }
    }
}

void FFTHelper::fft(std::vector<std::complex<float>>& data, bool inverse) {
    size_t n = data.size();
    if (n == 0 || (n & (n - 1)) != 0) {
        // Padding à la puissance de 2
        size_t newSize = nextPowerOf2(n);
        data.resize(newSize, std::complex<float>(0.0f, 0.0f));
        n = newSize;
    }
    
    bitReverse(data);
    
    float sign = inverse ? 1.0f : -1.0f;
    
    for (size_t len = 2; len <= n; len <<= 1) {
        float angle = sign * 2.0f * 3.14159265358979323846f / len;
        std::complex<float> wlen(std::cos(angle), std::sin(angle));
        
        for (size_t i = 0; i < n; i += len) {
            std::complex<float> w(1.0f, 0.0f);
            
            for (size_t j = 0; j < len / 2; ++j) {
                std::complex<float> u = data[i + j];
                std::complex<float> v = data[i + j + len / 2] * w;
                
                data[i + j] = u + v;
                data[i + j + len / 2] = u - v;
                
                w *= wlen;
            }
        }
    }
    
    if (inverse) {
        for (size_t i = 0; i < n; ++i) {
            data[i] /= static_cast<float>(n);
        }
    }
}

void FFTHelper::ifft(std::vector<std::complex<float>>& data) {
    fft(data, true);
}

void FFTHelper::convolveFFT(
    const std::vector<float>& signal,
    const std::vector<float>& kernel,
    std::vector<float>& output
) {
    if (signal.empty() || kernel.empty()) {
        output.clear();
        return;
    }
    
    size_t signalLen = signal.size();
    size_t kernelLen = kernel.size();
    size_t outputLen = signalLen + kernelLen - 1;
    size_t fftSize = nextPowerOf2(outputLen);
    
    // Préparer les données pour FFT
    std::vector<std::complex<float>> signalFFT(fftSize);
    std::vector<std::complex<float>> kernelFFT(fftSize);
    
    // Copier signal
    for (size_t i = 0; i < signalLen; ++i) {
        signalFFT[i] = std::complex<float>(signal[i], 0.0f);
    }
    for (size_t i = signalLen; i < fftSize; ++i) {
        signalFFT[i] = std::complex<float>(0.0f, 0.0f);
    }
    
    // Copier kernel
    for (size_t i = 0; i < kernelLen; ++i) {
        kernelFFT[i] = std::complex<float>(kernel[i], 0.0f);
    }
    for (size_t i = kernelLen; i < fftSize; ++i) {
        kernelFFT[i] = std::complex<float>(0.0f, 0.0f);
    }
    
    // FFT
    fft(signalFFT, false);
    fft(kernelFFT, false);
    
    // Multiplication dans le domaine fréquentiel
    std::vector<std::complex<float>> resultFFT(fftSize);
    for (size_t i = 0; i < fftSize; ++i) {
        resultFFT[i] = signalFFT[i] * kernelFFT[i];
    }
    
    // IFFT
    ifft(resultFFT);
    
    // Extraire la partie réelle
    output.resize(outputLen);
    for (size_t i = 0; i < outputLen; ++i) {
        output[i] = resultFFT[i].real();
    }
}

} // namespace webamp

