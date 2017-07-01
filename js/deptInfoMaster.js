var deptInfoMaster = (function () {

	const _currentSystem = 'master';

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
		DeptInfo.saveDeptDescription(_currentSystem);
	}

	function _handleEditDeptInfo() { // 系所列表 Modal 觸發
		const deptId = $(this).data('deptid');
		School.getDeptInfo(_currentSystem, deptId)
		.then((res) => { return res.json(); })
		.then((json) => {
			_renderDeptDetail(json);
		})
		.then(() => { $editDeptInfoModal.modal(); })
	}

	function _renderDeptDetail(deptData) { // 渲染系所詳細資料
		DeptInfo.renderCommonDeptDetail(deptData); // 渲染學制們共用欄位
		_renderSpecialDeptDetail(deptData);
	}

	function _renderSpecialDeptDetail(deptData) {

	};

	function _setData() {
		School.getSystemInfo(_currentSystem) // 取得學制資料，沒有該學制則回上一頁
		.then((res) => {
			if(res.ok) { // 有該學制則開始頁面初始化
				return res.json();
			} else {
				throw res;
			}
		}).then((json) => {
			DeptInfo.renderDescription(json); // 渲染該學制備註
			DeptInfo.renderDeptList(json.departments); // 渲染該學制系所列表
		}).then(() => {
			$.bootstrapSortable(true); // 啟用系所列表排序功能
			$editDeptInfoBtn = $('.btn-editDeptInfo'); // 新增系所編輯按鈕的觸發事件（開啟 Modal）
			$editDeptInfoBtn.on('click', _handleEditDeptInfo);
			DeptInfo.renderDeptSelect(_currentSystem); // 產生系所詳細資料 Modal 中下拉式選單
		})
		.catch((err) => {
			console.error(err);
		})
	}

})();
