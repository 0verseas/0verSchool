var SchoolUser = (_ => {
	/**
	 * cache DOM
	 */
	$schoolUserPage = $('#page-schoolUser');
	$titleRow = $schoolUserPage.find('#title');
	$listTable = $schoolUserPage.find('#schoolUserListTable');

	/**
	 * init
	 */
	_checkPermission();
	_handleResize();
	_getSchoolUserList();

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

	function _getSchoolUserList() {
		// TODO: get list
		var list = [
			{
				name: '蔡英文', 
				emali: 'abcde@gmail.com', 
				org: '海外聯招', 
				tel: '1234567#1234'
			}
		]

		$listTable
			.find('tbody')
			.append(list.map((val, i) => $(
				`<tr class="schoolUser">
					<td>${val.name}</td>
					<td>${val.email}</td>
					<td>${val.org}</td>
					<td>${val.tel}</td>
					<td>
						<button class="btn btn-warning btn-edit">
							<i class="fa fa-pencil" aria-hidden="true"></i>
						</button> 
						<button class="btn btn-danger btn-delete">
							<i class="fa fa-trash-o" aria-hidden="true"></i>
						</button>
					</td>
				</tr>`
		)));
	}

	function _handleResize() {
		const windowH = $(this).height();
		let listH = windowH - 250;
		(listH <= 650) && (listH = 650);
		$schoolUserPage.find('#schoolUserList').css('height', `${listH}px`);
	}

	function _checkPermission() {
		// TODO: checkPermission
	}

})();
