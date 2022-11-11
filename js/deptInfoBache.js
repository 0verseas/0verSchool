var deptInfoBache = (function () {

	const _currentSystem = 'bachelor';
	const _currentSystemName = '學士班';
	const _currentSystemId= '1';
	var _currentDeptId = '';
	var _lastYearAdmissionPlacementAmount = '';
	var _lastYearAdmissionPlacementQuota = '';
	var _schoolId;

	/**
	 * cache DOM
	 */

	var $deptInfoForm = $('#form-deptInfo'); // 學制資訊
	var $saveDeptDescriptionBtn = $deptInfoForm.find('#btn-deptInfoSave'); // 學制資訊儲存｜送出按鈕

	var $editDeptInfoBtn; // 系所列表每項資料的編輯按鈕，資料取回後再綁定 event
	var $editDeptInfoModal = $('#editDeptInfoModal'); // 系所列表每項資料的編輯框

	var $sendPreviewPDFBtn = $('#sendPreviewPDF-btn'); // 預覽版 PDF 按鈕
	var $sendFormalPDFBtn = $('#sendFormalPDF-btn'); // 正式版 PDF 按鈕
	var $lockSystemBtn = $('#lockSystem-btn'); // 確認送出鎖定學制

	// Modal special elements
	var $modalDeptInfo = $('#modal-deptInfo');
	var $schoolHasSelfEnrollment = $modalDeptInfo.find('#schoolHasSelfEnrollment'); // checkbox ，本校是否可單獨招收僑生
	var $hasSelfEnrollment = $modalDeptInfo.find('#hasSelfEnrollment');	// checkbox ，是否單獨招收僑生（自招）
	var $hasSpecialClass = $modalDeptInfo.find('#hasSpecialClass'); // checkbox ，是否開設僑生專班（有自主招生才能開專班）
	var $admissionTotalQuota = $modalDeptInfo.find('#admissionTotalQuota'); // Can't edit， 聯招人數（學士專用）
	var $admissionSelectionQuota = $modalDeptInfo.find('#admissionSelectionQuota'); // 個人申請人數
	var $admissionPlacementQuota = $modalDeptInfo.find('#admissionPlacementQuota'); // 聯合分發人數
	var $decreaseReasonOfAdmissionPlacement = $modalDeptInfo.find('#decreaseReasonOfAdmissionPlacement');
	var $placementQuotaTip = $modalDeptInfo.find('#placementQuotaTip');

	var $deptDetailSaveBtn = $('#deptDetailSave');

	var formGroup = {
		admissionSelectionQuotaForm: $modalDeptInfo.find('#admissionSelectionQuotaForm'),
		admissionPlacementQuotaForm: $modalDeptInfo.find('#admissionPlacementQuotaForm'),
		decreaseReasonOfAdmissionPlacementForm: $modalDeptInfo.find('#decreaseReasonOfAdmissionPlacementForm')
	};

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

	$sendPreviewPDFBtn.on('click', function () {
		_getGuidelinesReplyForm('preview');
	}); // 列印學制資訊 (預覽版)
	$sendFormalPDFBtn.on('click', function () {
		_getGuidelinesReplyForm('formal');
	}); // 列印學制資訊 (正式版)

	$lockSystemBtn.on('click', _lockSystem);

	/**
	 * init
	 */

	if(env.stage == 1){
			location.href = "./systemQuota.html";
	}
	 _setData();

	function _getGuidelinesReplyForm(mode = 'preview') {
		openLoading();
		School.getGuidelinesReplyForm(_currentSystem, {mode})
		.then(function(res) {
			if (res.ok) {
				return res.json;
			} else {
				throw res;
			}
		})
		.then(function(data) {
			swal({title:`正在產生${(mode === 'formal')?'正式版':'預覽版'} PDF，請在稍後至信箱確認。`, confirmButtonText:'確定', type:'info'});
			stopLoading();
		})
		.catch(function(err) {
			err.json && err.json().then(function(data) {
				swal({title:data.messages[0], confirmButtonText:'確定', type:'error'});
			});
			stopLoading();
		});
	}

	function _computeBachelorAdmissionTotalQuota() { // 「聯招人數（學士專用）」自動計算
		var totalPeople = Number($admissionSelectionQuota.val()) + Number($admissionPlacementQuota.val());
		$admissionTotalQuota.val(totalPeople);
		$decreaseReasonOfAdmissionPlacement.prop('disabled', !(Math.min(_lastYearAdmissionPlacementAmount, _lastYearAdmissionPlacementQuota) > $admissionPlacementQuota.val()));
		// set review if admissionSelectionQuota <= 0 ***
		if ($admissionSelectionQuota.val() <= 0) {
			DeptInfo.$reviewDiv.hide();
		} else {
			DeptInfo.$reviewDiv.show();
		}
	}

	function _saveDeptDescription() { // 儲存學制備註
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
			$editDeptInfoModal.modal({
				backdrop: 'static',
				keyboard: false
			});
			stopLoading();
		})
	}

	function _renderDeptDetail(deptData) { // 渲染系所詳細資料
		DeptInfo.renderCommonDeptDetail(deptData, "bache"); // 渲染學制們共用欄位
		var min = Math.min(deptData.last_year_admission_placement_amount, deptData.last_year_admission_placement_quota);
		$placementQuotaTip.tooltip({title: '聯合分發人數請大於 ' + min + ' 人，否則請填寫減招原因'});
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
		$decreaseReasonOfAdmissionPlacement.val(deptData.decrease_reason_of_admission_placement);
		_lastYearAdmissionPlacementAmount = deptData.last_year_admission_placement_amount;
		_lastYearAdmissionPlacementQuota = deptData.last_year_admission_placement_quota;
		_computeBachelorAdmissionTotalQuota();
	}

	function _switchSchoolHasSelfEnrollment() { // 校可獨招 => 系可獨招
		$hasSelfEnrollment.prop('disabled', !$schoolHasSelfEnrollment.prop('checked'));
	}

	function _switchHasSelfEnrollment() { // 系可獨招 => 系可開設僑生專班
		$hasSpecialClass.prop('disabled', !$hasSelfEnrollment.prop('checked'));
	}

	function _validateForm() {
		var commonFormValidateStatus = DeptInfo.validateForm();
		var form;
		for(form in formGroup) {
			formGroup[form].removeClass("is-invalid");
		}

		return commonFormValidateStatus;
	}

	function _getFormData() {
		var data = new FormData();
		var commonFormData = DeptInfo.getCommonFormData("bache");
		var item;
		for( item in commonFormData) {
			data.append(item, commonFormData[item]);
		}
		return data;
	}

	function _saveDeptDetail() {
		var checkcount = 0;
		var sendData = _getFormData();
		for (var pair of sendData.entries()) {
			if( pair[0] == 'moe_check_failed' && pair[1] == 1) {
                checkcount++;
            }

			if( pair[0] == 'teacher_quality_passed' && pair[1] == 'false') {
                checkcount++;
            }
		}

		var isAllSet = false;

		if (checkcount === 2) {
            isAllSet = confirm("經教育部查核被列為持續列管或不通過、\n師資質量未達「專科以上學校總量發展規模與資源條件標準」，\n\n該系所有名額會強制變為 0，您真的確認送出嗎？");
        } else {
            isAllSet = true;
        }

		if( isAllSet === true ) {
			const $validateResult = _validateForm();

			if ($validateResult.length <= 0) {
				openLoading();
				School.setDeptInfo(_currentSystem, _currentDeptId, sendData)
				.then((res) => {
					if (res.ok) {
						return res.json;
					} else {
						throw res;
					}
				})
				.then((json) => {
					swal({title:`儲存成功`, confirmButtonText:'確定', type:'success'});
					stopLoading();
				})
				.catch((err) => {
					err.json && err.json().then((data) => {
						swal({title:data.messages[0], confirmButtonText:'確定', type:'error'});
					});
					stopLoading();
				});
		} else {
				swal({title:$validateResult.join("\n"), confirmButtonText:'確定', type:'error'});
			}
		}
	}

	function _setData() {
		openLoading();

		School.getSchoolInfo() // 取的校資料以檢視校鎖定了沒
		.then(function(res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res;
			}
		}).then(function(json) {
			if (json.review_at == null) { // 校資料未鎖定
				$('#lockSystem-btn').attr('disabled', true);
				document.getElementById("lockSystem-btn").style.pointerEvents = "none";
				$('#lockSystem-tooltip').tooltip();
			}
			else {
				document.getElementById("lockSystem-btn").style.pointerEvents = "auto";
				$('#lockSystem-btn').attr('disabled', false);
				$('#lockSystem-tooltip').tooltip('disable');
			}
		});

		School.getSystemInfo(_currentSystem) // 取得學制資料，沒有該學制則回上一頁
		.then((res) => {
			if(res.ok) { // 有該學制則開始頁面初始化
				return res.json();
			} else {
				throw res;
			}
		}).then((json) => {
			_schoolId=json.school_code;
			DeptInfo.renderDescription(json); // 渲染該學制備註
			DeptInfo.renderDeptList(json.departments); // 渲染該學制系所列表
			if(json.review_at != null) {
				$('#sendFormalPDF-btn').show();
				$('#lockSystem-btn').hide();
				$('#btn-deptInfoSave').attr('disabled', true).text('已鎖定');
				$('#deptDetailSave').attr('disabled', true).text('已鎖定');
			}
		}).then(() => {
			$.bootstrapSortable(true); // 啟用系所列表排序功能
			$editDeptInfoBtn = $('.btn-editDeptInfo'); // 新增系所編輯按鈕的觸發事件（開啟 Modal）
			$editDeptInfoBtn.on('click', _handleEditDeptInfo);
			DeptInfo.renderDeptSelect(_currentSystem); // 產生系所詳細資料 Modal 中下拉式選單

			stopLoading();
		})
		.catch((err) => {
			if (err.status === 404) {
				swal({title:`沒有這個學制。 即將返回上一頁`, type:"error", showConfirmButton: false, allowOutsideClick: false, timer: 900}).catch(() => {
					window.history.back();
				});
			} else {
				err.json && err.json().then((data) => {
					console.error(data);
					swal({title:data.messages[0], confirmButtonText:'確定', type:'error'});
				});
			}
			stopLoading();
		})
	}

	function _lockSystem() {
		openLoading();

		var isAllSet = confirm("確認後就無法再修改 " + _currentSystemName + "相關部分(名額分配、系所資料)，您真的確認送出嗎？");
		if (isAllSet === true) {
			var data = {"confirmed": true}
			School.lockSystemInfo(_schoolId, _currentSystemId, data)
			.then((res) => {
				if (res.ok) {
					return res.json;
				} else {
					throw res;
				}
			})
			.then((json) => {
				swal({title:`儲存成功並鎖定`, confirmButtonText:'確定', type:'success'}).then(() => {
					location.reload();
				});
			})
			.catch((err) => {
				console.error(data);
				err.json && err.json().then((data) => {
					swal({title:data.messages[0], confirmButtonText:'確定', type:'error'});
				});
			});
		}
		stopLoading();
	}

})();
