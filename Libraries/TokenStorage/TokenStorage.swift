import Foundation
import Combine

struct TokenStorage {
    enum TokenStorageError: Error {
        case noToken
        case unexpectedTokenData
        case unhandledError(status: OSStatus)
    }
    
    static let secAttrLabel = "Token"
    static let secClass = kSecClassGenericPassword
    
    static func store(token: Token) -> Future<Void, TokenStorageError> {
        return Future() { promise in
            DispatchQueue.main.async {
                let attrs: [String: Any] = [
                    kSecClass as String: secClass,
                    kSecAttrLabel as String: secAttrLabel,
                    kSecValueData as String: token.token.data(using: .utf8)!,
                ]
                
                let status = SecItemAdd(attrs as CFDictionary, nil)
                guard status == errSecSuccess else {
                    promise(.failure(.unhandledError(status: status)))
                    return
                }
                
                promise(.success(()))
            }
        }
    }
    
    static func load() -> Future<Token?, TokenStorageError> {
        return Future() { promise in
            DispatchQueue.main.async {
                let query: [String: Any] = [
                    kSecClass as String: secClass,
                    kSecAttrLabel as String: secAttrLabel,
                    kSecMatchLimit as String: kSecMatchLimitOne,
                    kSecReturnData as String: true
                ]
                
                var item: CFTypeRef?
                let status = SecItemCopyMatching(query as CFDictionary, &item)
                guard status != errSecItemNotFound else {
                    promise(.failure(.noToken))
                    return
                }
                guard status == errSecSuccess else {
                    promise(.failure(.unhandledError(status: status)))
                    return
                }
                
                guard
                    let data = item as? Data,
                    let token = String(data: data, encoding: .utf8)
                else {
                    promise(.failure(.unexpectedTokenData))
                    return
                }
                
                promise(.success(Token(token: token)))
            }
        }
    }
    
    static func delete() -> Future<Void, TokenStorageError> {
        return Future() { promise in
            DispatchQueue.main.async {
                let query: [String: Any] = [
                    kSecClass as String: secClass,
                    kSecAttrLabel as String: secAttrLabel
                ]
                
                let status = SecItemDelete(query as CFDictionary)
                guard status == errSecSuccess || status == errSecItemNotFound else {
                    promise(.failure(.unhandledError(status: status)))
                    return
                }
                
                promise(.success(()))
            }
        }
    }
}
