import Testing
@testable import TestProject

@Suite
struct FailingTests {
    @Test
    func failing1() throws {
        Issue.record("This tests (1) always fails!")
    }

    @Test
    func failing2() throws {
        Issue.record("This tests (2) always fails!")
    }
}
