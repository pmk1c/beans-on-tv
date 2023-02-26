import Foundation
import Combine

struct SecureStorage {
    static let secClass = kSecClassGenericPassword
    static let dateEncodingStrategy = kSecClassGenericPassword
    
    static func store(key: String, value: Codable) async throws {
        var json: Data
        do {
            json = try JSONEncoder().encode(value)
        } catch {
            throw SecureStorageError.unhandledError(error: error)
        }
        
        let query: [String: Any] = [
            kSecClass as String: secClass,
            kSecAttrService as String: key,
        ]
        let attrs: [String: Any] = [
            kSecValueData as String: json,
        ]
        
        var status = SecItemAdd((query + attrs) as CFDictionary, nil)
        if (status == errSecDuplicateItem) {
            status = SecItemUpdate(query as CFDictionary, attrs as CFDictionary)
        }
        
        guard status == errSecSuccess else { throw SecureStorageError.unhandledSecItemError(status: status) }
    }
    
    static func get<T: Codable>(key: String) async throws -> T {
        let query: [String: Any] = [
            kSecClass as String: secClass,
            kSecAttrService as String: key,
            kSecMatchLimit as String: kSecMatchLimitOne,
            kSecReturnData as String: true
        ]
        
        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        guard status != errSecItemNotFound else { throw SecureStorageError.keyNotFound }
        guard status == errSecSuccess else { throw SecureStorageError.unhandledSecItemError(status: status) }
        guard let data = item as? Data else { throw SecureStorageError.unexpectedTokenData }
        
        var value: T
        do {
            value = try JSONDecoder().decode(T.self, from: data)
        } catch {
            throw SecureStorageError.unhandledError(error: error)
        }
        
        return value
    }
    
    static func delete(key: String) async throws {
        let query: [String: Any] = [
            kSecClass as String: secClass,
            kSecAttrService as String: key
        ]
        
        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else { throw SecureStorageError.unhandledSecItemError(status: status) }
    }
}
