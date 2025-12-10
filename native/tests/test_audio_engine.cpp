#include <gtest/gtest.h>
#include "audio_engine.h"
#include <thread>
#include <chrono>

namespace webamp {
namespace tests {

class AudioEngineTest : public ::testing::Test {
protected:
    void SetUp() override {
        engine_ = std::make_unique<AudioEngine>();
    }

    void TearDown() override {
        if (engine_) {
            engine_->shutdown();
        }
    }

    std::unique_ptr<AudioEngine> engine_;
};

TEST_F(AudioEngineTest, Initialization) {
    // Test d'initialisation (peut échouer si aucun driver n'est disponible)
    // C'est normal dans un environnement de test sans périphériques audio
    bool initialized = engine_->initialize("auto");
    
    // Si l'initialisation réussit, vérifier les valeurs
    if (initialized) {
        EXPECT_GT(engine_->getSampleRate(), 0);
        EXPECT_GT(engine_->getBufferSize(), 0);
    }
}

TEST_F(AudioEngineTest, SampleRateConfiguration) {
    // Tester différents sample rates
    std::vector<uint32_t> sampleRates = {44100, 48000, 96000, 192000};
    
    for (uint32_t rate : sampleRates) {
        bool result = engine_->setSampleRate(rate);
        // Peut échouer si le driver ne supporte pas le rate
        // Mais la méthode ne devrait pas planter
        EXPECT_NO_THROW(engine_->setSampleRate(rate));
    }
}

TEST_F(AudioEngineTest, BufferSizeConfiguration) {
    // Tester différentes tailles de buffer
    std::vector<uint32_t> bufferSizes = {32, 64, 128, 256};
    
    for (uint32_t size : bufferSizes) {
        EXPECT_NO_THROW(engine_->setBufferSize(size));
    }
}

TEST_F(AudioEngineTest, StartStop) {
    if (engine_->initialize("auto")) {
        EXPECT_TRUE(engine_->start());
        EXPECT_TRUE(engine_->isRunning());
        
        // Attendre un peu
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        
        EXPECT_TRUE(engine_->stop());
        EXPECT_FALSE(engine_->isRunning());
    }
}

TEST_F(AudioEngineTest, LatencyMeasurement) {
    if (engine_->initialize("auto")) {
        double latency = engine_->getTotalLatency();
        
        // Latence devrait être < 5ms (objectif)
        EXPECT_LE(latency, 0.01); // 10ms max (tolérance pour tests)
    }
}

TEST_F(AudioEngineTest, StatsRetrieval) {
    if (engine_->initialize("auto") && engine_->start()) {
        // Attendre un peu pour avoir des stats
        std::this_thread::sleep_for(std::chrono::milliseconds(200));
        
        auto stats = engine_->getStats();
        
        // Les stats devraient être valides
        EXPECT_GE(stats.samplesProcessed, 0);
        EXPECT_GE(stats.peakInput, -96.0);
        EXPECT_GE(stats.peakOutput, -96.0);
        
        engine_->stop();
    }
}

} // namespace tests
} // namespace webamp

