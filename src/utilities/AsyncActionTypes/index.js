export default function asyncActionTypes(actionName) {
	return {
		START: actionName,
		REQUEST: `${actionName}/REQUEST`,
		SUCCESS: `${actionName}/SUCCESS`,
		FAILURE: `${actionName}/FAILURE`
	};
}
