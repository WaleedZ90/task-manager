import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filter, groupBy, remove, clone } from 'lodash';
import TaskService from '../../services/TaskService';
import ToastService from '../../services/ToastService';
import TaskItem from './TaskItem';
import Textbox from '../Textbox';
import Dropdown from '../Dropdown';
import Button from '../Button';
import Modal from 'react-responsive-modal';
import TaskPrioritiesEnum from '../../enums/TaskPrioritiesEnum';
import './styles.scss';
import styles from './modal-styles.scss';

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
		taskCategories: [],
		taskPriorities: [ { id: 0, name: 'None' } ],
		tasksMapped: [],
		isLoading: false,
		hasError: false,
		filters: {
			name: '',
			priority: 0
		},
		filtersApplied: false,
		openModal: false,
		newTask: {
			name: '',
			priority: null,
			categoryId: null,
			dueDate: ''
		}
	};

	componentDidMount() {
		this.fetchTasks();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const { taskCategories, taskPriorities } = nextProps;
		return {
			taskCategories,
			taskPriorities
		};
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
		const done = e;
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
				const showBorderBottom = tasksArray[taskIndex + 1] != null;
				return (
					<TaskItem
						key={taskIndex}
						task={task}
						onSubtaskCheck={(subtask, e) => this.updateSubtask(subtask, e)}
						showBorderBottom={showBorderBottom}
					/>
				);
			});
		}

		return null;
	};

	renderTasksCategorized = () => {
		const { tasksMapped } = this.state;
		const tasksGrouped = this.groupTasks(tasksMapped, 'category.id');

		let taskCategories = clone(this.state.taskCategories);
		remove(taskCategories, (category) => {
			return tasksGrouped[category.id] == null;
		});

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

	openModal = () => {
		this.setState({ openModal: true });
	};

	closeModal = () => {
		this.setState({ openModal: false });
	};

	handleFormNameChange = (e) => {
		const name = e.target.value;
		this.setState({ newTask: { ...this.state.newTask, name } });
	};

	handleFormDueDateChange = (e) => {
		const dueDate = e.target.value;
		this.setState({ newTask: { ...this.state.newTask, dueDate } });
	};

	handleFormPriorityChange = (e) => {
		const selectedPriority = JSON.parse(e.target.value);
		let priority = null;
		if (selectedPriority.id == 0) {
			this.setState({ newTask: { ...this.state.newTask, priority } });
		} else {
			priority = selectedPriority.name;
			this.setState({ newTask: { ...this.state.newTask, priority } });
		}
	};

	handleFormCategoryChange = (e) => {
		const selectedCategory = JSON.parse(e.target.value);
		let categoryId = null;
		if (selectedCategory.id == 0) {
			this.setState({ newTask: { ...this.state.newTask, categoryId } });
		} else {
			categoryId = selectedCategory.id;
			this.setState({ newTask: { ...this.state.newTask, categoryId } });
		}
	};

	addNewTask = () => {
		const { newTask } = this.state;
		this.taskService.addTask(newTask).then((response) => {
			const { taskCategories } = this.state;
			let task = response.data;
			task.childTasks = [];
			const category = filter(taskCategories, (category) => category.id === task.categoryId);
			task.category = category[0] != null ? category[0] : { id: 0, name: 'Uncategorized' };
			task.priorityId = TaskPrioritiesEnum[task.priority];

			this.setState(
				{
					tasksMapped: [ ...this.state.tasksMapped, task ]
				},
				() => {
					this.closeModal();
					this.toastService.showSuccessToast('Task added successfully!');
				}
			);
		});
	};

	render() {
		const { filtersApplied, filters, taskCategories, tasksMapped, taskPriorities, openModal, newTask } = this.state;

		if (taskCategories.length === 0 || tasksMapped.length === 0) {
			return null;
		}

		return (
			<article className="tasklist-container">
				<section className="filters-section container">
					<div className="row filters-wrapper">
						<div className="col-sm-12 col-md-3">
							<Textbox
								placeholder="Filter by name"
								value={filters.name}
								changeAction={this.handleNameFilterChange}
							/>
						</div>
						<div className="col-sm-12 col-md-3">
							<Dropdown items={taskPriorities} onChange={this.handlePriorityChange} />
						</div>
						<div className="col-sm-12 col-md-5">
							<Button displayText="Add Task" action={this.openModal} />
						</div>
					</div>
				</section>
				{filtersApplied && this.renderTasksUncategorized()}
				{!filtersApplied && this.renderTasksCategorized()}

				<Modal open={openModal} onClose={this.closeModal} focusTrapped classNames={{ modal: 'customModal' }}>
					<h2>Add new Task</h2>
					<form>
						<fieldset>
							<label>Name</label>
							<Textbox value={newTask.name} changeAction={this.handleFormNameChange} />
						</fieldset>
						<fieldset>
							<label>Due date</label>
							<Textbox value={newTask.dueDate} changeAction={this.handleFormDueDateChange} />
						</fieldset>
						<fieldset>
							<label>Priority</label>
							<Dropdown items={taskPriorities} onChange={this.handleFormPriorityChange} />
						</fieldset>
						<fieldset>
							<label>Category</label>
							<Dropdown items={taskCategories} onChange={this.handleFormCategoryChange} />
						</fieldset>
						<fieldset className="add-button-section">
							<Button displayText="Add Task" action={this.addNewTask} />
						</fieldset>
					</form>
				</Modal>
			</article>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksList);
