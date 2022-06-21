import XCTest
@testable import TestProject

final class GreeterTests: XCTestCase {
    func testSimpleGreeting() throws {
        XCTAssertEqual(Greeter().greeting(forName: "Simple"), "Hello Simple")
    }

    func testWorldGreeting() throws {
        XCTAssertEqual(Greeter().greeting(forName: "World"), "Hello World")
    }

    func testGreetingWithSpace() throws {
        XCTAssertEqual(Greeter().greeting(forName: "With Space"), "Hello With Space")
    }
}
