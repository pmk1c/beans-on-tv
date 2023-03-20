import SwiftUI
import CachedAsyncImage

struct EpisodeCardView: View {
    let episode: Episode
    @FocusState private var focused: Bool
    
    var body: some View {
        VStack {
            NavigationLink(value: episode, label: {
                CachedAsyncImage(url: episode.thumbnailUrl) { phase in
                    if let image = phase.image {
                        image.resizable().scaledToFill().frame(width: 400 , height: 225)
                    } else {
                        Image(uiImage: UIImage(named: "Placeholder 16x9")!).resizable().scaledToFill().frame(width: 400 , height: 225)
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
                .frame(width: 440)
        }
    }
}
