@echo off
REM Script de build pour Windows (Visual Studio)

echo === Build WebAmp Native Helper ===

cd native

if not exist build (
    mkdir build
)

cd build

echo Configuration CMake...
cmake .. -G "Visual Studio 17 2022" -A x64

if %ERRORLEVEL% NEQ 0 (
    echo Erreur lors de la configuration CMake
    exit /b 1
)

echo Build...
cmake --build . --config Release

if %ERRORLEVEL% NEQ 0 (
    echo Erreur lors du build
    exit /b 1
)

echo === Build termine ===
echo Executable: native\build\Release\webamp_native.exe

cd ..\..
pause

