import React from 'react';
import './styles.scss';

const Textbox = (props) => {
	const { value, changeAction, blurAction, placeholder } = props;
	if (blurAction != null && typeof blurAction == 'function') {
		return (
			<input
				className="form-control shared-textbox"
				type="text"
				value={value}
				onChange={changeAction}
				onBlur={blurAction}
				placeholder={placeholder}
			/>
		);
	}

	return (
		<input
			className="form-control shared-textbox"
			type="text"
			value={value}
			onChange={changeAction}
			placeholder={placeholder}
		/>
	);
};

Textbox.defaultProps = {
	placeholder: ''
};

export default Textbox;
