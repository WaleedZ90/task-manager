import React, { Component } from 'react';
import { connect } from 'react-redux';
import './styles.scss';
import TaskService from '../../../services/TaskService';

function mapStateToProps(state) {
	return {
		taskCategories: state.taskCategories
	};
}
function mapDispatchToProps(dispatch) {
	return {};
}
class TasksList extends Component {
	taskService = new TaskService();
	static defaultProps = {
		filters: []
	};

	state = {
		tasks: [
			{
				id: 1,
				userId: 1,
				name: 'Shopping',
				dueDate: null,
				priority: 'high',
				categoryId: 1
			},
			{
				id: 2,
				userId: 1,
				name: 'Cooking',
				dueDate: null,
				priority: 'low',
				categoryId: 1
			},
			{
				id: 3,
				userId: 1,
				name: 'Cleaning',
				dueDate: null,
				priority: 'medium',
				categoryId: 1
			},
			{
				id: 4,
				userId: 1,
				name: 'Pay bills',
				dueDate: '2018-12-02T09:37:26.129Z',
				priority: 'high',
				categoryId: null
			},
			{
				id: 5,
				userId: 1,
				name: 'Send report',
				dueDate: null,
				priority: 'medium',
				categoryId: 2
			}
		],
		subTasks: [
			{
				id: 1,
				taskId: 1,
				item: 'Milk',
				done: true,
				optional: false
			},
			{
				id: 2,
				taskId: 1,
				item: 'Eggs',
				done: true,
				optional: false
			},
			{
				id: 3,
				taskId: 1,
				item: 'Tomatoes',
				done: false,
				optional: false
			},
			{
				id: 4,
				taskId: 1,
				item: 'Meat',
				done: false,
				optional: true
			},
			{
				id: 5,
				taskId: 2,
				item: 'Preheat oven',
				done: false,
				optional: false
			},
			{
				id: 6,
				taskId: 2,
				item: 'Cut vegetables',
				done: false,
				optional: false
			},
			{
				id: 7,
				taskId: 2,
				item: 'Boil vegetables',
				done: false,
				optional: false
			},
			{
				id: 8,
				taskId: 2,
				item: 'Mix ingredients',
				done: false,
				optional: false
			},
			{
				id: 9,
				taskId: 2,
				item: 'Put in oven',
				done: false,
				optional: false
			},
			{
				id: 10,
				taskId: 3,
				item: 'Dust furniture and shelf',
				done: true,
				optional: false
			},
			{
				id: 11,
				taskId: 3,
				item: 'Mop',
				done: true,
				optional: false
			},
			{
				id: 12,
				taskId: 3,
				item: 'Vacuum',
				done: false,
				optional: false
			},
			{
				id: 13,
				taskId: 3,
				item: 'Clean carpets',
				done: false,
				optional: true
			},
			{
				id: 14,
				taskId: 3,
				item: 'Change bed linens',
				done: false,
				optional: false
			},
			{
				id: 15,
				taskId: 3,
				item: 'Laundry',
				done: false,
				optional: false
			},
			{
				id: 16,
				taskId: 3,
				item: 'Dispose Garbage',
				done: false,
				optional: false
			},
			{
				id: 17,
				taskId: 4,
				item: 'Pay phone bills',
				done: true,
				optional: false
			},
			{
				id: 18,
				taskId: 5,
				item: 'Review report',
				done: true,
				optional: false
			}
		]
	};

	componentDidMount() {
		// TODO: Fetch Categories
		// TODO: Fetch Tasks
		// TODO: Fetch Subtasks
	}

	render() {
		return <h3>Tasks list</h3>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksList);
