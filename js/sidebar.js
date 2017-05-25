var Sidebar = (function () {
	/**
	 * cache DOM
	 */
	var $toggleBtn = $('#btn-toggle');
	var $sidebarWrap = $('#sidebarWrap');
	var $editAccountBtn = $sidebarWrap.find('#btn-editAccount');
	var $logoutBtn = $sidebarWrap.find('#btn-logout');
	var $userSchool = $sidebarWrap.find('#userSchool');
	var $userName = $sidebarWrap.find('#userName');

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
