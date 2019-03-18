import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);
const components = require.context('../src/components', true, /.stories.jsx$/);
function loadStories() {
	req.keys().forEach((filename) => req(filename));
	components.keys().forEach((filename) => components(filename));
}

configure(loadStories, module);
