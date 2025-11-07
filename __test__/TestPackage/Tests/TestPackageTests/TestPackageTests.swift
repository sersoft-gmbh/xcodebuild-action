import Testing
@testable import TestPackage

@Suite
struct TestPackageTests {
    @Test
    func example() {
        #expect(Greeter().text == "Hello, World!")
    }
}
