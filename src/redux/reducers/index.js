import consts from '../consts';

const initialState = {
	currentUser: {
		id: 1,
		name: 'John Smith',
		email: 'john.smith@example.com'
	},
	taskCategories: [],
	loadingTaskCategories: false,
	taskCategoriesHasError: false,
	taskPriorities: [
		{
			id: 1,
			name: 'low'
		},
		{
			id: 2,
			name: 'medium'
		},
		{
			id: 3,
			name: 'high'
		}
	]
};
const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case consts.FETCH_TASK_CATEGORIES.REQUEST:
			return { ...state, loadingTaskCategories: true };

		case consts.FETCH_TASK_CATEGORIES.SUCCESS:
			const taskCategories = action.resp.data;
			return { ...state, taskCategories, loadingTaskCategories: false };

		case consts.FETCH_TASK_CATEGORIES.FAILURE:
			return { ...state, taskCategoriesHasError: true };

		default:
			return state;
	}
};
export default rootReducer;
