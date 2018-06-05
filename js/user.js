var User = (function () {
	var _userInfo;
	var baseUrl = env.baseUrl;

	function _setUserInfo(userInfo) {
		_userInfo = userInfo;
	}

	function login(loginForm) {
		return fetch(baseUrl + '/editors/login', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(loginForm)
		});
	}

	function logout() {
		return fetch(baseUrl + '/editors/logout', {
			method: "POST",
			credentials: 'include'
		});
	}

	function isLogin() {
		return fetch(baseUrl + '/editors/login', {
			credentials: 'include'
		});
	}
	
	// permission: 'school_editor' | 'school_reviewer'
	function checkLogin(permission) {
		return isLogin().then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res.status;
			}
		}).then(function (json) {
			if (!json[permission] || json[permission].has_banned) {
				location.replace('/school/login.html');
			} else {
				_setUserInfo(json);
			}
		}).catch(function (err) {
			if (err == 401) {
				location.replace('/school/login.html');
			}
		});
	}

	function update(userInfo) {
		return fetch(baseUrl + `/schools/me/editors/${userInfo.username}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(userInfo)
		}).then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res.status;
			}
		}).then(function (json) {
			_setUserInfo(json);
			Sidebar.showUserInfo();
		});
	}

	function getUserInfo() {
		return _userInfo
	}

	return {
		login, 
		logout, 
		isLogin, 
		checkLogin, 
		getUserInfo,
		update
	}
})();
