const R = require('ramda');
const maxBy = key => {
	const holder = {};
	holder[key] = -Infinity;
	return R.pipe(
		R.reduce(R.maxBy(o => o[key]), holder),
		R.prop(key)
	);
};
const minBy = key => {
	const holder = {};
	holder[key] = Infinity;
	return R.pipe(
		R.reduce(R.minBy(o => o[key]), holder),
		R.prop(key)
	);
};
export function parseVariantData(data) {
	const minorAlleles = data.genome.filter(allele => allele.freq < 0.5 && allele.freq > 0);
	const output = {
		Sample: data.Sample,
		data: R.map(R.assoc('Sample', data.Sample), minorAlleles), //Add sample tag to each data point
		extremes: {
			freq: [minBy('freq')(minorAlleles), maxBy('freq')(minorAlleles)],
			concat_pos: [minBy('concat_pos')(minorAlleles), maxBy('concat_pos')(minorAlleles)],
		},
	};
	return output;
}

export function parseCoverageData(data) {
	const majorAllelesFunct = R.pipe(
		R.filter(allele => allele.freq > 0.5 && allele.freq > 0),
		R.map(R.pick(['chr', 'concat_pos', 'consensus', 'coverage', 'pos'])),
		R.map(R.assoc('Sample', data.Sample))
	);

	const DataSet = majorAllelesFunct(data.genome);
	//https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
	DataSet.sort(function(a, b) {
		return a.concat_pos > b.concat_pos ? 1 : b.concat_pos > a.concat_pos ? -1 : 0;
	});

	const output = {
		Sample: data.Sample,
		data: DataSet,
		extremes: {
			coverage: [minBy('coverage')(DataSet), maxBy('coverage')(DataSet)],
			concat_pos: [minBy('concat_pos')(DataSet), maxBy('concat_pos')(DataSet)],
		},
	};
	return output;
}

export function parseGenomeAnnotation(data) {
	const dataset = data.genome;
	const ORFboxes = [];
	let cumSize = 0;
	let offSet = 0;
	for (const segment of dataset) {
		//cycle through each segment
		for (const openReadingFrame of segment.ORF) {
			const name = openReadingFrame.name;
			let ORFsize = 0;
			for (const exon of openReadingFrame.regions) {
				const geneBox = {
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
/* 
const data = {
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
	],
};

parseCoverageData(data); */
