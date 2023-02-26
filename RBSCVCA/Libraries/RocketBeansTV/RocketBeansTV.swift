import Foundation
import Combine

struct RocketBeansTV {
    func fetchNewestEpisodes() -> any Publisher<[Episode], RocketBeansTVError> {
        let url = URL(string: "https://api.rocketbeans.tv/v1/media/episode/preview/newest?limit=50")!
        let decoder = JSONDecoder()
        
        return URLSession.shared.dataTaskPublisher(for: url)
            .map { $0.data }
            .decode(type: PaginatedBohnenEpisodes.self, decoder: decoder)
            .map { $0.data.episodes }
            .mapError { RocketBeansTVError.unknownError(error: $0) }
            .eraseToAnyPublisher()
    }
}
