const R = require('ramda');

export function filterAllele(position, mininumFrequency = 0.001, frequencyMax = 1) {
	//Positions is an object of alleles
	//convert alleles to arrary from object so we can cycle through
	if (!Array.isArray(position.alleles)) {
		position.alleles = Object.values(position.alleles);
	}
	position.alleles = position.alleles.filter(
		alleles => alleles.freq >= mininumFrequency && alleles.freq <= frequencyMax
	);
}

export function filterSegment(segment, coverage = 1000, mininumFrequency = 0.001, frequencyMax = 1) {
	//filter postions based on coverage
	segment.seq = segment.seq.filter(pos => pos.coverage >= coverage);
	segment.seq.forEach(pos => filterAllele(pos, mininumFrequency, frequencyMax));
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
