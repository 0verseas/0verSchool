var schoolInfo = (function () {

	/**
	 * cache DOM
	 */

	// 學校資料
	var $schoolInfoForm = $('#form-schoolInfo');
	var $schoolId = $schoolInfoForm.find('#schoolId');
	var $title = $schoolInfoForm.find('#title');
	var $engTitle = $schoolInfoForm.find('#engTitle');
	var $phone = $schoolInfoForm.find('#phone');
	var $fax = $schoolInfoForm.find('#fax');
	var $url = $schoolInfoForm.find('#url');
	var $engUrl = $schoolInfoForm.find('#engUrl');
	var $address = $schoolInfoForm.find('#address');
	var $engAddress = $schoolInfoForm.find('#engAddress');
	var $organization = $schoolInfoForm.find('#organization');
	var $engOrganization = $schoolInfoForm.find('#engOrganization');
	// 宿舍
	var $hasDorm = $schoolInfoForm.find('#hasDorm');
	var $dormInfo = $schoolInfoForm.find('#dormInfo');
	var $dormEngInfo = $schoolInfoForm.find('#dormEngInfo');
	// 僑生專屬獎學金
	var $hasScholarship = $schoolInfoForm.find('#hasScholarship');
	var $scholarshipDept = $schoolInfoForm.find('#scholarshipDept');
	var $engScholarshipDept = $schoolInfoForm.find('#engScholarshipDept');
	var $scholarshipUrl = $schoolInfoForm.find('#scholarshipUrl');
	var $engScholarshipUrl = $schoolInfoForm.find('#engScholarshipUrl');
	// 中五生招收
	var $hasFiveYearStudentAllowed = $schoolInfoForm.find('#hasFiveYearStudentAllowed');
	var $ruleOfFiveYearStudent = $schoolInfoForm.find('#ruleOfFiveYearStudent');
	var $ruleDocOfFiveYearStudent = $schoolInfoForm.find('#ruleDocOfFiveYearStudent');
	var $ruleDocOfFiveYearStudentUrl = $schoolInfoForm.find('#ruleDocOfFiveYearStudentUrl');
	// 單獨招收僑生（自招）
	var $hasSelfEnrollment = $schoolInfoForm.find('#hasSelfEnrollment');
	var $approvalNoOfSelfEnrollment = $schoolInfoForm.find('#approvalNoOfSelfEnrollment');
	var $approvalDocOfSelfEnrollment = $schoolInfoForm.find('#approvalDocOfSelfEnrollment');
	var $approvalDocOfSelfEnrollmentUrl = $schoolInfoForm.find('#approvalDocOfSelfEnrollmentUrl');

	// Button
	var $schoolInfoBtn = $schoolInfoForm.find('#btn-save');

	// form-group
	var formGroup = {
		phoneForm: $schoolInfoForm.find('#phoneForm'),
		faxForm: $schoolInfoForm.find('#faxForm'),
		urlForm: $schoolInfoForm.find('#urlForm'),
		engUrlForm: $schoolInfoForm.find('#engUrlForm'),
		addressForm: $schoolInfoForm.find('#addressForm'),
		engAddressForm: $schoolInfoForm.find('#engAddressForm'),
		organizationForm: $schoolInfoForm.find('#organizationForm'),
		engOrganizationForm: $schoolInfoForm.find('#engOrganizationForm'),
		dormInfoForm: $schoolInfoForm.find('#dormInfoForm'),
		dormEngInfoForm: $schoolInfoForm.find('#dormEngInfoForm'),
		scholarshipDeptForm: $schoolInfoForm.find('#scholarshipDeptForm'),
		engScholarshipDeptForm: $schoolInfoForm.find('#engScholarshipDeptForm'),
		scholarshipUrlForm: $schoolInfoForm.find('#scholarshipUrlForm'),
		engScholarshipUrlForm: $schoolInfoForm.find('#engScholarshipUrlForm'),
		ruleOfFiveYearStudentForm: $schoolInfoForm.find('#ruleOfFiveYearStudentForm'),
		approvalNoOfSelfEnrollmentForm: $schoolInfoForm.find('#approvalNoOfSelfEnrollmentForm')
	}

	/**
	 * init
	 */

	_getSchoolData();

	/**
	 * bind event
	 */

	$hasDorm.on("change", _switchDormStatus);
	$hasScholarship.on("change", _switchScholarshipStatus);
	$hasFiveYearStudentAllowed.on("change", _switchFiveYearStudentStatus);
	$hasSelfEnrollment.on("change", _switchSelfEnrollmentStatus);
	$schoolInfoBtn.on("click", _setSchoolInfo);

	function _switchDormStatus() { // 切換「宿舍」狀態
		$dormInfo.prop('disabled', !$hasDorm.prop('checked'));
		$dormEngInfo.prop('disabled', !$hasDorm.prop('checked'));
	}

	function _switchScholarshipStatus() { // 切換「僑生專屬獎學金」狀態
		$scholarshipDept.prop('disabled', !$hasScholarship.prop('checked'));
		$engScholarshipDept.prop('disabled', !$hasScholarship.prop('checked'));
		$scholarshipUrl.prop('disabled', !$hasScholarship.prop('checked'));
		$engScholarshipUrl.prop('disabled', !$hasScholarship.prop('checked'));
	}

	function _switchFiveYearStudentStatus() { // 切換「中五生招收」狀態
		$ruleOfFiveYearStudent.prop('disabled', !$hasFiveYearStudentAllowed.prop('checked'));
		$ruleDocOfFiveYearStudent.prop('disabled', !$hasFiveYearStudentAllowed.prop('checked'));
	}

	function _switchSelfEnrollmentStatus() { // 切換「單獨招收僑生（自招）」狀態
		$approvalNoOfSelfEnrollment.prop('disabled', !$hasSelfEnrollment.prop('checked'));
		$approvalDocOfSelfEnrollment.prop('disabled', !$hasSelfEnrollment.prop('checked'));
	}

	// 整理 form 資料
	function _getFormData() {
		var data = new FormData();
		data.append('address', $address.val());
		data.append('eng_address', $engAddress.val());
		data.append('organization', $organization.val());
		data.append('eng_organization', $engOrganization.val());
		data.append('url', $url.val());
		data.append('eng_url', $engUrl.val());
		data.append('phone', $phone.val());
		data.append('fax', $fax.val());
		data.append('has_dorm', +$hasDorm.prop('checked'));
		data.append('has_scholarship', +$hasScholarship.prop('checked'));
		data.append('has_five_year_student_allowed', +$hasFiveYearStudentAllowed.prop('checked'));
		data.append('has_self_enrollment', +$hasSelfEnrollment.prop('checked'));

		if ($hasDorm.prop('checked')) {
			data.append('dorm_info', $dormInfo.val());
			data.append('eng_dorm_info', $dormEngInfo.val());
		}
		if ($hasScholarship.prop('checked')) {
			data.append('scholarship_dept', $scholarshipDept.val());
			data.append('eng_scholarship_dept', $engScholarshipDept.val());
			data.append('scholarship_url', $scholarshipUrl.val());
			data.append('eng_scholarship_url', $engScholarshipUrl.val());
		}
		if ($hasFiveYearStudentAllowed.prop('checked')) {
			data.append('rule_of_five_year_student', $ruleOfFiveYearStudent.val());
			data.append('rule_doc_of_five_year_student', $ruleDocOfFiveYearStudent.prop('files')[0]);
		}
		if ($hasSelfEnrollment.prop('checked')) {
			data.append('approval_no_of_self_enrollment', $approvalNoOfSelfEnrollment.val());
			data.append('approval_doc_of_self_enrollment', $approvalDocOfSelfEnrollment.prop('files')[0]);
		}
		return data;
	}

	// 檢查表單要求
	function _validateForm() {
		var check = true;

		if (!_validateNotEmpty($phone)) {formGroup.phoneForm.addClass("has-danger"); check = false}
		if (!_validateNotEmpty($fax)) {formGroup.faxForm.addClass("has-danger"); check = false}
		if (!_validateNotEmpty($url)) {formGroup.urlForm.addClass("has-danger"); check = false}
		// if (!_validateUrlFormat($url)) {formGroup.urlForm.addClass("has-danger"); check = false}
		if (!_validateNotEmpty($address)) {formGroup.addressForm.addClass("has-danger"); check = false}
		if (!_validateNotEmpty($organization)) {formGroup.organizationForm.addClass("has-danger"); check = false}

		if ($hasDorm.prop("checked")) {
			if (!_validateNotEmpty($dormInfo)) {formGroup.dormInfoForm.addClass("has-danger"); check = false}
		}

		if ($hasScholarship.prop("checked")) {
			if (!_validateNotEmpty($scholarshipDept)) {formGroup.scholarshipDeptForm.addClass("has-danger"); check = false}
			if (!_validateNotEmpty($scholarshipUrl)) {formGroup.scholarshipUrlForm.addClass("has-danger"); check = false}
			// if (!_validateUrlFormat($scholarshipUrl)) {formGroup.scholarshipUrlForm.addClass("has-danger"); check = false}
		}

		if ($hasFiveYearStudentAllowed.prop("checked")) {
			if (!_validateNotEmpty($ruleOfFiveYearStudent)) {formGroup.ruleOfFiveYearStudentForm.addClass("has-danger"); check = false}
		}

		if ($hasSelfEnrollment.prop("checked")) {
			if (!_validateNotEmpty($approvalNoOfSelfEnrollment)) {formGroup.approvalNoOfSelfEnrollmentForm.addClass("has-danger"); check = false}
		}

		return check;
	}

	// 檢查有輸入的 Url 格式
	function _validateUrl() {
		var check = true;

		if (_validateNotEmpty($url)) {
			if (!_validateUrlFormat($url)) {formGroup.urlForm.addClass("has-danger"); check = false}
		}
		if (_validateNotEmpty($engUrl)) {
			if (!_validateUrlFormat($engUrl)) {formGroup.engUrlForm.addClass("has-danger"); check = false}
		}
		if (_validateNotEmpty($scholarshipUrl)) {
			if (!_validateUrlFormat($scholarshipUrl)) {formGroup.scholarshipUrlForm.addClass("has-danger"); check = false}
		}
		if (_validateNotEmpty($engScholarshipUrl)) {
			if (!_validateUrlFormat($engScholarshipUrl)) {formGroup.engScholarshipUrlForm.addClass("has-danger"); check = false}
		}

		return check;
	}

	// 檢查 form 是否為有值
	function _validateNotEmpty(el) {
		return el.val() !== "";
	}

	// 檢查 Url 格式是否正確
	function _validateUrlFormat(el) {
		var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		return regexp.test(el.val());
	}

	// 送出表單
	function _setSchoolInfo() {
		var form;
		// init highlight
		for(form in formGroup) {
			formGroup[form].removeClass("has-danger");
		}

		var urlResult = _validateUrl();
		var formResult = _validateForm();

		if (!urlResult || !formResult) {
			alert("有欄位輸入錯誤，請重新確認。");
			return;
		}

		var sendData = _getFormData();

		openLoading();

		School.setSchoolInfo(sendData)
		.then(function(res) {
			if(res.ok) {
				alert('儲存成功');
				location.reload();
			} else {
				throw res
			}
		}).catch(function(err) {
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);

				stopLoading();
			});
		})
	}

	// 擺放學校資料
	function _placedSchoolInfoData(schoolData) {
		$schoolId.val(schoolData.id);
		$title.val(schoolData.title);
		$engTitle.val(schoolData.eng_title);
		$phone.val(schoolData.phone);
		$fax.val(schoolData.fax);
		$url.val(schoolData.url);
		$engUrl.val(schoolData.eng_url);
		$address.val(schoolData.address);
		$engAddress.val(schoolData.eng_address);
		$organization.val(schoolData.organization);
		$engOrganization.val(schoolData.eng_organization);
		// 宿舍
		$hasDorm.prop("checked", schoolData.has_dorm);
		$dormInfo.val(schoolData.dorm_info);
		$dormEngInfo.val(schoolData.eng_dorm_info);
		// 僑生專屬獎學金
		$hasScholarship.prop("checked", schoolData.has_scholarship);
		$scholarshipDept.val(schoolData.scholarship_dept);
		$engScholarshipDept.val(schoolData.eng_scholarship_dept);
		$scholarshipUrl.val(schoolData.scholarship_url);
		$engScholarshipUrl.val(schoolData.eng_scholarship_url);
		// 中五生招收
		$hasFiveYearStudentAllowed.prop("checked", schoolData.has_five_year_student_allowed);
		$ruleOfFiveYearStudent.text(schoolData.rule_of_five_year_student);
		if (schoolData.rule_doc_of_five_year_student) {
			var FYSDocTitle = schoolData['rule_doc_of_five_year_student'].substring(schoolData['rule_doc_of_five_year_student'].lastIndexOf("/") + 1);
			$ruleDocOfFiveYearStudentUrl.prop("href", "http://localhost:8000/storage/" + schoolData.rule_doc_of_five_year_student);
			$ruleDocOfFiveYearStudentUrl.text(FYSDocTitle);
		}
		// 單獨招收僑生（自招）
		$hasSelfEnrollment.prop("checked", schoolData.has_self_enrollment);
		$approvalNoOfSelfEnrollment.val(schoolData.approval_no_of_self_enrollment);
		if (schoolData.approval_doc_of_self_enrollment) {
			var SEDocTitle = schoolData['approval_doc_of_self_enrollment'].substring(schoolData['approval_doc_of_self_enrollment'].lastIndexOf("/") + 1);
			$approvalDocOfSelfEnrollmentUrl.prop("href", "http://localhost:8000/storage/" + schoolData.approval_doc_of_self_enrollment);
			$approvalDocOfSelfEnrollmentUrl.text(SEDocTitle);
		}
	}

	// init
	function _getSchoolData() {
		openLoading();

		School.getSchoolInfo()
		.then(function(res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function(json) {
			// 處理擺放學校資料
			_placedSchoolInfoData(json);
			return json.info_status
		}).then(function(infoStatus) {
			var role = User.getUserInfo().school_editor.has_admin;

			_switchDormStatus();
			_switchScholarshipStatus();
			_switchFiveYearStudentStatus();
			_switchSelfEnrollmentStatus();

			stopLoading();
		}).catch(function(err) {
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);

				stopLoading();
			});
		})
	}

})();
