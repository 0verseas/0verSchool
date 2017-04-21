var Regulation = (_ => {
	/**
	 * cache DOM
	 */
	$regulationPage = $('#page-regulation');
	$titles = $regulationPage.find('.title');
	$schoolForm = $regulationPage.find('#schoolForm');
	$saveBtn = $schoolForm.find('#btn-save');
	$resetBtn = $schoolForm.find('#btn-reset');
	$deptForm = $regulationPage.find('#deptForm');
	$addDeptBtn = $deptForm.find('#btn-addDept');

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
	$deptForm.on('click.editDept', '.btn-editDept', _setDeptInfo)
	
	function _getSchoolInfo() {

	}

	function _handleSave() {

	}

	function _setDeptInfo() {
		console.log('1')
	}

	function _handleToggleContent() {
		let $this = $(this);
		let $target = $regulationPage.find(`#${$this.data('content')}`);
		$this.toggleClass('active');
		$target.slideToggle();
	}
	
})();
