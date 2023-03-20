import Foundation
import Combine

protocol RBSCVideoTokenEvent {}

struct RBSCVideoTokenStarted: RBSCVideoTokenEvent {
    let rbscToken: String
}

enum RBSCVideoTokenState: Equatable {
    case initial
    case fetched(videoToken: String)
}

class RBSCVideoTokenBloc: Bloc<RBSCVideoTokenEvent, RBSCVideoTokenState> {
    let rbtv: RocketBeansTV
    
    init(token: Token) {
        rbtv = RocketBeansTV(token: token)
        super.init(.initial)
    }
    
    func on(event: RBSCVideoTokenStarted) async throws {
        let token = try await rbtv.fetchRBSCVideoToken(rbscToken: event.rbscToken)
        emit(.fetched(videoToken: token.data.signedToken))
    }
    
    override func on(event: RBSCVideoTokenEvent) async throws {
        switch(event) {
        case let event as RBSCVideoTokenStarted:
            try await on(event: event)
        default:
            try await super.on(event: event)
        }
    }
}
