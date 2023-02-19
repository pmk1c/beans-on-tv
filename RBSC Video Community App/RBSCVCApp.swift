import SwiftUI

@main
struct RBSCVCApp: App {
    @StateObject var authTokenBloc = AuthTokenBloc()
    
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
