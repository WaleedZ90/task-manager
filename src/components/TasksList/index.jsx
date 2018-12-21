import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filter, groupBy } from 'lodash';
import TaskService from '../../services/TaskService';
import ToastService from '../../services/ToastService';
import TaskItem from './TaskItem';
import './styles.scss';

import { Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion';
import './accordion-styles.scss';

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
	toastService = new ToastService();
	static defaultProps = {
		filters: {}
	};

	state = {
		tasks: [],
		subTasks: [],
		taskCategories: [ { id: 0, name: 'Uncategorized' } ],
		tasksMapped: [],
		isLoading: false,
		hasError: false,
		filters: {
			name: null,
			priority: null
		}
	};

	componentDidMount() {
		this.fetchTasks();
	}

	componentWillReceiveProps(newProps) {
		// Fetching Categories
		const { taskCategories, loadingTaskCategories, taskCategoriesHasError, filters } = newProps;
		if (
			taskCategories &&
			Array.isArray(taskCategories) &&
			taskCategories.length > 0 &&
			!loadingTaskCategories &&
			!taskCategoriesHasError
		) {
			this.setState({
				taskCategories: [ ...this.state.taskCategories, ...taskCategories ],
				filters: { ...this.state.filters, ...filters }
			});
		}
	}

	fetchTasks = () => {
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
	};

	mapTasks = () => {
		const { tasks, subTasks, taskCategories } = this.state;
		if (taskCategories && tasks && subTasks) {
			const tasksMapped = tasks.map((task, index) => {
				const childTasks = filter(subTasks, (subTask) => subTask.taskId === task.id);
				const category = filter(taskCategories, (category) => category.id === task.categoryId);
				task.category = category[0] != null ? category[0] : { id: 0, name: 'Uncategorized' };
				return { ...task, childTasks };
			});
			this.setState({ tasksMapped });
		}
	};

	groupTasks = (tasksArray, key) => {
		return groupBy(tasksArray, key);
	};

	updateSubtask = (subTask, e) => {
		const done = e.target.checked;
		subTask.done = done;
		this.taskService.editSubTask(subTask.id, { done }).then((response) => {
			this.setState({
				tasksMapped: this.state.tasksMapped
			});
			this.toastService.showSuccessToast('Subtask updated!');
		});
	};

	renderTasks = (categoryId) => {
		const { tasksMapped, filters } = this.state;
		let filteredTasks = [];

		if (filters.name) {
			filteredTasks = filter(tasksMapped, (task) => task.name.includes(filters.name));
		}

		if (filters.priority) {
			filteredTasks = filter(tasksMapped, (task) => task.priority === filters.priority);
		}

		if (tasksMapped.length > 0) {
			const tasksGrouped = this.groupTasks(tasksMapped, 'category.id');
			const tasksToRender = tasksGrouped[categoryId].map((task, taskIndex) => {
				return (
					<TaskItem
						key={taskIndex}
						task={task}
						onSubtaskCheck={(subtask, e) => this.updateSubtask(subtask, e)}
					/>
				);
			});

			return tasksToRender;
		}

		return null;
	};

	render() {
		const { taskCategories, tasksMapped } = this.state;

		if (taskCategories.length === 0 || tasksMapped === 0) {
			return null;
		}

		return (
			<article className="tasklist-container">
				<Accordion>
					{taskCategories.map((category, index) => {
						return (
							<AccordionItem expanded={index === 0}>
								<AccordionItemTitle>
									<h3>{category.name}</h3>
									<div className="accordion__arrow" role="presentation" />
								</AccordionItemTitle>
								<AccordionItemBody>
									<section className="container-fluid">
										<div className="row">{this.renderTasks(category.id)}</div>
									</section>
								</AccordionItemBody>
							</AccordionItem>
						);
					})}
				</Accordion>
			</article>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksList);
