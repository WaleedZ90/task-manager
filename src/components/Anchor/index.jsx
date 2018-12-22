import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

const Anchor = (props) => {
	const { to, displayText } = props;
	return (
		<Link className="shared-anchor" to={to}>
			{displayText}
		</Link>
	);
};

Anchor.defaultProps = {
	to: '/',
	displayText: ''
};

export default Anchor;
