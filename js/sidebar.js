var Sidebar = (function () {
	/**
	 * cache DOM
	 */
	$toggleBtn = $('#btn-toggle');
	$sidebarWrap = $('#sidebarWrap');
	$editAccountBtn = $sidebarWrap.find('#btn-editAccount');
	$logoutBtn = $('#btn-logout');

	/**
	 * bind event
	 */
	$toggleBtn.on('click', _toggleSidebar);
	$editAccountBtn.on('click', _handleEditAccount);
	$logoutBtn.on('click', _logout);

	function _toggleSidebar() {
		$sidebarWrap.toggleClass('open');
	}

	function _handleEditAccount() {
		accountEditModal.open();
	}

	function _logout() {
		fetch('https://api.overseas.ncnu.edu.tw/users/logout', {
			method: "POST",
			credentials: 'include'
		}).then(function(res) {
			if(res.ok) {
				window.location.href = '/school/login.html'
			} else {
				throw res.status;
			}
		}).catch(function(err) {
			console.log("error: " + err);
		})
	}

})();
