//
//  LatestEpisodesView.swift
//  RBSC Video Community App
//
//  Created by Ruben Grimm on 12.02.23.
//

import SwiftUI

struct LatestEpisodesView: View {
    @State private var episodesResult: Result<[Episode], Error>?
    
    let columns = [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())]
    
    var body: some View {
        switch(episodesResult) {
        case .success(let episodes):
            ScrollView {
                LazyVGrid(columns: columns) {
                    ForEach(episodes, id: \.self.title) { episode in
                        NavigationLink {
                            Text(episode.title)
                        } label: {
                            VStack {
                                AsyncImage(url: URL(string: episode.thumbnail.first!.url)) { phase in
                                    if let image = phase.image {
                                        image.resizable().aspectRatio(contentMode: .fit)
                                    } else if phase.error != nil {
                                        Color.red
                                    } else {
                                        Color.blue
                                    }
                                }
                                Text(episode.title).lineLimit(1)
                            }
                        }
                    }
                }
            }
        case .failure(let error):
            Text(error.localizedDescription)
        case nil:
            ProgressView().onAppear {Task {
                try await self.fetchLatestEpisodes()
            }}
        }
    }
    
    func fetchLatestEpisodes() async throws {
        let url = URL(string: "https://api.rocketbeans.tv/v1/media/episode/preview/newest")!
        
        let (data, _) = try await URLSession.shared.data(from: url)
        let paginatedEpisodes: PaginatedBohnenEpisodes = try! JSONDecoder().decode(PaginatedBohnenEpisodes.self, from: data)
        
        self.episodesResult = Result.success(paginatedEpisodes.data.episodes)
    }
}

struct LatestEpisodesView_Previews: PreviewProvider {
    static var previews: some View {
        LatestEpisodesView()
    }
}
