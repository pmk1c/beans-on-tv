import SwiftUI

@main
struct RBSCVCApp: App {
    @StateObject var authTokenBloc = AuthTokenBloc()
    
    var body: some Scene {
        WindowGroup {
            NavigationStack {
                switch(authTokenBloc.state) {
                case .unknown:
                    ProgressView()
                case .unauthenticated:
                    LoginView()
                case .authenticated:
                    LatestEpisodesView()
                }
            }.task {
                await authTokenBloc.load()
            }.environmentObject(authTokenBloc)
        }
    }
}
