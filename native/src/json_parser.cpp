#include "json_parser.h"
#include <cctype>
#include <sstream>
#include <iomanip>

namespace webamp {

void JsonParser::skipWhitespace(const std::string& json, size_t& pos) {
    while (pos < json.length() && std::isspace(static_cast<unsigned char>(json[pos]))) {
        ++pos;
    }
}

std::string JsonParser::parseString(const std::string& json, size_t& pos) {
    if (pos >= json.length() || json[pos] != '"') {
        return "";
    }
    ++pos; // Skip opening quote
    
    std::string result;
    bool escaped = false;
    
    while (pos < json.length()) {
        char c = json[pos];
        
        if (escaped) {
            if (c == 'n') result += '\n';
            else if (c == 't') result += '\t';
            else if (c == 'r') result += '\r';
            else if (c == '\\') result += '\\';
            else if (c == '"') result += '"';
            else result += c;
            escaped = false;
        } else if (c == '\\') {
            escaped = true;
        } else if (c == '"') {
            ++pos; // Skip closing quote
            return result;
        } else {
            result += c;
        }
        ++pos;
    }
    
    return result;
}

std::string JsonParser::parseValue(const std::string& json, size_t& pos) {
    skipWhitespace(json, pos);
    
    if (pos >= json.length()) {
        return "";
    }
    
    if (json[pos] == '"') {
        return parseString(json, pos);
    }
    
    // Parse number or boolean or null
    size_t start = pos;
    while (pos < json.length() && 
           (std::isdigit(static_cast<unsigned char>(json[pos])) || 
            json[pos] == '.' || json[pos] == '-' || json[pos] == '+' ||
            json[pos] == 'e' || json[pos] == 'E' ||
            json[pos] == 't' || json[pos] == 'r' || json[pos] == 'u' || json[pos] == 'e' || json[pos] == 'f' ||
            json[pos] == 'a' || json[pos] == 'l' || json[pos] == 's' || json[pos] == 'n')) {
        ++pos;
    }
    
    return json.substr(start, pos - start);
}

std::map<std::string, std::string> JsonParser::parse(const std::string& json) {
    std::map<std::string, std::string> result;
    
    size_t pos = 0;
    skipWhitespace(json, pos);
    
    if (pos >= json.length() || json[pos] != '{') {
        return result;
    }
    ++pos; // Skip opening brace
    
    while (pos < json.length()) {
        skipWhitespace(json, pos);
        
        if (pos >= json.length()) break;
        
        if (json[pos] == '}') {
            break;
        }
        
        // Parse key
        std::string key = parseString(json, pos);
        if (key.empty()) {
            break;
        }
        
        skipWhitespace(json, pos);
        
        if (pos >= json.length() || json[pos] != ':') {
            break;
        }
        ++pos; // Skip colon
        
        skipWhitespace(json, pos);
        
        // Parse value
        std::string value = parseValue(json, pos);
        
        result[key] = value;
        
        skipWhitespace(json, pos);
        
        if (pos >= json.length()) break;
        
        if (json[pos] == ',') {
            ++pos; // Skip comma
        } else if (json[pos] == '}') {
            break;
        }
    }
    
    return result;
}

std::string JsonParser::getString(const std::map<std::string, std::string>& data, const std::string& key, const std::string& defaultValue) {
    auto it = data.find(key);
    if (it != data.end()) {
        return it->second;
    }
    return defaultValue;
}

double JsonParser::getDouble(const std::map<std::string, std::string>& data, const std::string& key, double defaultValue) {
    auto it = data.find(key);
    if (it != data.end()) {
        try {
            return std::stod(it->second);
        } catch (...) {
            return defaultValue;
        }
    }
    return defaultValue;
}

int JsonParser::getInt(const std::map<std::string, std::string>& data, const std::string& key, int defaultValue) {
    auto it = data.find(key);
    if (it != data.end()) {
        try {
            return std::stoi(it->second);
        } catch (...) {
            return defaultValue;
        }
    }
    return defaultValue;
}

bool JsonParser::getBool(const std::map<std::string, std::string>& data, const std::string& key, bool defaultValue) {
    auto it = data.find(key);
    if (it != data.end()) {
        const std::string& value = it->second;
        if (value == "true") return true;
        if (value == "false") return false;
    }
    return defaultValue;
}

} // namespace webamp

