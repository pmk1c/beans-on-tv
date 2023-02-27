import SwiftUI

struct LatestEpisodesView: View {
    @StateObject private var latestEpisodesBloc = LatestEpisodesBloc()
    
    let columns = [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())]
    
    var body: some View {
        switch(latestEpisodesBloc.state) {
        case let state as LatestEpisodesLoaded:
            ScrollView {
                EpisodesGridView(episodes: state.episodes).padding(.horizontal, 16)
            }.environmentObject(latestEpisodesBloc)
        default:
            ProgressView().onAppear {
                latestEpisodesBloc.add(LatestEpisodesStarted())
            }
        }
    }
}
