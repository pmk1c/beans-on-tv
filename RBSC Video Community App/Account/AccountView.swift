import SwiftUI

struct AccountView: View {
    @EnvironmentObject var authTokenBloc: AuthTokenBloc
    
    var body: some View {
        VStack {
            Button("Abmelden", role: .destructive, action: {
                Task {
                    await authTokenBloc.delete()
                }
            })
        }
    }
}

struct AccountView_Previews: PreviewProvider {
    static var previews: some View {
        ZStack {
            Image(uiImage: UIImage(named: "Background")!).opacity(0.5)
            AccountView()
        }
    }
}
