var accountEditModal;
$(document).ready(function () {
	accountEditModal = (function () {
		/**
		 * cache DOM
		 */
		var username = $('[name=username]');
		var name = $('[name=name]');
		var engName = $('[name=eng_name]');
		var email = $('[name=email]');
		var organization = $('[name=organization]');
		var phone = $('[name=phone]');
		
		var $modal = $('#modal-editAccount');
		var $storeBtn = $('#store-btn');
		$storeBtn.on('click', _store);
		$('#name-warnning').hide();

		function open() {
			// 重新call 登入API 拿到最新身份
			// console.log(User.getUserInfo());
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
		// 儲存使用者資料
		function _store() {
			console.log(email.val());
			var userInfo = {
				username: username.val(),
				password: sha256('admin123!@#'),	
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
			// call API
			User.update(userInfo).then(function() {
				$modal.modal('hide');
			}).catch(function(err) {
				console.log(err);
			});
		}

		return {
			open
		}

	})();
});
