import SwiftUI

struct LatestEpisodesView: View {
    var token: Token
    
    @StateObject private var viewModel = LatestEpisodesViewModel()
    
    let columns = [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())]
    
    var body: some View {
        switch(viewModel.state) {
        case .idle:
            Color.clear.onAppear { Task { await viewModel.load() } }
        case .loading:
            ProgressView()
        case .loaded(let episodes):
            Text("Neueste Videos").font(.title)
            EpisodesGridView(token: token, episodes: episodes)
        case .failed(let error):
            Text(error.localizedDescription)
        }
    }
}
