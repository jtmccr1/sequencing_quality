var expect = require('chai').expect;
var parseData = require('../src/utils/parseData');

describe('Parse Data', function() {
	beforeEach(function() {
		this.testData = {
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
		var result = parseData.parseVariantData(this.testData);
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
		result = parseData.parseCoverageData(this.testData);
		expect(result).to.deep.equal(answer);
	});
});
