import XCTest
@testable import TestPackage

final class TestPackageTests: XCTestCase {
    func testExample() {
        XCTAssertEqual(TestPackage().text, "Hello, World!")
    }
}
