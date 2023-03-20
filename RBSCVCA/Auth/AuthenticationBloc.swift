import Foundation
import Combine

protocol AuthenticationEvent {}

struct AuthenticationStarted: AuthenticationEvent {}

struct AuthenticationTokenFetched: AuthenticationEvent {
    let token: Token
}

struct AuthenticationSignOutPressed: AuthenticationEvent {}

enum AuthenticationState: Equatable {
    case initial
    case unauthenticated
    case authenticated(token: Token)
}

class AuthenticationBloc: Bloc<AuthenticationEvent, AuthenticationState> {
    let tokenKey = "token-1"
    
    init() {
        super.init(.initial)
    }
    
    func on(event: AuthenticationStarted) async throws {
        do {
            let token: Token = try await SecureStorage.get(key: tokenKey)
            emit(.authenticated(token: token))
        } catch SecureStorageError.keyNotFound {
            emit(.unauthenticated)
        }
    }
    
    func on(event: AuthenticationTokenFetched) async throws {
        try await SecureStorage.store(key: tokenKey, value: event.token)
        emit(.authenticated(token: event.token))
    }
    
    func on(event: AuthenticationSignOutPressed) async throws {
        try await SecureStorage.delete(key: tokenKey)
        emit(.unauthenticated)
    }
    
    override func on(event: AuthenticationEvent) async throws {
        switch(event) {
        case let event as AuthenticationStarted:
            try await on(event: event)
        case let event as AuthenticationTokenFetched:
            try await on(event: event)
        case let event as AuthenticationSignOutPressed:
            try await on(event: event)
        default:
            try await super.on(event: event)
        }
    }
}
