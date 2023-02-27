import Foundation

protocol LatestEpisodesEvent {}

struct LatestEpisodesStarted: LatestEpisodesEvent {}

struct LatestEpisodesEpisodeAppeared: LatestEpisodesEvent {
    let episode: Episode
}

protocol LatestEpisodesState {}

struct LatestEpisodesInitial: LatestEpisodesState {}

struct LatestEpisodesLoaded: LatestEpisodesState {
    let pages: [Page]
    
    var episodes: [Episode] {
        pages.flatMap { $0.episodes }
    }
}

class LatestEpisodesBloc: Bloc<LatestEpisodesEvent, LatestEpisodesState> {
    let latestEpisodesRepository = LatestEpisodesRepository()
    
    init() {
        super.init(LatestEpisodesInitial())
    }
    
    func on(event: LatestEpisodesStarted) async throws {
        let page = try await latestEpisodesRepository.fetchPage(number: 0)
        emit(LatestEpisodesLoaded(pages: [page]))
    }
    
    func on(event: LatestEpisodesEpisodeAppeared) async throws {
        guard let state = state as? LatestEpisodesLoaded else { return }
        
        let lastPage = state.pages.last!
        if (event.episode == lastPage.episodes.last) {
            let nextPageNumber = lastPage.number + 1
            let nextPage = try await latestEpisodesRepository.fetchPage(number: nextPageNumber)
            var newPages = state.pages
            newPages.append(nextPage)
            emit(LatestEpisodesLoaded(pages: newPages))
        }
    }
    
    override func on(event: LatestEpisodesEvent) async throws {
        switch(event) {
        case let event as LatestEpisodesStarted:
            try await on(event: event)
        case let event as LatestEpisodesEpisodeAppeared:
            try await on(event: event)
        default:
            try await super.on(event: event)
        }
    }
}
