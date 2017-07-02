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
		memoForm: $modalDeptInfo.find('#memoForm')
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

	function saveDeptDescription(system) { // Description 儲存｜送出
		var data = {
			'action': 'save',
			'description': $deptInfoDescription.val(),
			'eng_description': $deptInfoEngDescription.val()
		}

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
			console.log(json);
			location.reload();
		}).catch(function (err) {
			console.error(err);
		});
	}

	function renderDeptList(departments) { // 系所列表渲染
		// 預設排序
		departments.sort(function (a, b) {
		  return a.sort_order - b.sort_order;
		});

		// 狀態名稱對應中文
		var infoStatus = {
			editing: '編輯中',
			returned: '退回',
			confirmed: '通過',
			waiting: '待審閱'
		}

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
						<td>${infoStatus[value.info_status]}</td>
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
		for(form in formGroup) {
			formGroup[form].removeClass("has-danger");
		}
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
		return check;
	}

	function getCommonFormData() {
		var data = {
			sort_order: $sortOrder.val(),
			url: $url.val(),
			eng_url: $engUrl.val(),
			main_group: $mainGroup.val(),
			sub_group: $subGroup.val(),
			gender_limit: $genderLimit.val(),
			evaluation: $evaluation.val(),
			description: $description.val(),
			eng_description: $engDescription.val(),
			has_review_fee: +$hasReviewFee.prop("checked"),
			has_foreign_special_class: +$hasForeignSpecialClass.prop("checked"),
			has_eng_taught: +$hasEngTaught.prop("checked"),
			has_disabilities: +$hasDisabilities.prop("checked"),
			has_BuHweiHwaWen: +$hasBuHweiHwaWen.prop("checked"),
			has_birth_limit: +$hasBirthLimit.prop("checked"),
			memo: $memo.val(),
			application_docs: JSON.stringify([{
				type_id: 1,
				description: '中文說明',
				eng_description: 'eng description',
				required: true
			}])
		}
		if ($hasReviewFee.prop("checked")) {
			data.review_fee_detail = $reviewFeeDetail.val();
			data.eng_review_fee_detail = $engReviewFeeDetail.val();
		}
		if ($hasBirthLimit.prop("checked")) {
			data.birth_limit_after = $birthLimitAfter.val();
			data.birth_limit_before = $birthLimitBefore.val();
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
		getCommonFormData
	}

})();

Vue.component('review-items-select',{
	props:['selected_id', 'review_items_types', 'modifiable'],
	template: `
		<select class="form-control" v-model="selected_id" v-bind:disabled="!modifiable">
				<option
				v-for="type in review_items_types"
				v-text="type.name"
				v-bind:value="type.id"
				v-bind:disabled="type.used"></option>
		</select>
	`
})

var reviewItems = new Vue({ // 審查項目
	el: '#form-reviewItems',
	data: {
		reviewItemsTypes: [],
		applicationDocs: []
	},
	computed: {
		isfull() {
			return this.applicationDocs.length >= this.reviewItemsTypes.length;
		}
	},
	methods: {
		initTypes(reviewItemsTypes) {
			// 下拉選單初始化，fetch 回來的各學制審閱項目 "used"(是否被使用)
			this.reviewItemsTypes = reviewItemsTypes;
			for(type in this.reviewItemsTypes) {
				this.reviewItemsTypes[type].used = false;
			}
		},
		initApplicationDocs(applicationDocs) {
			// fetch 回現有審查項目，重新渲染下拉式選單（設定下拉式選單哪些被 "used"）
			this.applicationDocs = applicationDocs;
			for(doc in this.applicationDocs) {
				for(type in this.reviewItemsTypes) {
					if(this.applicationDocs[doc].type_id === this.reviewItemsTypes[type].id) {
						this.reviewItemsTypes[type].used = true;
					}
				}
			}
		},
		addApplicationDoc() {
			var notSelect = this.reviewItemsTypes.filter((type) => {
				return type['used'] === false;
			})
			console.log(notSelect);

			this.applicationDocs.push({
				type_id: "",
				description: "",
				eng_description: "",
				modifiable: true,
				required: false
			});
		},
		removeApplicationDoc(doc) {
			var index = this.applicationDocs.indexOf(doc);
			this.applicationDocs.splice(index, 1);
		}
	}
})
