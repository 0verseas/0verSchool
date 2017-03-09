var App = (_ => {
	
	/**
	 * init
	 */
	let _userInfo = {};
	_setLanguage();
	
	function _setLanguage() {
		!localStorage.language && (localStorage.language = 'ch');
		const lng = localStorage.language;
		$.i18n.init({
			lng, 
			debug: true
		}, function() {
			$(document).i18n();
		});
	}

	function changeLanguage(lng) {
		lng != 'ch' && lng != 'en' && (lng = 'ch');
		localStorage.language = lng;
		$.i18n.setLng(lng, function(err, t) { 
			$(document).i18n();
		});
	}

	function checkLogin(callback) {
		// TODO: if logged in 
		// save user info
		_userInfo = {
			cname: 'userrr', 
			ename: 'enameuserrr', 
			school: '國立暨南國際大學', 
			email: 'eeemail@emai.l', 
			org: '海外聯招', 
			tel: '1234567#1234', 
			admin: true
		}
		console.log(_userInfo);
		callback(_userInfo);
	}

	function getUserInfo() {
		return _userInfo;
	}

	return {
		changeLanguage, 
		checkLogin, 
		getUserInfo
	}
})();
