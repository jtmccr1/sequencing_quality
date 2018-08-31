const fs = require('fs');
const R = require('ramda');
import { reFormat } from './functions';

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

fs.readFile(inputFile, 'utf8', function(err, data) {
	if (err) throw err; // we'll not consider error handling for now
	const sample = JSON.parse(data);

	const unNestedData = reFormat(sample);
	const outputString = JSON.stringify(unNestedData, null);

	fs.writeFile(outputFile, outputString, err => {
		if (err) throw err;
	});
});
