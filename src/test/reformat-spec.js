const expect = require('chai').expect;
const R = require('ramda');

import { reFormat } from '../utils/commandLine/functions';

describe('reformat', function() {
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
				{
					chr: 'HA',
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

	it('reformat', function() {
		const answer = {
			Sample: 'test_sample',
			genome: [
				{
					chr: 'PA',
					concat_pos: 4708,
					consensus: 'A',
					count: 990,
					coverage: 981,
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
					pos: 24,
				},
				{
					chr: 'PA',
					concat_pos: 4708,
					consensus: 'A',
					count: 981,
					coverage: 981,
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
					pos: 24,
				},
				{
					chr: 'HA',
					concat_pos: 4708,
					consensus: 'A',
					count: 990,
					coverage: 981,
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
					pos: 24,
				},
				{
					chr: 'HA',
					concat_pos: 4708,
					consensus: 'A',
					count: 981,
					coverage: 981,
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
					pos: 24,
				},
			],
		};
		const result = reFormat(this.testVariantData);
		expect(result).to.deep.equal(answer);
	});
});
