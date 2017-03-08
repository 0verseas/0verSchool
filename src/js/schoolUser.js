var SchoolUser = (_ => {
	/**
	 * cache DOM
	 */
	$schoolUserPage = $('#page-schoolUser');
	$titleRow = $schoolUserPage.find('#title');
	$listTable = $schoolUserPage.find('#schoolUserListTable');

	/**
	 * bind event
	 */
	$titleRow.on('click.addSchoolUser', '.btn-openAddSchoolUserModal', _addSchoolUser);
	$listTable.on('click.edit', '.schoolUser .btn-edit', _handleEdit);
	$listTable.on('click.delete', '.schoolUser .btn-delete', _handleDelete);
	$(window).on('resize', _handleResize);

	function _addSchoolUser() {
		// open modal
		$('#modal-addSchoolUser').modal();
	}

	function _handleEdit() {
		console.log('editttt');
	}

	function _handleDelete() {
		console.log('deleteeee');
	}

	function _handleResize() {
		const windowH = $(this).height();
		let listH = windowH - 250;
		(listH <= 650) && (listH = 650);
		$schoolUserPage.find('#schoolUserList').css('height', `${listH}px`);
	}

	_handleResize();

})();
