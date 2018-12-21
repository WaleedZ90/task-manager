import React from 'react';
import './styles.scss';

const Checkbox = (props) => {
	const { displayText, action, value } = props;
	return (
		<div className="shared-checkbox">
			<input type="checkbox" name="shared-checkbox" onChange={action} checked={value} />
			{displayText != null && displayText != '' && <label for="shared-checkbox">{displayText}</label>}
		</div>
	);
};

Checkbox.defaultProps = {
	displayText: '',
	value: false
};

export default Checkbox;
