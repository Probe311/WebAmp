cmake_minimum_required(VERSION 3.20)
project(WebAmpNative VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Options de build
option(BUILD_ASIO "Build ASIO support" ON)
option(BUILD_WASAPI "Build WASAPI support" ON)
option(BUILD_COREAUDIO "Build CoreAudio support" OFF)
option(BUILD_PIPEWIRE "Build PipeWire support" OFF)
option(USE_ASIO_SDK "Use ASIO SDK (requires SDK in third_party/asio)" OFF)

# Dépendances
find_package(Threads REQUIRED)

# ASIO (Windows)
if(WIN32 AND BUILD_ASIO)
    message(STATUS "ASIO support enabled")
    
    # Vérifier si ASIO SDK est disponible
    if(USE_ASIO_SDK AND EXISTS "${CMAKE_CURRENT_SOURCE_DIR}/third_party/asio")
        message(STATUS "ASIO SDK found in third_party/asio")
        add_definitions(-DHAS_ASIO_SDK)
        include_directories(${CMAKE_CURRENT_SOURCE_DIR}/third_party/asio)
        
        # Ajouter les fichiers ASIO SDK si nécessaire
        # Note: L'utilisateur doit télécharger l'ASIO SDK depuis Steinberg
        # et le placer dans native/third_party/asio/
    else()
        message(STATUS "ASIO SDK not found - ASIO driver will be disabled")
        message(STATUS "To enable: Download ASIO SDK and place in native/third_party/asio/")
        message(STATUS "Then set USE_ASIO_SDK=ON in CMake")
    endif()
endif()

# WASAPI (Windows)
if(WIN32 AND BUILD_WASAPI)
    message(STATUS "WASAPI support enabled")
endif()

# CoreAudio (macOS)
if(APPLE)
    message(STATUS "CoreAudio support enabled")
    find_library(COREAUDIO_LIBRARY CoreAudio REQUIRED)
    find_library(AUDIOTOOLBOX_LIBRARY AudioToolbox REQUIRED)
    find_library(COREFOUNDATION_LIBRARY CoreFoundation REQUIRED)
    set(BUILD_COREAUDIO ON)
endif()

# PipeWire (Linux)
if(UNIX AND NOT APPLE)
    find_package(PkgConfig REQUIRED)
    pkg_check_modules(PIPEWIRE libpipewire-0.3)
    if(PIPEWIRE_FOUND)
        message(STATUS "PipeWire support enabled")
        set(BUILD_PIPEWIRE ON)
    else()
        message(STATUS "PipeWire not found - PipeWire driver will be disabled")
        message(STATUS "To enable: Install libpipewire-dev (sudo apt install libpipewire-dev)")
    endif()
endif()

# WebSocket (libwebsockets ou similaire)
# Pour MVP, on utilisera une implémentation simple avec Boost.Beast
find_package(Boost QUIET)
if(Boost_FOUND)
    message(STATUS "Boost found: ${Boost_VERSION}")
else()
    message(WARNING "Boost not found. WebSocket support may be limited.")
endif()

# Sources
set(NATIVE_SOURCES
    src/main.cpp
    src/audio_engine.cpp
    src/dsp_pipeline.cpp
    src/effect_chain.cpp
    src/effect_manager.cpp
    src/json_parser.cpp
    src/test_tone_generator.cpp
    src/websocket_server.cpp
    src/asio_driver.cpp
    src/wasapi_driver.cpp
    src/effects/distortion.cpp
    src/effects/overdrive.cpp
    src/effects/fuzz.cpp
    src/effects/chorus.cpp
    src/effects/flanger.cpp
    src/effects/tremolo.cpp
    src/effects/eq.cpp
    src/effects/delay.cpp
    src/effects/reverb.cpp
    src/ir_loader.cpp
    src/ir_convolution.cpp
    src/fft_helper.cpp
    src/buffer_pool.cpp
    src/simd_helper.cpp
    src/nam_loader.cpp
)

# Ajouter les drivers selon la plateforme
if(APPLE AND BUILD_COREAUDIO)
    list(APPEND NATIVE_SOURCES src/coreaudio_driver.cpp)
endif()

if(UNIX AND NOT APPLE AND BUILD_PIPEWIRE)
    list(APPEND NATIVE_SOURCES src/pipewire_driver.cpp)
endif()

set(NATIVE_HEADERS
    include/audio_engine.h
    include/dsp_pipeline.h
    include/effect_chain.h
    include/effect_manager.h
    include/json_parser.h
    include/test_tone_generator.h
    include/websocket_server.h
    include/asio_driver.h
    include/wasapi_driver.h
    include/audio_driver.h
    include/effect_base.h
    include/ring_buffer.h
    include/ir_loader.h
    include/ir_convolution.h
    include/fft_helper.h
    include/buffer_pool.h
    include/simd_helper.h
    include/nam_loader.h
)

# Ajouter les headers selon la plateforme
if(APPLE AND BUILD_COREAUDIO)
    list(APPEND NATIVE_HEADERS include/coreaudio_driver.h)
endif()

if(UNIX AND NOT APPLE AND BUILD_PIPEWIRE)
    list(APPEND NATIVE_HEADERS include/pipewire_driver.h)
endif()

# Include directories
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/third_party
)

# Exécutable
add_executable(webamp_native ${NATIVE_SOURCES} ${NATIVE_HEADERS})

# Link libraries
target_link_libraries(webamp_native
    PRIVATE
    Threads::Threads
)

if(WIN32)
    target_link_libraries(webamp_native PRIVATE ws2_32 winmm)
endif()

if(APPLE AND BUILD_COREAUDIO)
    target_link_libraries(webamp_native PRIVATE 
        ${COREAUDIO_LIBRARY} 
        ${AUDIOTOOLBOX_LIBRARY}
        ${COREFOUNDATION_LIBRARY}
    )
endif()

if(UNIX AND NOT APPLE AND BUILD_PIPEWIRE AND PIPEWIRE_FOUND)
    target_link_libraries(webamp_native PRIVATE ${PIPEWIRE_LIBRARIES})
    target_include_directories(webamp_native PRIVATE ${PIPEWIRE_INCLUDE_DIRS})
    target_compile_options(webamp_native PRIVATE ${PIPEWIRE_CFLAGS_OTHER})
endif()

if(Boost_FOUND)
    target_link_libraries(webamp_native PRIVATE Boost::system Boost::thread)
endif()

# Compiler flags pour optimisation temps réel
target_compile_options(webamp_native PRIVATE
    $<$<CXX_COMPILER_ID:MSVC>:/O2 /fp:fast>
    $<$<CXX_COMPILER_ID:GNU,Clang>:-O3 -ffast-math -march=native>
)

# Installation
install(TARGETS webamp_native
    RUNTIME DESTINATION bin
)

# Tests (optionnel)
option(BUILD_TESTS "Build tests" OFF)
if(BUILD_TESTS)
    enable_testing()
    add_subdirectory(tests)
endif()
