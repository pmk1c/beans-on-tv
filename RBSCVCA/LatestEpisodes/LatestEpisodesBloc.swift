import Foundation

protocol LatestEpisodesEvent {}

struct LatestEpisodesStarted: LatestEpisodesEvent {}

struct LatestEpisodesEpisodeAppeared: LatestEpisodesEvent {
    let episode: Episode
}

enum LatestEpisodesState: Equatable {
    case latestEpisodesInitial
    case latestEpisodesLoaded(pages: [Page], episodes: [Episode])
}

extension LatestEpisodesState {
    init(_ pages: [Page]) {
        let episodes = pages.flatMap { $0.episodes }
        self = .latestEpisodesLoaded(pages: pages, episodes: episodes)
    }
}

class LatestEpisodesBloc: Bloc<LatestEpisodesEvent, LatestEpisodesState> {
    let latestEpisodesRepository = LatestEpisodesRepository()
    
    init() {
        super.init(.latestEpisodesInitial)
    }
    
    func on(event: LatestEpisodesStarted) async throws {
        let page = try await latestEpisodesRepository.fetchPage(number: 0)
        emit(.init([page]))
    }
    
    func on(event: LatestEpisodesEpisodeAppeared) async throws {
        guard case let .latestEpisodesLoaded(pages, _) = state else { return }
        
        let lastPage = pages.last!
        if (event.episode == lastPage.episodes.last) {
            let nextPageNumber = lastPage.number + 1
            let nextPage = try await latestEpisodesRepository.fetchPage(number: nextPageNumber)
            var newPages = pages
            newPages.append(nextPage)
            emit(.init(newPages))
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
