const fs = require('fs');
const _ = require('lodash');
const R = require('ramda');

// !!!!! Make sure ordering in allele freqeuncies is kept.

// const args = process.argv.slice(2);
// // Look for help
// if (args.indexOf('-h') > -1 || args.length != 3) {
// 	console.log('Useage:');
// 	console.log('babel-node processSNV.js filtered1.json filtered2.json output.json');
// 	console.log(
// 		'This script takes in two json files and compares the frequency of alleles in both samples. The average is used but the individuals frequencies are kept.'
// 	);
// 	process.exit(1);
// }
const inputFile1 = './data/HK_1/HS1341_B.removed.filtered.json'; //args[0];
const inputFile2 = './data/HK_1/HS1345_B.removed.filtered.json'; //args[1];
//const outputFile = //args[2];

const data1 = JSON.parse(fs.readFileSync(inputFile1, 'utf8'));
const data2 = JSON.parse(fs.readFileSync(inputFile2, 'utf8'));

// merge deep with and concat
// then get single entries and add 0
// merge first level samples
let concatSinglet = (l, r) => (Array.isArray(l) && Array.isArray(r) ? R.concat(l, r) : R.concat([l], [r]));
let concatOrOne = (l, r) => (l === r ? r : concatSinglet(l, r));
//Use R.mapObjIndexed check key if key
const grabAndGroup = R.curry(function(desiredKey, group, value, key, data) {
	const helper = R.groupBy(loci => {
		return loci[group];
	});

	if (desiredKey === key) {
		return helper(value);
	} else {
		return value;
	}
});

const mergeDeepNoData = R.mergeDeepWith(concatOrOne);
const firstgroup = grabAndGroup('genome', 'chr');
const grabEnterandDoSomething = R.curry(function(desiredKey, something, value, key, data) {
	if (desiredKey === key) {
		return R.map(something, value);
	} else {
		return value;
	}
});

const mergeArray = x => R.mergeDeepWith(concatOrOne, x[0], x[1]);
const mergeSeg = grabEnterandDoSomething('genome', mergeArray);

testF = R.pipe(
	mergeDeepNoData,
	R.mapObjIndexed(firstgroup),
	R.mapObjIndexed(mergeSeg)
); //works as expected
const test = testF(data1, data2);
//grab genome and merge by segment name

//const test2 = R.mapObjIndexed(mergeSeg, test);
////
// Works to here merges samples then merges seq arrary - next to merge loci in array.
//// I'm having to map at each level to keep the levels near the top.
//// This will get teddious as we go down the levels - is it possible to do recursively map at first time than if key === genome enter group and go from here don't have to pass the whole object at each step of the pipe
//// Need to handle case where there is only one entry - Can I do it at the end? need to handle where it was missing from
//////

//grab seq and group by loci pos
byConcatPos = R.compose(
	R.groupBy(loci => {
		return loci.pos;
	}),
	R.prop('seq')
);
const test4 = byConcatPos(test3);

//merge loci needs test for two
const test5 = R.mergeDeepWith(concatOrOne, test4[23][0], test4[23][1]);

byNucleotide = R.compose(
	R.groupBy(allele => {
		return allele.nucleotide;
	}),
	R.prop('alleles')
);
const test6 = byNucleotide(test5);

// Check there are two

console.log(test);

class emptyLoci {
	constructor(concat_pos, pos) {
		(this.alleles = []),
			(this.consensus = null),
			(this.coverage = 0),
			(this.concat_pos = concat_pos),
			(this.pos = pos);
		//this.sample = sample;
	}
}
class emptyAllele {
	constructor(nucleotide, mutationalClass) {
		(this.alleles = []),
			(this.count = 0),
			(this.freq = 0),
			(this.nucleotide = nucleotide),
			(this.mutationalClass = mutationalClass);
		//this.sample = sample;
	}
}
