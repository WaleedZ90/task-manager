import React, { Component } from 'react';
import './styles.scss';

class Checkbox extends Component {
	static defaultProps = {
		displayText: '',
		value: false
	};

	state = {
		isChecked: false
	};

	handleCheckboxChange = () => {
		const { action } = this.props;
		this.setState({ isChecked: !this.state.isChecked }, () => {
			action(this.state.isChecked);
		});
	};

	render() {
		const { displayText, action, value, isChecked } = this.props;
		return (
			<div className="shared-checkbox">
				<input
					type="checkbox"
					name="shared-checkbox"
					onChange={this.handleCheckboxChange}
					defaultChecked={value}
					checked={isChecked}
				/>
				<span class="checkmark" />
				{displayText != null && displayText != '' && <label for="shared-checkbox">{displayText}</label>}
			</div>
		);
	}
}

export default Checkbox;
