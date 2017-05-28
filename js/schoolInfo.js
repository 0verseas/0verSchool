var schoolInfo = (function () {

	/**
	 * init
	 */

	_getSchoolData();

	/**
	 * cache DOM
	 */

	// 審閱建議
	var $reviewInfo = $('#reviewInfo');
	var $reviewBy = $reviewInfo.find('#reviewBy');
	var $reviewAt = $reviewInfo.find('#reviewAt');
	var $reviewMemo = $reviewInfo.find('#reviewMemo');

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
	// 單獨招收僑生（自招）
	var $hasSelfEnrollment = $schoolInfoForm.find('#hasSelfEnrollment');
	var $approvalNoOfSelfEnrollment = $schoolInfoForm.find('#approvalNoOfSelfEnrollment');
	var $approvalDocOfSelfEnrollment = $schoolInfoForm.find('#approvalDocOfSelfEnrollment');
	// Button
	var $saveBtn = $schoolInfoForm.find('#btn-save');
	var $commitBtn = $schoolInfoForm.find('#btn-commit');

	/**
	 * bind event
	 */

	$hasDorm.on("change", _switchDormStatus);
	$hasScholarship.on("change", _switchScholarshipStatus);
	$hasFiveYearStudentAllowed.on("change", _switchFiveYearStudentStatus);
	$hasSelfEnrollment.on("change", _switchSelfEnrollmentStatus);
	$saveBtn.on("click", _saveSchoolInfo);
	$commitBtn.on("click", _commitSchoolInfo);

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

	function _getFormData() {
		var data = {
			'address': $address.val(),
			'eng_address': $engAddress.val(),
			'organization': $organization.val(),
			'eng_organization': $engOrganization.val(),
			'url': $url.val(),
			'eng_url': $engUrl.val(),
			'phone': $phone.val(),
			'fax': $fax.val(),
			'has_dorm' : $hasDorm.prop('checked'),
			'dorm_info' : $dormInfo.val(),
			'eng_dorm_info' : $dormEngInfo.val(),
			'has_scholarship' : $hasScholarship.prop('checked'),
			'scholarship_dept' : $scholarshipDept.val(),
			'eng_scholarship_dept' : $engScholarshipDept.val(),
			'scholarship_url' : $scholarshipUrl.val(),
			'eng_scholarship_url' : $engScholarshipUrl.val(),
			'has_five_year_student_allowed' : $hasFiveYearStudentAllowed.prop('checked'),
			'rule_of_five_year_student' : $ruleOfFiveYearStudent.val(),
			'has_self_enrollment' : $hasSelfEnrollment.prop('checked'),
			'approval_no_of_self_enrollment' : $approvalNoOfSelfEnrollment.val()
		}
		if (!data.has_dorm) {delete data.dorm_info; delete data.eng_dorm_info}
		if (!data.has_scholarship) {delete data.scholarship_dept; delete data.eng_scholarship_dept; delete data.scholarship_url; delete data.eng_scholarship_url;}
		if (!data.has_five_year_student_allowed) {delete data.rule_of_five_year_student;}
		if (!data.has_self_enrollment) {delete data.approval_no_of_self_enrollment;}
		return data;
	}

	function _saveSchoolInfo() {

		var sendData = _getFormData();
		sendData['action'] = 'save';

		fetch('https://api.overseas.ncnu.edu.tw/schools/me/histories', {
			credentials: 'include',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(sendData)
		}).then(function(res) {
			if(!res.ok) {
				throw res
			}
		}).catch(function(err) {
			console.log(err);
		})
	}

	function _commitSchoolInfo() {
		var sendData = _getFormData();
		sendData['action'] = 'commit';

		fetch('https://api.overseas.ncnu.edu.tw/schools/me/histories', {
			credentials: 'include',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(sendData)
		}).then(function(res) {
			if(!res.ok) {
				throw res
			}
		}).catch(function(err) {
			console.log(err);
		})
	}

	function _placedReviewInfo(schoolData) {
		// 狀態為 `editing`(編輯中) 以及 `returned`(被退回)，則顯示審閱建議。
		// 狀態為 `confirmed`(通過) 、 `waiting`(已 commit 待檢驗) 則不須顯示審閱建議。
		if (schoolData.info_status === "editing" && schoolData.last_returned_data !== null || schoolData.info_status === "returned") {
			$reviewInfo.show("slow");
			$reviewBy.val(schoolData.last_returned_data.review_by);
			$reviewAt.text(schoolData.last_returned_data.review_at);
			$reviewMemo.text(schoolData.last_returned_data.review_memo);
		}
	}

	function _placedSchoolInfoData(schoolData) {
		// 擺放學校資料
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
		// 單獨招收僑生（自招）
		$hasSelfEnrollment.prop("checked", schoolData.has_self_enrollment);
		$approvalNoOfSelfEnrollment.val(schoolData.approval_no_of_self_enrollment);
	}

	function _getSchoolData() {
		fetch('https://api.overseas.ncnu.edu.tw/schools/me/histories/latest', {
			credentials: 'include'
		}).then(function(res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function(json) {
			// 處理擺放學校資料、顯示審閱結果
			_placedReviewInfo(json);
			_placedSchoolInfoData(json);
			return json.info_status
		}).then(function(infoStatus) {
			// 編輯狀態若為「等待審閱」或「審閱成功」，則 鎖住 編輯畫面。
			if (infoStatus === 'waiting' || infoStatus === 'confirmed') {
				$schoolInfoForm.find(':input').prop('disabled', true);
			} else {
				_switchDormStatus();
				_switchScholarshipStatus();
				_switchFiveYearStudentStatus();
				_switchSelfEnrollmentStatus();
			}
		}).catch(function(err) {
			console.log(err);
		})
	}

})();
