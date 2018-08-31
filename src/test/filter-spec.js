const expect = require('chai').expect;
const _ = require('lodash');
import { filterGenome } from '../utils/commandLine/functions';

describe('Filter', function() {
	it('filter coverage and frequency', function() {
		const testData = {
			Sample: 'HS1357_B',
			genome: [
				{
					chr: 'PA',
					concat_pos: 4708,
					consensus: 'A',
					count: 990,
					coverage: 1981,
					freq: 0.51,
					nucleotide: 'A',
					pos: 24,
				},
				{
					chr: 'PA',
					concat_pos: 4708,
					consensus: 'A',
					count: 1981,
					coverage: 981,
					freq: 0.0001,
					nucleotide: 'T',
					pos: 24,
				},
				{
					chr: 'HA',
					concat_pos: 4708,
					consensus: 'A',
					count: 1990,
					coverage: 981,
					freq: 0.51,
					nucleotide: 'A',
					pos: 24,
				},
				{
					chr: 'HA',
					concat_pos: 4708,
					consensus: 'A',
					count: 981,
					coverage: 1981,
					freq: 0.01,
					nucleotide: 'T',
					pos: 24,
				},
			],
		};
		const answer = {
			Sample: 'HS1357_B',
			genome: [
				{
					chr: 'PA',
					concat_pos: 4708,
					consensus: 'A',
					count: 990,
					coverage: 1981,
					freq: 0.51,
					nucleotide: 'A',
					pos: 24,
				},
				{
					chr: 'HA',
					concat_pos: 4708,
					consensus: 'A',
					count: 981,
					coverage: 1981,
					freq: 0.01,
					nucleotide: 'T',
					pos: 24,
				},
			],
		};
		const result = filterGenome(testData);

		expect(result).to.deep.equal(answer);
	});
});
