cmake_minimum_required(VERSION 3.20)

# Google Test
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9fd7189c2c3c5e5e0c0e4e1.zip
)
FetchContent_MakeAvailable(googletest)

# Sources du projet nécessaires pour les tests
set(TEST_SOURCES
  ../src/dsp_pipeline.cpp
  ../src/effect_chain.cpp
  ../src/effect_manager.cpp
  ../src/buffer_pool.cpp
  ../src/simd_helper.cpp
  ../src/test_tone_generator.cpp
  ../src/effects/distortion.cpp
  ../src/effects/overdrive.cpp
  ../src/effects/fuzz.cpp
  ../src/effects/chorus.cpp
  ../src/effects/flanger.cpp
  ../src/effects/tremolo.cpp
  ../src/effects/eq.cpp
  ../src/effects/delay.cpp
  ../src/effects/reverb.cpp
)

# Tests
add_executable(tests
  test_main.cpp
  test_effects.cpp
  test_effect_chain.cpp
  test_dsp_pipeline.cpp
  test_audio_engine.cpp
  test_websocket.cpp
  test_performance.cpp
  ${TEST_SOURCES}
)

# Link libraries
target_link_libraries(tests
  PRIVATE
  gtest_main
  gtest
  Threads::Threads
)

# Linker flags pour Windows
if(WIN32)
    target_link_libraries(tests PRIVATE ws2_32)
endif()

# Include directories
target_include_directories(tests
  PRIVATE
  ${CMAKE_SOURCE_DIR}/../include
  ${CMAKE_SOURCE_DIR}/..
)

# Compiler flags
target_compile_options(tests PRIVATE
  $<$<CXX_COMPILER_ID:MSVC>:/W4>
  $<$<CXX_COMPILER_ID:GNU,Clang>:-Wall -Wextra -Wpedantic>
)

# Enable testing
enable_testing()
add_test(NAME WebAmpTests COMMAND tests)
