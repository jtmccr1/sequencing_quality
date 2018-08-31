const expect = require('chai').expect;
const _ = require('lodash');
import { filterSegment } from '../utils/commandLine/functions';

describe('Filter', function() {
	it('filter coverage and frequency', function() {
		const testData = {
			Sample: 'HS1357_B',
			genome: [
				{
					chr: 'PA',
					seq: [
						{
							alleles: {
								A: {
									count: 2930,
									freq: 0.9996588195155237,
									mutationalClass: [
										{
											ORF: 'PA',
											aminoAcidPos: 0,
											classification: 'Synonymous',
											codingPos: 0,
											codonPos: 0,
											consensusAA: 'M',
											varAA: 'M',
										},
										{
											ORF: 'PA-X',
											aminoAcidPos: 0,
											classification: 'Synonymous',
											codingPos: 0,
											codonPos: 0,
											consensusAA: 'M',
											varAA: 'M',
										},
									],
									nucleotide: 'A',
								},
								G: {
									count: 1,
									freq: 0.000341180484476288,
									mutationalClass: [
										{
											ORF: 'PA',
											aminoAcidPos: 0,
											classification: 'Nonsynonymous',
											codingPos: 0,
											codonPos: 0,
											consensusAA: 'M',
											varAA: 'V',
										},
										{
											ORF: 'PA-X',
											aminoAcidPos: 0,
											classification: 'Nonsynonymous',
											codingPos: 0,
											codonPos: 0,
											consensusAA: 'M',
											varAA: 'V',
										},
									],
									nucleotide: 'G',
								},
							},
							concat_pos: 4629,
							consensus: 'A',
							coverage: 2931,
							pos: 10,
						},
					],
				},
			],
		};
		const answer = {
			Sample: 'HS1357_B',
			genome: [
				{
					chr: 'PA',
					seq: [
						{
							alleles: [
								{
									count: 2930,
									freq: 0.9996588195155237,
									mutationalClass: [
										{
											ORF: 'PA',
											aminoAcidPos: 0,
											classification: 'Synonymous',
											codingPos: 0,
											codonPos: 0,
											consensusAA: 'M',
											varAA: 'M',
										},
										{
											ORF: 'PA-X',
											aminoAcidPos: 0,
											classification: 'Synonymous',
											codingPos: 0,
											codonPos: 0,
											consensusAA: 'M',
											varAA: 'M',
										},
									],
									nucleotide: 'A',
								},
							],
							concat_pos: 4629,
							consensus: 'A',
							coverage: 2931,
							pos: 10,
						},
					],
				},
			],
		};
		testData.genome.forEach(segment => filterSegment(segment));

		expect(testData).to.deep.equal(answer);
	});
});
