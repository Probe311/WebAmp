#include "../include/buffer_pool.h"
#include <algorithm>

namespace webamp {

BufferPool::BufferPool(size_t bufferSize, size_t poolSize)
    : buffer_size_(bufferSize)
{
    initializePool(poolSize);
}

BufferPool::~BufferPool() {
    std::lock_guard<std::mutex> lock(mutex_);
    buffers_.clear();
    while (!available_buffers_.empty()) {
        available_buffers_.pop();
    }
}

void BufferPool::initializePool(size_t poolSize) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    buffers_.reserve(poolSize);
    for (size_t i = 0; i < poolSize; ++i) {
        auto buffer = std::make_unique<float[]>(buffer_size_);
        std::fill(buffer.get(), buffer.get() + buffer_size_, 0.0f);
        float* rawPtr = buffer.get();
        buffers_.push_back(std::move(buffer));
        available_buffers_.push(rawPtr);
    }
}

float* BufferPool::acquire() {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (available_buffers_.empty()) {
        // Créer un nouveau buffer si le pool est vide
        auto buffer = std::make_unique<float[]>(buffer_size_);
        std::fill(buffer.get(), buffer.get() + buffer_size_, 0.0f);
        float* rawPtr = buffer.get();
        buffers_.push_back(std::move(buffer));
        return rawPtr;
    }
    
    float* buffer = available_buffers_.front();
    available_buffers_.pop();
    return buffer;
}

void BufferPool::release(float* buffer) {
    if (!buffer) {
        return;
    }
    
    std::lock_guard<std::mutex> lock(mutex_);
    
    // Vérifier que le buffer appartient à ce pool
    bool found = false;
    for (const auto& ownedBuffer : buffers_) {
        if (ownedBuffer.get() == buffer) {
            found = true;
            break;
        }
    }
    
    if (found) {
        // Réinitialiser le buffer
        std::fill(buffer, buffer + buffer_size_, 0.0f);
        available_buffers_.push(buffer);
    }
}

size_t BufferPool::getAvailableCount() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return available_buffers_.size();
}

size_t BufferPool::getUsedCount() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return buffers_.size() - available_buffers_.size();
}

} // namespace webamp

