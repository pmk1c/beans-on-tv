import Foundation

struct Episode: Decodable, Hashable {
    let id: Int
    let title: String
    let thumbnail: [Thumbnail]
    let tokens: [EpisodeToken]
    
    static func == (lhs: Episode, rhs: Episode) -> Bool {
        return lhs.id == rhs.id
    }
    
    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}

