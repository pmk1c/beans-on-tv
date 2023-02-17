import Foundation
import Combine

class LoginViewModel: ObservableObject {
    @Published var error: Error?
    @Published var email = ""
    @Published var password: String = ""
    @Published var secondFactorToken: String = ""
    @Published var token: Token?
    
    init() {
        TokenStorage.load().catch { error -> Just<Token?> in
            switch(error) {
            case .noToken: break
            default: self.error = error
            }
            
            return Just(nil)
        }.assign(to: &$token)
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
        
        self.token = authLocal.data.token
        try await TokenStorage.store(token: authLocal.data.token).value
    }
}
