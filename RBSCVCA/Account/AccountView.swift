import SwiftUI

struct AccountView: View {
    @EnvironmentObject var authTokenBloc: AuthTokenBloc
    
    var body: some View {
        switch(authTokenBloc.state) {
        case .unauthenticated:
            LoginView()
        case .authenticated(_, _):
            Button("Abmelden", role: .destructive, action: {
                Task {
                    await authTokenBloc.delete()
                }
            })
        case .unknown:
            ProgressView()
        }
    }
}
