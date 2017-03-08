var User = (_ => {
	/**
	 * cache DOM
	 */
	$userPage = $('#page-user');
	$updateBtn = $userPage.find('#btn-updateUser');
	
	/**
	 * init
	 */
	_getUserInfo();

	/**
	 * bind event
	 */
	$updateBtn.on('click.update', _handleUpdate);

	function _handleUpdate() {
		console.log('updateeeee');
	}

	function _getUserInfo() {
		// TODO: get user info
	}

})();
