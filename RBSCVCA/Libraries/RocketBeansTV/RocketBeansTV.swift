import Foundation

struct RocketBeansTV {
    func fetchNewestEpisodes(limit: Int, offset: Int) async throws -> PaginatedBohnenEpisodes {
        do {
            let url = URL(string: "https://api.rocketbeans.tv/v1/media/episode/preview/newest?limit=\(limit)&offset=\(offset)")!
            let (data, _) = try await URLSession.shared.data(from: url)
            let paginatedEpisodes: PaginatedBohnenEpisodes = try JSONDecoder().decode(PaginatedBohnenEpisodes.self, from: data)
            
            return paginatedEpisodes
        } catch {
            throw RocketBeansTV.Failure.unknownError(error: error)
        }
    }
}
