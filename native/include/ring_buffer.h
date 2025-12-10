#pragma once

#include <atomic>
#include <cstdint>
#include <vector>
#include <cstring>

namespace webamp {

// Ring buffer lock-free pour communication inter-thread
template<typename T>
class RingBuffer {
public:
    explicit RingBuffer(size_t capacity)
        : capacity_(capacity)
        , buffer_(capacity)
        , write_pos_(0)
        , read_pos_(0)
    {
        // Capacité doit être une puissance de 2 pour optimiser modulo
        if ((capacity & (capacity - 1)) != 0) {
            // Arrondir à la puissance de 2 supérieure
            capacity_ = 1;
            while (capacity_ < capacity) {
                capacity_ <<= 1;
            }
            buffer_.resize(capacity_);
        }
    }
    
    // Écriture (producteur)
    size_t write(const T* data, size_t count) {
        const size_t write_pos = write_pos_.load(std::memory_order_relaxed);
        const size_t read_pos = read_pos_.load(std::memory_order_acquire);
        
        const size_t available = capacity_ - (write_pos - read_pos) - 1;
        const size_t to_write = (count < available) ? count : available;
        
        if (to_write == 0) return 0;
        
        const size_t write_index = write_pos & (capacity_ - 1);
        const size_t first_part = std::min(to_write, capacity_ - write_index);
        
        std::memcpy(&buffer_[write_index], data, first_part * sizeof(T));
        if (to_write > first_part) {
            std::memcpy(&buffer_[0], data + first_part, (to_write - first_part) * sizeof(T));
        }
        
        write_pos_.store(write_pos + to_write, std::memory_order_release);
        return to_write;
    }
    
    // Lecture (consommateur)
    size_t read(T* data, size_t count) {
        const size_t write_pos = write_pos_.load(std::memory_order_acquire);
        const size_t read_pos = read_pos_.load(std::memory_order_relaxed);
        
        const size_t available = write_pos - read_pos;
        const size_t to_read = (count < available) ? count : available;
        
        if (to_read == 0) return 0;
        
        const size_t read_index = read_pos & (capacity_ - 1);
        const size_t first_part = std::min(to_read, capacity_ - read_index);
        
        std::memcpy(data, &buffer_[read_index], first_part * sizeof(T));
        if (to_read > first_part) {
            std::memcpy(data + first_part, &buffer_[0], (to_read - first_part) * sizeof(T));
        }
        
        read_pos_.store(read_pos + to_read, std::memory_order_release);
        return to_read;
    }
    
    size_t available() const {
        const size_t write_pos = write_pos_.load(std::memory_order_acquire);
        const size_t read_pos = read_pos_.load(std::memory_order_acquire);
        return write_pos - read_pos;
    }
    
    void reset() {
        write_pos_.store(0, std::memory_order_release);
        read_pos_.store(0, std::memory_order_release);
    }
    
private:
    size_t capacity_;
    std::vector<T> buffer_;
    std::atomic<size_t> write_pos_;
    std::atomic<size_t> read_pos_;
};

} // namespace webamp

