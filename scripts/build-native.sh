#!/bin/bash
# Script de build pour macOS/Linux

echo "=== Build WebAmp Native Helper ==="

cd native

if [ ! -d "build" ]; then
    mkdir build
fi

cd build

echo "Configuration CMake..."
cmake .. -DCMAKE_BUILD_TYPE=Release

if [ $? -ne 0 ]; then
    echo "Erreur lors de la configuration CMake"
    exit 1
fi

echo "Build..."
cmake --build .

if [ $? -ne 0 ]; then
    echo "Erreur lors du build"
    exit 1
fi

echo "=== Build terminé ==="
echo "Exécutable: native/build/webamp_native"

cd ../..

