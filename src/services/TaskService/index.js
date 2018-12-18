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
}
