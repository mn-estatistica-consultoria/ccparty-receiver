'use strict';

describe('Service: Cast', function () {

    // load the service's module
    beforeEach(module('raincastApp'));

    // instantiate service
    var Cast;
    beforeEach(inject(function (_Cast_) {
        Cast = _Cast_;
    }));

    it('should do something', function () {
        expect(!!Cast).toBe(true);
    });

});
