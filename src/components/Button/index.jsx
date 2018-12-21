import React from 'react';
import './styles.scss';

const Button = (props) => {
	const { displayText, action, type } = props;
	return (
		<button className="shared-button" onClick={action} type={type}>
			{displayText}
		</button>
	);
};

Button.defaultProps = {
	type: 'button',
	displayText: ''
};

export default Button;
