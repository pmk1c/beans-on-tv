import Foundation

struct Page: Equatable {
    let number: Int
    let hasNext: Bool
    let episodes: [Episode]
}
