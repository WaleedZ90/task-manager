import React from 'react';
import './styles.scss';
import Tag from '../../Tag';
import OptionsMenu from '../../OptionsMenu';
import TaskPrioritiesEnum from '../../../enums/TaskPrioritiesEnum';
import OptionItem from '../../OptionItem';
import OptionItemTypes from '../../../enums/OptionItemTypes';
import Checkbox from '../../Checkbox';

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
				<OptionsMenu>
					<OptionItem
						config={{
							type: OptionItemTypes.ANCHOR,
							action: `/tasks/${task.id}`,
							displayText: 'Edit',
							icon: 'fas fa-edit'
						}}
					/>
				</OptionsMenu>
			</header>
			<section className="subtasks-container">
				{task.childTasks.map((subTask, index) => {
					const { optional } = subTask;
					return (
						<div className="subtask-item">
							<Checkbox action={(e) => props.onSubtaskCheck(subTask, e)} value={subTask.done} />
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
