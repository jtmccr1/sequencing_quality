var expect = require('chai').expect;
import { parseVariantData, parseCoverageData, parseGenomeAnnotation } from '../utils/parseData';

describe('Parse Data', function() {
	beforeEach(function() {
		this.testVariantData = {
			Sample: 'test_sample',
			genome: [
				{
					chr: 'PA',
					seq: [
						{
							alleles: {
								A: {
									count: 990,
									freq: 0.51,
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
									],
									nucleotide: 'A',
								},
								T: {
									count: 981,
									freq: 0.49,
									mutationalClass: [
										{
											ORF: 'PA',
											aminoAcidPos: 0,
											classification: 'NonSynonymous',
											codingPos: 0,
											codonPos: 0,
											consensusAA: 'M',
											varAA: 'G',
										},
									],
									nucleotide: 'T',
								},
							},
							concat_pos: 4708,
							consensus: 'A',
							coverage: 981,
							pos: 24,
						},
					],
				},
			],
		};
		this.testGenomeData = {
			genome: [
				{
					seg: 'PB2',
					size: 10,
					ORF: [
						{
							name: 'PB2',
							regions: [
								{
									start: 2,
									stop: 8,
								},
							],
						},
					],
				},
				{
					seg: 'PB1',
					size: 15,
					ORF: [
						{
							name: 'PB1',
							regions: [
								{
									start: 2,
									stop: 8,
								},
							],
						},
						{
							name: 'PB1-F2',
							regions: [
								{
									start: 2,
									stop: 6,
								},
								{
									start: 10,
									stop: 12,
								},
							],
						},
					],
				},
			],
		};
	});

	it('Get minor allele data', function() {
		const answer = [
			{
				Sample: 'test_sample',
				chr: 'PA',
				nucleotide: 'T',
				consensus: 'A',
				pos: 24,
				concat_pos: 4708,
				freq: 0.49,
				count: 981,
				coverage: 981,
				mutationalClass: [
					{
						ORF: 'PA',
						aminoAcidPos: 0,
						classification: 'NonSynonymous',
						codingPos: 0,
						codonPos: 0,
						consensusAA: 'M',
						varAA: 'G',
					},
				],
			},
		];

		var result = parseVariantData(this.testVariantData);
		expect(result).to.deep.equal(answer);
	});

	it('Get coverage data', function() {
		const answer = [
			{
				Sample: 'test_sample',
				chr: 'PA',
				concat_pos: 4708,
				consensus: 'A',
				coverage: 981,
				pos: 24,
			},
		];
		var result = parseCoverageData(this.testVariantData);
		expect(result).to.deep.equal(answer);
	});

	it('Get genome annotation', function() {
		const answer = [
			{
				name: 'PB2',
				ORFstart: 2,
				ORFend: 8,
				verticleOffSet: 0,
				fivePrimeUtrStart: 0,
				fivePrimeUtrEnd: 2,
				threePrimeUtrStart: 8,
				threePrimeUtrEnd: 10,
			},
			{
				name: 'PB1',
				ORFstart: 12,
				ORFend: 18,
				verticleOffSet: 0,
				fivePrimeUtrStart: 10,
				fivePrimeUtrEnd: 12,
				threePrimeUtrStart: 18,
				threePrimeUtrEnd: 25,
			},
			{
				name: 'PB1-F2',
				ORFstart: 12,
				ORFend: 16,
				verticleOffSet: -1,
				fivePrimeUtrStart: 10,
				fivePrimeUtrEnd: 12,
				threePrimeUtrStart: 16,
				threePrimeUtrEnd: 25,
			},
			{
				name: 'PB1-F2',
				ORFstart: 20,
				ORFend: 22,
				verticleOffSet: -1,
				fivePrimeUtrStart: 16,
				fivePrimeUtrEnd: 20,
				threePrimeUtrStart: 22,
				threePrimeUtrEnd: 25,
			},
		];
		var result = parseGenomeAnnotation(this.testGenomeData);
		expect(result).to.deep.equal(answer);
	});
});
