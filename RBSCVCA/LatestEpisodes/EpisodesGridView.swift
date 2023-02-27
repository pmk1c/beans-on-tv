import SwiftUI

struct EpisodesGridView: View {
    @EnvironmentObject var latestEpisodesBloc: LatestEpisodesBloc
    var episodes: [Episode]
    
    let columns = [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())]
    
    var body: some View {
        LazyVGrid(columns: columns) {
            ForEach(episodes) { episode in
                EpisodeCardView(episode: episode).onAppear {
                    latestEpisodesBloc.add(LatestEpisodesEpisodeAppeared(episode: episode))
                }
            }
        }
    }
}
