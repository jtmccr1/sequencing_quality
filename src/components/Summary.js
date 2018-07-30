import React from 'react';
import { css } from 'glamor';
import CoveragePlot from './coveragePlot';
import VariantPlot from './variantPlot';
import { channelColours } from '../utils/commonStyles';
import CummulativeDistribution from './cummulativeDistribution';

const panelContainer = css({
	width: 'calc(100% - 350px)',
	height: '350px' /* adjusting these will also adjust the graphs */,
	minHeight: '350px',
	margin: '10px 10px 10px 10px',
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
	render() {
		return (
			<div {...panelContainer}>
				<div {...panelTitle} />
				<div {...flexRow}>
					<CoveragePlot
						style={{ width: '35%', margin: 'auto', height: '100%' }}
						title={'Coverage'}
						coverageData={this.props.coverageData}
						colours={channelColours}
						genomeAnnotation={this.props.genomeAnnotation}
					/>
					<VariantPlot
						style={{ width: '35%', margin: 'auto', height: '100%' }}
						title={'Frequency'}
						variantData={this.props.variantData}
						colours={channelColours}
						genomeAnnotation={this.props.genomeAnnotation}
					/>
					<CummulativeDistribution
						style={{ width: '35%', margin: 'auto', height: '100%' }}
						title={'CDF of variant frequencies'}
						variantData={this.props.variantData}
						colours={channelColours}
					/>
				</div>
			</div>
		);
	}
}

export default Summary;
