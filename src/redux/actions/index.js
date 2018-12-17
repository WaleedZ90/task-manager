import consts from '../consts';
import axios from 'axios';

// TODO: refactor that
const baseUrl = process.env.REACT_APP_API_BASEURL;

export const fetchTaskCategories = () => ({
	type: consts.FETCH_TASK_CATEGORIES.START,
	async: axios({
		method: 'GET',
		url: `${baseUrl}/categories`
	})
});
