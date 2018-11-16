import React from 'react';
import { css } from 'glamor';

const panelContainerCollapsed = {
	position: 'relative',
	width: '98%',
	height: '30px', // collapsed
	minHeight: '30px', // collapsed
	margin: '10px 10px 10px 10px',
	transition: 'height 0.5s ease-out',
	WebkitTransition: 'height 0.5s ease-out',
	border: '1px solid gray',
	borderRadius: '5px',
	borderLeft: '5px solid gray',
};

const panelContainerExpanded = {
	...panelContainerCollapsed,
	height: '500px',
	minHeight: '500px',
};
export const panelTitle = css({
	cursor: 'pointer',
	fontWeight: 'bold',
	fontSize: '1.3em',
	paddingLeft: '20px',
	color: '#F0605C',
});
const ExpandToggle = ({ title, callback }) => (
	<div {...panelTitle} onClick={callback}>
		{title}
	</div>
);

class Panel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
		};
	}
	render() {
		let panelStyles = {
			...(this.state.expanded ? panelContainerExpanded : panelContainerCollapsed),
			...{ borderColor: '#D8D8D8' },
		};
		return (
			<div style={panelStyles}>
				<ExpandToggle
					title={this.props.title}
					callback={() => this.setState({ expanded: !this.state.expanded })}
				/>

				{this.state.expanded ? (
					<div style={{ textAlign: 'center' }}>
						<div display={'inline-block'}>{<this.props.child {...this.props.childProps} />}</div>
					</div>
				) : null}
			</div>
		);
	}
}
export default Panel;
