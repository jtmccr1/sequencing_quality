const fs = require('fs');
const expect = require('chai').expect;

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
//https://github.com/ramda/ramda/wiki/Cookbook#filter-an-object-using-keys-as-well-as-values
const objFromListWith = R.curry((fn, list) => R.chain(R.zipObj, R.map(fn))(list));
const grabAndObjectFromList2 = R.curry((selectKey, newKey, list) => {
	const helper = R.compose(
		// this can be a function that makes a function
		objFromListWith(R.prop(newKey)),
		R.prop(selectKey)
	);
	return helper(list);
});
//modifying the object means we have the side effect of modifying the oringinal object which is sloppy but just what we want here
// so I'll leave it here
const keepStructure = R.curry((selectKey, newKey, obj) => {
	const helper = grabAndObjectFromList2(selectKey, newKey);
	obj[selectKey] = helper(obj); //sloppyness but ok!
	return obj;
});
const keepStructureObjectifyGenome = keepStructure('genome', 'chr');
const keepStructureObjectifySeq = keepStructure('seq', 'pos');
const keepStructureObjectifyAllele = keepStructure('alleles', 'nucleotide');

const MapkeepStructureObjectifySeq = R.map(keepStructureObjectifySeq);
const MapMapkeepStructureObjectifyAllele = R.map(x => R.map(keepStructureObjectifyAllele, x.seq));

const objectifyData = R.pipe(
	keepStructureObjectifyGenome,
	R.prop('genome'),
	MapkeepStructureObjectifySeq,
	MapMapkeepStructureObjectifyAllele
);

const concatSinglet = (l, r) => (Array.isArray(l) && Array.isArray(r) ? R.concat(l, r) : R.concat([l], [r]));
const concatOrOne = (l, r) => (l === r ? r : concatSinglet(l, r));
const mergeDeepNoData = R.mergeDeepWith(concatOrOne);

const data1Objectified = objectifyData(data1);
const data2Objectified = objectifyData(data2);

const output = mergeDeepNoData(data1Objectified, data2Objectified);
// works just need to handel equal mutational classification arrary in merge
// need to add empty positions were needed.

//map over values and return for each a seq object
