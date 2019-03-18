import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from '.';

storiesOf('Button', module).add('button', () => <Button displayText={'Waleed'} action={action()} />);
