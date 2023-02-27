import Foundation

struct PaginatedBohnenEpisodes: Decodable {
    let pagination: Pagination
    let data: BohnenEpisodes
}

