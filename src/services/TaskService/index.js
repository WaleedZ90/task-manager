import axios from 'axios';
import TaskPrioritiesEnum from '../../enums/TaskPrioritiesEnum';
import { orderBy } from 'lodash';

export default class TaskService {
	baseUrl = process.env.REACT_APP_API_BASEURL;
	getTasks() {
		try {
			return axios({
				method: 'GET',
				url: `${this.baseUrl}/tasks`
			}).then((response) => {
				if (response && response.data) {
					const tasks = response.data.map((task, index) => {
						const priorityId = TaskPrioritiesEnum[task.priority];
						return {
							...task,
							priorityId
						};
					});
					return orderBy(tasks, [ 'priorityId' ], [ 'desc' ]);
				}
				return null;
			});
		} catch (error) {
			return new Error('Failed to retrieve Tasks');
		}
	}

	getSubTasks() {
		try {
			return axios({
				method: 'GET',
				url: `${this.baseUrl}/subtasks`
			}).then((response) => {
				return response.data;
			});
		} catch (error) {
			return new Error('Failed to retrieve subtasks');
		}
	}

	getTaskById(id = null) {
		try {
			if (id == null) throw new Error('there was no id supplied.');

			let taskPromise = axios({
				method: 'GET',
				url: `${this.baseUrl}/tasks/${id}`
			});

			let subTasksPromise = axios({
				method: 'GET',
				url: `${this.baseUrl}/tasks/${id}/subtasks`
			});

			return Promise.all([ taskPromise, subTasksPromise ]).then((values) => {
				let task = values[0].data;
				let subtasks = values[1].data;
				task.childTasks = subtasks;
				task.priorityId = TaskPrioritiesEnum[task.priority];

				return task;
			});
		} catch (error) {
			return new Error('Failed to retrieve single task');
		}
	}

	editTask(id, data) {
		try {
			if (id == null) throw new Error('there was no id supplied.');

			return axios({
				method: 'PATCH',
				url: `${this.baseUrl}/tasks/${id}`,
				data
			}).then((response) => {
				debugger;
			});
		} catch (error) {
			return new Error('Failed to edit task');
		}
	}

	editSubTask(id, data) {
		try {
			if (id == null) throw new Error('there was no id supplied.');

			return axios({
				method: 'PATCH',
				url: `${this.baseUrl}/subtasks/${id}`,
				data
			}).then((response) => {
				debugger;
			});
		} catch (error) {
			return new Error('Failed to edit subtask');
		}
	}
}
