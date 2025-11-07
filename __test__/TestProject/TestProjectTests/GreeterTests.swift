import Testing
@testable import TestProject

@Suite
struct GreeterTests {
    @Test
    func simpleGreeting() throws {
        #expect(Greeter().greeting(forName: "Simple") == "Hello Simple")
    }

    @Test
    func worldGreeting() throws {
        #expect(Greeter().greeting(forName: "World") == "Hello World")
    }

    @Test
    func greetingWithSpace() throws {
        #expect(Greeter().greeting(forName: "With Space") == "Hello With Space")
    }
}
