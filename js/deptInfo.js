var DeptInfo = (function () {

	// 此為 deptInfoBache, deptInfoTwoYear, deptInfoMaster, deptInfoPhd 共同引入的檔案
	// 內容為各系所資訊 API

	var _applicationDocumentTypes;

	/**
	 * cache DOM
	 */

	var $deptInfoForm = $('#form-deptInfo'); // 學制資訊
	var $deptInfoDescription = $deptInfoForm.find('#description'); // 中文備註
	var $deptInfoEngDescription = $deptInfoForm.find('#engDescription'); // 英文備註

	var $deptList = $('#dept-list'); // 系所列表
	var $deptFilterInput = $('#dept-filter-input'); // 搜尋欄

	// Modal common elements
	var $modalDeptInfo = $('#modal-deptInfo');
	var $sortOrder = $modalDeptInfo.find('#sortOrder'); // 簡章順序
	var $id = $modalDeptInfo.find('#id'); // Can't edit ，系所代碼
	var $cardCode = $modalDeptInfo.find('#cardCode'); // Can't edit，讀卡代碼
	var $title = $modalDeptInfo.find('#title'); // Can't edit，中文名稱
	var $engTitle = $modalDeptInfo.find('#engTitle'); // Can't edit，英文名稱
	var $url = $modalDeptInfo.find('#url'); // 系中文網站網址
	var $engUrl = $modalDeptInfo.find('#engUrl'); // 系英文網站網址
	var $mainGroup = $modalDeptInfo.find('#mainGroup'); // select bar，主要隸屬學群
	var $subGroup = $modalDeptInfo.find('#subGroup'); // select bar，次要隸屬學群
	var $genderLimit = $modalDeptInfo.find('#genderLimit'); // select bar，招收性別限制
	var $evaluation = $modalDeptInfo.find('#evaluation'); // select bar，最近一次系所評鑑
	var $description = $modalDeptInfo.find('#description'); // textarea，選系中文說明
	var $engDescription = $modalDeptInfo.find('#engDescription'); // textarea，選系英文說明
	var $hasReviewFee = $modalDeptInfo.find('#hasReviewFee'); // checkbox，是否需要收審查費用
	var $reviewFeeDetail = $modalDeptInfo.find('#reviewFeeDetail'); // textarea，審查費用中文說明
	var $engReviewFeeDetail = $modalDeptInfo.find('#engReviewFeeDetail'); // textarea，審查費用英文說明
	var $hasForeignSpecialClass = $modalDeptInfo.find('#hasForeignSpecialClass'); // checkbox，是否招收外生專班
	var $hasEngTaught = $modalDeptInfo.find('#hasEngTaught'); // checkbox，是否為全英文授課
	var $hasDisabilities = $modalDeptInfo.find('#hasDisabilities'); // checkbox，是否招收身障學生
	var $hasBuHweiHwaWen = $modalDeptInfo.find('#hasBuHweiHwaWen'); // checkbox，是否招收不具華文基礎學生
	var $hasBirthLimit = $modalDeptInfo.find('#hasBirthLimit'); // checkbox，是否限制出生日期
	var $birthLimitAfter = $modalDeptInfo.find('#birthLimitAfter'); // 限制出生日期（以後）
	var $birthLimitBefore = $modalDeptInfo.find('#birthLimitBefore'); // 限制出生日期（以前）
	var $memo = $modalDeptInfo.find('#memo'); // 給海聯的訊息
	var $groupCode = $modalDeptInfo.find('#groupCode'); //類組

	// 所有審查項目
	var $reviewDiv = $modalDeptInfo.find('#review-div');

	var formGroup = {
		sortOrderForm: $modalDeptInfo.find('#sortOrderForm'),
		urlForm: $modalDeptInfo.find('#urlForm'),
		engUrlForm: $modalDeptInfo.find('#engUrlForm'),
		mainGroupForm: $modalDeptInfo.find('#mainGroupForm'),
		subGroupForm: $modalDeptInfo.find('#subGroupForm'),
		genderLimitForm: $modalDeptInfo.find('#genderLimitForm'),
		evaluation: $modalDeptInfo.find('#evaluation'),
		descriptionForm: $modalDeptInfo.find('#descriptionForm'),
		engDescriptionForm: $modalDeptInfo.find('#engDescriptionForm'),
		reviewFeeDetailForm: $modalDeptInfo.find('#reviewFeeDetailForm'),
		engReviewFeeDetailForm: $modalDeptInfo.find('#engReviewFeeDetailForm'),
		birthLimitAfterForm: $modalDeptInfo.find('#birthLimitAfterForm'),
		birthLimitBeforeForm: $modalDeptInfo.find('#birthLimitBeforeForm'),
		memoForm: $modalDeptInfo.find('#memoForm'),
		groupCodeForm: $modalDeptInfo.find('#groupCodeForm')
	}

	/**
	 * bind event
	 */

	$deptFilterInput.on('keyup', _filterDeptInput); // 系所列表篩選
	$hasReviewFee.on("change", _switchHasReviewFee); // 是否需要收審查費用
	$hasBirthLimit.on("change", _switchHasBirthLimit); // 是否限制出生日期

	/**
	 * events
	 */

	function renderDescription(json) { // 渲染備註欄
		$deptInfoDescription.text(json.description);
		$deptInfoEngDescription.text(json.eng_description);
	}

	function saveDeptDescription(system) { // Description 儲存
		var data = {
			'description': $deptInfoDescription.val(),
			'eng_description': $deptInfoEngDescription.val()
		}

   		openLoading();

		School.setSystemInfo(system, data)
		.then(function (res) {
			if(res.ok) {
				alert('儲存成功')
				return res.json();
			} else {
				alert('儲存失敗')
				throw res
			}
		}).then(function (json) {
			location.reload();
		}).catch(function (err) {
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);

				stopLoading();
			});
		});
	}

	function renderDeptList(departments) { // 系所列表渲染
		// 預設排序
		departments.sort(function (a, b) {
		  return a.sort_order - b.sort_order;
		});

		// 列表初始化
		$deptList.find('tbody').html('');
		departments.forEach(function (value, index) {
			var updateAt = moment(value.creator.updated_at);
			$deptList
				.find('tbody')
				.append(`
					<tr>
						<td>
							<span class="btn-editDeptInfo" data-deptid="${value.id}"><i class="fa fa-pencil" aria-hidden="true"></i></span>
						</td>
						<td>${value.sort_order}</td>
						<td>${value.id}</td>
						<td>
							<div>${value.title}</div>
							<div>${value.eng_title}</div>
						</td>
						<td>${value.creator.name}</td>
						<td>${updateAt.format('M月D日 H:m:s (YYYY)')}</td>
					</tr>
				`);
		});
	}

	function _filterDeptInput(e) { // 「系所列表」搜尋過濾列表
		let filter = $deptFilterInput.val().toUpperCase();
		var tr = $deptList.find('tr');

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
		var item = School.getDeptFormItem(system) // 產生系所詳細資料 Modal 中下拉式選單

		item.then(res => { return res[0].json(); }) // 學群
		.then(json => {
			// 列表初始化
			$mainGroup.html('<option value="">無</option>');
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
		})

		item.then(res => { return res[1].json(); }) // 評鑑等級
		.then(json => {
			$evaluation.html('');
			json.forEach((value, index) => {
				$evaluation
					.append(`
						<option value="${value.id}">${value.title}</option>
					`);
			});
		})

		item.then(res => { return res[2].json(); }) // 審查項目類別
		.then(json => {
			reviewItems.initTypes(json);
		})
	}

	function renderCommonDeptDetail(deptData) {
		$sortOrder.val(deptData.sort_order);
		$id.val(deptData.id);
		$cardCode.val(deptData.card_code);
		$title.val(deptData.title);
		$engTitle.val(deptData.eng_title);
		$url.val(deptData.url);
		$engUrl.val(deptData.eng_url);
		$mainGroup.val(deptData.main_group);
		$subGroup.val(deptData.sub_group);
		$groupCode.val(deptData.group_code);
		$genderLimit.val(deptData.gender_limit);
		$evaluation.val(deptData.evaluation);
		$description.val(deptData.description);
		$engDescription.val(deptData.eng_description);
		$hasReviewFee.prop("checked", deptData.has_review_fee);
		$reviewFeeDetail.val(deptData.review_fee_detail);
		$engReviewFeeDetail.val(deptData.eng_review_fee_detail);
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
		_switchHasReviewFee();
		_switchHasBirthLimit();

		reviewItems.initApplicationDocs(deptData.application_docs);

		let applicationDocs = deptData.application_docs;
		// 拿到師長推薦函的紙本推薦函收件期限
		for (let doc of applicationDocs) {
			if (doc.paper != null) {
				$('#recieveDeadline').val(doc.paper.deadline);
			}
		}
	}

	function _switchHasReviewFee() {
		$reviewFeeDetail.prop('disabled', !$hasReviewFee.prop('checked'));
		$engReviewFeeDetail.prop('disabled', !$hasReviewFee.prop('checked'));
	}

	function _switchHasBirthLimit() {
		$birthLimitAfter.prop('disabled', !$hasBirthLimit.prop('checked'));
		$birthLimitBefore.prop('disabled', !$hasBirthLimit.prop('checked'));
	}

	function validateForm() {
		var check = true;
		var appDocCheck = true;
		for(form in formGroup) {
			formGroup[form].removeClass("has-danger");
		}
		$('#recieveDeadlineDiv').removeClass("has-danger");
		if (!_validateNotEmpty($sortOrder)) {formGroup.sortOrderForm.addClass("has-danger"); check = false}
		if (!_validateNotEmpty($url)) {formGroup.urlForm.addClass("has-danger"); check = false}
		if (!_validateUrlFormat($url)) {formGroup.urlForm.addClass("has-danger"); check = false}
		if (_validateNotEmpty($engUrl)) {
			if (!_validateUrlFormat($engUrl)) {formGroup.engUrlForm.addClass("has-danger"); check = false}
		}
		if (!_validateNotEmpty($mainGroup)) {formGroup.mainGroupForm.addClass("has-danger"); check = false}
		if (!_validateNotEmpty($description)) {formGroup.descriptionForm.addClass("has-danger"); check = false}
		if ($hasReviewFee.prop("checked")) {
			if (!_validateNotEmpty($reviewFeeDetail)) {formGroup.reviewFeeDetailForm.addClass("has-danger"); check = false}
		}
		if ($hasBirthLimit.prop("checked")) {
			var birthLimitAfterStatus = _validateNotEmpty($birthLimitAfter);
			var birthLimitBeforeStatus = _validateNotEmpty($birthLimitBefore);
			if (!(birthLimitAfterStatus || birthLimitBeforeStatus)) {
				formGroup.birthLimitAfterForm.addClass("has-danger");
				formGroup.birthLimitBeforeForm.addClass("has-danger");
				check = false
			}
		}

		// 驗證各審查項目
		appDocCheck = reviewItems.validateReviewItems();

		// 驗證審查項目中的紙本推薦函的收件期限欄位
		for(type of reviewItems.reviewItemsTypes) {
			// 紙本推薦函為特定審查項目，寫死 type id
			if (type.id == 8 || type.id == 26 || type.id == 46 || type.id == 66) {
				// 如果需要此審查項目且需要紙本推薦函，才檢查
				if (type.needed && type.need_paper) {
					// 檢查收件期限欄位是否為空
					if (!_validateNotEmpty($('#recieveDeadline'))) {
						$('#recieveDeadlineDiv').addClass("has-danger");
						check = false
					}
				}
			}
		}

		return check && appDocCheck;
	}

	function getCommonFormData() {
		// 取得審查項目資料
		let applicationDocs = reviewItems.getReviewItems();
		// 拿到師長推薦函的紙本推薦函收件期限
		for (let doc of applicationDocs) {
			if (doc.id == 8 || doc.id == 26 || doc.id == 46 || doc.id == 66) {
				// 審查項目都是用 Vue bind 值，可是 datepicker 跟 Vue 有衝突，所以只有此值用 jQuery 取值
				doc.recieve_deadline = $('#recieveDeadline').val();
			}
		}

		var data = {
			sort_order: $sortOrder.val(),
			url: $url.val(),
			eng_url: $engUrl.val(),
			main_group: $mainGroup.val(),
			sub_group: $subGroup.val(),
			group_code: $groupCode.val(),
			gender_limit: $genderLimit.val(),
			evaluation: $evaluation.val(),
			description: $description.val(),
			eng_description: $engDescription.val(),
			has_review_fee: +$hasReviewFee.prop("checked"),
			review_fee_detail: $reviewFeeDetail.val(),
			eng_review_fee_detail: $engReviewFeeDetail.val(),
			has_foreign_special_class: +$hasForeignSpecialClass.prop("checked"),
			has_eng_taught: +$hasEngTaught.prop("checked"),
			has_disabilities: +$hasDisabilities.prop("checked"),
			has_BuHweiHwaWen: +$hasBuHweiHwaWen.prop("checked"),
			has_birth_limit: +$hasBirthLimit.prop("checked"),
			birth_limit_after: $birthLimitAfter.val(),
			birth_limit_before: $birthLimitBefore.val(),
			memo: $memo.val(),
			application_docs: JSON.stringify(applicationDocs)
		}
		return data;
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
		initTypes(reviewItemsTypes) {
			// fetch 回來的審閱類別放入下拉選單
			for(type of reviewItemsTypes) {
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
				// 如果是紙本推薦函，（不同學制的紙本推薦函 id 不一樣），把紙本推薦函的欄位加進去
				if (type.id == 8 || type.id == 26 || type.id == 46 || type.id == 66) {
					type.need_paper = false;
					type.recipient = '';
					type.recipient_phone = '';
					type.recieve_email = '';
					type.recieve_address = '';

				}
			}
			this.reviewItemsTypes = reviewItemsTypes;
		},
		// cleanTypesNeeded() {
		// 	for(type in this.reviewItemsTypes) {
		// 		this.reviewItemsTypes[type].needed = false;
		// 		this.reviewItemsTypes[type].required = false;
		// 		this.reviewItemsTypes[type].modifiable = true;
		// 		this.reviewItemsTypes[type].description = '';
		// 		this.reviewItemsTypes[type].eng_description = '';
		// 		this.reviewItemsTypes[type].error = false;
		// 	}
		// },
		initApplicationDocs(applicationDocs) {
			// this.cleanTypesNeeded();
			// 整理審閱資料的格式
			for(doc of applicationDocs) {
				for(type of this.reviewItemsTypes) {
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
			var check = true

			for(type of this.reviewItemsTypes) {
				type.error = false;
				if (type.id == 8 || type.id == 26 || type.id == 46 || type.id == 66) {
					type.recipient_error = false;
					type.recipient_phone_error = false;
					type.recieve_email_error = false;
					type.recieve_address_error = false;
				}
			}

			for(type of this.reviewItemsTypes) {
				// 如果需要此審查項目
				if (type.needed == true) {
					// 先檢查是否有中文備註
					if (type.description == "") {
						type.error = true;
						check = false;
					}
					// 如果有需要紙本推薦函
					if (type.need_paper == true) {
						// 檢查紙本推薦函的所需欄位是否有填寫
						if (type.recipient == '') {
							type.recipient_error = true;
							check = false;
						}
						if (type.recipient_phone == '') {
							type.recipient_phone_error = true;
							check = false;
						}
						if (type.recieve_email == '') {
							type.recieve_email_error = true;
							check = false;
						}
						if (type.recieve_address == '') {
							type.recieve_address_error = true;
							check = false;
						}
					}
				}
			}
			return check;
		},
		getReviewItems() {
			var data = this.reviewItemsTypes.filter((type) => {
				return type.needed;
			})
			return data;
		}
	}
})
