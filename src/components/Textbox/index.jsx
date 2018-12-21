import React from 'react';
import './styles.scss';

const Textbox = (props) => {
	const { value, changeAction, blurAction } = props;
	if (blurAction != null && typeof blurAction == 'function') {
		return <input type="text" value={value} onChange={changeAction} onBlur={blurAction} />;
	}

	return <input type="text" value={value} onChange={changeAction} />;
};

export default Textbox;
