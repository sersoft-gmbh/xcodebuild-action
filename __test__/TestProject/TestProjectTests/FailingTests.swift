import XCTest
@testable import TestProject

final class FailingTests: XCTestCase {
    func testFailing1() throws {
        XCTFail("This tests (1) always fails!")
    }

    func testFailing2() throws {
        XCTFail("This tests (2) always fails!")
    }
}
