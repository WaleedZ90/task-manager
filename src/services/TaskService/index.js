import axios from 'axios';

export default class TaskService {
	baseUrl = process.env.REACT_APP_API_BASEURL;
	getTasks() {
		try {
			return axios({
				method: 'GET',
				url: `${this.baseUrl}/tasks`
			}).then((response) => {
				return response.data;
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
