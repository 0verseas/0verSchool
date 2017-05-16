var Sidebar = (function () {
	/**
	 * cache DOM
	 */
	$toggleBtn = $('#btn-toggle');
	$sidebarWrap = $('#sidebarWrap');
	$editAccountBtn = $sidebarWrap.find('#btn-editAccount');

	/**
	 * bind event
	 */
	$toggleBtn.on('click', _toggleSidebar);
	$editAccountBtn.on('click', _handleEditAccount)

	function _toggleSidebar() {
		$sidebarWrap.toggleClass('open');
	}

	function _handleEditAccount() {
		accountEditModal.open();
	}

})();
