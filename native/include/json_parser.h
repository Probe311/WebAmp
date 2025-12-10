#pragma once

#include <string>
#include <map>
#include <vector>

namespace webamp {

// Parser JSON simple pour extraire les valeurs des messages WebSocket
class JsonParser {
public:
    static std::map<std::string, std::string> parse(const std::string& json);
    static std::string getString(const std::map<std::string, std::string>& data, const std::string& key, const std::string& defaultValue = "");
    static double getDouble(const std::map<std::string, std::string>& data, const std::string& key, double defaultValue = 0.0);
    static int getInt(const std::map<std::string, std::string>& data, const std::string& key, int defaultValue = 0);
    static bool getBool(const std::map<std::string, std::string>& data, const std::string& key, bool defaultValue = false);
    
private:
    static void skipWhitespace(const std::string& json, size_t& pos);
    static std::string parseString(const std::string& json, size_t& pos);
    static std::string parseValue(const std::string& json, size_t& pos);
};

} // namespace webamp

