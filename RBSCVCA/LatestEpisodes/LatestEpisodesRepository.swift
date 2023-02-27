import Foundation

struct LatestEpisodesRepository {
    let episodesPerPage = 25
    
    let rbtv = RocketBeansTV()
    
    func fetchPage(number: Int) async throws -> Page {
        let offset = number * episodesPerPage
        let response = try await rbtv.fetchNewestEpisodes(limit: episodesPerPage, offset: offset)
        
        let hasNext = response.pagination.total > offset + episodesPerPage
        let episodes = response.data.episodes.map { Episode(episode: $0) }
        return Page(number: number, hasNext: hasNext, episodes: episodes)
    }
}
