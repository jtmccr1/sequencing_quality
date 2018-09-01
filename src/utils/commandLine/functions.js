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

//R.groupBy(x=>x.concat_pos,final2)

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
// Processing duplicate functions
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
	const justOne = ['nucleotide', 'concat_pos', 'chr', 'pos', 'mutationalClass', 'allele'];
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

export function compareSites(data1, data2) {
	// replace the genome value with a new entry that is an object keyed by chr:posNuc (HA:100A) and contains 0's where alleles which were found in the other sample are missing
	const full1 = replaceGenome(listToObject(R.concat(data1.genome, notInLast(data2.genome, data1.genome))))(data1);
	const full2 = replaceGenome(listToObject(R.concat(data2.genome, notInLast(data1.genome, data2.genome))))(data2);
	const mergedData = R.mergeDeepWithKey(mergeLogic, full1, full2);
	// back to arrary and mean if needed
	const arrayGenome = processMerged(mergedData.genome);
	//rename to raw
	const final = replaceGenome(arrayGenome)(mergedData);
	return final;
}
