import Foundation
import Combine

struct Change<State> {
    let currentState: State
    let nextState: State
}

class Bloc<Event, State>: ObservableObject {
    @Published var state: State
    
    private let events = PassthroughSubject<Event, Never>()
    private let changes = PassthroughSubject<Change<State>, Never>()
    private let errors  = PassthroughSubject<Error, Never>()
    private var cancellables = Set<AnyCancellable>()
    
    init(_ initialState: State) {
        state = initialState
        bindEvents()
        bindChanges()
    }
    
    func add(_ event: Event) {
        events.send(event)
    }
    
    func on(error: Error) {
        print(error)
    }
    
    func on(event: Event) async throws {
        assert(false, "No event handler for event \(event)")
    }
    
    func emit(_ nextState: State) {
        changes.send(Change(currentState: state, nextState: nextState))
    }
    
    private func bindEvents() {
        let eventsSink = events.sink { event in
            do {
                try await self.on(event: event)
            } catch {
                self.on(error: error)
            }
        }
        cancellables.insert(eventsSink)
    }
    
    private func bindChanges() {
        let changesSink = changes
            .map { $0.nextState }
            .receive(on: DispatchQueue.main)
            .assign(to: \.state, on: self)
        cancellables.insert(changesSink)
    }
}
