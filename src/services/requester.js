import axios from 'axios';
export default function(requestSettings = {}) {
	requestSettings.headers['Access-Control-Allow-Origin'] = '*';
	requestSettings.headers['Content-Type'] = 'application/json';

	const _request = axios(requestSettings);
	return _request;
}
