import Foundation

public func +<K, V>(left: [K:V], right: [K:V]) -> [K:V] {
    return left.merging(right) { $1 }
}
