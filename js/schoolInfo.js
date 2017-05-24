var schoolInfo = (function () {

	_getSchoolData();

	/**
	 * cache DOM
	 */

	// 審閱建議
	$reviewInfo = $('#reviewInfo');
	$reviewBy = $reviewInfo.find('#reviewBy');
	$reviewAt = $reviewInfo.find('#reviewAt');
	$reviewMemo = $reviewInfo.find('#reviewMemo');

	// 學校資料
	$schoolInfoForm = $('#form-schoolInfo');
	$schoolId = $schoolInfoForm.find('#schoolId');
	$title = $schoolInfoForm.find('#title');
	$engTitle = $schoolInfoForm.find('#engTitle');
	$phone = $schoolInfoForm.find('#phone');
	$fax = $schoolInfoForm.find('#fax');
	$url = $schoolInfoForm.find('#url');
	$engUrl = $schoolInfoForm.find('#engUrl');
	$address = $schoolInfoForm.find('#address');
	$engAddress = $schoolInfoForm.find('#engAddress');
	$organization = $schoolInfoForm.find('#organization');
	$engOrganization = $schoolInfoForm.find('#engOrganization');
	// 宿舍
	$hasDorm = $schoolInfoForm.find('#hasDorm');
	$dormInfo = $schoolInfoForm.find('#dormInfo');
	$dormEngInfo = $schoolInfoForm.find('#dormEngInfo');
	// 僑生專屬獎學金
	$hasScholarship = $schoolInfoForm.find('#hasScholarship');
	$scholarshipDept = $schoolInfoForm.find('#scholarshipDept');
	$engScholarshipDept = $schoolInfoForm.find('#engScholarshipDept');
	$scholarshipUrl = $schoolInfoForm.find('#scholarshipUrl');
	$engScholarshipUrl = $schoolInfoForm.find('#engScholarshipUrl');
	// 中五生招收
	$hasFiveYearStudentAllowed = $schoolInfoForm.find('#hasFiveYearStudentAllowed');
	$ruleOfFiveYearStudent = $schoolInfoForm.find('#ruleOfFiveYearStudent');
	$ruleDocOfFiveYearStudent = $schoolInfoForm.find('#ruleDocOfFiveYearStudent');
	// 單獨招收僑生（自招）
	$hasSelfEnrollment = $schoolInfoForm.find('#hasSelfEnrollment');
	$approvalNoOfSelfEnrollment = $schoolInfoForm.find('#approvalNoOfSelfEnrollment');
	$approvalDocOfSelfEnrollment = $schoolInfoForm.find('#approvalDocOfSelfEnrollment');

	/**
	 * bind event
	 */

	$hasDorm.on("change", _switchDormStatus);
	$hasScholarship.on("change", _switchScholarshipStatus);
	$hasFiveYearStudentAllowed.on("change", _switchFiveYearStudentStatus);
	$hasSelfEnrollment.on("change", _switchSelfEnrollmentStatus);

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

	function _placedReviewInfo(schoolData) {
		// 狀態為 `editing` 以及「有被審閱過」，則顯示審閱建議。
		// 狀態為 `confirmed`(通過) 、 `waiting`(已 commit 待檢驗) 則不須顯示審閱建議。
		if (schoolData.info_status === "editing" && schoolData.review_by !== null) {
			$reviewInfo.show("slow");
			$reviewBy.val(schoolData.review_by);
			$reviewAt.text(schoolData.review_at);
			$reviewMemo.text(schoolData.review_memo);
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
			window.location.href = '/school/'
		})
	}

})();
