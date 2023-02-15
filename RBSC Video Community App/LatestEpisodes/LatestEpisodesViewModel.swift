import Foundation

class LatestEpisodesViewModel: ObservableObject {
    enum State {
            case idle
            case loading
            case failed(Error)
            case loaded([Episode])
        }
    
    @Published private(set) var state = State.idle
    
    func load() async {
        state = .loading
        
        do {
            let url = URL(string: "https://api.rocketbeans.tv/v1/media/episode/preview/newest")!
            let (data, _) = try await URLSession.shared.data(from: url)
            let paginatedEpisodes: PaginatedBohnenEpisodes = try JSONDecoder().decode(PaginatedBohnenEpisodes.self, from: data)
            
            state = .loaded(paginatedEpisodes.data.episodes)
        } catch {
            state = .failed(error)
        }
    }
}
