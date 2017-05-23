var Sidebar = (function () {
	/**
	 * cache DOM
	 */
	$toggleBtn = $('#btn-toggle');
	$sidebarWrap = $('#sidebarWrap');
	$editAccountBtn = $sidebarWrap.find('#btn-editAccount');
	$logoutBtn = $sidebarWrap.find('#btn-logout');
	$userSchool = $sidebarWrap.find('#userSchool');
	$userName = $sidebarWrap.find('#userName');

	/**
	 * bind event
	 */
	$toggleBtn.on('click', _toggleSidebar);
	$editAccountBtn.on('click', _handleEditAccount);
	$logoutBtn.on('click', _logout);

	/**
	 * init
	 */
	User.isLogin().then(function (res) {
		if(res.ok) {
			return res.json();
		} else {
			throw res.status;
		}
	}).then(function (json) {
		_showUserInfo(json);
	}).catch(function (err) {
		if (err == 401) {
			location.href = '/school/login.html';
		}
	});

	function _toggleSidebar() {
		$sidebarWrap.toggleClass('open');
	}

	function _handleEditAccount() {
		accountEditModal.open();
	}

	function _logout() {
		User.logout().then(function(res) {
			if(res.ok) {
				window.location.href = '/school/login.html'
			} else {
				throw res.status;
			}
		}).catch(function(err) {
			console.log("error: " + err);
		})
	}

	function _showUserInfo(userInfo) {
		$userName.text(userInfo.name);
		// 我拿不到隸屬學校rrrrrrrr
	}

})();
