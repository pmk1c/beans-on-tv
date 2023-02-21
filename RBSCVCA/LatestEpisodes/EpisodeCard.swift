import SwiftUI

struct EpisodeCard: View {
    let episode: Episode
    @FocusState private var focused: Bool
    
    var body: some View {
        VStack {
            NavigationLink(value: episode, label: {
                AsyncImage(url: URL(string: episode.thumbnail.first!.url)) { phase in
                    if let image = phase.image {
                        image.resizable().scaledToFill()
                    } else {
                        Image(uiImage: UIImage(named: "Placeholder 16x9")!)
                    }
                }
            })
            .buttonStyle(.card)
            .focused($focused)
            Text(episode.title)
                .lineLimit(1)
                .padding(.top, 8)
                .opacity(focused ? 1 : 0)
                .font(.custom("Rubik-Light_Medium", size: 24))
        }
    }
}

struct EpisodeCard_Previews: PreviewProvider {
    static var episode = Episode(id: 1, title: "Wird 2023 das Jahr von Nintendo? | GameTalk", thumbnail: [Thumbnail(url: "https://rocketbeans.tv/cdn-cgi/imagedelivery/wiXHaYounWItGQ2BJaXH2w/479b1c32-c0d5-411d-861c-08991b975400/0x360")], tokens: [])
    
    
    static var episodeMissingImage = Episode(id: 2, title: "Wird 2023 das Jahr von Nintendo? | GameTalk", thumbnail: [Thumbnail(url: "https://missing.invalid")], tokens: [])
    
    static var previews: some View {
        Group {
            EpisodeCard(episode: episode).previewDisplayName("Default")
            EpisodeCard(episode: episodeMissingImage).previewDisplayName("Missing Image")
        }
    }
}
