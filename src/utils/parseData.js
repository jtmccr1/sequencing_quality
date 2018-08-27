import * as _ from 'lodash';

export function parseVariantData(data) {
	let parsedDataSet = [];
	const sample = data.Sample;
	const genome = data.genome;
	for (const segment of genome) {
		console.log(segment.chr);
		//cycle through each segment
		for (const loci of segment.seq) {
			const consensus = loci.consensus;
			const coverage = loci.coverage;
			const concat_pos = loci.concat_pos;
			const pos = loci.pos;
			if (!Array.isArray(loci.alleles)) {
				loci.alleles = Object.values(loci.alleles);
			}
			for (const allele of loci.alleles) {
				if (allele.freq < 0.5) {
					const nt = allele.nucleotide;
					const count = allele.count;
					const datapoint = {
						sample: sample,
						chr: segment.chr,
						nucleotide: nt,
						consensus: consensus,
						pos: pos,
						concat_pos: concat_pos,
						freq: allele.freq,
						count: count,
						coverage: coverage,
						mutationalClass: allele.mutationalClass,
					};
					parsedDataSet.push(datapoint);
				}
			}
		}
	}
	const output = {
		sample: sample,
		data: parsedDataSet,
		extremes: {
			freq: [_.minBy(parsedDataSet, a => a.freq).freq, _.maxBy(parsedDataSet, a => a.freq).freq],
			concat_pos: [
				_.minBy(parsedDataSet, a => a.concat_pos).concat_pos,
				_.maxBy(parsedDataSet, a => a.concat_pos).concat_pos,
			],
		},
	};
	return output;
}

export function parseCoverageData(data) {
	const parsedDataSet = [];
	const sample = data.Sample;
	const genome = data.genome;
	for (const segment of genome) {
		//cycle through each segment
		for (const loci of segment.seq) {
			var consensus = loci.consensus;
			var coverage = loci.coverage;
			var concat_pos = loci.concat_pos;
			var pos = loci.pos;
			var datapoint = {
				Sample: sample,
				chr: segment.chr,
				concat_pos: concat_pos,
				consensus: consensus,
				coverage: coverage,
				pos: pos,
			};
			parsedDataSet.push(datapoint);
		}
	}
	//https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
	parsedDataSet.sort(function(a, b) {
		return a.concat_pos > b.concat_pos ? 1 : b.concat_pos > a.concat_pos ? -1 : 0;
	});

	const output = {
		sample: sample,
		data: parsedDataSet,
		extremes: {
			coverage: [
				_.minBy(parsedDataSet, a => a.coverage).coverage,
				_.maxBy(parsedDataSet, a => a.coverage).coverage,
			],
			concat_pos: [
				_.minBy(parsedDataSet, a => a.concat_pos).concat_pos,
				_.maxBy(parsedDataSet, a => a.concat_pos).concat_pos,
			],
		},
	};
	return output;
}

export function parseGenomeAnnotation(data) {
	var dataset = data.genome;
	var ORFboxes = [];
	var cumSize = 0;
	var offSet = 0;
	for (const segment of dataset) {
		//cycle through each segment
		for (const openReadingFrame of segment.ORF) {
			var name = openReadingFrame.name;
			var ORFsize = 0;
			for (const exon of openReadingFrame.regions) {
				var geneBox = {
					name: name,
					ORFstart: exon.start + cumSize,
					ORFend: exon.stop + cumSize,
					verticleOffSet: offSet,
					fivePrimeUtrStart: cumSize + ORFsize,
					fivePrimeUtrEnd: exon.start + cumSize,
					threePrimeUtrStart: exon.stop + cumSize,
					threePrimeUtrEnd: cumSize + segment.size,
				};
				ORFboxes.push(geneBox);
				ORFsize = ORFsize + exon.stop;
			}
			offSet = offSet - 1;
		}
		cumSize = cumSize + segment.size;
		offSet = 0;
	}
	return ORFboxes;
}
