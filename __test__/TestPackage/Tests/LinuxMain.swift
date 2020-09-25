import XCTest

import TestPackageTests

var tests = [XCTestCaseEntry]()
tests += TestPackageTests.__allTests()

XCTMain(tests)
