import React, { Component } from 'react';
import './styles.scss';
import TaskService from '../../services/TaskService';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Dropdown from '../../components/Dropdown';

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
	state = {
		task: null,
		taskCategories: []
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

	handleFormSubmit = (e) => {
		e.preventDefault();
		const { task } = this.state;
		// TODO: Handle promise response
		this.taskService.editTask(task.id, { name: task.name, priority: task.priority, categoryId: task.categoryId });
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
		// TODO: Handle promise response
		this.taskService.editSubTask(subtask.id, { item: subtask.item });
	};

	render() {
		const { task, taskCategories } = this.state;
		const { taskPriorities } = this.props;

		if (task == null) return null;

		return (
			<article className="details-page-container">
				<form onSubmit={this.handleFormSubmit}>
					<fieldset>
						<label>Name</label>
						<input type="text" value={task.name} onChange={this.handleNameChange} />
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
					<section>
						<div>add subtask</div>
						<div>
							{task.childTasks.map((subtask, subtaskIndex) => {
								return (
									<fieldset>
										<input
											type="text"
											value={subtask.item}
											onChange={(e) => this.handleSubTaskNameChange(subtask, e)}
											onBlur={(e) => this.saveSubtaskChanges(subtask)}
										/>
									</fieldset>
								);
							})}
						</div>
					</section>
					<button type="submit">Save</button>
				</form>
			</article>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DetailsPage));
