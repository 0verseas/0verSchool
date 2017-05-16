var account = (function () {
	/**
	 * cache DOM
	 */
	$pageContent = $('#pageContent');
	
	/**
	 * bind event
	 */
	$pageContent.on('click.editAccount', _handleEditAccount);

	function _handleEditAccount() {
		accountEditModal.open();
	}

})();
