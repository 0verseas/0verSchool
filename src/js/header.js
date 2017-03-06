var Header = (_ => {
	
	/**
	 * cache DOM
	**/
	const $nav = $('#nav');

	/**
	 * bind event
	**/
	// for i18n
	// $nav.on('click.toChinese', '.btn-ch', () => {App.changeLanguage('ch')});
	// $nav.on('click.toEnglish', '.btn-en', () => {App.changeLanguage('en')});
	$nav.on('click.logout', '#btn-logout', _handleLogout);

	function _handleLogout() {
		console.log('lllllllogout~');
	}

	function _getUser() {
		App.checkLogin(function() {
			$nav.find('#userName').text('uuuser')
		});
	}

	_getUser();

})();
