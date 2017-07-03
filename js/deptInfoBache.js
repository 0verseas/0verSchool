var deptInfoBache = (function () {

	const _currentSystem = 'bachelor';
	var _currentDeptId = '';
	var _lastYearAdmissionPlacementAmount = '';
	var _lastYearAdmissionPlacementQuota = '';

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
	var $hasSelfEnrollment = $modalDeptInfo.find('#hasSelfEnrollment');	// checkbox ，是否單獨招收僑生（自招）
	var $hasSpecialClass = $modalDeptInfo.find('#hasSpecialClass'); // checkbox ，是否開設僑生專班（有自主招生才能開專班）
	var $admissionTotalQuota = $modalDeptInfo.find('#admissionTotalQuota'); // Can't edit， 聯招人數（學士專用）
	var $admissionSelectionQuota = $modalDeptInfo.find('#admissionSelectionQuota'); // 個人申請人數
	var $admissionPlacementQuota = $modalDeptInfo.find('#admissionPlacementQuota'); // 聯合分發人數
	var $decreaseReasonOfAdmissionPlacement = $modalDeptInfo.find('#decreaseReasonOfAdmissionPlacement');

	var $deptDetailSaveBtn = $('#deptDetailSave');

	var formGroup = {
		admissionSelectionQuotaForm: $modalDeptInfo.find('#admissionSelectionQuotaForm'),
		admissionPlacementQuotaForm: $modalDeptInfo.find('#admissionPlacementQuotaForm'),
		decreaseReasonOfAdmissionPlacementForm: $modalDeptInfo.find('#decreaseReasonOfAdmissionPlacementForm')
	}

	/**
	 * bind event
	 */

	$saveDeptDescriptionBtn.on('click', _saveDeptDescription); // 儲存｜送出學制資料

	$schoolHasSelfEnrollment.on("change", _switchSchoolHasSelfEnrollment); // 校可獨招 => 系可獨招
	$hasSelfEnrollment.on("change", _switchHasSelfEnrollment); // 系可獨招 => 系可開設僑生專班

	// 聯招人數自動計算
	$admissionSelectionQuota.on('keyup', _computeBachelorAdmissionTotalQuota);
	$admissionPlacementQuota.on('keyup', _computeBachelorAdmissionTotalQuota);

	$deptDetailSaveBtn.on('click', _saveDeptDetail);

	/**
	 * init
	 */

	 _setData();

	function _computeBachelorAdmissionTotalQuota() { // 「聯招人數（學士專用）」自動計算
		var totalPeople = Number($admissionSelectionQuota.val()) + Number($admissionPlacementQuota.val());
		$admissionTotalQuota.val(totalPeople);
		$decreaseReasonOfAdmissionPlacement.prop('disabled', !(Math.min(_lastYearAdmissionPlacementAmount, _lastYearAdmissionPlacementQuota) > $admissionPlacementQuota.val()));
	}

	function _saveDeptDescription() { // 儲存學制備註
		DeptInfo.saveDeptDescription(_currentSystem);
	}

	function _handleEditDeptInfo() { // 系所列表 Modal 觸發
		_currentDeptId = $(this).data('deptid');
		School.getDeptInfo(_currentSystem, _currentDeptId)
		.then((res) => { return res.json(); })
		.then((json) => {
			_renderDeptDetail(json);
		})
		.then(() => { $editDeptInfoModal.modal(); })
	}

	function _renderDeptDetail(deptData) { // 渲染系所詳細資料
		DeptInfo.renderCommonDeptDetail(deptData); // 渲染學制們共用欄位
		_renderSpecialDeptDetail(deptData);
		_switchHasSelfEnrollment();
		_switchSchoolHasSelfEnrollment();
	}

	function _renderSpecialDeptDetail(deptData) {
		$schoolHasSelfEnrollment.prop("checked", deptData.school_has_self_enrollment);
		$hasSelfEnrollment.prop("checked", deptData.has_self_enrollment);
		$hasSpecialClass.prop("checked", deptData.has_special_class);
		$admissionSelectionQuota.val(deptData.admission_selection_quota);
		$admissionPlacementQuota.val(deptData.admission_placement_quota);
		_lastYearAdmissionPlacementAmount = deptData.last_year_admission_placement_amount;
		_lastYearAdmissionPlacementQuota = deptData.last_year_admission_placement_quota;
		_computeBachelorAdmissionTotalQuota();
	};

	function _switchSchoolHasSelfEnrollment() { // 校可獨招 => 系可獨招
		$hasSelfEnrollment.prop('disabled', !$schoolHasSelfEnrollment.prop('checked'));
	}

	function _switchHasSelfEnrollment() { // 系可獨招 => 系可開設僑生專班
		$hasSpecialClass.prop('disabled', !$hasSelfEnrollment.prop('checked'));
	}

	function _validateForm() {
		var specialFormValidateStatus = true;
		var commonFormValidateStatus = DeptInfo.validateForm();
		for(form in formGroup) {
			formGroup[form].removeClass("has-danger");
		}
		if (!_validateNotEmpty($admissionSelectionQuota)) {formGroup.admissionSelectionQuotaForm.addClass("has-danger"); specialFormValidateStatus = false}
		if (!_validateNotEmpty($admissionPlacementQuota)) {formGroup.admissionPlacementQuotaForm.addClass("has-danger"); specialFormValidateStatus = false}
		if ((Math.min(_lastYearAdmissionPlacementAmount, _lastYearAdmissionPlacementQuota) > $admissionPlacementQuota.val())) {
			if (!_validateNotEmpty($decreaseReasonOfAdmissionPlacement)) {formGroup.decreaseReasonOfAdmissionPlacementForm.addClass("has-danger"); specialFormValidateStatus = false}
		}
		if (specialFormValidateStatus && commonFormValidateStatus) {
			return true;
		} else {
			return false;
		}
	}

	// 檢查 form 是否為有值
	function _validateNotEmpty(el) {
		return el.val() !== "";
	}

	function _getFormData() {
		var data = new FormData();
		data.append('has_self_enrollment', +$hasSelfEnrollment.prop('checked'));
		data.append('has_special_class', +$hasSpecialClass.prop('checked'));
		data.append('admission_selection_quota', $admissionSelectionQuota.val());
		data.append('admission_placement_quota', $admissionPlacementQuota.val());
		data.append('decrease_reason_of_admission_placement', $decreaseReasonOfAdmissionPlacement.val());
		var commonFormData = DeptInfo.getCommonFormData();
		for( item in commonFormData) {
			data.append(item, commonFormData[item]);
		}
		for (var pair of data.entries()) {
		    console.log(pair[0]+ ', ' + pair[1]); 
		}
		return data;
	}

	function _saveDeptDetail() {
		if (_validateForm()) {
			var sendData = _getFormData();
			School.setDeptInfo(_currentSystem, _currentDeptId, sendData)
			.then((res) => {
				if (res.ok) {
					return res.json;
				} else {
					throw res;
				}
			})
			.then((json) => {
				console.log(json);
			})
			.catch((err) => {
				console.log(err);
			})
		} else {
			alert("有欄位輸入錯誤，請重新確認。");
		}
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
