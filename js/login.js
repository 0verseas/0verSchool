var login = (function () {

	/**
	 * cache DOM
	 */

	$username = $('#username');
	$password = $('#password');
	$loginBtn = $('#btn-login');
	$errMsg = $('#errMsg')

	/**
	 * bind event
	 */

	$loginBtn.on('click', _login);

	// 登入：
	// 200: 跳轉至 /school
	// 401: 顯示錯誤訊息
	function _login() {
		var loginForm = {
			username: $username.val(),
			password: $password.val()
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
				$errMsg.text('帳號密碼錯誤。');
			}
		})
	}

})();
