var Index = (_ => {
	/**
	 * cache DOM
	 */
	$btnSchoolAccountSetting = $('#btn-schoolAccountSetting');

	/**
	 * bind event
	 */
	$btnSchoolAccountSetting.on('click', _checkPermission);

	function _checkPermission() {
		// check permission than redirect to 
		// /user or /schoolUser
		console.log('ccccheck')
	}

})();
