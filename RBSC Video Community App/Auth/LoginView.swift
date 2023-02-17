import SwiftUI

struct LoginView: View {
    @StateObject private var vm = LoginViewModel()
    
    var body: some View {
        if (vm.token != nil) {
            LatestEpisodesView(token: vm.token!)
        } else if (vm.error != nil) {
            Text(vm.error!.localizedDescription)
        } else {
            Form {
                Section(header: Text("Anmelden")) {
                    TextField("E-Mail", text: $vm.email).keyboardType(.emailAddress).textContentType(.emailAddress)
                    SecureField("Passwort", text: $vm.password).autocapitalization(.none).textContentType(.password)
                    TextField("Sicherheitscode", text: $vm.secondFactorToken).keyboardType(.numberPad).textContentType(.oneTimeCode).onSubmit {
                        Task {
                            try await vm.login()
                        }
                    }
                }
            }
        }
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
    }
}
