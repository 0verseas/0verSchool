var School = (function () {

	function getSchoolInfo() {
		return fetch(`https://api.overseas.ncnu.edu.tw/schools/me/histories/latest`, {
			credentials: 'include'
		})
		.then(function (res) {
			if (res.status === 404) {
				alert('沒有這個學制。 即將返回上一頁。');
				window.history.back();
			}
			return res;
		});
	}

	function setSchoolInfo(data) {
		return fetch(`https://api.overseas.ncnu.edu.tw/schools/me/histories`, {
			method: 'POST',
			body: data,
			credentials: 'include'
		});
	}

	function getSystemQuota(system) {
		return fetch(`https://api.overseas.ncnu.edu.tw/schools/me/systems/${system}/histories/latest?data_type=quota`, {
			credentials: 'include'
		})
		.then(function (res) {
			if (res.status === 404) {
				window.location.replace('/404.html');
			}
			return res;
		});
	}

	function setSystemQuota(system, data) {
		return fetch(`https://api.overseas.ncnu.edu.tw/schools/me/systems/${system}/histories?data_type=quota`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}, 
			credentials: 'include', 
			body: JSON.stringify(data)
		});
	}

	function getSystemInfo(system) {
		return fetch(`https://api.overseas.ncnu.edu.tw/schools/me/systems/${system}/histories/latest?data_type=info`, {
			credentials: 'include'
		})
		.then(function (res) {
			if (res.status === 404) {
				alert('沒有這個學制。 即將返回上一頁。');
				window.history.back();
			}
			return res;
		})
	}

	function setSystemInfo(system, data) {
		return fetch(`https://api.overseas.ncnu.edu.tw/schools/me/systems/${system}/histories?data_type=info`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}, 
			credentials: 'include', 
			body: JSON.stringify(data)
		});
	}

	function getDeptInfo(system, deptId) {
		return fetch(`https://api.overseas.ncnu.edu.tw/schools/me/systems/${system}/departments/${deptId}/histories/latest`, {
			credentials: 'include'
		})
	}

	function getDeptGroups() {
		return fetch(`https://api.overseas.ncnu.edu.tw/department-groups`, {
			credentials: 'include'
		})
	}

	function getEvaluationLevels(){
		return fetch(`https://api.overseas.ncnu.edu.tw/evaluation-levels`, {
			credentials: 'include'
		})
	}

	function getApplicationDocumentTypes(system) {
		return fetch(`https://api.overseas.ncnu.edu.tw/systems/${system}/application-document-types`, {
			credentials: 'include'
		})
	}

	return {
		getSchoolInfo,
		setSchoolInfo,
		getSystemQuota,
		setSystemQuota,
		getSystemInfo,
		setSystemInfo,
		getDeptInfo,
		getDeptGroups,
		getEvaluationLevels,
		getApplicationDocumentTypes
	};

})();
