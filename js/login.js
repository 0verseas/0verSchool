var login = (function () {

	/**
	 * cache DOM
	 */

	$username = $('#username');
	$password = $('#password');
	$loginBtn = $('#btn-login');
	$errMsg = $('#errMsg');
	$getStatus = $('#getStatus');

	/**
	 * bind event
	 */

	$loginBtn.on('click', _login);
	$password.on('keydown', _login);
	$getStatus.on('click', _getStatus);

	// 登入：
	// 200: 跳轉至 /school
	// 401: 顯示錯誤訊息
	function _login(e) {
		if (e.type == 'keydown' && e.keyCode != 13) {
			return;
		}

		var username = $username.val();
		var password = $password.val();

		if (!username || !password) {
			return;
		}

		var loginForm = {
			username: username,
			password: sha256(password)
		}

		User.login(loginForm).then(function(res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res.status;
			}
		}).then(function(json) {
			console.log(json);
			window.location.href = '/school/'
		}).catch(function(err) {
			if (err == 401) {
				$errMsg.finish().show().text('帳號密碼錯誤。').fadeOut(1500);
			}
		})
	}

	function _getStatus() {
		User.isLogin().then(function(res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function(json) {
			console.log(json);
		}).catch(function(err) {
			console.log(err);
		})
	}

})();