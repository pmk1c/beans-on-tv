import Foundation

enum SecureStorageError: Error {
    case keyNotFound
    case unexpectedTokenData
    case unhandledError(error: Error)
    case unhandledSecItemError(status: OSStatus)
}
