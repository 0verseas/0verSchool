var App = (_ => {
	
	/**
	 * init
	 */
	checkLogin(function() {
		// TODO: if no login => redirect
		console.log('check login~~');
	});

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
		callback();
	}

	return {
		changeLanguage, 
		checkLogin
	}
})();
