var Regulation = (_ => {
	/**
	 * cache DOM
	 */
	$regulationPage = $('#page-regulation');
	$titles = $regulationPage.find('.title');
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
	$titles.on('click', _handleToggleContent);
	
	function _getSchoolInfo() {

	}

	function _handleSave() {

	}

	function _handleToggleContent() {
		let $this = $(this);
		let $target = $regulationPage.find(`#${$this.data('content')}`);
		$this.toggleClass('active');
		$target.slideToggle();
	}
	
})();
