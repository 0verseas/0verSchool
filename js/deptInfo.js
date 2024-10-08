var DeptInfo = (function () {

	// 此為 deptInfoBache, deptInfoTwoYear, deptInfoMaster, deptInfoPhd 共同引入的檔案
	// 內容為各系所資訊 API

	let _applicationDocumentTypes;

	/**
	 * cache DOM
	 */

	const $deptInfoForm = $('#form-deptInfo'); // 學制資訊
	const $deptInfoDescription = $deptInfoForm.find('#description'); // 中文備註
	const $deptInfoEngDescription = $deptInfoForm.find('#engDescription'); // 英文備註

	const $deptList = $('#dept-list'); // 系所列表
	const $deptFilterInput = $('#dept-filter-input'); // 搜尋欄

	// Modal common elements
	const $modalDeptInfo = $('#modal-deptInfo');
	const $sortOrder = $modalDeptInfo.find('#sortOrder'); // 簡章順序
	const $id = $modalDeptInfo.find('#id'); // Can't edit ，系所代碼
	const $extendedTag = $modalDeptInfo.find('#extendedTag'); // Can't edit，讀卡代碼
	const $titleMain = $modalDeptInfo.find('#titleMain');  // 核定系名
	const $titleDivision = $modalDeptInfo.find('#titleDivision');  // 招生分組
	const $title = $modalDeptInfo.find('#title'); // Can't edit，中文名稱
	const $engTitle = $modalDeptInfo.find('#engTitle'); // Can't edit unless add at this year is true in the past, but now open to edit，英文名稱
	const $url = $modalDeptInfo.find('#url'); // 系中文網站網址
	const $engUrl = $modalDeptInfo.find('#engUrl'); // 系英文網站網址
	const $mainGroup = $modalDeptInfo.find('#mainGroup'); // select bar，主要隸屬學群
	const $subGroup = $modalDeptInfo.find('#subGroup'); // select bar，次要隸屬學群
	const $genderLimit = $modalDeptInfo.find('#genderLimit'); // select bar，招收性別限制
	const $moeCheckFailed = $modalDeptInfo.find('#moeCheckFailed'); // select bar，是否經教育部查核被列為持續列管或不通過
    const $teacherQualityPassed = $modalDeptInfo.find('#teacherQualityPassed'); // select bar，師資質量是否達「專科以上學校總量發展規模與資源條件標準」附表五所定基準
	const $description = $modalDeptInfo.find('#description'); // textarea，選系中文說明
	const $engDescription = $modalDeptInfo.find('#engDescription'); // textarea，選系英文說明
	const $hasForeignSpecialClass = $modalDeptInfo.find('#hasForeignSpecialClass'); // checkbox，是否招收外生專班
	const $hasEngTaught = $modalDeptInfo.find('#hasEngTaught'); // checkbox，是否為全英文授課
	const $hasDisabilities = $modalDeptInfo.find('#hasDisabilities'); // checkbox，是否招收身障學生
	const $hasBuHweiHwaWen = $modalDeptInfo.find('#hasBuHweiHwaWen'); // checkbox，是否招收不具華文基礎學生
	const $hasBirthLimit = $modalDeptInfo.find('#hasBirthLimit'); // checkbox，是否限制出生日期
	const $birthLimitAfter = $modalDeptInfo.find('#birthLimitAfter'); // 限制出生日期（以後）
	const $birthLimitBefore = $modalDeptInfo.find('#birthLimitBefore'); // 限制出生日期（以前）
	const $memo = $modalDeptInfo.find('#memo'); // 給海聯的訊息
	const $groupCode = $modalDeptInfo.find('#groupCode'); //類組
    const $admissionSelectionQuota = $modalDeptInfo.find('#admissionSelectionQuota'); // 個人申請人數
	const $interviewForm = $modalDeptInfo.find('#form-interviewInfo'); // 面試資訊區域
	const $hasInterview = $modalDeptInfo.find('#hasInterview'); // checkbox，是否需要面試
	const $interviewDescription = $modalDeptInfo.find('#interview-description'); // textarea，選系中文說明
	const $interviewEngDescription = $modalDeptInfo.find('#interview-english-description'); // textarea，選系英文說明

	// 所有審查項目
	const $reviewDiv = $modalDeptInfo.find('#review-div');

	let formGroup = {
		sortOrderForm: $modalDeptInfo.find('#sortOrderForm input'),
        engTitleForm: $modalDeptInfo.find('#engTitleForm input'),
		urlForm: $modalDeptInfo.find('#urlForm input'),
		engUrlForm: $modalDeptInfo.find('#engUrlForm input'),
		mainGroupForm: $modalDeptInfo.find('#mainGroupForm select'),
		subGroupForm: $modalDeptInfo.find('#subGroupForm select'),
		genderLimitForm: $modalDeptInfo.find('#genderLimitForm select'),
        moeCheckFailedForm: $modalDeptInfo.find('#moeCheckFailedForm select'),
        teacherQualityPassedForm: $modalDeptInfo.find('#teacherQualityPassedForm select'),
		descriptionForm: $modalDeptInfo.find('#descriptionForm textarea'),
		engDescriptionForm: $modalDeptInfo.find('#engDescriptionForm textarea'),
		birthLimitAfterForm: $modalDeptInfo.find('#birthLimitAfterForm input'),
		birthLimitBeforeForm: $modalDeptInfo.find('#birthLimitBeforeForm input'),
		memoForm: $modalDeptInfo.find('#memoForm textarea'),
		groupCodeForm: $modalDeptInfo.find('#groupCodeForm select'),
		interviewForm: $modalDeptInfo.find('#form-interviewInfo textarea')
	};

	/**
	 * bind event
	 */

	$deptFilterInput.on('keyup', _filterDeptInput); // 系所列表篩選
	$hasBirthLimit.on("change", _switchHasBirthLimit); // 是否限制出生日期
	$moeCheckFailed.on("change", _switchMoeCheckFailed); // 是否被列管
	$teacherQualityPassed.on("change" ,_switchTeacherQualityPassed); // 是否師資不合格
	$hasInterview.on("change" ,_switchHasInterview);

	/**
	 * events
	 */

	function renderDescription(json) { // 渲染備註欄
		$deptInfoDescription.text(json.description);
		$deptInfoEngDescription.text(json.eng_description);
	}

	function saveDeptDescription(system) { // Description 儲存
		let check = true;

		if (!_validateNotEmpty($deptInfoDescription)) {
            $deptInfoDescription.addClass("is-invalid");
			check = false;
		}

        if (!_validateNotEmpty($deptInfoEngDescription)) {
            $deptInfoEngDescription.addClass("is-invalid");
            check = false;
        }

        if (check === true) {
            let data = {
                'description': $deptInfoDescription.val(),
                'eng_description': $deptInfoEngDescription.val()
            };

            openLoading();
            School.setSystemInfo(system, data)
			.then(function (res) {
				if (res.ok) {
					swal({title:`儲存成功`, confirmButtonText:'確定', type:'success'}).then(() => {
						location.reload();
					});
				} else {
					swal({title:`儲存失敗`, confirmButtonText:'確定', type:'error'}).then(() => {
						throw res;
					});
				}
				stopLoading();
			})
			.catch(function (err) {
                err.json && err.json().then((data) => {
                    console.error(data);
					swal({title:data.messages[0], confirmButtonText:'確定', type:'error'});
                });
				stopLoading();
            });
        } else {
			swal({title:`有欄位輸入錯誤，請重新確認。`, confirmButtonText:'確定', type:'error'});
		}
	}

	function renderDeptList(departments) { // 系所列表渲染
		// 預設排序
		departments.sort(function (a, b) {
		  return a.sort_order - b.sort_order;
		});

		// 列表初始化
		$deptList.find('tbody').html('');
		departments.forEach(function (value, index) {
			let updateAt = moment(value.created_at).format('YYYY/MM/DD HH:mm:ss');
			let engTitle = encodeHtmlCharacters(value.eng_title);  // department english title
			let title = encodeHtmlCharacters(value.title); // department title
			if(value.is_extended_department == 1){
				title = title+'&nbsp;&nbsp;<span class="badge badge-warning">重點產業系所</span>';
			}
			if(value.is_extended_department == 2){
				title = title+'&nbsp;&nbsp;<span class="badge table-primary">國際專修部</span>';
			}
			$deptList
				.find('tbody')
				.append(`
					<tr class="btn-editDeptInfo" data-deptid="${value.id}">
						<td>
							<i class="fa fa-pencil" aria-hidden="true"></i>
						</td>
						<td>${value.sort_order}</td>
						<td>${value.id}</td>
						<td>
							<div>${title}</div>
							<div>${engTitle}</div>
						</td>
						<td>${value.created_by}</td>
						<td>${updateAt}</td>
					</tr>
				`);
		});
	}

	function _filterDeptInput(e) { // 「系所列表」搜尋過濾列表
		let filter = $deptFilterInput.val().toUpperCase();
		let tr = $deptList.find('tr');

		let i;
		for (i = 0; i < tr.length; i++) {
			let code = tr[i].getElementsByTagName("td")[2]; // 代碼
			let name = tr[i].getElementsByTagName("td")[3]; // 名稱

			if (code || name) {
				if (code.innerHTML.toUpperCase().indexOf(filter) > -1 || name.innerHTML.toUpperCase().indexOf(filter) > -1) {
					tr[i].style.display = "";
				} else {
					tr[i].style.display = "none";
				}
			}
		}
	}

	function renderDeptSelect(system) {
		let item = School.getDeptFormItem(system); // 產生系所詳細資料 Modal 中下拉式選單

		item.then(res => { return res[0].json(); }) // 學群
		.then(json => {
			// 列表初始化
			// $mainGroup.html('<option value="">無</option>');
			$subGroup.html('<option value="">無</option>');
			json.forEach((value, index) => {
				$mainGroup
					.append(`
						<option value="${value.id}">${value.title}</option>
					`);
				$subGroup
					.append(`
						<option value="${value.id}">${value.title}</option>
					`);
			});
		});

		item.then(res => { return res[2].json(); }) // 審查項目類別
		.then(json => {
			reviewItems.initTypes(json);
		});
	}

	function renderCommonDeptDetail(deptData, system) {
		$sortOrder.val(deptData.sort_order);
		$id.val(deptData.id);
		if(deptData.is_extended_department == 1){
			$extendedTag.text('重點產業系所').removeClass('table-primary').addClass('badge-warning');
		} else if(deptData.is_extended_department == 2){
			$extendedTag.text('國際專修部').removeClass('badge-warning').addClass('table-primary');
		} else {
			$extendedTag.text('');
		}
        $titleMain.val(deptData.title_main);  // 核定系名
        $titleDivision.val(deptData.title_division);  // 招生分組
		$titleDivision.attr('maxlength', 191 - Array.from($titleMain.val()).length);
		$title.val(deptData.title);
		$engTitle.val(deptData.eng_title);

        const label = $($engTitle).parent().find('label');

		/*if (deptData.add_at_this_year === true) {
            $engTitle.prop('disabled', false);
            label.text('英文名稱（應與學校英文學位授予名稱一致）*');
            label.addClass('text-danger');
		} else {
            $engTitle.prop('disabled', true);
            label.text('英文名稱（應與學校英文學位授予名稱一致）');
            label.removeClass('text-danger');
		}*/
		// 開放修改英文名稱（原本是只有當年新加入的才可以）
		$engTitle.prop('disabled', false);
		label.text('英文名稱（應與學校英文學位授予名稱一致）*');
		label.addClass('text-danger');

		$url.val(deptData.url);
		$engUrl.val(deptData.eng_url);
		$mainGroup.val(deptData.main_group);
		$subGroup.val(deptData.sub_group);
		if (system === "bache") {
			$groupCode.val(deptData.group_code);
		}
		$genderLimit.val(deptData.gender_limit);

        $moeCheckFailed.val(deptData.moe_check_failed);

		if (deptData.teacher_quality_passed === true) {
            $teacherQualityPassed.val("Y");
		} else {
            $teacherQualityPassed.val("N");
		}

        $description.val(deptData.description);
		$engDescription.val(deptData.eng_description);
		$hasForeignSpecialClass.prop("checked", deptData.has_foreign_special_class);
		$hasEngTaught.prop("checked", deptData.has_eng_taught);
		$hasDisabilities.prop("checked", deptData.has_disabilities);
		$hasBuHweiHwaWen.prop("checked", deptData.has_BuHweiHwaWen);
		$hasBirthLimit.prop("checked", deptData.has_birth_limit);
		$birthLimitAfter.val(deptData.birth_limit_after);
		$birthLimitBefore.val(deptData.birth_limit_before);
		$memo.val(deptData.memo);
		$('.datepicker').datepicker({
			format: 'yyyy-mm-dd'
		});
		_switchHasBirthLimit();
		_switchMoeCheckFailed();
		_switchTeacherQualityPassed();

		if(deptData.admission_selection_quota > 0 && (system === "bache" || system === "twoYear")){
			$interviewForm.show();
			if(deptData.is_extended_department == 2){
				// 教育部規定 國際專修部一定要面試
				$hasInterview.attr('disabled',true);
				$hasInterview.val('1');
				$hasInterview.prop('checked',true).trigger('change');
			} else {
				$hasInterview.attr('disabled',false);
				$hasInterview.val(+deptData.has_interview);
				$hasInterview.prop('checked', deptData.has_interview).trigger('change');
			}
			if(deptData.has_interview) {
				$interviewDescription.val(deptData.interview_description);
				$interviewEngDescription.val(deptData.interview_eng_description);
			} else {
				$interviewDescription.val('');
				$interviewEngDescription.val('');
			}
		} else {
			$interviewForm.hide();
		}

		reviewItems.initApplicationDocs(deptData.application_docs);
		// 初始化渲染師長推薦函上傳方法的選項
		let upload_letter_method = deptData.recommendation_letter_upload_method === null ? '' : deptData.recommendation_letter_upload_method;
		$modalDeptInfo.find('#recommendation-letter-upload-method').val(upload_letter_method);

		let applicationDocs = deptData.application_docs;
		// 拿到師長推薦函的紙本推薦函收件期限
		for (let doc of applicationDocs) {
			if (doc.paper != null) {
				$('#recieveDeadline').val(doc.paper.deadline);
				// 紙本推薦函就不需要選師長推薦函上傳方式了
				$modalDeptInfo.find('#recommendation-letter-upload-method').val('-1');
				$modalDeptInfo.find('#recommendation-letter-upload-method').attr('disabled', true);
			}
		}
	}

	function _switchHasBirthLimit() {
		$birthLimitAfter.prop('disabled', !$hasBirthLimit.prop('checked'));
		$birthLimitBefore.prop('disabled', !$hasBirthLimit.prop('checked'));
	}

	function _switchMoeCheckFailed() {
		if ($moeCheckFailed.val() == '1') {
			$('#descriptionForm').hide();
			$('#engDescriptionForm').hide();
			$('#selfEnrollmentChoose').hide();
			$('#limitBlock').hide();
			$('#review-div').hide();
			//$('#memoForm').hide();
		}
		else if($teacherQualityPassed.val() == 'Y') {
			$('#descriptionForm').show();
			$('#engDescriptionForm').show();
			$('#selfEnrollmentChoose').show();
			$('#limitBlock').show();
			if($('#admissionSelectionQuota').val() > 0) {
				$('#review-div').show();
			}
			$('#memoForm').show();
		}
		else;
	}

	function _switchTeacherQualityPassed() {
		if ($teacherQualityPassed.val() == 'N') {
			$('#descriptionForm').hide();
			$('#engDescriptionForm').hide();
			$('#selfEnrollmentChoose').hide();
			$('#limitBlock').hide();
			$('#review-div').hide();
			//$('#memoForm').hide();
		}
		else if ($moeCheckFailed.val() != '1'){
			$('#descriptionForm').show();
			$('#engDescriptionForm').show();
			$('#selfEnrollmentChoose').show();
			$('#limitBlock').show();
			if($('#admissionSelectionQuota').val() > 0) {
				$('#review-div').show();
			}
			$('#memoForm').show();
		}
		else ;
	}

	function _switchHasInterview(){
		const checked = document.getElementById('hasInterview').checked;
		if(checked){
			$interviewDescription.attr('disabled', false);
			$interviewEngDescription.attr('disabled', false);
		} else {
			$interviewDescription.attr('disabled', true);
			$interviewEngDescription.attr('disabled', true);
		}
	}

	function validateForm() {
		let check = [];
		let appDocCheck;
		let form;
		for(form in formGroup) {
			formGroup[form].removeClass("is-invalid");
		}
		$('#recieveDeadlineDiv').removeClass("is-invalid");
        if (!_validateNotEmpty($engTitle)) {
            formGroup.engTitleForm.addClass("is-invalid");
            check.push('系所英文名稱輸入錯誤');
        }

		if (!_validateNotEmpty($url) || !_validateUrlFormat($url)) {
			formGroup.urlForm.addClass("is-invalid");
			check.push('系所中文網址輸入錯誤');
		}

        if (!_validateNotEmpty($engUrl) || !_validateUrlFormat($engUrl)) {
            formGroup.engUrlForm.addClass("is-invalid");
            check.push('系所英文網址輸入錯誤');
        }

		if (!_validateNotEmpty($mainGroup)) {
			formGroup.mainGroupForm.addClass("is-invalid");
            check.push('系所主要學群選擇錯誤');
		}

		if (!_validateNotEmpty($description)) {
			formGroup.descriptionForm.addClass("is-invalid");
            check.push('中文系所簡介未填寫');
		}

		if (!_validateNotEmpty($engDescription)) {
			formGroup.engDescriptionForm.addClass("is-invalid");
            check.push('英文系所簡介未填寫');
		}

		if ($hasBirthLimit.prop("checked")) {
			let birthLimitAfterStatus = _validateNotEmpty($birthLimitAfter);
			let birthLimitBeforeStatus = _validateNotEmpty($birthLimitBefore);
			if (!(birthLimitAfterStatus || birthLimitBeforeStatus)) {
				formGroup.birthLimitAfterForm.addClass("is-invalid");
				formGroup.birthLimitBeforeForm.addClass("is-invalid");
                check.push('出生日期至少需填一項');
			}
		}

		// 驗證各審查項目
		appDocCheck = reviewItems.validateReviewItems();

		// 驗證審查項目中的紙本推薦函的收件期限欄位
		for(let type of reviewItems.reviewItemsTypes) {
			// 紙本推薦函為特定審查項目，寫死 type id
			if (type.id == 8 || type.id == 26 || type.id == 46 || type.id == 66) {
				// 如果需要此審查項目且需要紙本推薦函，才檢查
				if (type.needed && type.need_paper) {
					// 檢查收件期限欄位是否為空
					if (!_validateNotEmpty($('#recieveDeadline'))) {
						$('#recieveDeadline').addClass("is-invalid");
                        check.push('紙本推薦函收件期限未填寫');
					}
				}
			}
		}

		if($('#admissionSelectionQuota').val() > 0 && $hasInterview.prop('checked')){
			if($interviewDescription.val() == "" || $interviewEngDescription.val() == ""){
				check.push('面試說明未填寫');
				formGroup.interviewForm.addClass("is-invalid");
			}
		}

		//return check && appDocCheck;
		return check.concat(appDocCheck);
	}

	function getCommonFormData(system) {
		// 取得審查項目資料
		let applicationDocs = reviewItems.getReviewItems();
		// 拿到師長推薦函的紙本推薦函收件期限
		for (let doc of applicationDocs) {
			if (doc.id == 8 || doc.id == 26 || doc.id == 46 || doc.id == 66) {
				// 審查項目都是用 Vue bind 值，可是 datepicker 跟 Vue 有衝突，所以只有此值用 jQuery 取值
				doc.recieve_deadline = $('#recieveDeadline').val();
			}
		}

		let $teacher_quality_passed_data = false;

        if ($teacherQualityPassed.val() === "Y") {
            $teacher_quality_passed_data = true;
        } else {
            $teacher_quality_passed_data = false;
        }

		let data = {
			title_division: $titleDivision.val(),
        	eng_title: $engTitle.val(),
			url: $url.val(),
			eng_url: $engUrl.val(),
			main_group: $mainGroup.val(),
			sub_group: $subGroup.val(),
			gender_limit: $genderLimit.val(),
            moe_check_failed: $moeCheckFailed.val(),
            teacher_quality_passed: $teacher_quality_passed_data,
			description: $description.val(),
			eng_description: $engDescription.val(),
			has_eng_taught: +$hasEngTaught.prop("checked"),
			has_birth_limit: +$hasBirthLimit.prop("checked"),
			birth_limit_after: $birthLimitAfter.val(),
			birth_limit_before: $birthLimitBefore.val(),
			memo: $memo.val(),
			application_docs: JSON.stringify(applicationDocs)
		};

		if(system === 'bache'){
			data.special_dept_type = $('#specialDepartment').val();
		}

		if(applicationDocs.length > 0 && (system === "bache" || system === "twoYear")){
			data.has_interview = +$hasInterview.prop("checked");
			data.interview_description = $interviewDescription.val();
			data.interview_eng_description = $interviewEngDescription.val();
		} else {
			data.has_interview = 0;
			data.interview_description = '';
			data.interview_eng_description = '';
		}

        // 師長推薦函上傳管道
        if ($modalDeptInfo.find('#recommendation-letter-upload-method').val() !== null){  // 有需要推薦函且不是紙本才需要丟
        	data.recommendation_letter_upload_method = $modalDeptInfo.find('#recommendation-letter-upload-method').val();
		}

		if (system === "bache") {
			data.group_code = $groupCode.val();
		} else {
			data.group_code = 1;
		}
		return data;
	}

	// 檢查 form 是否為有值
	function _validateNotEmpty(el) {
		return el.val() !== "";
	}

	// 檢查 Url 格式是否正確
	function _validateUrlFormat(el) {
		let regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		return regexp.test(el.val());
	}

	// 轉換一些敏感字元避免 XSS
	function encodeHtmlCharacters(bareString) {
		if (bareString === null) return '';
		return bareString.replace(/&/g, "&amp;")  // 轉換 &
			.replace(/</g, "&lt;").replace(/>/g, "&gt;")  // 轉換 < 及 >
			.replace(/'/g, "&apos;").replace(/"/g, "&quot;")  // 轉換英文的單雙引號
			.replace(/ /g, " &nbsp;");
	}

	return {
		renderDescription,
		saveDeptDescription,
		renderDeptList,
		renderDeptSelect,
		renderCommonDeptDetail,
		validateForm,
		getCommonFormData,
		formGroup,
		$reviewDiv
	}

})();

var reviewItems = new Vue({ // 審查項目
	el: '#form-reviewItems',
	data: {
		reviewItemsTypes: [],
		applicationDocs: []
	},
	methods: {
		initTypes(reviewItemsTypes = this.reviewItemsTypes) {
			// fetch 回來的審閱類別放入下拉選單
			for(let type of reviewItemsTypes) {
				// 刪掉不需要的欄位
				delete type.eng_name;
				delete type.created_at;
				delete type.updated_at;
				delete type.deleted_at;
				delete type.system_id;
				// 初始化需要的欄位
				type.type_id = type.id;
				type.needed = false;
				type.required = false;
				type.modifiable = true;
				type.description = '';
				type.eng_description = '';
				type.error = false;
				type.engerror = false;
				// 如果是紙本推薦函，（不同學制的紙本推薦函 id 不一樣），把紙本推薦函的欄位加進去
				if (type.id == 8 || type.id == 26 || type.id == 46 || type.id == 66) {
					type.need_paper = false;
					type.recipient = '';
					type.recipient_phone = '';
					type.recieve_email = '';
					type.recieve_address = '';
				}
				if(type.name != '作品集'){
					type.upload_restrictions = '上傳檔案類型限制為：pdf、png 或 jpg 檔，單一檔案大小不得超過 4 MB。'
				} else {
					type.upload_restrictions = '上傳檔案類型限制為：pdf、png、jpg、mp3、mp4 或 avi 檔，單一檔案大小不得超過 8 MB。'
				}
			}
			this.reviewItemsTypes = reviewItemsTypes;
		},
		initApplicationDocs(applicationDocs) {
			this.initTypes();
			// 整理審閱資料的格式
			for(let doc of applicationDocs) {
				for(let type of this.reviewItemsTypes) {
					if (doc.type_id === type.type_id) {
						type.needed = true;
						type.required = doc.required;
						type.modifiable = doc.modifiable;
						type.description = doc.description;
						type.eng_description = doc.eng_description;
						if (type.id == 8 || type.id == 26 || type.id == 46 || type.id == 66) {
							if (doc.paper != null){
								type.need_paper = true;
								type.recipient = doc.paper.recipient;
								type.recipient_phone = doc.paper.phone;
								type.recieve_email = doc.paper.email;
								type.recieve_address = doc.paper.address;
							} else {
								type.need_paper = false;
							}
						}
					}
				}
			}

			this.applicationDocs = applicationDocs;
		},
		validateReviewItems() {
			let check = [];

			if ($('#admissionSelectionQuota').val() > 0) {
                for (let type of this.reviewItemsTypes) {
                    type.error = false;
                    type.engerror = false;
                    if (type.id == 8 || type.id == 26 || type.id == 46 || type.id == 66) {
                        type.recipient_error = false;
                        type.recipient_phone_error = false;
                        type.recieve_email_error = false;
                        type.recieve_address_error = false;
                    }
                }

                for (let type of this.reviewItemsTypes) {
                    // 如果需要此審查項目
                    if (type.needed == true) {
                        // 先檢查是否有中文備註
                        if (type.description == "" && type.eng_description) {
                            type.error = true;
                            check.push(type.name + ' 中文備註未填寫');
                        }
                        if (type.eng_description == ""  && type.description) {
                            type.engerror = true;
                            check.push(type.name + ' 英文備註未填寫');
                        }
                        // 如果有需要紙本推薦函
                        if (type.need_paper == true) {
                            // 檢查紙本推薦函的所需欄位是否有填寫
                            if (type.recipient == '') {
                                type.recipient_error = true;
                                check.push('紙本推薦函收件人未填寫');
                            }
                            if (type.recipient_phone == '') {
                                type.recipient_phone_error = true;
                                check.push('紙本推薦函收件人電話未填寫');
                            }
                            if (type.recieve_email == '') {
                                type.recieve_email_error = true;
                                check.push('紙本推薦函收件人 Email 未填寫');
                            }
                            if (type.recieve_address == '') {
                                type.recieve_address_error = true;
                                check.push('紙本推薦函收件人地址未填寫');
                            }
                        }
                    }
                }
            }
			return check;
		},
		getReviewItems() {
			let data = this.reviewItemsTypes.filter((type) => {
				return type.needed;
			});
			return data;
		}
	}
});
