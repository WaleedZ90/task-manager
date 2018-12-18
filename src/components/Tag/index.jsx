import React from 'react';
import './styles.scss';

const Tag = (props) => {
	const { color, text } = props;
	return <span className={`tag-item tag-item-${color}`}>{text}</span>;
};

Tag.defaultProps = {
	color: 'danger',
	text: ''
};

export default Tag;
