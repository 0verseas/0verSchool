var login = (function () {

	/**
	 * cache DOM
	 */

	$username = $('#username');
	$password = $('#password');
	$loginBtn = $('#btn-login');
	$errMsg = $('#errMsg');

	/**
	 * bind event
	 */

	$loginBtn.on('click', _login);
	$password.on('keydown', _login);

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
			password: sha3_256(password)
		}

		fetch('http://localhost:8000/api/users/login', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(loginForm)
		}).then(function(res) {
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

})();
