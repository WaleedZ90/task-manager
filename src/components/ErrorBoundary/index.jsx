import React, { Component } from 'react';
import './styles.scss';

export default class ErrorBoundary extends Component {
	state = {
		hasError: false,
		error: null,
		info: null
	};

	componentDidCatch(error, info) {
		this.setState({ hasError: true, error, info });
	}

	render() {
		const { children } = this.props;
		const { hasError } = this.state;

		if (hasError) {
			return (
				<div>
					<h1>Something went wrong</h1>
				</div>
			);
		}

		return children;
	}
}
