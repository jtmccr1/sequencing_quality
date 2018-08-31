const R = require('ramda');
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
