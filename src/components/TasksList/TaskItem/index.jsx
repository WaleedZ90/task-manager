import React from 'react';
import './styles.scss';
import Tag from '../../Tag';
import TaskPrioritiesEnum from '../../../enums/TaskPrioritiesEnum';

const TaskItem = (props) => {
	const { task } = props;
	if (task == null) return null;

	let tagColor = '';

	if (task.priorityId == TaskPrioritiesEnum.high) tagColor = 'danger';
	if (task.priorityId == TaskPrioritiesEnum.medium) tagColor = 'warning';
	if (task.priorityId == TaskPrioritiesEnum.low) tagColor = 'info';

	return (
		<article className="task-item col-sm-12 col-md-6">
			<header className="task-item-header">
				<h3>
					<span>{task.name}</span>
					<Tag text={task.priority.toUpperCase()} color={tagColor} />
				</h3>
				<i className="fas fa-ellipsis-v" />
			</header>
			<section className="subtasks-container">
				{task.childTasks.map((subTask, index) => {
					const { optional } = subTask;
					return (
						<div className="subtask-item">
							<input type="checkbox" />
							<p>
								<span>{subTask.item}</span>
								{!optional && <Tag text="REQUIRED" color="danger" />}
							</p>
						</div>
					);
				})}
			</section>
		</article>
	);
};

TaskItem.defaultProps = {
	task: null
};

export default TaskItem;
