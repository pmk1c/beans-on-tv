import Foundation

struct Token: Codable, Equatable {
    let accessToken: String
    let tokenType: String
    let expiresIn: Date
    let refreshToken: String
    let userId: Int
    let displayName: String
}
