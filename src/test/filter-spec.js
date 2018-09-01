const expect = require('chai').expect;
const _ = require('lodash');
import { filterGenome, compareSites } from '../utils/commandLine/functions';

describe('Filter and process duplcates', function() {
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
	it('process duplicates', function() {
		const sample1 = {
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
					concat_pos: 100,
					consensus: 'A',
					count: 100,
					coverage: 100,
					freq: 1,
					nucleotide: 'A',
					pos: 11,
				},
				{
					chr: 'HA',
					concat_pos: 1,
					consensus: 'T',
					count: 1,
					coverage: 1,
					freq: 1,
					nucleotide: 'T',
					pos: 1,
				},
			],
		};
		const sample2 = {
			Sample: 'HS1357_A',
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
					concat_pos: 100,
					consensus: 'A',
					count: 99,
					coverage: 100,
					freq: 0.99,
					nucleotide: 'A',
					pos: 11,
				},
				{
					chr: 'HA',
					concat_pos: 100,
					consensus: 'A',
					count: 1,
					coverage: 100,
					freq: 0.01,
					nucleotide: 'C',
					pos: 11,
				},
				{
					chr: 'HA',
					concat_pos: 2,
					consensus: 'G',
					count: 1,
					coverage: 1,
					freq: 1,
					nucleotide: 'G',
					pos: 2,
				},
			],
		};

		const answer = {
			Sample: ['HS1357_B', 'HS1357_A'],
			genome: [
				{
					allele: 'PA:24A',
					chr: 'PA',
					concat_pos: 4708,
					consensus: 'A',
					count: 990,
					coverage: 1981,
					freq: 0.51,
					nucleotide: 'A',
					pos: 24,
					freqRaw: [0.51, 0.51],
					coverageRaw: [1981, 1981],
					countRaw: [990, 990],
				},
				{
					allele: 'HA:11C',
					chr: 'HA',
					concat_pos: 100,
					consensus: 'A',
					count: 0,
					coverage: 0,
					freq: 0,
					nucleotide: 'C',
					pos: 11,
					freqRaw: [0, 0.01],
					coverageRaw: [null, 100],
					countRaw: [0, 1],
				},
				{
					allele: 'HA:11A',
					chr: 'HA',
					concat_pos: 100,
					consensus: 'A',
					count: 99.5,
					coverage: 100,
					freq: 0.995,
					nucleotide: 'A',
					pos: 11,
					freqRaw: [1, 0.99],
					coverageRaw: [100, 100],
					countRaw: [100, 99],
				},
				{
					allele: 'HA:1T',
					chr: 'HA',
					concat_pos: 1,
					consensus: ['T', 'N'],
					count: 0,
					coverage: 0,
					freq: 0,
					nucleotide: 'T',
					pos: 1,
					freqRaw: [1, 0],
					coverageRaw: [1, null],
					countRaw: [1, 0],
				},
				{
					allele: 'HA:2G',
					chr: 'HA',
					concat_pos: 2,
					consensus: ['N', 'G'],
					count: 0,
					coverage: 0,
					freq: 0,
					nucleotide: 'G',
					pos: 2,
					freqRaw: [0, 1],
					coverageRaw: [null, 1],
					countRaw: [0, 1],
				},
			],
		};
		const result = compareSites(sample1, sample2);
		result.genome = result.genome.sort((a, b) => a.allele < b.allele);
		answer.genome = answer.genome.sort((a, b) => a.allele < b.allele);
		expect(result).to.deep.equal(answer);
	});
});
