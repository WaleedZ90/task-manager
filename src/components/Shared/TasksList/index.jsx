import React, { Component } from 'react';
import './styles.scss';
import TaskService from '../../../services/TaskService';

export default class TasksList extends Component {
	static defaultProps = {
		filters: []
	};

	taskService = new TaskService();

	componentDidMount() {
		this.taskService
			.getTasks()
			.then((res) => {
				debugger;
			})
			.catch((err) => {
				debugger;
			});
	}

	render() {
		return <h3>Tasks list</h3>;
	}
}
