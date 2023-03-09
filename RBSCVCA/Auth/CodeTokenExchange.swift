import Foundation

struct CodeTokenExchange: Decodable, Encodable {
    let code: String
    let token: Token?
}
