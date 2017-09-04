var deptInfoPhd = (function () {

	const _currentSystem = 'phd';
	var _currentDeptId = '';

	/**
	 * cache DOM
	 */
	var $sendPreviewPDFBtn = $('#sendPreviewPDF-btn'); // 預覽版 PDF 按鈕
	var $sendFormalPDFBtn = $('#sendFormalPDF-btn'); // 正式版 PDF 按鈕

	var $deptInfoForm = $('#form-deptInfo'); // 學制資訊
	var $saveDeptDescriptionBtn = $deptInfoForm.find('#btn-deptInfoSave'); // 學制資訊儲存｜送出按鈕

	var $editDeptInfoBtn; // 系所列表每項資料的編輯按鈕，資料取回後再綁定 event
	var $editDeptInfoModal = $('#editDeptInfoModal'); // 系所列表每項資料的編輯框

	// Modal special elements
	var $modalDeptInfo = $('#modal-deptInfo');
	var $schoolHasSelfEnrollment = $modalDeptInfo.find('#schoolHasSelfEnrollment'); // checkbox ，本校是否可單獨招收僑生
	var $hasSelfEnrollment = $modalDeptInfo.find('#hasSelfEnrollment');	// checkbox ，是否單獨招收僑生（自招）
	var $hasSpecialClass = $modalDeptInfo.find('#hasSpecialClass'); // checkbox ，是否開設僑生專班（有自主招生才能開專班）
	var $admissionSelectionQuota = $modalDeptInfo.find('#admissionSelectionQuota'); // 聯招(個人申請)人數（碩博二技專用）
	var $selfEnrollmentQuota = $modalDeptInfo.find('#selfEnrollmentQuota'); // 自招人數

	var $deptDetailSaveBtn = $('#deptDetailSave');

	var formGroup = {
		admissionSelectionQuotaForm: $modalDeptInfo.find('#admissionSelectionQuotaForm'),
		selfEnrollmentQuotaForm: $modalDeptInfo.find('#selfEnrollmentQuotaForm')
	}

	/**
	 * bind event
	 */

	$saveDeptDescriptionBtn.on('click', _saveDeptDescription); // 儲存｜送出學制資料

	$schoolHasSelfEnrollment.on("change", _switchSchoolHasSelfEnrollment); // 校可獨招 => 系可獨招
	$hasSelfEnrollment.on("change", _switchHasSelfEnrollment); // 系可獨招 => 系可開設僑生專班、可填自招人數

	$deptDetailSaveBtn.on('click', _saveDeptDetail);

	$admissionSelectionQuota.on('keyup', _reviewDivAction);

	$sendPreviewPDFBtn.on('click', function () {
		_getGuidelinesReplyForm('preview');
	}); // 列印學制資訊 (預覽版)
	$sendFormalPDFBtn.on('click', function () {
		_getGuidelinesReplyForm('formal');
	}); // 列印學制資訊 (正式版)

	/**
	 * init
	 */

	_setData();

	function _getGuidelinesReplyForm(mode = 'preview') {
		School.getGuidelinesReplyForm(_currentSystem,{mode})
		.then(function(res) {
			if (res.ok) {
				return res.json;
			} else {
				throw res;
			}
		})
		.then(function(data) {
			if (mode === 'formal') {
				alert('寄送正式版 PDF 成功，請至信箱確認。');
			} else {
				alert('寄送預覽版 PDF 成功，請至信箱確認。');
			}
			stopLoading();
		})
		.catch(function(err) {
			err.json && err.json().then(function(data) {
				alert(data.messages[0]);
			})
			stopLoading();
		});
	}

	function _reviewDivAction() { // hide or show reviewDiv
		if ($admissionSelectionQuota.val() <= 0) {
			DeptInfo.$reviewDiv.hide();
		} else {
			DeptInfo.$reviewDiv.show();
		}

	}

	function _saveDeptDescription() {
		DeptInfo.saveDeptDescription(_currentSystem);
	}

	function _handleEditDeptInfo() { // 系所列表 Modal 觸發
		openLoading();

		_currentDeptId = $(this).data('deptid');
		School.getDeptInfo(_currentSystem, _currentDeptId)
		.then((res) => { return res.json(); })
		.then((json) => {
			_renderDeptDetail(json);
		})
		.then(() => {
            _reviewDivAction();

			$editDeptInfoModal.modal({
				backdrop: 'static',
				keyboard: false
			});

			stopLoading();
		})
	}

	function _renderDeptDetail(deptData) { // 渲染系所詳細資料
		DeptInfo.renderCommonDeptDetail(deptData, "phd"); // 渲染學制們共用欄位
		_renderSpecialDeptDetail(deptData);
		_switchHasSelfEnrollment();
		_switchSchoolHasSelfEnrollment();
	}

	function _renderSpecialDeptDetail(deptData) {
		$schoolHasSelfEnrollment.prop("checked", deptData.school_has_self_enrollment);
		$hasSelfEnrollment.prop("checked", deptData.has_self_enrollment);
		$hasSpecialClass.prop("checked", deptData.has_special_class);
		$admissionSelectionQuota.val(deptData.admission_selection_quota);
		$selfEnrollmentQuota.val(deptData.self_enrollment_quota);
	};

	function _switchSchoolHasSelfEnrollment() { // 校可獨招 => 系可獨招
		// $hasSelfEnrollment.prop('disabled', !$schoolHasSelfEnrollment.prop('checked'));
	}

	function _switchHasSelfEnrollment() { // 系可獨招 => 系可開設僑生專班、可填自招人數
		$hasSpecialClass.prop('disabled', !$hasSelfEnrollment.prop('checked'));
		// $selfEnrollmentQuota.prop('disabled', !$hasSelfEnrollment.prop('checked'));
	}

	function _validateForm() {
		var specialFormValidateStatus = true;
		var commonFormValidateStatus = DeptInfo.validateForm();
		for(form in formGroup) {
			formGroup[form].removeClass("has-danger");
		}
		if (!_validateNotEmpty($admissionSelectionQuota)) {formGroup.admissionSelectionQuotaForm.addClass("has-danger"); specialFormValidateStatus = false}
		if ($hasSelfEnrollment.prop("checked")) {
			if (!_validateNotEmpty($selfEnrollmentQuota)) {formGroup.selfEnrollmentQuotaForm.addClass("has-danger"); specialFormValidateStatus = false}
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
		data.append('self_enrollment_quota', $selfEnrollmentQuota.val());
		var commonFormData = DeptInfo.getCommonFormData("phd");
		for( item in commonFormData) {
			data.append(item, commonFormData[item]);
		}
		return data;
	}

	function _saveDeptDetail() {
		if (_validateForm()) {
			openLoading();

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
				alert("儲存成功");

				stopLoading();
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				});

				stopLoading();
			})
		} else {
			alert("有欄位輸入錯誤，請重新確認。");
		}
	}

	function _setData() {
		openLoading();

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

			stopLoading();
		})
		.catch((err) => {
			if (err.status === 404) {
				alert('沒有這個學制。 即將返回上一頁。');
				window.history.back();
			} else {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);

					stopLoading();
				});
			}
		})
	}
})();
