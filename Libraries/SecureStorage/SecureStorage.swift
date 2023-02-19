import Foundation
import Combine

struct SecureStorage {
    static let secClass = kSecClassGenericPassword
    static let dateEncodingStrategy = kSecClassGenericPassword
    
    static func store(key: String, value: Codable) -> Future<Void, SecureStorageError> {
        return Future() { promise in
            DispatchQueue.main.async {
                var json: Data
                do {
                    json = try JSONEncoder().encode(value)
                } catch {
                    promise(.failure(.unhandledError(error: error)))
                    return
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
                
                guard status == errSecSuccess else {
                    promise(.failure(.unhandledSecItemError(status: status)))
                    return
                }
                
                promise(.success(()))
            }
        }
    }
    
    static func get<T: Codable>(key: String) -> Future<T, SecureStorageError> {
        return Future() { promise in
            DispatchQueue.main.async {
                let query: [String: Any] = [
                    kSecClass as String: secClass,
                    kSecAttrService as String: key,
                    kSecMatchLimit as String: kSecMatchLimitOne,
                    kSecReturnData as String: true
                ]
                
                var item: CFTypeRef?
                let status = SecItemCopyMatching(query as CFDictionary, &item)
                guard status != errSecItemNotFound else {
                    promise(.failure(.keyNotFound))
                    return
                }
                guard status == errSecSuccess else {
                    promise(.failure(.unhandledSecItemError(status: status)))
                    return
                }
                
                guard let data = item as? Data else {
                    promise(.failure(.unexpectedTokenData))
                    return
                }
                
                var value: T
                do {
                    value = try JSONDecoder().decode(T.self, from: data)
                } catch {
                    promise(.failure(.unhandledError(error: error)))
                    return
                }
                
                promise(.success(value))
            }
        }
    }
    
    static func delete(key: String) -> Future<Void, SecureStorageError> {
        return Future() { promise in
            DispatchQueue.main.async {
                let query: [String: Any] = [
                    kSecClass as String: secClass,
                    kSecAttrService as String: key
                ]
                
                let status = SecItemDelete(query as CFDictionary)
                guard status == errSecSuccess || status == errSecItemNotFound else {
                    promise(.failure(.unhandledSecItemError(status: status)))
                    return
                }
                
                promise(.success(()))
            }
        }
    }
}
