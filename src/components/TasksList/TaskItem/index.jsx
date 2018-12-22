import React from 'react';
import './styles.scss';
import Tag from '../../Tag';
import OptionsMenu from '../../OptionsMenu';
import TaskPrioritiesEnum from '../../../enums/TaskPrioritiesEnum';
import OptionItem from '../../OptionItem';
import OptionItemTypes from '../../../enums/OptionItemTypes';
import Checkbox from '../../Checkbox';
import Anchor from '../../Anchor';

const TaskItem = (props) => {
	const { task, showBorderBottom } = props;
	if (task == null) return null;

	const shouldRenderChildren = task.childTasks && task.childTasks.length > 0;
	let tagColor = '';

	if (task.priorityId == TaskPrioritiesEnum.high) tagColor = 'danger';
	if (task.priorityId == TaskPrioritiesEnum.medium) tagColor = 'warning';
	if (task.priorityId == TaskPrioritiesEnum.low) tagColor = 'info';

	return (
		<article className={`task-item col-sm-12 ${showBorderBottom ? 'task-item-border-bottom' : ''}`}>
			<header className="task-item-header">
				<h3>
					<span>{task.name}</span>
					{task.priority && <Tag text={task.priority.toUpperCase()} color={tagColor} />}
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
				{shouldRenderChildren &&
					task.childTasks.map((subTask, index) => {
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

				{!shouldRenderChildren && (
					<div className="empty-state-container">
						<p>No subtasks to view</p>
						<Anchor to={`/tasks/${task.id}`} displayText={'Add Subtask'} />
					</div>
				)}
			</section>
		</article>
	);
};

TaskItem.defaultProps = {
	task: null,
	showBorderBottom: false
};

export default TaskItem;
