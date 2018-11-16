import React from 'react';
import { css } from 'glamor';
import CoveragePlot from './coveragePlot';
import VariantPlot from './variantPlot';
import TechnicalPlot from './TechnicalReplicates';
import { channelColours } from '../utils/commonStyles';
import CummulativeDistribution from './cummulativeDistribution';

const panelContainer = css({
	width: 'calc(100%-20px)',
	height: '500' /* adjusting these will also adjust the graphs */,
	minHeight: '500px',
	margin: '10px 100px 10px 50px',
});

export const panelTitle = css({
	fontWeight: 'bold',
	fontSize: '1.3em',
	paddingLeft: '20px',
});

const flexRow = css({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	height: 'calc(100% - 25px)',
});

class Summary extends React.Component {
	//Filtering here
	render() {
		return (
			<div>
				<div {...panelContainer}>
					<div {...panelTitle} />
					<div {...flexRow}>
						{/*<CoveragePlot
							style={{ width: '25%', margin: 'auto', height: '100%' }}
							title={'Coverage'}
							coverageData={this.props.coverageData}
							colours={channelColours}
							genomeAnnotation={this.props.genomeAnnotation}
						/>
						<VariantPlot
							style={{ width: '25%', margin: 'auto', height: '100%' }}
							title={'Frequency'}
							variantData={this.props.variantData}
							colours={channelColours}
							genomeAnnotation={this.props.genomeAnnotation}
						/>*/}
						<CummulativeDistribution
							style={{ width: '50%', margin: 'auto', height: '100%' }}
							title={'CDF of variant frequencies'}
							variantData={this.props.variantData}
							colours={channelColours}
						/>
						<TechnicalPlot
							style={{ width: '50%', margin: 'auto', height: '100%' }}
							title={'Tenchical Replicates'}
							variantData={this.props.variantData}
							colours={channelColours}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Summary;
