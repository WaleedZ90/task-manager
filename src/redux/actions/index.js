import consts from '../consts';
import axios from 'axios';

// TODO: refactor that
const baseUrl = 'http://localhost:4000';

export const fetchTaskCategories = (successCallback, failureCallback) => ({
	type: consts.FETCH_TASK_CATEGORIES.START,
	async: axios({
		method: 'GET',
		url: `${baseUrl}/categories`
	}),
	successCallback,
	failureCallback
});
