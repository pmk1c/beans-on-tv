import SwiftUI
import Sentry

@main
struct RBSCVCApp: App {
    @StateObject var authTokenBloc = AuthTokenBloc()
    
    init() {
        SentrySDK.start { options in
            options.dsn = "https://5ea110fa8c8d48db928a4f3211a5856f@o4504708985847808.ingest.sentry.io/4504708989714432"
        }
    }
    
    var body: some Scene {
        WindowGroup {
            ZStack {
                Image(uiImage: UIImage(named: "Background")!).opacity(0.5)
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
                }.environmentObject(authTokenBloc).onAppear {
                    for family in UIFont.familyNames.sorted() {
                        let names = UIFont.fontNames(forFamilyName: family)
                        print("Family: \(family) Font names: \(names)")
                    }
                }
            }
        }
    }
}
