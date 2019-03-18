import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Dropdown from '.';

storiesOf('Dropdowns', module).add('Dropdown', () => {
	const menuItems = [
		{ id: 0, name: 'None' },
		{
			id: 1,
			name: 'low'
		},
		{
			id: 2,
			name: 'medium'
		},
		{
			id: 3,
			name: 'high'
		}
	];
	return <Dropdown items={menuItems} onChange={action()} />;
});
