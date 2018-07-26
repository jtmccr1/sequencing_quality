module.exports = {
	parseVariantData(data) {
		var parsedDataSet = [];
		var sample = data.Sample;
		const genome = data.genome;
		for (var i = 0; i < genome.length; i++) {
			//cycle through each segment
			var chr = genome[i].chr;
			for (var j = 0; j < genome[i].seq.length; j++) {
				var consensus = genome[i].seq[j].consensus;
				var coverage = genome[i].seq[j].coverage;
				var concat_pos = genome[i].seq[j].concat_pos;
				var pos = genome[i].seq[j].pos;
				for (var key in genome[i].seq[j].alleles) {
					var freq = genome[i].seq[j].alleles[key].freq;
					if (freq < 0.5) {
						var nt = genome[i].seq[j].alleles[key].nucleotide;
						var count = genome[i].seq[j].alleles[key].count;
						var datapoint = {
							Sample: sample,
							chr: chr,
							nucleotide: nt,
							consensus: consensus,
							pos: pos,
							concat_pos: concat_pos,
							freq: freq,
							count: count,
							coverage: coverage,
							mutationalClass: genome[i].seq[j].alleles[key].mutationalClass,
						};
						parsedDataSet.push(datapoint);
					}
				}
			}
		}
		return parsedDataSet;
	},
	parseCoverageData(data) {
		var parsedDataSet = [];
		var sample = data.Sample;
		const genome = data.genome;
		for (var i = 0; i < genome.length; i++) {
			//cycle through each segment
			var chr = genome[i].chr;
			for (var j = 0; j < genome[i].seq.length; j++) {
				var consensus = genome[i].seq[j].consensus;
				var coverage = genome[i].seq[j].coverage;
				var concat_pos = genome[i].seq[j].concat_pos;
				var pos = genome[i].seq[j].pos;
				var datapoint = {
					Sample: sample,
					chr: chr,
					concat_pos: concat_pos,
					consensus: consensus,
					coverage: coverage,
					pos: pos,
				};
				parsedDataSet.push(datapoint);
			}
		}
		return parsedDataSet;
	},
};
