var expect = require('chai').expect;
var calcScales = require('../utils/commonFunctions').calcScales;
import { scaleLinear } from 'd3-scale';

describe('Calculate scales', function() {
	beforeEach(function() {
		this.oneArraryData = [{ x: 1, y: 2 }, { x: 10, y: 30 }, { x: 0, y: -50 }];
		this.chartGeom = {
			spaceLeft: 10,
			width: 100,
			spaceRight: 10,
			height: 100,
			spaceBottom: 20,
			spaceTop: 20,
		};
	});

	it('Get scales from variant data', function() {
		const answer = {
			x: scaleLinear()
				.domain([0, 10])
				.range([10, 90]),
			y: scaleLinear()
				.domain([-50, 30])
				.range([80, 20]),
		};
		var result = calcScales(this.chartGeom, this.oneArraryData, 'x', 'y');

		const answerPos = {
			x: [answer.x(5), answer.x(0)],
			y: [answer.y(-5), answer.y(20)],
		};
		const resultPos = {
			x: [result.x(5), result.x(0)],
			y: [result.y(-5), result.y(20)],
		};
		expect(resultPos).to.deep.equal(answerPos);
	});
});
