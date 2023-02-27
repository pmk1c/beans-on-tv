import Foundation

struct Episode: Hashable, Identifiable {
    let id: Int
    let title: String
    let thumbnailUrl: URL
    let youtubeId: String
    let rbscToken: String?
    
    init(episode: RocketBeansTV.Episode) {
        id = episode.id
        title = episode.title
        thumbnailUrl = URL(string: episode.thumbnail.first { $0.name == "small" }!.url)!
        youtubeId = episode.tokens.first { $0.type == "youtube" }!.token
        rbscToken = episode.tokens.first { $0.type == "rbsc" }?.token
    }
}
