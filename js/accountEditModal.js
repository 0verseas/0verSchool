var accountEditModal;
$(document).ready(function () {
	accountEditModal = (function () {
		/**
		 * cache DOM
		 */
		var page = $('.modal-content');
		var username = $('[name=username]');
		var password = $('[name=password]');
		var passwordSecond = $('[name=password-second]');
		var name = $('[name=name]');
		var engName = $('[name=eng_name]');
		var email = $('[name=email]');
		var organization = $('[name=organization]');
		var phone = $('[name=phone]');
		
		var $modal = $('#modal-editAccount');
		var $storeBtn = $('#store-btn');

		var emailDiv = $('#email-div');
		var emailWarning = $('#email-warning');
		var passwordCheckDiv = $('#password-check-div');
		var passwordCheck = $('#password-check');

		$storeBtn.on('click', _store);
		password.on('input', _doubleCheck);
		passwordSecond.on('input', _doubleCheck);
		email.on('input', _checkEmail);

		// 密碼二次確認
		function _doubleCheck() {
			if (passwordSecond.val() !== password.val()) {
				passwordCheckDiv.addClass('has-danger');
				passwordSecond.addClass('form-control-danger');
				passwordCheck.show();
			} else {
				passwordCheckDiv.removeClass('has-danger');
				passwordSecond.removeClass('form-control-danger');
				passwordCheck.hide();
			}
		}

		function _checkEmail() {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			// 如果正確
			if (re.test(email.val())) {
				emailDiv.removeClass('has-danger');
				email.removeClass('form-control-danger');
				emailWarning.hide();
			} else {
				emailDiv.addClass('has-danger');
				email.addClass('form-control-danger');
				emailWarning.show();
			}
		}

		function open() {
			// 重新call 登入API 拿到最新身份
			var user = User.getUserInfo();
			username.attr('value', user.username);
			name.attr('value', user.name);
			engName.attr('value', user.eng_name);
			email.attr('value', user.email);
			organization.attr('value', user.school_editor.organization);
			phone.attr('value', user.phone);
			// 確認身份再選擇跑哪一個modal
			$modal.modal({
				backdrop: 'static',
				keyboard: false
			});
		}
		function _checkForm() {
			var $inputs = page.find('.required');
			var valid = true;
			for (let input of $inputs) {
				if (!$(input).val()) {
					$(input).focus();
					valid = false;
					break;
				}
			}
			return valid;
		}

		// 儲存使用者資料
		function _store() {
			// check dom value
			if (!_checkForm()) {
				alert('輸入有誤');
				return;
			}
			// check password is changed
			storedPassword = null; 
			if (password.val()) {
				storedPassword = sha256(password.val());
			}
			var userInfo = {
				username: username.val(),
				password: storedPassword,	
				email: email.val(),
				name: name.val(),
				eng_name: engName.val(),
				phone: phone.val(),
				organization: organization.val(),
				has_banned:	false,
				has_admin: true,
				departments: {
					bachelor: [],
					two_year: [],
					master: [],
					phd: []
				}
			}

      openLoading();

			// call API
			User.update(userInfo).then(function() {
				$modal.modal('hide');

        stopLoading();
			}).catch(function(err) {
				err.json && err.json().then((data) => {
          console.error(data);
          alert(`ERROR: \n${data.messages[0]}`);

          stopLoading();
        });
			});
		}

		return {
			open
		}

	})();
});
