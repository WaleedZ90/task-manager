import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filter, groupBy } from 'lodash';
import TaskService from '../../../services/TaskService';
import CategoryContainer from './CategoryContainer';
import './styles.scss';

function mapStateToProps(state) {
	return {
		taskCategories: state.taskCategories,
		loadingTaskCategories: state.loadingTaskCategories,
		taskCategoriesHasError: state.taskCategoriesHasError
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
		tasks: [],
		subTasks: [],
		taskCategories: [ { id: 0, name: 'Uncategorized' } ],
		tasksMapped: [],
		isLoading: false,
		hasError: false
	};

	componentDidMount() {
		let tasksPromise = this.taskService.getTasks();
		let subTasksPromise = this.taskService.getSubTasks();
		Promise.all([ tasksPromise, subTasksPromise ])
			.then((values) => {
				this.setState({ tasks: values[0], subTasks: values[1] }, () => {
					this.mapTasks();
				});
			})
			.catch((err) => {
				this.setState({ hasError: true });
			});
	}

	componentWillReceiveProps(newProps) {
		// Fetching Categories
		const { taskCategories, loadingTaskCategories, taskCategoriesHasError } = newProps;
		if (
			taskCategories &&
			Array.isArray(taskCategories) &&
			taskCategories.length > 0 &&
			!loadingTaskCategories &&
			!taskCategoriesHasError
		) {
			this.setState({ taskCategories: [ ...this.state.taskCategories, ...taskCategories ] });
		}
	}

	mapTasks = () => {
		const { tasks, subTasks, taskCategories } = this.state;
		if (taskCategories && tasks && subTasks) {
			const tasksMapped = tasks.map((task, index) => {
				const childTasks = filter(subTasks, (subTask) => subTask.taskId == task.id);
				const category = filter(taskCategories, (category) => category.id == task.categoryId);
				task.category = category[0] != null ? category[0] : { id: 0, name: 'Uncategorized' };
				return { ...task, childTasks };
			});
			this.setState({ tasksMapped });
		}
	};

	renderTasksByCategory = (categoryId) => {
		const { tasksMapped } = this.state;
		if (tasksMapped.length > 0) {
			const tasksGrouped = groupBy(tasksMapped, 'category.id');
			const tasksToRender = tasksGrouped[categoryId].map((task, taskIndex) => {
				return <strong>{task.name}</strong>;
			});

			return tasksToRender;
		}

		return null;
	};

	render() {
		const { taskCategories, tasksMapped } = this.state;

		if (taskCategories.length == 0 || tasksMapped == 0) {
			return null;
		}

		return (
			<article className="tasklist-container">
				{taskCategories.map((category, index) => {
					return (
						<CategoryContainer categoryName={category.name}>
							{this.renderTasksByCategory(category.id)}
						</CategoryContainer>
					);
				})}
			</article>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksList);
