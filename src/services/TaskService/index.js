import requester from '../requester';
import axios from 'axios';

export default class TaskService {
	baseUrl = 'http//localhost:3001';
	getTasks() {
		try {
			return axios({
				method: 'GET',
				url: `${this.baseUrl}/tasks`
			}).then((response) => {
				return response;
			});
		} catch (error) {
			return new Error('Failed to retrieve Tasks');
		}
	}
}
