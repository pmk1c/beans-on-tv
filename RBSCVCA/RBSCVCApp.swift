import SwiftUI
import Sentry

@main
struct RBSCVCApp: App {
    @StateObject var authenticationBloc = AuthenticationBloc()
    
    init() {
        SentrySDK.start { options in
            options.dsn = "https://5ea110fa8c8d48db928a4f3211a5856f@o4504708985847808.ingest.sentry.io/4504708989714432"
        }
    }
    
    var body: some Scene {
        WindowGroup {
            NavigationStack {
                ZStack {
                    Image(uiImage: UIImage(named: "Background")!).opacity(0.5)
                    TabView {
                        LatestEpisodesView()
                            .tabItem {
                                Label("Neueste Videos", systemImage: "star.square.fill").labelStyle(.titleOnly)
                            }
                        AccountView()
                            .tabItem {
                                Label("Account", systemImage: "person.crop.circle").labelStyle(.iconOnly)
                            }
                    }
                    .onAppear {
                        authenticationBloc.add(AuthenticationStarted())
                    }
                }.navigationDestination(for: Episode.self) { episode in
                    PlayerView(episode: episode)
                }
            }
            .environmentObject(authenticationBloc)
        }
    }
}
