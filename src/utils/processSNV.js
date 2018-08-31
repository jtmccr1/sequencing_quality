const fs = require('fs');
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
const inputFile1 = './data/HK_8/PC1A.removed.flattened.filtered.json'; //args[0];
const inputFile2 = './data/HK_8/PC1B.removed.flattened.filtered.json'; //args[1];
///const outputFile = args[2];

const data1 = JSON.parse(fs.readFileSync(inputFile1, 'utf8'));
const data2 = JSON.parse(fs.readFileSync(inputFile2, 'utf8'));
const comp = (l, r) => l.concat_pos === r.concat_pos && l.nucleotide === r.nucleotide;

const notInLast = R.pipe(
	R.differenceWith(comp),
	R.map(R.omit(['freq', 'count', 'coverage', 'consensus'])),
	R.map(R.merge(R.zipObj(['freq', 'count', 'coverage', 'consensus'], [0, 0, 0, 'N'])))
);
// Merge data
const full1 = R.concat(data1.genome, notInLast(data2.genome, data1.genome));
const full2 = R.concat(data2.genome, notInLast(data1.genome, data2.genome));

//https://github.com/ramda/ramda/wiki/Cookbook#filter-an-object-using-keys-as-well-as-values
const objFromListWith = R.curry((fn, list) => R.chain(R.zipObj, R.map(fn))(list));
// Join concat pos and nucleotide then merge

const mergeLogic = (l, r, k) => {
	// always the Same bewteen duplicate nucleotide, concat_pos,chr, pos,
	const justOne = ['nucleotide', 'concat_pos', 'chr', 'pos'];
	const alwaysTwo = ['freq', 'count', 'coverage', 'Sample'];
	if (R.indexOf(k, justOne) > -1) {
		if (l === r) {
			return l;
		} else {
			throw new Error(`left and right should match at key ${k}`);
		}
	} else if (R.indexOf(k, alwaysTwo)) {
		return R.concat([l], [r]);
	} else if (k === 'concensus') {
		if (l === r) {
			return l;
		} else {
			return R.concat([l], [r]);
		}
	} else {
		throw new Error(`Don't know how to handle key ${k}`);
	}
};
