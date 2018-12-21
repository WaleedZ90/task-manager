import { toast } from 'react-toastify';

class ToastService {
	baseSettings = {
		position: toast.POSITION.TOP_RIGHT,
		autoClose: 2000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true
	};

	_overrideBaseSettings(customSettings) {
		return {
			...this.baseSettings,
			customSettings
		};
	}

	showSuccessToast(message = '', customSettings = {}) {
		toast.success(message, this._overrideBaseSettings(customSettings));
	}

	showDangerToast(message = '', customSettings = {}) {
		toast.error(message, this._overrideBaseSettings(customSettings));
	}

	showWarningToast(message = '', customSettings = {}) {
		toast.warn(message, this._overrideBaseSettings(customSettings));
	}

	showInfoToast(message = '', customSettings = {}) {
		toast.info(message, this._overrideBaseSettings(customSettings));
	}
}

export default ToastService;
