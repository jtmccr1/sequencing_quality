const fs = require('fs');
const _ = require('lodash');
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
//add sample name to loci

//Combine objects - now work to force the two to become one
const newObject = {
	Sample: [data1.Sample, data2.Sample],
	genome: [...data1.genome, ...data2.genome],
};

newObject.genome = _.chain(newObject.genome)
	.groupBy(seg => seg.chr)
	.value();
let newGenome = [];
for (let segment of Object.values(newObject.genome)) {
	segment = merge(segment, compareAndMergeChr)[0];
	segment.seq = _.chain(segment.seq)
		.groupBy(seq => seq.concat_pos)
		.value();
	let newSeq = [];
	for (let loci of Object.values(segment.seq)) {
		if (loci.length === 1) {
			const found = loci[0];
			//add sample here
			const other = new emptyLoci(found.concat_pos, found.pos);
			loci.push(other);
		}
		loci = merge(loci, compareAndMergeConcatPos)[0];
		loci.alleles = _.chain(loci.alleles)
			.groupBy(allele => allele.nucleotide)
			.value();
		let newAllele = [];
		for (let alleles of Object.values(loci.alleles)) {
			if (alleles.length === 1) {
				const found = alleles[0];
				//add sample here
				const other = new emptyAllele(found.nucleotide, found.mutationalClass);
				alleles.push(other);
			}
			alleles = merge(alleles, compareAndMergeNucleotide)[0];
			newAllele.push(alleles);
		}
		loci.alleles = newAllele;
		newSeq.push(loci);
	}
	segment.seq = newSeq;
	newGenome.push(segment);
}
newObject.genome = newGenome;
console.log(newgenome);
console.log(newObject);

//For each segment get intersection of loci based on

for (const segment1 of data1.genome) {
	const chr = segment1.chr;
	const segment2 = data2.genome.filter(seg => seg.chr === chr)[0];
	// add identifier to each loci

	_.each(segment1.seq, loci => _.extend(loci, { sample: data1.Sample }));
	_.each(segment2.seq, loci => _.extend(loci, { sample: data2.Sample }));
	// groups by concat_pos
	const allLoci = _.groupBy([...segment1.seq, ...segment2.seq], x => x.concat_pos);
	// compare coverage, consensus, enter alleles and compare alleles
	//const validLoci = _.intersectionBy(segment1.seq, segment2.seq, 'concat_pos');
	seq = [];
	for (const loci of Object.values(allLoci)) {
		if (loci.length === 1) {
			const found = loci[0];
			const other = new emptyLoci(found.concat_pos, found.pos);
			loci.push(other);
		}
		console.log(loci);
		seq.push(merge(loci));
	}
	//output is the same format but every entry is an object with the sample names as keys
}
//stackoverflow.com/questions/41071520/merge-objects-concatenating-values-using-lodash

function merge(people, compareFunction) {
	return _.uniqWith(people, compareFunction);
}

function compareAndMergeChr(first, second) {
	if (first['chr'] === second['chr']) {
		for (const key of Object.keys(first)) {
			if (first[key] !== second[key]) {
				first[key] = second[key] = [].concat(first[key], second[key]);
			}
		}
		return true;
	}
	return false;
}
function compareAndMergeConcatPos(first, second) {
	if (first['concat_pos'] === second['concat_pos']) {
		for (const key of Object.keys(first)) {
			if (first[key] !== second[key]) {
				first[key] = second[key] = [].concat(first[key], second[key]);
			}
		}
		return true;
	}
	return false;
}
function compareAndMergeNucleotide(first, second) {
	if (first['nucleotide'] === second['nucleotide']) {
		// Make this a deep comparison so the mutational classes don't get copied
		for (const key of Object.keys(first).filter(k => k !== 'mutationalClass')) {
			if (first[key] !== second[key]) {
				first[key] = second[key] = [].concat(first[key], second[key]);
			}
		}
		return true;
	}
	return false;
}

// at each level check the keys are the same
// if keys are the same
