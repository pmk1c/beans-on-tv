import Foundation

extension RocketBeansTV {
    struct PaginatedBohnenEpisodes: Decodable {
        let pagination: Pagination
        let data: BohnenEpisodes
    }
}
