const fs = require('fs');
const R = require('ramda');
const RA = require('ramda-adjunct');
import { compareSites } from './functions';

const args = process.argv.slice(2);
// Look for help
if (args.indexOf('-h') > -1 || args.length != 3) {
	console.log('Useage:');
	console.log('babel-node processSNV.js filtered1.json filtered2.json output.json');
	console.log(
		'This script takes in two json files and compares the frequency of alleles in both samples. The average is used but the individuals frequencies are kept.'
	);
	process.exit(1);
}
const inputFile1 = args[0];
const inputFile2 = args[1];
const outputFile = args[2];

const data1 = JSON.parse(fs.readFileSync(inputFile1, 'utf8'));
const data2 = JSON.parse(fs.readFileSync(inputFile2, 'utf8'));

// add alleles that are missing from each

const processedData = compareSites(data1, data2);

fs.writeFile(outputFile, processedData, err => {
	if (err) throw err;
});
