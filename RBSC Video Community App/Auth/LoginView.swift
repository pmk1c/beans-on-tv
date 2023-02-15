import SwiftUI

struct LoginView: View {
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var secondFactorToken: String = ""
    @State private var loginResult: Result<Token, Error>?
    
    var body: some View {
        switch loginResult {
        case .success(let token):
            LatestEpisodesView(token: token)
        case .failure(let error):
            Text(error.localizedDescription)
        case nil:
            Form {
                Section(header: Text("Anmelden")) {
                    TextField("E-Mail", text: $email).keyboardType(.emailAddress).autocapitalization(.none)
                        .disableAutocorrection(true)
                    
                    SecureField("Passwort", text: $password).autocapitalization(.none).disableAutocorrection(true)
                    TextField("Sicherheitscode", text: $secondFactorToken).keyboardType(.numberPad).autocapitalization(.none)
                        .disableAutocorrection(true).onSubmit { Task {
                                try await self.login()
                            }
                        }
                }
            }
        }
    }
    
    func login() async throws {
        let url = URL(string: "https://api.rocketbeans.tv/v1/auth/local")!
        var request = URLRequest(url: url)
        
        let dict: [String: Any] = [
          "email": email,
          "password": password,
          "secondFactorToken": secondFactorToken,
        ]
        let data = try! JSONSerialization.data(withJSONObject: dict, options: [])
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let (result, _) = try await URLSession.shared.upload(for: request, from: data)
        let authLocal: AuthLocal = try! JSONDecoder().decode(AuthLocal.self, from: result)
        
        self.loginResult = Result.success(authLocal.data.token)
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
    }
}
