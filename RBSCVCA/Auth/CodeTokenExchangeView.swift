import SwiftUI

struct CodeTokenExchangeView: View {
    @State private var createCodeResult: Result<CodeTokenExchange, Error>?
    @State private var fetchTokenResult: Result<CodeTokenExchange, Error>?
    @EnvironmentObject var authenticationBloc: AuthenticationBloc
    
    var body: some View {
        switch createCodeResult {
        case .success(let codeTokenExchange):
            VStack {
                Text("Besuche https://rbtv.bmind.de, melde dich mit deinem RBTV-Account an und gib folgenden Code ein:").font(.custom("Rubik-Light_Medium", size: 32)).padding(.bottom, 32)
                Text(formatCode(code: codeTokenExchange.code)).font(.custom("Rubik-Light_Medium", size: 48))
            }.onAppear {
                Task {
                    try await self.fetchToken()
                }
            }
        case .failure(let error):
            Text(error.localizedDescription)
        case nil:
            ProgressView().onAppear {Task {
                try await self.createCode()
            }}
        }
    }
    
    func formatCode(code: String) -> String {
        let start = code.startIndex
        let fourth = code.index(start, offsetBy: 4)
        let end = code.endIndex
        return "\(code[start..<fourth])-\(code[fourth..<end])"
    }
    
    func createCode() async throws {
        let url = URL(string: "https://ietacfzilviitulpecdz.functions.supabase.co/code-token-exchange-create")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldGFjZnppbHZpaXR1bHBlY2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzYwNjI0NDcsImV4cCI6MTk5MTYzODQ0N30.jD-zPr3HB4C2AoImRgBFSxfRbPAnbQRQWwuPowxEsQU", forHTTPHeaderField: "Authorization")
        
        let (data, _) = try await URLSession.shared.upload(for: request, from: Data())
        let codeTokenExchange: CodeTokenExchange = try! JSONDecoder().decode(CodeTokenExchange.self, from: data)
        
        self.createCodeResult = Result.success(codeTokenExchange)
    }
    
    func fetchToken() async throws {
        let url = URL(string: "https://ietacfzilviitulpecdz.functions.supabase.co/code-token-exchange-read")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldGFjZnppbHZpaXR1bHBlY2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzYwNjI0NDcsImV4cCI6MTk5MTYzODQ0N30.jD-zPr3HB4C2AoImRgBFSxfRbPAnbQRQWwuPowxEsQU", forHTTPHeaderField: "Authorization")
        let json = try JSONEncoder().encode(self.createCodeResult?.get())
        
        let jsonDecoder = JSONDecoder()
        jsonDecoder.keyDecodingStrategy = .convertFromSnakeCase
        let (data, _) = try await URLSession.shared.upload(for: request, from: json)
        let codeTokenExchange: CodeTokenExchange = try! jsonDecoder.decode(CodeTokenExchange.self, from: data)
        
        guard let token = codeTokenExchange.token else {
            // 5 seconds
            try await Task.sleep(nanoseconds: 5000000000)
            try await fetchToken();
            return
        }
        
        authenticationBloc.add(AuthenticationTokenFetched(token: token))
    }
}
