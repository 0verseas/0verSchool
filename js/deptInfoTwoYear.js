var deptInfoTwoYear = (function () {

	const _currentSystem = 'twoYear';

	/**
	 * cache DOM
	 */

	var $deptInfoForm = $('#form-deptInfo'); // 學制資訊
	var $saveDeptDescriptionBtn = $deptInfoForm.find('#btn-deptInfoSave'); // 學制資訊儲存｜送出按鈕

	var $editDeptInfoBtn; // 系所列表每項資料的編輯按鈕，資料取回後再綁定 event
	var $editDeptInfoModal = $('#editDeptInfoModal'); // 系所列表每項資料的編輯框

	// Modal special elements
	var $modalDeptInfo = $('#modal-deptInfo');
	var $schoolHasSelfEnrollment = $modalDeptInfo.find('#schoolHasSelfEnrollment'); // checkbox ，本校是否可單獨招收僑生
	var $hasRiJian = $modalDeptInfo.find('#hasRiJian'); // checkbox ，是否開設日間二技學制
	var $hasSelfEnrollment = $modalDeptInfo.find('#hasSelfEnrollment'); // checkbox ，是否單獨招收僑生（自招）
	var $hasSpecialClass = $modalDeptInfo.find('#hasSpecialClass'); // checkbox ， 是否開設僑生專班
	var $approvalNoOfSpecialClass = $modalDeptInfo.find('#approvalNoOfSpecialClass'); // 開設專班文號
	var $approvalDocOfSpecialClass = $modalDeptInfo.find('#approvalDocOfSpecialClass'); // 開設專班文件電子檔
	var $approvalDocOfSpecialClassUrl = $modalDeptInfo.find('#approvalDocOfSpecialClassUrl'); // 已存在的開設專班文件電子檔
	var $admissionSelectionQuota = $modalDeptInfo.find('#admissionSelectionQuota'); // 聯招(個人申請)人數（碩博二技專用）
	var $selfEnrollmentQuota = $modalDeptInfo.find('#selfEnrollmentQuota'); // 自招人數

	/**
	 * bind event
	 */

	$saveDeptDescriptionBtn.on('click', _saveDeptDescription); // 儲存｜送出學制資料
	
	$schoolHasSelfEnrollment.on("change", _switchSchoolHasSelfEnrollment); // 校可獨招 => 可開日間、專班
	$hasRiJian.on("change", _switchHasRiJian); // 開日間 => 可自招、開聯招人數
	$hasSelfEnrollment.on("change", _switchHasSelfEnrollment); // 開自招 => 開自招人數
	$hasSpecialClass.on("change", _switchHasSpecialClass); // 開專班 => 開專班文號、電子檔，以及開聯招人數

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
		_switchHasSpecialClass();
		_switchHasSelfEnrollment();
		_switchHasRiJian();
		_switchSchoolHasSelfEnrollment();
	}

	function _renderSpecialDeptDetail(deptData) {
		$schoolHasSelfEnrollment.prop("checked", deptData.school_has_self_enrollment);
		$hasRiJian.prop("checked", deptData.has_RiJian);
		$hasSelfEnrollment.prop("checked", deptData.has_self_enrollment);
		$hasSpecialClass.prop("checked", deptData.has_special_class);
		$approvalNoOfSpecialClass.val(deptData.approval_no_of_special_class)
		$approvalDocOfSpecialClassUrl.prop("href", "");
		$approvalDocOfSpecialClassUrl.text("");
		$admissionSelectionQuota.val(deptData.admission_selection_quota);
		$selfEnrollmentQuota.val(deptData.self_enrollment_quota);
	};

	function _switchSchoolHasSelfEnrollment() { // 校可獨招 => 可開日間、專班
		$hasRiJian.prop('disabled', !$schoolHasSelfEnrollment.prop('checked'));
		$hasSpecialClass.prop('disabled', !$schoolHasSelfEnrollment.prop('checked'));
	}

	function _switchHasRiJian() { // 開日間 => 可自招、開聯招人數
		$hasSelfEnrollment.prop('disabled', !$hasRiJian.prop('checked'));
		var hasRiJianStatus = $hasRiJian.prop('checked');
		var hasSpecialClass = $hasSpecialClass.prop('checked');
		if (hasRiJianStatus || hasSpecialClass) { $admissionSelectionQuota.prop('disabled', false); } else { $admissionSelectionQuota.prop('disabled', true); }
	}

	function _switchHasSelfEnrollment() { // 開自招 => 開自招人數
		$selfEnrollmentQuota.prop('disabled', !$hasSelfEnrollment.prop('checked'));
	}

	function _switchHasSpecialClass() { // 開專班 => 開專班文號、電子檔，以及開聯招人數
		$approvalNoOfSpecialClass.prop('disabled', !$hasSpecialClass.prop('checked'));
		$approvalDocOfSpecialClass.prop('disabled', !$hasSpecialClass.prop('checked'));
		var hasRiJianStatus = $hasRiJian.prop('checked');
		var hasSpecialClass = $hasSpecialClass.prop('checked');
		if (hasRiJianStatus || hasSpecialClass) { $admissionSelectionQuota.prop('disabled', false); } else { $admissionSelectionQuota.prop('disabled', true); }
	}

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
