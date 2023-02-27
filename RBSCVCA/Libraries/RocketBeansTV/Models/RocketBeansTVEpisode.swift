import Foundation

extension RocketBeansTV {
    struct Episode: Decodable {
        let id: Int
        let title: String
        let thumbnail: [Thumbnail]
        let tokens: [EpisodeToken]
    }
}
