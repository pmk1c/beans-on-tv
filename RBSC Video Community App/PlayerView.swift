import SwiftUI
import AVKit

struct PlayerView: View {
    
    @State var player = AVPlayer(url: URL(string: "https://cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyOTc0NTk4NDlkN2RhMGY0MmJlNGU5NTY3NWNlNDRhIn0.eyJzdWIiOiJhMGU3ZGNkODgyYzE5ZTU0MmI0NTY4NDc0NmNiZTYzOCIsImtpZCI6IjEyOTc0NTk4NDlkN2RhMGY0MmJlNGU5NTY3NWNlNDRhIiwiZXhwIjoxNjc2MDc1NDQ4fQ.ktyV0djNbedviwUS3OQoB_deTbL4X8hdJ8itRpFBQ5qg144R5TXoqtH_0iAZGPA6fhSwgkfkK0biwsC6KCQrXucJ2eee7mOsVgncv9ou0JxvwXVlMrTZ1Ax8rWMEI2Dh0aBwHRhbg2aF9pVYxIoNhW-YTqs8Xr1vOxBD1uSRzPbcApnUx2q5Nd7uO60-mWJTcD4AsFfB_pTUv6pwSA6O4BG7HZ6vRBMifiMgkuqo6XCW9J5u7gfnc-aXhdNNfu9WQGUmynA9uBi-FKLdbKGW4vYRRQxM3n0gph1s4NzmJAlmupq6mGRAfXPZeiNZDdOmcrMdoaK9eEEfQ_5arupgDQ/manifest/video.m3u8")!)
       @State var isPlaying: Bool = false
       
       var body: some View {
           VStack {
               VideoPlayer(player: player)
                   .frame(width: 320, height: 180, alignment: .center)

               Button {
                   isPlaying ? player.pause() : player.play()
                   isPlaying.toggle()
                   player.seek(to: .zero)
               } label: {
                   Image(systemName: isPlaying ? "stop" : "play")
                       .padding()
               }
           }
       }
}

struct PlayerView_Previews: PreviewProvider {
    static var previews: some View {
        PlayerView()
    }
}
