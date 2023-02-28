import SwiftUI
import AVKit

struct PlayerView: View {
    var episode: Episode
    @EnvironmentObject var authenticationBloc: AuthenticationBloc
    
    var body: some View {
        PlayerChildView(episode: episode, rbscVideoTokenBloc: createRBSCVideoTokenBloc())
    }
    
    func createRBSCVideoTokenBloc() -> RBSCVideoTokenBloc {
        guard case let .authenticated(accessToken, _) = authenticationBloc.state else { assert(false, "This should not happen") }
        return RBSCVideoTokenBloc(token: accessToken)
    }
}

struct PlayerChildView: View {
    var episode: Episode
    @ObservedObject var rbscVideoTokenBloc: RBSCVideoTokenBloc
    
    @Environment(\.openURL) private var openURL
    @EnvironmentObject var authenticationBloc: AuthenticationBloc
       
       var body: some View {
           switch(rbscVideoTokenBloc.state) {
           case .initial:
               ProgressView().onAppear(perform: fetchVideoToken)
           case let .fetched(videoToken):
               let player = AVPlayer(url: URL(string: "https://cloudflarestream.com/\(videoToken)/manifest/video.m3u8")!)
               VideoPlayer(player: player)
                   .ignoresSafeArea()
                   .onAppear {
                       player.play()
                   }.onDisappear() {
                       player.pause()
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
