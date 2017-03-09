var User = (_ => {
	/**
	 * cache DOM
	 */
	$userPage = $('#page-user');
	$userForm = $userPage.find('#userForm');
	$updateBtn = $userForm.find('#btn-updateUser');
	
	/**
	 * init
	 */
	_setUserInfo();

	/**
	 * bind event
	 */
	$updateBtn.on('click.update', _handleUpdate);

	function _handleUpdate() {
		console.log('updateeeee');
	}

	function _setUserInfo() {
		// TODO: get user info
		let userInfo = App.getUserInfo();
		for(let key in userInfo) {
			console.log(key)
			let $input = $userForm.find(`input#${key}`);
			if($input.length) {
				$input.val(userInfo[key]);
			}
		}
	}

})();
