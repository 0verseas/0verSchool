var School = (function () {

	function getSchoolInfo() {
		return fetch(`https://api.overseas.ncnu.edu.tw/schools/me/histories/latest`, {
			credentials: 'include'
		})
		.then(function (res) {
			if (res.status === 404) {
				alert('查無學校資料。 即將返回上一頁。');
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

	function getDeptInfo(system, deptId) { // 取得某學制某系所
		return fetch(`https://api.overseas.ncnu.edu.tw/schools/me/systems/${system}/departments/${deptId}/histories/latest`, {
			credentials: 'include'
		})
	}

	function setDeptInfo(system, deptId, data) { // 儲存某學制某系所
		return fetch(`https://api.overseas.ncnu.edu.tw/schools/me/systems/${system}/departments/${deptId}/histories`, {
			method: 'POST',
			body: data,
			credentials: 'include'
		});
	}

	function getDeptFormItem(system) { // 取得系所 Modal 中下拉式選單的 option，包含學群、評鑑、審查項目。
		var urls = [
		'https://api.overseas.ncnu.edu.tw/department-groups',
		'https://api.overseas.ncnu.edu.tw/evaluation-levels',
		'https://api.overseas.ncnu.edu.tw/systems/' + system + '/application-document-types'
		]
		const grabContent = url => fetch(url, {
			credentials: 'include'
		})
		return Promise
		.all(urls.map(grabContent))
	}

	return {
		getSchoolInfo,
		setSchoolInfo,
		getSystemQuota,
		setSystemQuota,
		getSystemInfo,
		setSystemInfo,
		getDeptInfo,
		setDeptInfo,
		getDeptFormItem
	};

})();
