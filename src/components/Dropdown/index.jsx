import React from 'react';
import './styles.scss';

const Dropdown = (props) => {
	const { items, onChange, selectedId } = props;
	return (
		<select className="shared-dropdown-select form-control" onChange={onChange}>
			{items.map((item, index) => {
				return (
					<option key={index} value={JSON.stringify(item)} selected={item.id === selectedId}>
						{item.name}
					</option>
				);
			})}
		</select>
	);
};

Dropdown.defaultProps = {
	items: [],
	onChange: null
};

export default Dropdown;
