import { RoutesLoader } from '../src/index';
import { expect } from 'chai';

describe('#load routes', () => {
	it('load route', () => {
		expect(RoutesLoader('./test/routes', false).stack[0].route.path).to.equal('/');
	});
});

describe('#load routes recursive', () => {
	it('load route recursive', () => {
		expect(RoutesLoader('./test/routes', true).stack[1].route.path).to.equal('/recursive');
	});
});
