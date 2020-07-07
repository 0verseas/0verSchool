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
	// 緬甸師培專案
	var $hasMyanmarTeacherEducation = $schoolInfoForm.find('#hasMyanmarTeacherEducation');
	var $myanmarScholarshipInfo = $schoolInfoForm.find('#myanmarScholarshipInfo');
	var $myanmarDormInfo = $schoolInfoForm.find('#myanmarDormInfo');
	var $myanmarNote = $schoolInfoForm.find('#myanmarNote');

	// Button
	var $schoolInfoBtn = $schoolInfoForm.find('#btn-save');
	var $schoolLockBtn = $schoolInfoForm.find('#btn-lock-school');
	var $downloadExcel = $schoolInfoForm.find('#downloadExcel');

	var text = '';
	// form-group
	var formGroup = {
		phoneForm: $schoolInfoForm.find('#phoneForm input'),
		faxForm: $schoolInfoForm.find('#faxForm input'),
		urlForm: $schoolInfoForm.find('#urlForm input'),
		engUrlForm: $schoolInfoForm.find('#engUrlForm input'),
		addressForm: $schoolInfoForm.find('#addressForm input'),
		engAddressForm: $schoolInfoForm.find('#engAddressForm input'),
		organizationForm: $schoolInfoForm.find('#organizationForm input'),
		engOrganizationForm: $schoolInfoForm.find('#engOrganizationForm input'),
		dormInfoForm: $schoolInfoForm.find('#dormInfoForm textarea'),
		dormEngInfoForm: $schoolInfoForm.find('#dormEngInfoForm textarea'),
		scholarshipDeptForm: $schoolInfoForm.find('#scholarshipDeptForm input'),
		engScholarshipDeptForm: $schoolInfoForm.find('#engScholarshipDeptForm input'),
		scholarshipUrlForm: $schoolInfoForm.find('#scholarshipUrlForm input'),
		engScholarshipUrlForm: $schoolInfoForm.find('#engScholarshipUrlForm input'),
		ruleOfFiveYearStudentForm: $schoolInfoForm.find('#ruleOfFiveYearStudentForm textarea'),
		approvalNoOfSelfEnrollmentForm: $schoolInfoForm.find('#approvalNoOfSelfEnrollmentForm input'),
		myanmarEducationTeacherScholarshipForm: $schoolInfoForm.find('#myanmarEducationTeacherScholarshipForm textarea'),
		myanmarEducationTeacherDormForm: $schoolInfoForm.find('#myanmarEducationTeacherDormForm textarea'),
		myanmarEducationTeacherNoteForm: $schoolInfoForm.find('#myanmarEducationTeacherNoteForm textarea')
	};

	/**
	 * init
	 */

	_getSchoolData();
	_checkDownload();
	/**
	 * bind event
	 */

	$hasDorm.on("change", _switchDormStatus);
	$hasScholarship.on("change", _switchScholarshipStatus);
	$hasFiveYearStudentAllowed.on("change", _switchFiveYearStudentStatus);
	$hasSelfEnrollment.on("change", _switchSelfEnrollmentStatus);
	$hasMyanmarTeacherEducation.on("change", _switchMyanmarTeacherEducation);
	$schoolInfoBtn.on("click", _setSchoolInfo);
	$schoolLockBtn.on("click", check_bachelor_quota);
	$downloadExcel.on("click", _downloadExcel);

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

	function _switchMyanmarTeacherEducation() { // 切換「緬甸師培專案」狀態
		$myanmarScholarshipInfo.prop('disabled', !$hasMyanmarTeacherEducation.prop('checked'));
		$myanmarDormInfo.prop('disabled', !$hasMyanmarTeacherEducation.prop('checked'));
		$myanmarNote.prop('disabled', !$hasMyanmarTeacherEducation.prop('checked'));
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
		data.append('has_myanmar_teacher_education', +$hasMyanmarTeacherEducation.prop('checked'));

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
		if($hasMyanmarTeacherEducation.prop('checked')) {
			data.append('myanmar_scholarship_info', $myanmarScholarshipInfo.val());
			data.append('myanmar_dorm_info', $myanmarDormInfo.val());
			data.append('myanmar_note', $myanmarNote.val());
		}

		return data;
	}

	// 檢查表單要求
	function _validateForm() {
		var check = true;

		if (!_validateNotEmpty($phone)) {formGroup.phoneForm.addClass("is-invalid"); check = false}
		if (!_validateNotEmpty($fax)) {formGroup.faxForm.addClass("is-invalid"); check = false}
		if (!_validateNotEmpty($url)) {formGroup.urlForm.addClass("is-invalid"); check = false}
		// if (!_validateUrlFormat($url)) {formGroup.urlForm.addClass("is-invalid"); check = false}
		if (!_validateNotEmpty($address)) {formGroup.addressForm.addClass("is-invalid"); check = false}
		if (!_validateNotEmpty($organization)) {formGroup.organizationForm.addClass("is-invalid"); check = false}
		if (!_validateNotEmpty($engUrl)) {formGroup.engUrlForm.addClass("is-invalid"); check = false}
		if (!_validateNotEmpty($engAddress)) {formGroup.engAddressForm.addClass("is-invalid"); check = false}
		if (!_validateNotEmpty($engOrganization)) {formGroup.engOrganizationForm.addClass("is-invalid"); check = false}

		if ($hasDorm.prop("checked")) {
			if (!_validateNotEmpty($dormInfo)) {formGroup.dormInfoForm.addClass("is-invalid"); check = false}
			if (!_validateNotEmpty($dormEngInfo)) {formGroup.dormEngInfoForm.addClass("is-invalid"); check = false}
		}

		if ($hasScholarship.prop("checked")) {
			if (!_validateNotEmpty($scholarshipDept)) {formGroup.scholarshipDeptForm.addClass("is-invalid"); check = false}
			if (!_validateNotEmpty($scholarshipUrl)) {formGroup.scholarshipUrlForm.addClass("is-invalid"); check = false}
			// if (!_validateUrlFormat($scholarshipUrl)) {formGroup.scholarshipUrlForm.addClass("is-invalid"); check = false}
			if (!_validateNotEmpty($engScholarshipDept)) {formGroup.engScholarshipDeptForm.addClass("is-invalid"); check = false}
			if (!_validateNotEmpty($engScholarshipUrl)) {formGroup.engScholarshipUrlForm.addClass("is-invalid"); check = false}
		}

		if ($hasFiveYearStudentAllowed.prop("checked")) {
			if (!_validateNotEmpty($ruleOfFiveYearStudent)) {formGroup.ruleOfFiveYearStudentForm.addClass("is-invalid"); check = false}
		}

		if ($hasSelfEnrollment.prop("checked")) {
			if (!_validateNotEmpty($approvalNoOfSelfEnrollment)) {formGroup.approvalNoOfSelfEnrollmentForm.addClass("is-invalid"); check = false}
		}

		if($hasMyanmarTeacherEducation.prop("checked")) {
			if (!_validateNotEmpty($myanmarScholarshipInfo)) {formGroup.myanmarEducationTeacherScholarshipForm.addClass("is-invalid"); check = false;}
			if (!_validateNotEmpty($myanmarDormInfo)) {formGroup.myanmarEducationTeacherDormForm.addClass("is-invalid"); check = false;}
			//if (!_validateNotEmpty($myanmarNote)) {formGroup.myanmarEducationTeacherNoteForm.addClass("is-invalid"); check = false;}
		}

		return check;
	}

	// 檢查有輸入的 Url 格式
	function _validateUrl() {
		var check = true;

		if (_validateNotEmpty($url)) {
			if (!_validateUrlFormat($url)) {formGroup.urlForm.addClass("is-invalid"); check = false}
		}
		if (_validateNotEmpty($engUrl)) {
			if (!_validateUrlFormat($engUrl)) {formGroup.engUrlForm.addClass("is-invalid"); check = false}
		}
		if (_validateNotEmpty($scholarshipUrl)) {
			if (!_validateUrlFormat($scholarshipUrl)) {formGroup.scholarshipUrlForm.addClass("is-invalid"); check = false}
		}
		if (_validateNotEmpty($engScholarshipUrl)) {
			if (!_validateUrlFormat($engScholarshipUrl)) {formGroup.engScholarshipUrlForm.addClass("is-invalid"); check = false}
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
			formGroup[form].removeClass("is-invalid");
		}

		var urlResult = _validateUrl();
		var formResult = _validateForm();

		if (!urlResult || !formResult) {
			alert("有欄位輸入錯誤，請重新確認。");
			return;
		}

		var sendData = _getFormData();
		sendData.append('confirmed', '0');

		openLoading();

		School.setSchoolInfo(sendData)
		.then(function(res) {
			console.log(sendData);
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
	// 鎖定表單
	function _lockschool() {
		var isAllSet = confirm("提醒您：確認後就無法再更改「學校資料」");
		if (isAllSet === true) {
			// init highlight
			var form;
			for (form in formGroup) {
				formGroup[form].removeClass("is-invalid");
			}

			var urlResult = _validateUrl();
			var formResult = _validateForm();

			if (!urlResult || !formResult) {
				alert("有欄位輸入錯誤，請重新確認。");
				return;
			}

			var sendData = _getFormData();
			sendData.append('confirmed', '1');
			openLoading();

			School.setSchoolInfo(sendData)
				.then(function (res) {
					console.log(sendData);
					if (res.ok) {
						alert('鎖定成功');
						location.reload();
					} else {
						throw res
					}
				}).catch(function (err) {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);

					stopLoading();
				});
			})
		}
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
			$ruleDocOfFiveYearStudentUrl.prop("href", env.baseUrl + "/storage/" + schoolData.rule_doc_of_five_year_student);
			$ruleDocOfFiveYearStudentUrl.text(FYSDocTitle);
		}
		// 單獨招收僑生（自招）
		$hasSelfEnrollment.prop("checked", schoolData.has_self_enrollment);
		$approvalNoOfSelfEnrollment.val(schoolData.approval_no_of_self_enrollment);
		if (schoolData.approval_doc_of_self_enrollment) {
			var SEDocTitle = schoolData['approval_doc_of_self_enrollment'].substring(schoolData['approval_doc_of_self_enrollment'].lastIndexOf("/") + 1);
			$approvalDocOfSelfEnrollmentUrl.prop("href", env.baseUrl + "/storage/" + schoolData.approval_doc_of_self_enrollment);
			$approvalDocOfSelfEnrollmentUrl.text(SEDocTitle);
		}
		// 緬甸師培專案
		$hasMyanmarTeacherEducation.prop("checked", schoolData.has_myanmar_teacher_education);
		//console.log(schoolData.myanmar_Scholarship_info);
		// if(schoolData.myanmar_Scholarship_info == null) {
		// 	// TODO: 待補預設文字
		// 	$str = '*****預設文字供參考，請自行更改說明*****'+'<br />'+
		// 	'例：1.提供第一學年免繳學雜費及免繳住宿費';
		// 	//$myanmarScholarshipInfo.val($str);
		// 	document.getElementById("myanmarScholarshipInfo").innerHTML = $str;
		// }
		// else { $myanmarScholarshipInfo.val(schoolData.myanmar_scholarship_info); }
		$myanmarScholarshipInfo.val(schoolData.myanmar_scholarship_info);
		$myanmarDormInfo.val(schoolData.myanmar_dorm_info);
		$myanmarNote.val(schoolData.myanmar_note);
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
			if (json.review_at != null) { // 已鎖定
				document.getElementById("btn-save").disabled = true;
				$('#btn-lock-school').removeClass('btn-danger').addClass('btn-success').prop('disabled', true).text('已鎖定')
			}
			// 有招收緬甸師培生才可以選要不要勾「是否招收緬甸師培生」
			if(json.has_myanmar_teacher_education == 1){
				$hasMyanmarTeacherEducation.prop('disabled', false);
			}
			return json.info_status
		}).then(function(infoStatus) {
			var role = User.getUserInfo().school_editor.has_admin;

			_switchDormStatus();
			_switchScholarshipStatus();
			_switchFiveYearStudentStatus();
			_switchSelfEnrollmentStatus();
			_switchMyanmarTeacherEducation();

			stopLoading();
		}).catch(function(err) {
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);

				stopLoading();
			});
		})
	}

	function _checkDownload() {
		School.getSchoolInfo() // 取的校資料以檢視校鎖定了沒
			.then(function(res) {
				if(res.ok) {
					return res.json();
				} else {
					throw res
				}
			}).then(function(json) {
			if (json.review_at == null) { // 校資料未鎖定
				text += "學校資料尚未鎖定！" + '\n';
			}
		})

		School.getSystemInfo(1) // 取得學制資料，沒有該學制則回上一頁
			.then((res) => {
				if(res.ok) { // 有該學制則開始頁面初始化
					return res.json();
				} else {
					throw res;
				}
			}).then((json) => {
			if(json.review_at == null) {
				text += "學士班尚未鎖定！" + '\n';
			}
		})

		School.getSystemInfo(2) // 取得學制資料，沒有該學制則回上一頁
			.then((res) => {
				if(res.ok) { // 有該學制則開始頁面初始化
					return res.json();
				} else {
					throw res;
				}
			}).then((json) => {
			if(json.review_at == null) {
				text += "港二技尚未鎖定！" + '\n';
			}
		})

		School.getSystemInfo(3) // 取得學制資料，沒有該學制則回上一頁
			.then((res) => {
				if(res.ok) { // 有該學制則開始頁面初始化
					return res.json();
				} else {
					throw res;
				}
			}).then((json) => {
			if(json.review_at == null) {
				text += "碩士班尚未鎖定！" + '\n';
			}
		})

		School.getSystemInfo(4) // 取得學制資料，沒有該學制則回上一頁
			.then((res) => {
				if(res.ok) { // 有該學制則開始頁面初始化
					return res.json();
				} else {
					throw res;
				}
			}).then((json) => {
			if(json.review_at == null) {
				text += "博士班尚未鎖定！" + '\n';
			}
		})
	}

	//下載學校 Excel 清冊
	function _downloadExcel() {

		if (text =='') {
			window.open (env.baseUrl + '/school-data-exportation');
		}
		else {
			alert(text);
		}
	}

	//確認學士班（含港二季）給定的招生名額是否分配完
	function check_bachelor_quota(){
		let allowTotal = 0;
		let wantTotal = 0;

		School.getSystemQuota('bachelor').then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function (json) {
			allowTotal = json.last_year_surplus_admission_quota + json.quota_used + json.quota_passed + json.ratify_expanded_quota;
			 wantTotal = json.self_enrollment_quota + json.another_department_self_enrollment_quota + json.another_department_admission_selection_quota;
			for(let i = 0; i<json.departments.length;i++){
				wantTotal+=json.departments[i].admission_placement_quota + json.departments[i].admission_selection_quota;
			}
			if(allowTotal != wantTotal){
				alert('學士班（含港二季）各系所招生名額加總必須等於可招生總量');
				return ;
			} else {
				check_master_quota();
			}	
		})
	}

	//確認碩士班給定的招生名額是否分配完
	function check_master_quota(){
		let allowTotal = 0;
		let wantTotal = 0;
		
		School.getSystemQuota('master').then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function (json) {
			allowTotal = json.last_year_surplus_admission_quota + json.quota_used + json.quota_passed + json.ratify_expanded_quota;
			 wantTotal = json.self_enrollment_quota ;
			for(let i = 0; i<json.departments.length;i++){
				wantTotal+=json.departments[i].admission_selection_quota;
			}
			if(allowTotal != wantTotal){
				alert('碩士班各系所招生名額加總必須等於可招生總量');
				return ;
			} else {
				check_phd_quota();
			}
		})
	}

	//確認博士班給定的招生名額是否分配完
	function check_phd_quota(){
		let allowTotal = 0;
		let wantTotal = 0;
		
		School.getSystemQuota('phd').then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function (json) {
			allowTotal = json.last_year_surplus_admission_quota + json.quota_used + json.quota_passed + json.ratify_expanded_quota;
			 wantTotal = json.self_enrollment_quota ;
			for(let i = 0; i<json.departments.length;i++){
				wantTotal+=json.departments[i].admission_selection_quota;
			}
			if(allowTotal != wantTotal){
				alert('博士班各系所招生名額加總必須等於可招生總量');
				return ;
			} else {
				_lockschool();
			}
		})
	}

})();
