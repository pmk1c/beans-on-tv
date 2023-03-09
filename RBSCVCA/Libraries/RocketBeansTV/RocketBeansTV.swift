import Foundation

struct RocketBeansTV {
    let token: Token?
    let baseUrl = URL(string: "https://api.rocketbeans.tv/v1")!
    
    func fetchNewestEpisodes(limit: Int, offset: Int) async throws -> PaginatedBohnenEpisodes {
        var url = baseUrl
            .appending(path: "/media/episode/preview/newest")
            .appending(queryItems: [
                URLQueryItem(name: "limit", value: limit.formatted()),
                URLQueryItem(name: "offset", value: offset.formatted())
            ])
        let (data, _) = try await URLSession.shared.data(from: url)
        let paginatedEpisodes: PaginatedBohnenEpisodes = try JSONDecoder().decode(PaginatedBohnenEpisodes.self, from: data)
        
        return paginatedEpisodes
    }
    
    func fetchRBSCVideoToken(rbscToken: String) async throws -> VideoTokenResponse {
        guard let token = token else { throw Failure.noToken }
        
        let url = baseUrl
            .appending(path: "/rbsc/video/token")
            .appending(path: rbscToken)
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token.accessToken)", forHTTPHeaderField: "Authorization")
        let (result, _) = try await URLSession.shared.data(for: request)
        let videoTokenResponse: VideoTokenResponse = try! JSONDecoder().decode(VideoTokenResponse.self, from: result)
        
        return videoTokenResponse
    }
}
