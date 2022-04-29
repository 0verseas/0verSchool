var School = (function () {

	var baseUrl = env.baseUrl;

	function getSchoolInfo() {
		return fetch(baseUrl + `/schools/me/histories/latest`, {
			credentials: 'include'
		});
	}

	function setSchoolInfo(data) {
		return fetch(baseUrl + `/schools/me/histories`, {
			method: 'POST',
			body: data,
			credentials: 'include'
		});
	}

	function getFirstSystemQuota(schoolid) {
		return fetch(baseUrl + `/schools/${schoolid}/quotas`, {
			credentials: 'include'
		});
	}

	function setFirstSystemQuota(schoolid, data) {
		return fetch(baseUrl + `/schools/${schoolid}/quotas`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(data)
		});
	}

	function getSystemQuota(system) {
		return fetch(baseUrl + `/schools/me/systems/${system}/histories/latest?data_type=quota`, {
			credentials: 'include'
		});
	}

	function setSystemQuota(system, data) {
		return fetch(baseUrl + `/schools/me/systems/${system}/histories?data_type=quota`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(data)
		});
	}

	function getSystemInfo(system) {
		return fetch(baseUrl + `/schools/me/systems/${system}/histories/latest?data_type=info`, {
			credentials: 'include'
		});
	}

	function setSystemInfo(system, data) {
		return fetch(baseUrl + `/schools/me/systems/${system}/histories?data_type=info`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(data)
		});
	}

	function lockSystemInfo (schoolId, systemId, data) {
		return fetch(baseUrl + `/schools/${schoolId}/systems/${systemId}/histories/confirmation`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(data)
		});
	}

	function getGuidelinesReplyForm(system, data) {
		return fetch(`${baseUrl}/schools/me/systems/${system}/guidelines-reply-form`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(data)
		});
	}

	function getDeptInfo(system, deptId) { // 取得某學制某系所
		return fetch(baseUrl + `/schools/me/systems/${system}/departments/${deptId}/histories/latest`, {
			credentials: 'include'
		})
	}

	function setDeptInfo(system, deptId, data) { // 儲存某學制某系所
		return fetch(baseUrl + `/schools/me/systems/${system}/departments/${deptId}/histories`, {
			method: 'POST',
			body: data,
			credentials: 'include'
		});
	}

	function getDeptFormItem(system) { // 取得系所 Modal 中下拉式選單的 option，包含學群、評鑑、審查項目。
		var urls = [
		baseUrl + '/department-groups',
		baseUrl + '/evaluation-levels',
		baseUrl + '/systems/' + system + '/application-document-types'
		]
		const grabContent = url => fetch(url, {
			credentials: 'include'
		})
		return Promise
		.all(urls.map(grabContent))
	}

	function getSchoolLogoFile() {
		return fetch(baseUrl + `/editors/logo-upload`, {
			method: 'GET',
			credentials: 'include'
		});
	}

	function uploadSchoolLogoFile(data) {
		return fetch(baseUrl + `/editors/logo-upload`, {
			method: 'POST',
			body: data,
			credentials: 'include'
		});
	}

	function deleteSchoolLogoFile(fileName) {
		return fetch(baseUrl + `/editors/logo-upload/${fileName}`, {
			method: 'DELETE',
			credentials: 'include'
		});
	}

	return {
		getSchoolInfo,
		setSchoolInfo,
		getFirstSystemQuota,
		setFirstSystemQuota,
		getSystemQuota,
		setSystemQuota,
		getSystemInfo,
		setSystemInfo,
		lockSystemInfo,
		getDeptInfo,
		setDeptInfo,
		getDeptFormItem,
		getGuidelinesReplyForm,
		getSchoolLogoFile,
		uploadSchoolLogoFile,
		deleteSchoolLogoFile
	};

})();
