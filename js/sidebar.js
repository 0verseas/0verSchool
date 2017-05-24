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
	_showUserInfo();

	function _toggleSidebar() {
		$sidebarWrap.toggleClass('open');
	}

	function _handleEditAccount() {
		accountEditModal.open();
	}

	function _logout() {
		User.logout().then(function(res) {
			if(res.ok) {
				window.location.replace('/school/login.html');
			} else {
				throw res.status;
			}
		}).catch(function(err) {
			console.log("error: " + err);
		})
	}

	function _showUserInfo() {
		var userInfo = User.getUserInfo();
		if (!userInfo) {
			setTimeout(_showUserInfo, 1);
			return;
		}
		$userName.text(userInfo.name);
		$userSchool.text(userInfo.school_editor.school.title);
	}

})();
