var deptInfoPhd = (function () {
	/**
	 * cache DOM
	 */

	var $deptInfoForm = $('#form-deptInfo'); // 學制資訊
	var $saveDeptDescriptionBtn = $deptInfoForm.find('#btn-deptInfoSave'); // 學制資訊儲存｜送出按鈕

	var $editDeptInfoBtn; // 系所列表每項資料的編輯按鈕，資料取回後再綁定 event
	var $editDeptInfoModal = $('#editDeptInfoModal'); // 系所列表每項資料的編輯框

	/**
	 * bind event
	 */

	$saveDeptDescriptionBtn.on('click', _saveDeptDescription); // 儲存｜送出學制資料

	/**
	 * init
	 */

	_setData();

	function _saveDeptDescription() {
		DeptInfo.saveDeptDescription('phd');
	}

	function _handleEditDeptInfo() { // 系所列表 Modal 觸發
		$editDeptInfoModal.modal();
	}

	function _setData() {
		School.getSystemInfo('phd')
		.then((res) => {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then((json) => {
			DeptInfo.renderDescription(json);
			DeptInfo.renderDeptList(json.departments);
		}).then(() => {
			$.bootstrapSortable(true);
			$editDeptInfoBtn = $('.btn-editDeptInfo'); // 系所列表每項資料的編輯按鈕
			$editDeptInfoBtn.on('click', _handleEditDeptInfo); // 打開 Modal
		})
		.catch((err) => {
			console.error(err);
		})
	}

})();
