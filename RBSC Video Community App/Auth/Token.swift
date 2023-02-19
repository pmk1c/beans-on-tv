import Foundation

struct Token: Codable {
    let token: String
    let validUntil: Date?
    let type: Int
    let uid: Int
}
