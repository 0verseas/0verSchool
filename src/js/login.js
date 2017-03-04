var Login = (_ => {

	/**
	 * cache DOM 
	**/
	const $loginCard = $('#login');
	const $window = $(window);

	/**
	 * bind event
	**/
	$loginCard.on('click.login', '#btn-login', _handleLogin);
	$loginCard.on('keydown.login', 'input', _handleLogin);
	$loginCard.on('click.toChinese', '.btn-ch', () => {App.changeLanguage('ch')});
	$loginCard.on('click.toEnglish', '.btn-en', () => {App.changeLanguage('en')});
	$window.on('resize', _handleResize);

	function _handleLogin(e) {
		if(e.type == 'keydown' && e.keyCode != 13) {
			return;
		}
		const account = $loginCard.find('#account').val();
		const password = $loginCard.find('#password').val();
		console.log(account);
		console.log(password);
	}

	function _handleResize() {
		const H = $(this).height();
		const mt = (H - 202) / 2;
		$loginCard.css('margin-top', `${mt}px`);
	}

	_handleResize();

})();
