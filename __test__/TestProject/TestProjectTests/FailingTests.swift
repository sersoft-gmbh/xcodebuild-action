//
//  FailingTests.swift
//  TestProjectTests
//
//  Created by Florian Friedrich on 22.04.20.
//  Copyright © 2020 ser.soft GmbH. All rights reserved.
//

import XCTest
@testable import TestProject

final class FailingTests: XCTestCase {
    override func setUpWithError() throws {
        try super.setUpWithError()
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        try super.tearDownWithError()
    }

    func testFailing1() throws {
        XCTFail("This tests (1) always fails!")
    }

    func testFailing2() throws {
        XCTFail("This tests (2) always fails!")
    }
}
