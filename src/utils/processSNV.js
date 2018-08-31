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
const inputFile1 = './data/HK_1/HS1341_B.removed.filtered.json'; //args[0];
const inputFile2 = './data/HK_1/HS1345_B.removed.filtered.json'; //args[1];
///const outputFile = args[2];

const data1 = JSON.parse(fs.readFileSync(inputFile1, 'utf8'));
const data2 = JSON.parse(fs.readFileSync(inputFile2, 'utf8'));

class emptySegment {
	constructor([chr]) {
		(this.chr = chr), (this.seq = []);
	}
}
class emptyLoci {
	constructor([concat_pos, pos]) {
		(this.alleles = []),
			(this.consensus = null),
			(this.coverage = 0),
			(this.concat_pos = concat_pos),
			(this.pos = pos);
		//this.sample = sample;
	}
}
class emptyAllele {
	constructor([nucleotide, mutationalClass]) {
		(this.count = 0), (this.freq = 0), (this.nucleotide = nucleotide), (this.mutationalClass = mutationalClass);
		//this.sample = sample;
	}
}

//add sample name to loci
// Loop to add missing data
//Add missing segments if any
//for those missing from 1 This is a long step
// const addMissing = (selectKey, baseKeys, fillObj, array1, array2) => {
// 	const missing = R.differenceWith(R.eqBy(R.prop(selectKey)), array1, array2);
// 	for (const entry of missing) {
// 		const args = R.pick(baseKeys, entry);
// 		array2.push(new fillObj(Object.values(args)));
// 	}
// };

// const addMissingSymetric = R.curry((selectKey, baseKeys, fillObj, array1, array2) => {
// 	addMissing(selectKey, baseKeys, fillObj, array1, array2);
// 	addMissing(selectKey, baseKeys, fillObj, array2, array1);
// });

// addMissingSymetric('chr', ['chr'], emptySegment, data1.genome, data2.genome);

// for (const seg of data1.genome) {
// 	const seq1 = seg.seq;
// 	const seq2 = R.prop('seq', R.filter(x => x.chr === seg.chr, data2.genome)[0]);
// 	addMissingSymetric('pos', ['concat_pos', 'pos'], emptyLoci, seq1, seq2);
// 	for (const loci of seq1) {
// 		const alleles1 = loci.alleles;
// 		const alleles2 = R.prop('alleles', R.filter(x => x.pos === loci.pos, seq2)[0]);
// 		addMissingSymetric('nucleotide', ['nucleotide', 'mutationalClass'], emptyAllele, alleles1, alleles2);
// 	}
// }

// Merge data
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
	R.prop('genome'), // this is why we lose the sample key
	MapkeepStructureObjectifySeq,
	MapMapkeepStructureObjectifyAllele
);

const concatSinglet = (l, r) => (Array.isArray(l) && Array.isArray(r) ? R.concat(l, r) : R.concat([l], [r]));
const concatOrOne = (l, r) => (R.equals(l, r) ? r : concatSinglet(l, r));
const mergeDeepNoData = R.mergeDeepWith(concatOrOne);

const data1Objectified = objectifyData(data1);
const data2Objectified = objectifyData(data2);

const output = mergeDeepNoData(data1, data2);
// merge again with initial data - if different fine - if the same add 0 in the right spot. use withkeys for this.
// DeObjectify
output.genome = R.values(output.genome);
//deobjectify sequences
output.genome = R.forEach(x => (x.seq = R.values(x.seq)), output.genome);
// deobjectify alleles
output.genome = R.forEach(seg => R.forEach(loci => (loci.alleles = R.values(loci.alleles)), seg.seq), output.genome);

// write output

const outputString = JSON.stringify(output, null);
fs.writeFile(outputFile, outputString, err => {
	if (err) throw err;
	console.log('Data written to file');
});
