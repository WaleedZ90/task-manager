import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Checkbox from '.';

storiesOf('Checkboxes', module).add('Checkbox', () => <Checkbox displayText={'Waleed'} action={action()} />);
