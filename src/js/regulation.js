var Regulation = (_ => {
	/**
	 * cache DOM
	 */
	$regulationPage = $('#page-regulation');
	$schoolForm = $regulationPage.find('#schoolForm');
	$saveBtn = $schoolForm.find('#btn-save');
	$resetBtn = $schoolForm.find('#btn-reset');

	/**
	 * init
	 */
	_getSchoolInfo();

	/**
	 * bind event
	 */
	$saveBtn.on('click', _handleSave);
	$resetBtn.on('click', _getSchoolInfo);
	
	function _getSchoolInfo() {

	}

	function _handleSave() {
		
	}
	
})();
