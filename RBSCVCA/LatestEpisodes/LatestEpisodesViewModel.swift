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
        await MainActor.run {
            state = .loading
        }
        
        do {
            let url = URL(string: "https://api.rocketbeans.tv/v1/media/episode/preview/newest?limit=50")!
            let (data, _) = try await URLSession.shared.data(from: url)
            let paginatedEpisodes: PaginatedBohnenEpisodes = try JSONDecoder().decode(PaginatedBohnenEpisodes.self, from: data)
            
            
            await MainActor.run {
                state = .loaded(paginatedEpisodes.data.episodes)
            }
        } catch {
            await MainActor.run {
                state = .failed(error)
            }
        }
    }
}
