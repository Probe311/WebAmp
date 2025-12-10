#include "websocket_server.h"
#include <iostream>
#include <thread>
#include <atomic>
#include <vector>
#include <sstream>
#include <algorithm>
#include <cstring>

#ifdef _WIN32
#include <winsock2.h>
#include <ws2tcpip.h>
#pragma comment(lib, "ws2_32.lib")
#else
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <fcntl.h>
#define SOCKET int
#define INVALID_SOCKET -1
#define SOCKET_ERROR -1
#define closesocket close
#endif

namespace webamp {

// Helper pour base64 (simplifié pour WebSocket key)
std::string base64Encode(const std::string& input) {
    const char base64_chars[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    std::string result;
    int val = 0, valb = -6;
    for (unsigned char c : input) {
        val = (val << 8) + c;
        valb += 8;
        while (valb >= 0) {
            result.push_back(base64_chars[(val >> valb) & 0x3F]);
            valb -= 6;
        }
    }
    if (valb > -6) result.push_back(base64_chars[((val << 8) >> (valb + 8)) & 0x3F]);
    while (result.size() % 4) result.push_back('=');
    return result;
}

// SHA-1 simplifié pour WebSocket (pour MVP, on utilise une version basique)
std::string sha1(const std::string& input) {
    // Pour MVP, on génère une clé simple
    // En production, utiliser une vraie implémentation SHA-1
    std::string magic = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    std::string combined = input + magic;
    
    // Hash simple (à remplacer par vrai SHA-1)
    std::string result;
    for (size_t i = 0; i < 20; ++i) {
        char c = 0;
        for (size_t j = 0; j < combined.length(); ++j) {
            c ^= combined[j] + i;
        }
        result += c;
    }
    return base64Encode(result);
}

// Parser du header HTTP pour extraire la clé WebSocket
std::string extractWebSocketKey(const std::string& request) {
    size_t keyPos = request.find("Sec-WebSocket-Key:");
    if (keyPos == std::string::npos) {
        return "";
    }
    
    size_t keyStart = request.find(" ", keyPos) + 1;
    size_t keyEnd = request.find("\r\n", keyStart);
    if (keyEnd == std::string::npos) {
        return "";
    }
    
    std::string key = request.substr(keyStart, keyEnd - keyStart);
    // Trim whitespace
    key.erase(0, key.find_first_not_of(" \t"));
    key.erase(key.find_last_not_of(" \t") + 1);
    return key;
}

// Réponse HTTP pour le handshake WebSocket
std::string createWebSocketHandshakeResponse(const std::string& key) {
    std::string acceptKey = sha1(key);
    
    std::ostringstream response;
    response << "HTTP/1.1 101 Switching Protocols\r\n";
    response << "Upgrade: websocket\r\n";
    response << "Connection: Upgrade\r\n";
    response << "Sec-WebSocket-Accept: " << acceptKey << "\r\n";
    response << "\r\n";
    return response.str();
}

// Décoder une frame WebSocket
std::string decodeWebSocketFrame(const std::vector<uint8_t>& frame) {
    if (frame.size() < 2) {
        return "";
    }
    
    bool masked = (frame[1] & 0x80) != 0;
    uint64_t payloadLen = frame[1] & 0x7F;
    
    size_t headerLen = 2;
    if (payloadLen == 126) {
        if (frame.size() < 4) return "";
        payloadLen = (frame[2] << 8) | frame[3];
        headerLen = 4;
    } else if (payloadLen == 127) {
        if (frame.size() < 10) return "";
        payloadLen = 0;
        for (int i = 0; i < 8; ++i) {
            payloadLen = (payloadLen << 8) | frame[2 + i];
        }
        headerLen = 10;
    }
    
    size_t maskOffset = headerLen;
    if (masked) {
        maskOffset += 4;
    }
    
    if (frame.size() < maskOffset + payloadLen) {
        return "";
    }
    
    std::string result;
    result.reserve(payloadLen);
    
    for (size_t i = 0; i < payloadLen; ++i) {
        uint8_t byte = frame[maskOffset + i];
        if (masked) {
            byte ^= frame[headerLen + (i % 4)];
        }
        result += static_cast<char>(byte);
    }
    
    return result;
}

// Encoder un message en frame WebSocket
std::vector<uint8_t> encodeWebSocketFrame(const std::string& message) {
    std::vector<uint8_t> frame;
    frame.push_back(0x81); // FIN + text frame
    
    size_t payloadLen = message.length();
    if (payloadLen < 126) {
        frame.push_back(static_cast<uint8_t>(payloadLen));
    } else if (payloadLen < 65536) {
        frame.push_back(126);
        frame.push_back(static_cast<uint8_t>((payloadLen >> 8) & 0xFF));
        frame.push_back(static_cast<uint8_t>(payloadLen & 0xFF));
    } else {
        frame.push_back(127);
        for (int i = 7; i >= 0; --i) {
            frame.push_back(static_cast<uint8_t>((payloadLen >> (i * 8)) & 0xFF));
        }
    }
    
    for (char c : message) {
        frame.push_back(static_cast<uint8_t>(c));
    }
    
    return frame;
}

class WebSocketServer::Impl {
public:
    Impl() : server_socket_(INVALID_SOCKET), client_socket_(INVALID_SOCKET) {
#ifdef _WIN32
        WSADATA wsaData;
        WSAStartup(MAKEWORD(2, 2), &wsaData);
#endif
    }
    
    ~Impl() {
        shutdown();
#ifdef _WIN32
        WSACleanup();
#endif
    }
    
    bool initialize(uint16_t port) {
        port_ = port;
        
        server_socket_ = socket(AF_INET, SOCK_STREAM, 0);
        if (server_socket_ == INVALID_SOCKET) {
            return false;
        }
        
        // Réutiliser l'adresse
        int opt = 1;
#ifdef _WIN32
        setsockopt(server_socket_, SOL_SOCKET, SO_REUSEADDR, (char*)&opt, sizeof(opt));
#else
        setsockopt(server_socket_, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
#endif
        
        sockaddr_in addr{};
        addr.sin_family = AF_INET;
        addr.sin_addr.s_addr = INADDR_ANY;
        addr.sin_port = htons(port);
        
        if (bind(server_socket_, (sockaddr*)&addr, sizeof(addr)) == SOCKET_ERROR) {
            closesocket(server_socket_);
            server_socket_ = INVALID_SOCKET;
            return false;
        }
        
        if (listen(server_socket_, 1) == SOCKET_ERROR) {
            closesocket(server_socket_);
            server_socket_ = INVALID_SOCKET;
            return false;
        }
        
        return true;
    }
    
    void shutdown() {
        if (client_socket_ != INVALID_SOCKET) {
            closesocket(client_socket_);
            client_socket_ = INVALID_SOCKET;
        }
        if (server_socket_ != INVALID_SOCKET) {
            closesocket(server_socket_);
            server_socket_ = INVALID_SOCKET;
        }
    }
    
    bool start() {
        return true; // Le serveur démarre dans serverThread
    }
    
    void stop() {
        shutdown();
    }
    
    bool sendMessage(const std::string& message) {
        if (client_socket_ == INVALID_SOCKET) {
            return false;
        }
        
        auto frame = encodeWebSocketFrame(message);
        int sent = send(client_socket_, (const char*)frame.data(), static_cast<int>(frame.size()), 0);
        return sent > 0;
    }
    
    bool acceptConnection() {
        if (server_socket_ == INVALID_SOCKET) {
            return false;
        }
        
        // Non-blocking accept
        fd_set readSet;
        FD_ZERO(&readSet);
        FD_SET(server_socket_, &readSet);
        
        timeval timeout{};
        timeout.tv_sec = 0;
        timeout.tv_usec = 100000; // 100ms
        
        int result = select(static_cast<int>(server_socket_) + 1, &readSet, nullptr, nullptr, &timeout);
        if (result <= 0 || !FD_ISSET(server_socket_, &readSet)) {
            return false;
        }
        
        client_socket_ = accept(server_socket_, nullptr, nullptr);
        return client_socket_ != INVALID_SOCKET;
    }
    
    bool handleHandshake() {
        if (client_socket_ == INVALID_SOCKET) {
            return false;
        }
        
        std::vector<char> buffer(4096);
        int received = recv(client_socket_, buffer.data(), static_cast<int>(buffer.size() - 1), 0);
        if (received <= 0) {
            return false;
        }
        
        buffer[received] = '\0';
        std::string request(buffer.data());
        
        std::string key = extractWebSocketKey(request);
        if (key.empty()) {
            return false;
        }
        
        std::string response = createWebSocketHandshakeResponse(key);
        send(client_socket_, response.c_str(), static_cast<int>(response.length()), 0);
        
        return true;
    }
    
    bool receiveMessage(std::string& message) {
        if (client_socket_ == INVALID_SOCKET) {
            return false;
        }
        
        // Vérifier si des données sont disponibles
        fd_set readSet;
        FD_ZERO(&readSet);
        FD_SET(client_socket_, &readSet);
        
        timeval timeout{};
        timeout.tv_sec = 0;
        timeout.tv_usec = 10000; // 10ms
        
        int result = select(static_cast<int>(client_socket_) + 1, &readSet, nullptr, nullptr, &timeout);
        if (result <= 0 || !FD_ISSET(client_socket_, &readSet)) {
            return false;
        }
        
        // Lire les 2 premiers octets pour connaître la taille
        uint8_t header[2];
        int received = recv(client_socket_, (char*)header, 2, MSG_PEEK);
        if (received < 2) {
            if (received == 0) {
                // Connexion fermée
                closesocket(client_socket_);
                client_socket_ = INVALID_SOCKET;
                if (on_connection_) {
                    on_connection_(false);
                }
            }
            return false;
        }
        
        // Calculer la taille totale de la frame
        bool masked = (header[1] & 0x80) != 0;
        uint64_t payloadLen = header[1] & 0x7F;
        size_t frameLen = 2;
        
        if (payloadLen == 126) {
            frameLen = 4;
        } else if (payloadLen == 127) {
            frameLen = 10;
        }
        if (masked) {
            frameLen += 4;
        }
        frameLen += payloadLen;
        
        // Lire la frame complète
        std::vector<uint8_t> frame(frameLen);
        received = recv(client_socket_, (char*)frame.data(), static_cast<int>(frameLen), 0);
        if (received != static_cast<int>(frameLen)) {
            return false;
        }
        
        message = decodeWebSocketFrame(frame);
        return !message.empty();
    }
    
    void setOnMessage(std::function<void(const std::string&)> handler) {
        on_message_ = handler;
    }
    
    void setOnConnection(std::function<void(bool)> handler) {
        on_connection_ = handler;
    }
    
    bool hasClient() const {
        return client_socket_ != INVALID_SOCKET;
    }
    
private:
    uint16_t port_;
    SOCKET server_socket_;
    SOCKET client_socket_;
    std::function<void(const std::string&)> on_message_;
    std::function<void(bool)> on_connection_;
};

WebSocketServer::WebSocketServer()
    : port_(8765)
    , running_(false)
    , initialized_(false)
{
    impl_ = std::make_unique<Impl>();
}

WebSocketServer::~WebSocketServer() {
    shutdown();
}

bool WebSocketServer::initialize(uint16_t port, const std::string& certPath, const std::string& keyPath) {
    if (initialized_) {
        shutdown();
    }
    
    port_ = port;
    cert_path_ = certPath;
    key_path_ = keyPath;
    
    if (!impl_->initialize(port)) {
        return false;
    }
    
    impl_->setOnMessage([this](const std::string& msg) {
        this->handleMessage(msg);
    });
    
    impl_->setOnConnection([this](bool connected) {
        if (connection_handler_) {
            connection_handler_(connected);
        }
    });
    
    initialized_ = true;
    return true;
}

void WebSocketServer::shutdown() {
    stop();
    if (impl_) {
        impl_->shutdown();
    }
    initialized_ = false;
}

bool WebSocketServer::start() {
    if (!initialized_ || running_) {
        return false;
    }
    
    if (!impl_->start()) {
        return false;
    }
    
    running_ = true;
    server_thread_ = std::thread(&WebSocketServer::serverThread, this);
    
    return true;
}

bool WebSocketServer::stop() {
    if (!running_) {
        return true;
    }
    
    running_ = false;
    
    if (impl_) {
        impl_->stop();
    }
    
    if (server_thread_.joinable()) {
        server_thread_.join();
    }
    
    return true;
}

bool WebSocketServer::sendMessage(const std::string& message) {
    if (!running_ || !impl_) {
        return false;
    }
    return impl_->sendMessage(message);
}

bool WebSocketServer::sendBinary(const void* data, size_t size) {
    // Pour MVP, on encode en texte
    // TODO: Implémenter frames binaires
    return false;
}

void WebSocketServer::serverThread() {
    while (running_) {
        // Accepter une nouvelle connexion si nécessaire
        if (!impl_->hasClient()) {
            if (impl_->acceptConnection()) {
                if (impl_->handleHandshake()) {
                    if (connection_handler_) {
                        connection_handler_(true);
                    }
                    std::cout << "Client WebSocket connecté\n";
                } else {
                    std::cerr << "Erreur lors du handshake WebSocket\n";
                }
            }
        } else {
            // Lire les messages
            std::string message;
            if (impl_->receiveMessage(message)) {
                if (message_handler_) {
                    message_handler_(message);
                }
            }
        }
        
        std::this_thread::sleep_for(std::chrono::milliseconds(1));
    }
}

void WebSocketServer::handleMessage(const std::string& message) {
    if (message_handler_) {
        message_handler_(message);
    }
}

} // namespace webamp
