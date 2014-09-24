/// <reference path="../../definitions/mocha.d.ts" />
/// <reference path="../../definitions/chai.d.ts" />

module Spec {
    chai.should();
    describe("GameFactory", () => {
        it("should be true", () => {
            true.should.be.true;
        });
    });
}
