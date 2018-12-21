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
import { Link } from 'react-router-dom';

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
			this.setState({ task: response });
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
			this.setState({
				taskCategories: [ ...this.state.taskCategories, ...taskCategories ]
			});
		}
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
		const isOptional = e.target.checked;
		this.setState({ newSubtask: { ...this.state.newSubtask, isOptional } });
	};

	addNewSubtask = () => {
		const { task, newSubtask } = this.state;
		const subtaskToAdd = {
			item: newSubtask.name,
			done: false,
			optional: newSubtask.isOptional
		};

		this.taskService.addSubTask(task.id, subtaskToAdd).then((response) => {
			const newSubTask = response.data;
			this.setState({
				task: {
					childTasks: [ ...task.childTasks, newSubTask ]
				}
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
				<section>
					<Link to={'/'}>Back</Link>
				</section>
				<form>
					<section>
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
						{/* TODO: Date */}
						<Button displayText="Save" action={this.saveTaskChanges} />
					</section>
					<section>
						<div>
							<fieldset>
								<Textbox value={newSubtask.name} changeAction={this.handleNewSubtaskName} />
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
