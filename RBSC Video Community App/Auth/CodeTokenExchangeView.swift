import SwiftUI

struct CodeTokenExchangeView: View {
    @State private var createCodeResult: Result<CodeTokenExchange, Error>?
    @State private var fetchTokenResult: Result<CodeTokenExchange, Error>?
    
    var body: some View {
        switch createCodeResult {
        case .success(let codeTokenExchange):
            switch fetchTokenResult {
                case .success(_):
                LatestEpisodesView(token: Token(token: ""))
            case .failure(let error):
                Text(error.localizedDescription)
            case nil:
                VStack {
                    Text("Besuche https://rbscvca.vercel.app, logge dich mit deinem RocketBeans-Account ein und gib den unten stehenden Code ein.")
                    Text(codeTokenExchange.code)
                }.onAppear {
                    Task {
                        try await self.fetchToken()
                    }
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
        
        let (data, _) = try await URLSession.shared.upload(for: request, from: json)
        let codeTokenExchange: CodeTokenExchange = try! JSONDecoder().decode(CodeTokenExchange.self, from: data)
        
        if (codeTokenExchange.token == nil) {
            // 5 seconds
            try await Task.sleep(nanoseconds: 5000000000)
            try await fetchToken();
        } else {
            self.fetchTokenResult = Result.success(codeTokenExchange)
        }
    }
}

struct CodeTokenExchangeView_Previews: PreviewProvider {
    static var previews: some View {
        CodeTokenExchangeView()
    }
}
