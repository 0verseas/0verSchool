var login = (function () {

	/**
	 * cache DOM
	 */

	var $username = $('#username');
	var $password = $('#password');
	var $loginBtn = $('#btn-login');
	var $errMsg = $('#errMsg');
	var $getStatus = $('#getStatus');

	// 引入 reCAPTCHA 的 JS 檔案
    var s = document.createElement('script');
    let src = 'https://www.google.com/recaptcha/api.js?render=' + env.reCAPTCHA_site_key;
    s.setAttribute('src', src);
    document.body.appendChild(s);

	/**
	 * bind event
	 */

	$loginBtn.on('click', _login);
	$password.on('keydown', _login);
	$getStatus.on('click', _getStatus);

	/**
	 * init
	 */

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
			password: sha256(password),
			google_recaptcha_token: ''
		}

		grecaptcha.ready(function() {
            grecaptcha.execute(env.reCAPTCHA_site_key, {
              action: 'SchoolLogin'
            }).then(function(token) {
                // token = document.getElementById('btn-login').value
                loginForm.google_recaptcha_token=token;
            }).then(function(){
				User.login(loginForm).then(function (res) {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw res;
                    }
                }).then(function (json) {
                    // console.log(json);
					window.location.href = '/school/index.html';
					// window.location.href = '/school/systemQuota.html'
                }).catch(function (err) {
                    console.log(err);
                    if (err.status == 401) {
                        $errMsg.finish().show().text('帳號或密碼錯誤。').fadeOut(5000);
                    } else if (err.status == 403) {
                        $errMsg.finish().show().text('Google reCAPTCHA verification failed').fadeOut(5000);
                    }
                    else if (err.status == 429) {  // 429 Too Many Requests
                        $errMsg.finish().show().text('錯誤次數太多，請稍後再試。').fadeOut(5000);
                    }
                })
			});
        });
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
