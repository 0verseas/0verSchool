var deptInfoBache = (function () {

	const _currentSystem = 'bachelor';

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

	var $addReviewItemBtn = $('#btn-addReviewItem'); // 新增更多審查項目按鈕
	var $reviewItemsForm = $('#form-reviewItems'); // 審查項目列表

	/**
	 * bind event
	 */

	$saveDeptDescriptionBtn.on('click', _saveDeptDescription); // 儲存｜送出學制資料

	$schoolHasSelfEnrollment.on("change", _switchSchoolHasSelfEnrollment); // 校可獨招 => 系可獨招
	$hasSelfEnrollment.on("change", _switchHasSelfEnrollment); // 系可獨招 => 系可開設僑生專班

	// 聯招人數自動計算
	$admissionSelectionQuota.on('keyup', _computeBachelorAdmissionTotalQuota);
	$admissionPlacementQuota.on('keyup', _computeBachelorAdmissionTotalQuota);
	$addReviewItemBtn.on('click', _addReviewItemRow);

	/**
	 * init
	 */

	 _setData();

	function _computeBachelorAdmissionTotalQuota() { // 「聯招人數（學士專用）」自動計算
		var totalPeople = Number($admissionSelectionQuota.val()) + Number($admissionPlacementQuota.val());
		$admissionTotalQuota.val(totalPeople);
	}

	function _addReviewItemRow() { // 新增審查的項目
		var $newReviewItemRow = $(`
			<div class="row">
				<div class="form-group col-sm-4">
					<label for="">審查項目</label>

					<select class="form-control">
						<optgroup label="分類？">
							<option>畢業證書</option>
							<option>作品</option>
						</optgroup>
						<optgroup label="分類？">
							<option>其他</option>
						</optgroup>
					</select>
				</div>

				<div class="col-sm-8">
					<div class="form-check">
						<label class="form-check-label">
							<input type="checkbox" class="form-check-input">
							是否為必備
						</label>
					</div>
					<div class="form-group">
						<label for="">審查項目中文說明</label>
						<textarea class="form-control" rows="3"></textarea>
					</div>

					<div class="form-group">
						<label for="">審查項目英文說明</label>
						<textarea class="form-control" rows="3"></textarea>
					</div>
				</div>
			</div>
			<hr>`);
		$reviewItemsForm.append($newReviewItemRow);
	}

	function _saveDeptDescription() { // 儲存學制備註
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
		_switchHasSelfEnrollment();
		_switchSchoolHasSelfEnrollment();
	}

	function _renderSpecialDeptDetail(deptData) {
		$schoolHasSelfEnrollment.prop("checked", deptData.school_has_self_enrollment);
		$hasSelfEnrollment.prop("checked", deptData.has_self_enrollment);
		$hasSpecialClass.prop("checked", deptData.has_special_class);
		$admissionSelectionQuota.val(deptData.admission_selection_quota);
		$admissionPlacementQuota.val(deptData.admission_placement_quota);
		_computeBachelorAdmissionTotalQuota();
	};

	function _switchSchoolHasSelfEnrollment() { // 校可獨招 => 系可獨招
		$hasSelfEnrollment.prop('disabled', !$schoolHasSelfEnrollment.prop('checked'));
	}

	function _switchHasSelfEnrollment() { // 系可獨招 => 系可開設僑生專班
		$hasSpecialClass.prop('disabled', !$hasSelfEnrollment.prop('checked'));
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
