import React from 'react';
import MutationsOverTime from './MutationsOverTime';
class Figures extends React.Component {
	render() {
		return (
			<div>
				<h2>Look at these sweet figures</h2>
				<p>
					They should probably be on a separate page currently they change with the data - There's too much to
					handle it all now.
				</p>
				<MutationsOverTime
					title={'Mutations over time'}
					metaData={this.props.metaData}
					variantData={this.props.variantData}
					style={{ width: '25%', margin: 'auto', height: '100%' }}
				/>
			</div>
		);
	}
}

export default Figures;
