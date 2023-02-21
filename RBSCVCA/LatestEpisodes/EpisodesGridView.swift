import SwiftUI

struct EpisodesGridView: View {
    var episodes: [Episode]
    
    let columns = [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())]
    
    var body: some View {
        LazyVGrid(columns: columns) {
            ForEach(episodes, id: \.self.title) { episode in
                EpisodeCard(episode: episode)
            }
        }
    }
}

struct EpisodesGridView_Previews: PreviewProvider {
    static let episode1 = Episode(id: 1, title: "Wird 2023 das Jahr von Nintendo? | GameTalk", thumbnail: [Thumbnail(url: "https://rocketbeans.tv/cdn-cgi/imagedelivery/wiXHaYounWItGQ2BJaXH2w/479b1c32-c0d5-411d-861c-08991b975400/0x360")], tokens: [])
    static let episode2 = Episode(id: 2, title: "Wird 2024 das Jahr von Nintendo? | GameTalk", thumbnail: [Thumbnail(url: "https://rocketbeans.tv/cdn-cgi/imagedelivery/wiXHaYounWItGQ2BJaXH2w/479b1c32-c0d5-411d-861c-08991b975400/0x360")], tokens: [])
    static let episode3 = Episode(id: 3, title: "Wird 2025 das Jahr von Nintendo? | GameTalk", thumbnail: [Thumbnail(url: "https://rocketbeans.tv/cdn-cgi/imagedelivery/wiXHaYounWItGQ2BJaXH2w/479b1c32-c0d5-411d-861c-08991b975400/0x360")], tokens: [])
    static let episode4 = Episode(id: 4, title: "Wird 2026 das Jahr von Nintendo? | GameTalk", thumbnail: [Thumbnail(url: "https://rocketbeans.tv/cdn-cgi/imagedelivery/wiXHaYounWItGQ2BJaXH2w/479b1c32-c0d5-411d-861c-08991b975400/0x360")], tokens: [])
    static let episode5 = Episode(id: 5, title: "Wird 2027 das Jahr von Nintendo? | GameTalk", thumbnail: [Thumbnail(url: "https://rocketbeans.tv/cdn-cgi/imagedelivery/wiXHaYounWItGQ2BJaXH2w/479b1c32-c0d5-411d-861c-08991b975400/0x360")], tokens: [])
    static let episode6 = Episode(id: 6, title: "Wird 2028 das Jahr von Nintendo? | GameTalk", thumbnail: [Thumbnail(url: "https://rocketbeans.tv/cdn-cgi/imagedelivery/wiXHaYounWItGQ2BJaXH2w/479b1c32-c0d5-411d-861c-08991b975400/0x360")], tokens: [])
    
    static var previews: some View {
        EpisodesGridView(episodes: [episode1, episode2, episode3, episode4, episode5, episode6])
    }
}
