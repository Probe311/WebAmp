#pragma once

#include <cstdint>
#include <vector>
#include <complex>
#include <cmath>

namespace webamp {

// Helper FFT simple pour convolution (Radix-2)
class FFTHelper {
public:
    static void fft(std::vector<std::complex<float>>& data, bool inverse = false);
    static void ifft(std::vector<std::complex<float>>& data);
    
    // Convolution via FFT (overlap-add)
    static void convolveFFT(
        const std::vector<float>& signal,
        const std::vector<float>& kernel,
        std::vector<float>& output
    );
    
private:
    static size_t nextPowerOf2(size_t n);
    static void bitReverse(std::vector<std::complex<float>>& data);
};

} // namespace webamp

