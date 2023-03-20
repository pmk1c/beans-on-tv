import SwiftUI
import Combine

struct LatestEpisodesView: View {
    @StateObject private var latestEpisodesBloc = LatestEpisodesBloc()
    
    let columns = [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())]
    
    var body: some View {
        switch(latestEpisodesBloc.state) {
        case let .latestEpisodesLoaded(_, episodes):
            ScrollView {
                EpisodesGridView(episodes: episodes).padding(.horizontal, 16)
            }
            .environmentObject(latestEpisodesBloc)
            .onReceive(NotificationCenter.default.publisher(for: UIApplication.didBecomeActiveNotification)) { _ in
                latestEpisodesBloc.add(LatestEpisodesStarted())
            }
        default:
            ProgressView().onAppear {
                latestEpisodesBloc.add(LatestEpisodesStarted())
            }
        }
    }
}
