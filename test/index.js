var should = require('chai').should();


describe('#load routes', function() {
	it('load route', function() {
		require('../index')('./test/routes').stack[0].route.path.should.equal('/');
	});
});

describe('#load routes recursive', function() {
	it('load route recursive', function() {
		require('../index')('./test/routes',true).stack[1].route.path.should.equal('/recursive');
	});
});
