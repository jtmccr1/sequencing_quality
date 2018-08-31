const fs = require('fs');
const R = require('ramda');
const args = process.argv.slice(2);
// Look for help
if (args.indexOf('-h') > -1 || args.length != 2) {
	console.log('Useage:');
	console.log('babel-node processSNV.js sample.json  output.json');
	console.log(
		'This script takes in a json with nested genomes structure and outputs a file without the nested structure. each allele is an object - note if there are no alleles at a loci it will error'
	);
	process.exit(1);
}
const inputFile = args[0]; //'./data/HS1294_B.removed.json'; //;
const outputFile = args[1];
const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

const unNestGenome = R.pipe(
	R.prop('genome'),
	R.values
);
const x = unNestGenome(data); ///

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
const test = R.map(unNestSeq, x);
const concatAll = R.reduce(R.concat, []);
const output = concatAll(test);

unNestAlleles = loci => {
	const lociData = R.dissoc('alleles', loci);
	const mergeLociData = R.merge(R.__, lociData);
	const x = R.map(mergeLociData, loci.alleles);
	return R.values(x);
};
const final = R.map(unNestAlleles, output);
const final2 = concatAll(final);
//R.groupBy(x=>x.concat_pos,final2)

//include sample and genome
const outputString = JSON.stringify(final2, null);
fs.writeFile(outputFile, outputString, err => {
	if (err) throw err;
	console.log('Data written to file');
});
