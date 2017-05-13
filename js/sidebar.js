var Sidebar = (function () {
	/**
	 * cache DOM
	 */
	$toggleBtn = $('#btn-toggle');
	$sidebarWrap = $('#sidebarWrap');

	/**
	 * bind event
	 */
	$toggleBtn.on('click', _toggleSidebar);

	function _toggleSidebar() {
		$sidebarWrap.toggleClass('open');
	}

})();
