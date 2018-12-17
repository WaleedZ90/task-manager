import consts from '../consts';
// src/js/reducers/index.js
const initialState = {
	currentUser: {
		id: 1,
		name: 'John Smith',
		email: 'john.smith@example.com'
	},
	taskCategories: [
		{
			id: 1,
			name: 'Personal'
		},
		{
			id: 2,
			name: 'Work'
		}
	],
	loadingTaskCategories: false
};
const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case consts.FETCH_TASK_CATEGORIES.REQUEST:
			return { ...state, loadingTaskCategories: true };

		case consts.FETCH_TASK_CATEGORIES.SUCCESS:
			return { ...state, loadingTaskCategories: false };

		default:
			return state;
	}
};
export default rootReducer;
