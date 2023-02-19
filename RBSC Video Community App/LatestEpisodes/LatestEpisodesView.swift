import SwiftUI

struct LatestEpisodesView: View {
    @StateObject private var viewModel = LatestEpisodesViewModel()
    
    let columns = [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())]
    
    var body: some View {
        switch(viewModel.state) {
        case .idle:
            ProgressView().onAppear {  Task { await viewModel.load() } }
        case .loading:
            ProgressView()
        case .loaded(let episodes):
            ScrollView {
                Text("Neueste Videos").font(.custom("Rubik-Light_Bold", size: 48)).shadow(color: .black, radius: 0.5, x: 2, y: 2).frame(maxWidth: .infinity, alignment: .leading).padding(.horizontal, 16)
                EpisodesGridView(episodes: episodes).padding(.horizontal, 16)
            }
        case .failed(let error):
            Text(error.localizedDescription)
        }
    }
}
