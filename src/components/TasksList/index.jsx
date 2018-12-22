import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filter, groupBy } from 'lodash';
import TaskService from '../../services/TaskService';
import ToastService from '../../services/ToastService';
import TaskItem from './TaskItem';
import Textbox from '../Textbox';
import Dropdown from '../Dropdown';
import './styles.scss';

import { Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion';
import './accordion-styles.scss';

function mapStateToProps(state) {
	return {
		taskCategories: state.taskCategories,
		loadingTaskCategories: state.loadingTaskCategories,
		taskCategoriesHasError: state.taskCategoriesHasError,
		taskPriorities: state.taskPriorities
	};
}
function mapDispatchToProps(dispatch) {
	return {};
}
class TasksList extends Component {
	taskService = new TaskService();
	toastService = new ToastService();

	state = {
		tasks: [],
		subTasks: [],
		taskCategories: [ { id: 0, name: 'Uncategorized' } ],
		taskPriorities: [ { id: 0, name: 'None' } ],
		tasksMapped: [],
		isLoading: false,
		hasError: false,
		filters: {
			name: '',
			priority: 0
		},
		filtersApplied: false
	};

	componentDidMount() {
		this.fetchTasks();
	}

	componentWillReceiveProps(newProps) {
		// Fetching Categories
		const { taskCategories, loadingTaskCategories, taskCategoriesHasError, taskPriorities } = newProps;
		if (
			taskCategories &&
			Array.isArray(taskCategories) &&
			taskCategories.length > 0 &&
			!loadingTaskCategories &&
			!taskCategoriesHasError
		) {
			this.setState({
				taskCategories: [ ...this.state.taskCategories, ...taskCategories ],
				taskPriorities: [ ...this.state.taskPriorities, ...taskPriorities ]
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

	renderTasks = (tasksArray) => {
		if (tasksArray && Array.isArray(tasksArray)) {
			return tasksArray.map((task, taskIndex) => {
				return (
					<TaskItem
						key={taskIndex}
						task={task}
						onSubtaskCheck={(subtask, e) => this.updateSubtask(subtask, e)}
					/>
				);
			});
		}

		return null;
	};

	renderTasksCategorized = () => {
		const { taskCategories, tasksMapped } = this.state;
		const tasksGrouped = this.groupTasks(tasksMapped, 'category.id');
		return (
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
									<div className="row">{this.renderTasks(tasksGrouped[category.id])}</div>
								</section>
							</AccordionItemBody>
						</AccordionItem>
					);
				})}
			</Accordion>
		);
	};

	renderTasksUncategorized = () => {
		const { tasksMapped, filtersApplied, filters } = this.state;
		if (filtersApplied) {
			let tasksFiltered = [];

			if (filters.name != '' && filters.priority > 0) {
				tasksFiltered = filter(
					tasksMapped,
					(task) =>
						task.name.toLowerCase().includes(filters.name.toLowerCase()) &&
						task.priorityId === filters.priority
				);

				return (
					<section className="container-fluid">
						<div className="row">{this.renderTasks(tasksFiltered)}</div>
					</section>
				);
			}

			if (filters.name != '') {
				tasksFiltered = filter(tasksMapped, (task) =>
					task.name.toLowerCase().includes(filters.name.toLowerCase())
				);

				return (
					<section className="container-fluid">
						<div className="row">{this.renderTasks(tasksFiltered)}</div>
					</section>
				);
			}

			if (filters.priority) {
				tasksFiltered = filter(tasksMapped, (task) => task.priorityId === filters.priority);

				return (
					<section className="container-fluid">
						<div className="row">{this.renderTasks(tasksFiltered)}</div>
					</section>
				);
			}

			return (
				<section className="container-fluid">
					<div className="row">{this.renderTasks(tasksMapped)}</div>
				</section>
			);
		}

		return (
			<section className="container-fluid">
				<div className="row">{this.renderTasks(tasksMapped)}</div>
			</section>
		);
	};

	handleNameFilterChange = (e) => {
		const name = e.target.value;
		const { filters } = this.state;
		if (name != '') {
			this.setState({
				filters: { ...this.state.filters, name },
				filtersApplied: name != '' || filters.priority > 0
			});
		} else {
			this.setState({
				filters: { ...this.state.filters, name },
				filtersApplied: name != '' || filters.priority > 0
			});
		}
	};

	handlePriorityChange = (e) => {
		const selectedPriority = JSON.parse(e.target.value);
		const { filters } = this.state;
		if (selectedPriority.id > 0) {
			this.setState({
				filters: { ...this.state.filters, priority: selectedPriority.id },
				filtersApplied: selectedPriority.id > 0 || filters.name != ''
			});
		} else {
			this.setState({
				filters: { ...this.state.filters, priority: selectedPriority.id },
				filtersApplied: selectedPriority.id > 0 || filters.name != ''
			});
		}
	};

	render() {
		const { filtersApplied, filters, taskCategories, tasksMapped, taskPriorities } = this.state;

		if (taskCategories.length === 0 || tasksMapped === 0) {
			return null;
		}

		return (
			<article className="tasklist-container">
				<section className="filters-section container">
					<div className="row">
						<div>
							<Textbox
								placeholder="Filter by name"
								value={filters.name}
								changeAction={this.handleNameFilterChange}
							/>
						</div>
						<div>
							<Dropdown items={taskPriorities} onChange={this.handlePriorityChange} />
						</div>
					</div>
				</section>
				{filtersApplied && this.renderTasksUncategorized()}
				{!filtersApplied && this.renderTasksCategorized()}
			</article>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksList);
