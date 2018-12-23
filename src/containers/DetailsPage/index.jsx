import React, { Component } from 'react';
import './styles.scss';
import TaskService from '../../services/TaskService';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import Textbox from '../../components/Textbox';
import ToastService from '../../services/ToastService';
import { filter } from 'lodash';
import Anchor from '../../components/Anchor';

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
class DetailsPage extends Component {
	taskService = new TaskService();
	toastService = new ToastService();
	state = {
		task: null,
		taskCategories: [],
		newSubtask: {
			name: '',
			isOptional: false
		}
	};

	componentDidMount() {
		const taskId = this.props.match.params.id;
		this.taskService.getTaskById(taskId).then((response) => {
			const { taskCategories } = this.state;
			const task = response;
			const category = filter(taskCategories, (category) => category.id === task.categoryId);
			task.category = category[0] != null ? category[0] : { id: 0, name: 'Uncategorized' };
			this.setState({ task });
		});
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const { taskCategories, taskPriorities } = nextProps;
		return {
			taskCategories,
			taskPriorities
		};
	}

	saveTaskChanges = () => {
		const { task } = this.state;
		this.taskService
			.editTask(task.id, { name: task.name, priority: task.priority, categoryId: task.categoryId })
			.then((response) => {
				this.toastService.showSuccessToast('Task edited successfully!');
			});
	};

	handleNameChange = (e) => {
		const name = e.target.value;
		this.setState({ task: { ...this.state.task, name } });
	};

	handleDueDateChange = (e) => {
		const dueDate = e.target.value;
		this.setState({ task: { ...this.state.task, dueDate } });
	};

	handleCategoryChange = (e) => {
		const selectedCategory = JSON.parse(e.target.value);
		this.setState({ task: { ...this.state.task, categoryId: selectedCategory.id } });
	};

	handlePriorityChange = (e) => {
		const selectedPriority = JSON.parse(e.target.value);
		this.setState({
			task: {
				...this.state.task,
				priority: selectedPriority.name,
				priorityId: selectedPriority.id
			}
		});
	};

	handleSubTaskNameChange = (subtask, e) => {
		subtask.item = e.target.value;
		this.setState({ task: this.state.task });
	};

	saveSubtaskChanges = (subtask) => {
		this.taskService.editSubTask(subtask.id, { item: subtask.item }).then((response) => {
			this.toastService.showSuccessToast(`Subtask [${subtask.id}]: Successfully edited.`);
		});
	};

	handleNewSubtaskName = (e) => {
		const name = e.target.value;
		this.setState({ newSubtask: { ...this.state.newSubtask, name } });
	};

	handleOptionalCheckboxChange = (e) => {
		const isOptional = e;
		this.setState({ newSubtask: { ...this.state.newSubtask, isOptional } });
	};

	addNewSubtask = () => {
		const { task, newSubtask } = this.state;
		const subtaskToAdd = {
			item: newSubtask.name,
			done: false,
			optional: newSubtask.isOptional
		};
		debugger;

		this.taskService.addSubTask(task.id, subtaskToAdd).then((response) => {
			const newSubTask = response.data;
			task.childTasks.push(newSubTask);
			this.setState({
				task
			});
			this.toastService.showSuccessToast('Subtask added successfully!');
		});
	};

	render() {
		const { task, taskCategories, newSubtask } = this.state;
		const { taskPriorities, loadingTaskCategories } = this.props;

		if (task == null || loadingTaskCategories == true) return null;

		return (
			<article className="details-page-container">
				<section className="back-section">
					<Anchor to={'/'} displayText={'Back'} />
				</section>
				<form>
					<section className="task-edit-section">
						<fieldset>
							<label>Name</label>
							<Textbox value={task.name} changeAction={this.handleNameChange} />
						</fieldset>
						<fieldset>
							<label>Category</label>
							<Dropdown
								items={taskCategories}
								onChange={this.handleCategoryChange}
								selectedId={task.categoryId}
							/>
						</fieldset>
						<fieldset>
							<label>Priority</label>
							<Dropdown
								items={taskPriorities}
								onChange={this.handlePriorityChange}
								selectedId={task.priorityId}
							/>
						</fieldset>
						<fieldset>
							<label>Due Date</label>
							<Textbox value={task.dueDate} changeAction={this.handleDueDateChange} />
						</fieldset>
						<Button displayText="Save" action={this.saveTaskChanges} />
					</section>
					<section className="subtasks-edit-section">
						<div className="add-subtask-section">
							<fieldset>
								<Textbox
									value={newSubtask.name}
									placeholder={'Subtask info'}
									changeAction={this.handleNewSubtaskName}
								/>
								<Checkbox displayText="Optional" action={this.handleOptionalCheckboxChange} />
								<Button displayText="Add Subtask" action={this.addNewSubtask} />
							</fieldset>
						</div>
						<div>
							{task.childTasks.map((subtask, subtaskIndex) => {
								return (
									<fieldset>
										<Textbox
											value={subtask.item}
											changeAction={(e) => this.handleSubTaskNameChange(subtask, e)}
											blurAction={(e) => this.saveSubtaskChanges(subtask)}
										/>
									</fieldset>
								);
							})}
						</div>
					</section>
				</form>
			</article>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DetailsPage));
