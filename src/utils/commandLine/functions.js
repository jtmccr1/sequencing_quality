const R = require('ramda');
const RA = require('ramda-adjunct');

const filterPipe = (coverage, mininumFrequency, maxFrequency) =>
	R.pipe(
		R.prop('genome'),
		R.filter(pos => pos.coverage >= coverage && pos.freq >= mininumFrequency && pos.freq <= maxFrequency)
	);

export function filterGenome(data, coverage = 1000, mininumFrequency = 0.001, maxFrequency = 1) {
	//filter postions based on coverage
	return {
		Sample: data.Sample,
		genome: filterPipe(coverage, mininumFrequency, maxFrequency)(data),
	};
}
/// reformatting

//include sample and genome
const concatAll = R.reduce(R.concat, []);
const unNestSeq = seg => {
	const segData = R.dissoc('seq', seg);
	const mergeSegData = R.merge(R.__, segData);
	const x = R.map(mergeSegData, seg.seq);
	return R.values(x);
};
const unNestAlleles = loci => {
	const lociData = R.dissoc('alleles', loci);
	const mergeLociData = R.merge(R.__, lociData);
	const x = R.map(mergeLociData, loci.alleles);
	return R.values(x);
};
export const reFormatPipe = R.pipe(
	R.prop('genome'),
	R.values(),
	R.map(unNestSeq),
	concatAll(),
	R.map(unNestAlleles),
	concatAll(),
	R.identity
);

export function reFormat(data) {
	return {
		Sample: data.Sample,
		genome: reFormatPipe(data),
	};
}
// ************* Processing duplicate functions *******************************

const comp = (l, r) => l.concat_pos === r.concat_pos && l.nucleotide === r.nucleotide;
const notInLast = R.pipe(
	R.differenceWith(comp),
	R.map(R.omit(['freq', 'count', 'coverage', 'consensus'])),
	R.map(R.merge(R.zipObj(['freq', 'count', 'coverage', 'consensus'], [0, 0, 0, 'N'])))
);

// pass coverage and consensus to possition if possible

//add chrPosNuc key and objectify
const objFromListWith = R.curry((fn, list) => R.chain(R.zipObj, R.map(fn))(list));
const listToObject = R.pipe(
	R.map(pos => R.assoc('allele', `${pos.chr}:${pos.pos}${pos.nucleotide}`, pos)),
	objFromListWith(R.prop('allele'))
);

const mergeLogic = (k, l, r) => {
	// always the Same bewteen duplicate nucleotide, concat_pos,chr, pos,
	const justOne = ['nucleotide', 'concat_pos', 'chr', 'pos', 'mutationalClass', 'allele', 'loci'];
	const alwaysTwo = ['freq', 'count', 'coverage', 'Sample'];
	if (R.indexOf(k, justOne) > -1) {
		if (R.equals(l, r)) {
			return l;
		} else {
			throw new Error(`left and right should match at key ${k}`);
		}
	} else if (R.indexOf(k, alwaysTwo) > -1) {
		return R.concat([l], [r]);
	} else if (k === 'consensus') {
		if (l === r) {
			return l;
		} else {
			return R.concat([l], [r]);
		}
	} else {
		throw new Error(`Don't know how to handle key ${k}`);
	}
};

// return mean if no entry is 0 otherwise give 0
const stringentMean = array => (R.indexOf(0, array) > -1 || R.indexOf(null, array) > -1 ? 0 : R.mean(array));
//convert to array, save arrays, get means - keeping original names to maintian compatability
const processMerged = R.pipe(
	R.values(),
	R.map(RA.renameKeys({ freq: 'freqRaw', count: 'countRaw', coverage: 'coverageRaw' })),
	R.map(pos =>
		R.merge(pos, {
			freq: stringentMean(pos.freqRaw),
			count: stringentMean(pos.countRaw),
			coverage: stringentMean(pos.coverageRaw),
		})
	)
);
const replaceGenome = x =>
	R.pipe(
		R.dissoc('genome'),
		R.assoc('genome', x)
	);

const correctMissing = R.pipe(
	R.groupBy(R.prop('loci')), // object keyed by loci with arrays of alleles as values
	R.map(R.map(R.pickAll(['coverage', 'consensus']))), //for each key for each allele in array grab the coverage and consensus
	R.map(R.reduce(R.maxBy(a => a.coverage), { coverage: 0 })),
	maxes => {
		return R.over(
			R.lens(R.props(['consensus', 'coverage', 'loci']), R.mergeDeepLeft()),
			([consensus, coverage, loci]) => maxes[loci]
		);
	} // reduce the array to the entry with the most coverage (will be either what was found in the sample or 0)
);

export function compareSites(data1, data2) {
	// add loci key
	const data1WithLoci = replaceGenome(R.map(pos => R.assoc('loci', `${pos.chr}:${pos.pos}`, pos), data1.genome))(
		data1
	);
	const data2WithLoci = replaceGenome(R.map(pos => R.assoc('loci', `${pos.chr}:${pos.pos}`, pos), data2.genome))(
		data2
	);

	// replace the genome value with a new entry that is an object keyed by chr:posNuc (HA:100A) and contains 0's where alleles which were found in the other sample are missing
	const full1 = replaceGenome(R.concat(data1WithLoci.genome, notInLast(data2WithLoci.genome, data1WithLoci.genome)))(
		data1WithLoci
	);
	const full2 = replaceGenome(R.concat(data2WithLoci.genome, notInLast(data1WithLoci.genome, data2WithLoci.genome)))(
		data2WithLoci
	);
	// correct coverage and consensus at missing alleles where there was something at the loci. ie. coverage !=0 but all reads were not the reported nucleotide

	const full1Corrected = replaceGenome(listToObject(full1.genome.map(correctMissing(full1.genome))))(full1);
	const full2Corrected = replaceGenome(listToObject(full2.genome.map(correctMissing(full2.genome))))(full2);

	const mergedData = R.mergeDeepWithKey(mergeLogic, full1Corrected, full2Corrected);
	// back to arrary and mean if needed
	const arrayGenome = processMerged(mergedData.genome);
	//rename to raw
	const final = replaceGenome(arrayGenome)(mergedData);
	return final;
}
