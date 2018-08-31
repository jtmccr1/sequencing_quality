const fs = require('fs');
import { filterGenome } from './functions';

const args = process.argv.slice(2);
// Look for help
if (args.indexOf('-h') > -1 || args.length != 5) {
	console.log('Useage:');
	console.log('babel-node filter.js sample.json filtered.json coverageCutoff mininumFrequency maximumFrequency');
	console.log(
		'This script takes in a json file and filters the position entries based on coverage. It then filters the allele entries based on frequency. Note the consensus at each position that meets the coverage requirement is kept.'
	);
	process.exit(1);
}
const inputFile = args[0];
const outputFile = args[1];
const coverage = parseFloat(args[2]);
const mininumFrequency = parseFloat(args[3]);
const maximumFrequency = parseFloat(args[4]);

fs.readFile(inputFile, 'utf8', function(err, data) {
	if (err) throw err; // we'll not consider error handling for now
	const sample = JSON.parse(data);
	const filteredSample = filterGenome(sample, coverage, mininumFrequency, maximumFrequency);
	const filteredSampleString = JSON.stringify(filteredSample, null);
	fs.writeFile(outputFile, filteredSampleString, err => {
		if (err) throw err;
	});
});
