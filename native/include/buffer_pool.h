#pragma once

#include <cstdint>
#include <vector>
#include <memory>
#include <mutex>
#include <queue>

namespace webamp {

// Pool de buffers audio réutilisables pour éviter les allocations
class BufferPool {
public:
    BufferPool(size_t bufferSize, size_t poolSize = 4);
    ~BufferPool();
    
    // Obtenir un buffer du pool
    float* acquire();
    
    // Libérer un buffer dans le pool
    void release(float* buffer);
    
    // Obtenir la taille des buffers
    size_t getBufferSize() const { return buffer_size_; }
    
    // Statistiques
    size_t getAvailableCount() const;
    size_t getUsedCount() const;
    
private:
    size_t buffer_size_;
    std::vector<std::unique_ptr<float[]>> buffers_;
    std::queue<float*> available_buffers_;
    mutable std::mutex mutex_;
    
    void initializePool(size_t poolSize);
};

} // namespace webamp

