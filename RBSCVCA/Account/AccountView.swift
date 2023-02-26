import SwiftUI

struct AccountView: View {
    @EnvironmentObject var authenticationBloc: AuthenticationBloc
    
    var body: some View {
        switch(authenticationBloc.state) {
        case .unauthenticated:
            LoginView()
        case .authenticated(_, _):
            Button("Abmelden", role: .destructive, action: {
                authenticationBloc.add(AuthenticationSignOutPressed())
            })
        case .initial:
            ProgressView()
        }
    }
}
