import SwiftUI
import AVKit

struct PlayerView: View {
    var episode: Episode
    
    @Environment(\.openURL) private var openURL
    @State var videoTokenResult: Result<String, Error>?
    @EnvironmentObject var authTokenBloc: AuthTokenBloc
       
       var body: some View {
           switch(videoTokenResult) {
           case .success(let videoToken):
               let player = AVPlayer(url: URL(string: "https://cloudflarestream.com/\(videoToken)/manifest/video.m3u8")!)
               VideoPlayer(player: player).ignoresSafeArea()
           case .failure(let error):
               Text(error.localizedDescription)
           case nil:
               ProgressView().onAppear {
                   Task {
                       try await self.fetchVideoToken()
                   }
               }
           }
       }
    
    func fetchVideoToken() async throws {
        guard case let .authenticated(accessToken, _) = authTokenBloc.state else {
            throw RuntimeError("You need to be authenticated to reach this code!")
        }
        
        guard let episodeToken = (episode.tokens.first { $0.type == "rbsc" })?.token else {
            if let youTubeId = episode.tokens.first(where: { $0.type == "youtube" })?.token,
            let url = URL(string: "youtube://watch/\(youTubeId)") {
                openURL(url)
            }
            return
        }
        
        let url = URL(string: "https://api.rocketbeans.tv/v1/rbsc/video/token/\(episodeToken)")!
        var request = URLRequest(url: url)
        request.setValue("Bearer \(accessToken.token)", forHTTPHeaderField: "Authorization")
        
        let (result, _) = try await URLSession.shared.data(for: request)
        let videoTokenResponse: VideoTokenResponse = try! JSONDecoder().decode(VideoTokenResponse.self, from: result)
        
        self.videoTokenResult = Result.success(videoTokenResponse.data.signedToken)
    }
}
