import Foundation
import Combine

protocol AuthenticationEvent {}

struct AuthenticationStarted: AuthenticationEvent {}

struct AuthenticationTokenFetched: AuthenticationEvent {
    let accessToken: Token
    let refreshToken: Token
}

struct AuthenticationSignOutPressed: AuthenticationEvent {}

enum AuthenticationState: Equatable {
    case initial
    case unauthenticated
    case authenticated(accessToken: Token, refreshToken: Token)
    
    
    static func == (lhs: AuthenticationState, rhs: AuthenticationState) -> Bool {
        switch((lhs, rhs)) {
        case (
            .authenticated(let lhsAccessToken, let lhsRefreshToken),
            .authenticated(let rhsAccessToken, let rhsRefreshToken)
        ):
            return lhsAccessToken.token == rhsAccessToken.token && lhsRefreshToken.token == rhsRefreshToken.token
        default:
            return lhs == rhs
        }
    }
    
}

class AuthenticationBloc: Bloc<AuthenticationEvent, AuthenticationState> {
    let accessTokenKey = "accessToken-1"
    let refreshTokenKey = "refreshToken-1"
    
    init() {
        super.init(.initial)
    }
    
    func on(event: AuthenticationStarted) async throws {
        do {
            let accessToken: Token = try await SecureStorage.get(key: accessTokenKey)
            let refreshToken: Token = try await SecureStorage.get(key: refreshTokenKey)
            emit(.authenticated(accessToken: accessToken, refreshToken: refreshToken))
        } catch SecureStorageError.keyNotFound {
            emit(.unauthenticated)
        }
    }
    
    func on(event: AuthenticationTokenFetched) async throws {
        try await SecureStorage.store(key: accessTokenKey, value: event.accessToken)
        try await SecureStorage.store(key: refreshTokenKey, value: event.refreshToken)
        emit(.authenticated(accessToken: event.accessToken, refreshToken: event.refreshToken))
    }
    
    func on(event: AuthenticationSignOutPressed) async throws {
        try await SecureStorage.delete(key: accessTokenKey)
        try await SecureStorage.delete(key: refreshTokenKey)
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
