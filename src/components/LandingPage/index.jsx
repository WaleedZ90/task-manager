import React from 'react';
import './styles.scss';

import TasksList from '../Shared/TasksList';

const LandingPage = (props) => {
	return (
		<section className="landing-page-container">
			<TasksList />
		</section>
	);
};

export default LandingPage;
