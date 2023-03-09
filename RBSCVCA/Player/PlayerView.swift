import SwiftUI
import AVKit

struct PlayerView: View {
    var episode: Episode
    @EnvironmentObject var authenticationBloc: AuthenticationBloc
    
    var body: some View {
        PlayerChildView(episode: episode, rbscVideoTokenBloc: createRBSCVideoTokenBloc()!)
    }
    
    func createRBSCVideoTokenBloc() -> RBSCVideoTokenBloc? {
        guard case let .authenticated(token) = authenticationBloc.state else {
            return nil
        }
        return RBSCVideoTokenBloc(token: token)
    }
}

struct PlayerChildView: View {
    var episode: Episode
    @ObservedObject var rbscVideoTokenBloc: RBSCVideoTokenBloc
    
    @Environment(\.openURL) private var openURL
    @EnvironmentObject var authenticationBloc: AuthenticationBloc
    @State var player: AVPlayer?
    
    var body: some View {
        switch(rbscVideoTokenBloc.state) {
        case .initial:
            ProgressView().onAppear(perform: fetchVideoToken)
        case let .fetched(videoToken):
            VideoPlayer(player: player)
                .ignoresSafeArea()
                .onAppear {
                    if (player == nil) {
                        player = AVPlayer(url: URL(string: "https://cloudflarestream.com/\(videoToken)/manifest/video.m3u8")!)
                    }
                    player!.play()
                }.onDisappear() {
                    player!.pause()
                }
        }
    }
    
    func fetchVideoToken() {
        guard let rbscToken = episode.rbscToken,
              case .authenticated = authenticationBloc.state
        else {
            let url = URL(string: "youtube://watch/\(episode.youtubeId)")!
            openURL(url)
            return
        }
        
        rbscVideoTokenBloc.add(RBSCVideoTokenStarted(rbscToken: rbscToken))
    }
}
