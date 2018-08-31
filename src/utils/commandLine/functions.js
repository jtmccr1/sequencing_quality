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

export function reFormat(data) {
	// helper functions
	const unNestGenome = R.pipe(
		R.prop('genome'),
		R.values
	);
	// for each of the unNNestedGenome make this helper funciton to add chr
	// for each of the loci in the seq call this function
	// unnest seq
	const addChrtoLocus = o => R.assoc('chr', o.chr);
	const unNestSeq = seg => {
		//add sample to loci as well
		const addChr = addChrtoLocus(seg);
		const x = R.map(addChr, seg.seq);
		return x;
	};
	const concatAll = R.reduce(R.concat, []);

	const unNestAlleles = loci => {
		const lociData = R.dissoc('alleles', loci);
		const mergeLociData = R.merge(R.__, lociData);
		const x = R.map(mergeLociData, loci.alleles);
		return R.values(x);
	};

	const output = { Sample: data.Sample };
	const unNestedGenome = unNestGenome(data); ///
	const unNestedSeq = R.map(unNestSeq, unNestedGenome);
	const unNestedSeqConcat = concatAll(unNestedSeq);
	const UnNestedAlleles = R.map(unNestAlleles, unNestedSeqConcat);
	output['genome'] = concatAll(UnNestedAlleles);
	return output;
}
