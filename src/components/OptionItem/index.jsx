import React from 'react';
import './styles.scss';
import OptionItemTypes from '../../enums/OptionItemTypes';
import { Link } from 'react-router-dom';

const OptionItem = (props) => {
	const { config } = props;

	switch (config.type) {
		case OptionItemTypes.ANCHOR:
			return (
				<Link className="option-item" to={config.action}>
					<i className={`${config.icon}`} />
					{config.displayText}
				</Link>
			);

		case OptionItemTypes.BUTTON:
			return (
				<button className="option-item" onClick={config.action}>
					<i className={`${config.icon}`} />
					{config.displayText}
				</button>
			);

		default:
			return (
				<Link className="option-item" to={config.action}>
					<i className={`${config.icon}`} />
					{config.displayText}
				</Link>
			);
	}
};

OptionItem.defaultProps = {
	config: {
		type: OptionItemTypes.ANCHOR,
		action: '/',
		displayText: '',
		icon: ''
	}
};

export default OptionItem;
