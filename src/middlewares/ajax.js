// middleware.js
export default () => (next) => (action) => {
	const { async, auth, type, ...rest } = action;

	if (!async) return next(action);

	const SUCCESS = `${type}/SUCCESS`;
	const REQUEST = `${type}/REQUEST`;
	const FAILURE = `${type}/FAILURE`;

	// notify that request has been sent
	next({ ...rest, type: REQUEST });

	return async.request
		.then((resp) => {
			if (async.successCallback && typeof async.successCallback == 'function') {
				async.successCallback(resp.data);
			}
			next({ ...rest, resp, type: SUCCESS });
			return resp;
		})
		.catch((error) => {
			if (async.failureCallback && typeof async.failureCallback == 'function') {
				async.failureCallback(error);
			}
			next({ ...rest, error, type: FAILURE });
			throw error;
		});
};
