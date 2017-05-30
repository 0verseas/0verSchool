var School = (function () {

	function getSystemQuota(system) {
		return fetch(`https://api.overseas.ncnu.edu.tw/schools/me/systems/${system}/histories/latest?data_type=quota`, {
			credentials: 'include'
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
		});
	}

	return {
		getSystemQuota,
		setSystemQuota,
		getSystemInfo
	};

})();
