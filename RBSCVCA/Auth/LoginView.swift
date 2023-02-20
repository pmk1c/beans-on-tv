import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authTokenBloc: AuthTokenBloc
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var secondFactorToken: String = ""
    @State private var error: Error?
    
    var body: some View {
        if (error != nil) {
            Text(error!.localizedDescription)
        } else {
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
        let jsonDecoder = JSONDecoder()
        let dateFormatter = ISO8601DateFormatter()
        dateFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        jsonDecoder.dateDecodingStrategy = .custom { decoder in
            let dateString = try decoder.singleValueContainer().decode(String.self)
            if let date = dateFormatter.date(from: dateString) {
                return date
            }
            throw DecodingError.dataCorrupted(
                DecodingError.Context(codingPath: decoder.codingPath,
                                      debugDescription: "Invalid date"))
        }
        
        let authLocal: AuthLocal = try! jsonDecoder.decode(AuthLocal.self, from: result)
        
        await authTokenBloc.store(accessToken: authLocal.data.token, refreshToken: authLocal.data.refreshToken)
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
    }
}
