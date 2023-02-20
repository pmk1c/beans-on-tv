import Foundation

struct AuthLocalToken: Decodable {
    let token: Token
    let refreshToken: Token
}
