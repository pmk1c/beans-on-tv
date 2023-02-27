import Foundation

struct Pagination: Decodable {
    let offset: Int
    let limit: Int
    let total: Int
}

