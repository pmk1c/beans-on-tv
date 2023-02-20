import Foundation
import Combine

class AuthTokenBloc: ObservableObject {
    enum State {
        case unknown
        case unauthenticated
        case authenticated(accessToken: Token, refreshToken: Token)
    }
    
    @Published var state: State = .unknown
    
    let accessTokenKey = "accessToken-1"
    let refreshTokenKey = "refreshToken-1"
    
    func load() async {
        do {
            let accessToken: Token = try await SecureStorage.get(key: accessTokenKey).value
            let refreshToken: Token = try await SecureStorage.get(key: refreshTokenKey).value
            await MainActor.run {
                state = .authenticated(accessToken: accessToken, refreshToken: refreshToken)
            }
        } catch SecureStorageError.keyNotFound {
            await MainActor.run {
                state = .unauthenticated
            }
        } catch {
            await MainActor.run {
                print("Error: \(error)")
                state = .unauthenticated
                
            }
        }
    }
    
    func store(accessToken: Token, refreshToken: Token) async {
        do {
            try await SecureStorage.store(key: accessTokenKey, value: accessToken).value
            try await SecureStorage.store(key: refreshTokenKey, value: refreshToken).value
            await MainActor.run {
                state = .authenticated(accessToken: accessToken, refreshToken: refreshToken)
            }
        } catch {
            await MainActor.run {
                print("Error: \(error)")
                state = .unauthenticated
            }
        }
    }
    
    func delete() async {
        do {
            try await SecureStorage.delete(key: accessTokenKey).value
            try await SecureStorage.delete(key: refreshTokenKey).value
            await MainActor.run {
                state = .unauthenticated
            }
        } catch {
            await MainActor.run {
                print("Error: \(error)")
                state = .unauthenticated
            }
        }
    }
}
