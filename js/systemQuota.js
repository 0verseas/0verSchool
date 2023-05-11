var systemQuota = (function () {

	/**
	 * cacheDOM
	 */
	const $lastEditionInfo = $('#lastEditionInfo');
	const $btnSave = $('#btn-save');
	const $btnConfirm = $('#btn-confirm');
	const $btnPdf = $('#btn-pdf');

	//quota
	const $fixedQuotaTable = $('#fixed_quota_table');

	const $bachelorTotalAmount = $('#bachelor_total_amount'); // 學士班去年總招生名額
	const $masterTotalAmount = $('#master_total_amount'); // 碩士班去年總招生名額
	const $phdTotalAmount = $('#phd_total_amount'); // 博士班去年總招生名額

	const $bachelorAmount = $('#bachelor_amount'); // 學士班今年招生名額上限
	const $masterAmount = $('#master_amount'); // 碩士班今年招生名額上限
	const $phdAmount = $('#phd_amount'); // 博士班今年招生名額上限

	const $bachelorAdmissionAmount = $('#bachelor_admission_amount'); // 學士班今年一般系所招生名額上限
	const $masterAdmissionAmount = $('#master_admission_amount'); // 碩士班今年一般系所招生名額上限
	const $phdAdmissionAmount = $('#phd_admission_amount'); // 博士班今年一般系所招生名額上限

	const $bachelorKeyIndustryAmount = $('#bachelor_key_industry_amount'); // 學士班今年重點產業系所招生名額上限
	const $masterKeyIndustryAmount = $('#master_key_industry_amount'); // 碩士班今年重點產業系所招生名額上限
	const $phdKeyIndustryAmount = $('#phd_key_industry_amount'); // 博士班今年重點產業系所招生名額上限

	const $inputQuotaRable = $('#input_quota_table');

	const $bachelor_quota_used = $('#bachelor_quota_used'); // 學士班今年欲使用名額
	const $master_quota_used = $('#master_quota_used'); // 碩士班今年欲使用名額
	const $phd_quota_used = $('#phd_quota_used'); // 博士班今年欲使用名額

	const $bachelor_quota_passed = $('#bachelor_quota_passed'); // 學士班今年班別間流用名額
	const $master_quota_passed = $('#master_quota_passed'); // 碩士班今年班別間流用名額
	const $phd_quota_passed = $('#phd_quota_passed'); // 博士班今年班別間流用名額

	const $bachelor_surplus_quota = $('#bachelor_surplus_quota'); // 學士班今年本地生招生缺額
	const $master_surplus_quota = $('#master_surplus_quota'); // 碩士班今年本地生招生缺額
	const $phd_surplus_quota = $('#phd_surplus_quota'); // 博士班今年本地生招生缺額

	const $bachelor_expanded_quota = $('#bachelor_expanded_quota'); // 學士班今年擴增名額
	const $master_expanded_quota = $('#master_expanded_quota'); // 碩士班今年擴增名額
	const $phd_expanded_quota = $('#phd_expanded_quota'); // 博士班今年擴增名額
	const $expanded_quota_directions = $('#expanded_quota_directions'); // 擴增名額需要填寫調查表說明

	const $bachelor_sum = $('#bachelor_sum'); // 學士班今年實際招收名額
	const $master_sum = $('#master_sum'); // 碩士班今年實際招收名額
	const $phd_sum = $('#phd_sum'); // 博士班今年實際招收名額

	const $bachelor_key_industry_quota = $('#bachelor_key_industry_quota'); // 學士班今年重點產業系所名額
	const $master_key_industry_quota = $('#master_key_industry_quota'); // 碩士班今年重點產業系所名額
	const $phd_key_industry_quota = $('#phd_key_industry_quota'); // 博士班今年重點產業系所名額
	const $key_industry_quota_approved_number = $('#key_industry_quota_approved_number'); // 教育部重點產業系所名額核定公文文字號

	const $bachelor_IFP_quota = $('#bachelor_IFP_quota'); // 今年學士班國際專修部名額
	const $IFP_quota_approved_number = $('#IFP_quota_approved_number'); // 教育部國際專修部名額核定公文文字號

	const $bachelor_quota_sum = $('#bachelor_quota_sum'); // 實際招收名額 for 醫學顯示
	const $quota_medicine_selection = $('#quota_medicine_selection'); // 醫學系個人申請名額
	const $quota_medicine_placement = $('#quota_medicine_placement'); // 醫學系聯合分發名額
	const $quota_medicine_self = $('#quota_medicine_self'); // 醫學系單獨招生名額
	const $medicine_quota_sum = $('#medicine_quota_sum') // 醫學系名額小計
	const $bachelor_except_medicine_quota_sum = $('#bachelor_except_medicine_quota_sum'); // 扣除醫牙可招收名額

	const $IACP_table = $('.IACP_table'); // 產學攜手合作計畫名額表單
	const $bachelor_quota_sum_for_IACP = $('#bachelor_quota_sum_for_IACP'); // 實際招收名額 for 產學攜手合作計畫表格顯示
	const $bachelor_IACP_amount = $('#bachelor_IACP_amount'); // 產學攜手合作計畫名額上限
	const $bachelor_IACP_quota = $('#bachelor_IACP_quota'); // 欲使用的產學攜手合作計畫名額
	const $bachelor_except_IACP_quota_sum = $('#bachelor_except_IACP_quota_sum'); // 扣除產學攜手合作計畫名額的可招收名額

	const $description = $('#description'); // 學制流用需求描述

	let schoolid;
	let has_medicine_dept = 0;
	let has_IACP_amount = 0;

	/**
	*	bind event
	*/

	$bachelor_quota_used.on('change', {system:"bachelor", validate: "+"}, _handleQuotaChanged);
	$bachelor_quota_passed.on('change', {system:"bachelor", validate: "-"}, _handleQuotaChanged);
	$bachelor_surplus_quota.on('change', {system:"bachelor", validate: "+"}, _handleQuotaChanged);
	$bachelor_expanded_quota.on('change', {system:"bachelor", validate: "+"}, _handleQuotaChanged);

	$master_quota_used.on('change', {system:"master", validate: "+"}, _handleQuotaChanged);
	$master_quota_passed.on('change', {system:"master", validate: "-"}, _handleQuotaChanged);
	$master_surplus_quota.on('change', {system:"master", validate: "+"}, _handleQuotaChanged);
	$master_expanded_quota.on('change', {system:"master", validate: "+"}, _handleQuotaChanged);

	$phd_quota_used.on('change', {system:"phd", validate: "+"}, _handleQuotaChanged);
	$phd_quota_passed.on('change', {system:"phd", validate: "-"}, _handleQuotaChanged);
	$phd_surplus_quota.on('change', {system:"phd", validate: "+"}, _handleQuotaChanged);
	$phd_expanded_quota.on('change', {system:"phd", validate: "+"}, _handleQuotaChanged);

	// $quota_medicine_selection.on('change', _handleMedicineQuotaChanged);
	// $quota_medicine_placement.on('change', _handleMedicineQuotaChanged);
	// $quota_medicine_self.on('change', _handleMedicineQuotaChanged);

	$bachelor_IACP_quota.on('change', {system:"bachelor", validate: "+"}, _handleQuotaChanged);

	$btnSave.on('click', {action: "save"}, _handleSave);
	$btnConfirm.on('click', {action: "confirm"}, _handleSave);
	$btnPdf.on('click', _handlePDF);

	/**
	* init
	*/

	_init();

	/**
	* function
	*/

	function _init() {
		if(env.stage == 2){
			location.href = "./index.html";
		}
		openLoading();

		User.isLogin().then(function(res) { // 取得校碼
			if(res.ok) {
				return res.json();
			} else {
				throw res.status;
			}
		}).then(function(json) {
			schoolid=json.school_editor.school_code;

			School.getFirstSystemQuota(schoolid).then(function (res) { //取得各學制總量數據
				if(res.ok) {
					return res.json();
				} else {
					throw res
				}
			}).then(function (json) {
				if(json.bachelor != null){
					json.updated_by = json.bachelor.updated_by;
					json.updated_at = json.bachelor.updated_at;
					json.confirmed_at = json.bachelor.confirmed_at ;
				} else if(json.master != null){
					json.updated_by = json.master.updated_by;
					json.updated_at = json.master.updated_at;
					json.confirmed_at = json.master.confirmed_at ;
				} else if(json.phd != null){
					json.updated_by = json.phd.updated_by;
					json.updated_at = json.phd.updated_at;
					json.confirmed_at = json.phd.confirmed_at ;
				}
				return json;
			}).then(function (json) {
				if( json.confirmed_at != null ) {
					document.getElementById("btn-confirm").textContent = "已鎖定";
					document.getElementById("btn-confirm").disabled = true;
					document.getElementById("btn-save").disabled = true;
				} else {
					document.getElementById('btn-pdf').textContent = "提交後才能下載PDF";
					document.getElementById('btn-pdf').disabled = true;
					$('#btn-pdf').removeClass('btn-success').addClass('btn-danger');
				}
				has_medicine_dept = json.has_medicine_dept;
				return json;
			}).then(function (json) {
				_renderData(json);
			}).then(function () {
				stopLoading();
				}).catch(function (err) {
				if (err.status === 404) {
					swal({title:"沒有這個學校，即將返回上一頁。", confirmButtonText:'確定', type:'error'}).then(() => {
						window.history.back();
					});
				} else {
					err.json && err.json().then((data) => {
						console.error(data);
						swal({title:data.messages[0], confirmButtonText:'確定', type:'error'});
					});
				}
				stopLoading();
			});
		}).catch(function(err) {
			if (err == 401) {
				$errMsg.finish().show().text('帳號密碼錯誤。').fadeOut(1500);
			}
		})

		function _renderData(json) {
			_setEditor(json.updated_by, json.updated_at);
			_setQuota(json);
			return;
		}

		function _setQuota(data) {
			$key_industry_quota_approved_number.html('');
			$IFP_quota_approved_number.html('');
			if( data.bachelor == null){
				$('.bachelor').hide(); // 隱藏學士班欄位
			} else {
				_renderQuota('bachelor', data.bachelor); // 渲染名額資料
				$bachelor_IFP_quota.val(+data.bachelor.IFP_quota); // 渲染國際專修部名額資料 只有學士班有

				// 如果有醫學相關系所 就處理相關名額資料
				if(has_medicine_dept == 1) {
					$("#medicine_quota").show();
					let quota_medicine_selection_val = +data.bachelor.quota_medicine_selection; // 醫學系所個申名額
					let quota_medicine_placement_val = +data.bachelor.quota_medicine_placement; // 醫學系所聯分名額
					let quota_medicine_self_val = +data.bachelor.quota_medicine_self; // 醫學系所單招名額
					$bachelor_quota_sum.val(+$bachelor_sum.val()); // 學士班實際招生名額總計
					$quota_medicine_selection.val(quota_medicine_selection_val);
					$quota_medicine_placement.val(quota_medicine_placement_val);
					$quota_medicine_self.val(quota_medicine_self_val);
					$medicine_quota_sum.val(quota_medicine_selection_val+ quota_medicine_placement_val+ quota_medicine_self_val);
					// 非醫學系所實際招生名額總計
					$bachelor_except_medicine_quota_sum.val(+$bachelor_sum.val() - +$medicine_quota_sum.val());
				}

				// 如果有產學攜手合作計畫名額 就處理相關名額資料
				if(+data.bachelor.IACP_amount){
					$IACP_table.show();
					$bachelor_quota_sum_for_IACP.val($bachelor_sum.val());
					$bachelor_IACP_amount.text(+data.bachelor.IACP_amount);
					$bachelor_IACP_quota.val(+data.bachelor.IACP_quota);
					$bachelor_except_IACP_quota_sum.val($bachelor_sum.val() - $bachelor_IACP_quota.val());
					has_IACP_amount = 1;
				}
			}

			if( data.master == null){
				$('.master').hide(); // 隱藏碩士班欄位
			} else {
				_renderQuota('master', data.master); // 渲染名額資料
			}

			if( data.phd == null){
				$('.phd').hide(); // 隱藏博士班欄位
			} else {
				_renderQuota('phd', data.phd); // 渲染名額資料
			}

			// 如果有填寫擴增名額 就出現提示文字 沒有就刪除提示文字
			if( parseInt($bachelor_expanded_quota.val()) + parseInt($master_expanded_quota.val()) + parseInt($phd_expanded_quota.val()) > 0){
				$expanded_quota_directions.html(`<a class="text-danger">請記得填寫「招生名額增量申請表」並回傳</a>`);
			} else {
				$expanded_quota_directions.html('');
			}

			$description.val(data.description); // 備註
			return;
		}

		function _renderQuota(system, system_quota_data){
			// 名額上限們
			$('#'+system+'_total_amount').text(+system_quota_data.last_year_admission_amount_multiply_10);
			$('#'+system+'_amount').text(+system_quota_data.last_year_admission_amount);
			$('#'+system+'_admission_amount').text(+system_quota_data.admission_amount);
			$('#'+system+'_key_industry_amount').text(+system_quota_data.key_industry_amount);
			// 一般系所
			$('#'+system+'_quota_used').val(+system_quota_data.quota_used);
			$('#'+system+'_quota_passed').val(+system_quota_data.quota_passed);
			$('#'+system+'_surplus_quota').val(+system_quota_data.last_year_surplus_admission_quota);
			$('#'+system+'_expanded_quota').val(+system_quota_data.expanded_quota);
			$('#'+system+'_sum').val(+system_quota_data.quota_used + +system_quota_data.quota_passed + +system_quota_data.last_year_surplus_admission_quota + +system_quota_data.expanded_quota);
			// 重點產業系所
			$('#'+system+'_key_industry_quota').val(+system_quota_data.key_industry_quota);
			if(system_quota_data.key_industry_quota_approved_number != null)
				$key_industry_quota_approved_number.append('依'+system_quota_data.key_industry_quota_approved_number+'函核定<br/>');
			if(system_quota_data.IFP_quota_approved_number != null)
				$IFP_quota_approved_number.append('依'+system_quota_data.IFP_quota_approved_number+'函核定<br/>');
		}

		function _setEditor(updated_by, updated_at) {
			$lastEditionInfo.find('.who').text(updated_by ? updated_by : 'unknown');
			$lastEditionInfo.find('.when').text(moment(updated_at).format('YYYY/MM/DD HH:mm:ss'));
		}

	}

	async function _handleQuotaChanged(argument) {
		const system = argument.data.system;
		const validateType = argument.data.validate;
		const input = $(this).val();

		// 檢查沒通過得直接歸零
		if(!_validateQuotaInput(validateType, input)){
			$(this).val(0);
		}

		// 確認目前輸入改變後是否不符合規定
		await _checkSystemQuota(system);
		let quota_used = +$('#'+system+'_quota_used').val();
		let quota_passed = +$('#'+system+'_quota_passed').val();
		let surplus_quota = +$('#'+system+'_surplus_quota').val();
		let expanded_quota = +$('#'+system+'_expanded_quota').val();

		// 計算各學制實際招生名額總計
		$('#'+system+'_sum').val(quota_used+quota_passed+surplus_quota+expanded_quota);

		// 如果該校有醫學系所 就要計算醫學相關系所名額
		if(has_medicine_dept){
			$bachelor_quota_sum.val(+$bachelor_sum.val());
			$bachelor_except_medicine_quota_sum.val(+$bachelor_sum.val() - +$quota_medicine_selection.val() - +$quota_medicine_placement.val() - +$quota_medicine_self.val());
		}

		// 如果該校有產學攜手合作計畫名額上限 就要計算跟檢查產學攜手合作計畫名額上限
		if(has_IACP_amount){
			if(+$bachelor_IACP_quota.val() > +$bachelor_IACP_amount.text()){
				$bachelor_IACP_quota.val(+$bachelor_IACP_amount.text());
			}else if(+$bachelor_IACP_quota.val() < 0){
				$bachelor_IACP_quota.val(0);
			}
			// 產學攜手合作計畫欲使用名額 要 <= 學士班可用總額
			if(has_IACP_amount && (parseInt($bachelor_IACP_quota.val()) > parseInt($bachelor_sum.val()))){
				$bachelor_IACP_quota.val($bachelor_sum.val());
				await swal({title:"學士班實際招生名額應大於等於產學攜手合作計畫名額！", confirmButtonText:'確定', type:'warning'});
			}
			$bachelor_quota_sum_for_IACP.val($bachelor_sum.val());
			$bachelor_except_IACP_quota_sum.val($bachelor_sum.val() - $bachelor_IACP_quota.val());
		}
	}

	// 名額 input 使用正規表達示檢查
	function _validateQuotaInput(type, value){
		const regex = (type == "+") ?/[0-9]+/: /[-][0-9]+|[0-9]+/;
		if(value.match(regex) == null){
			return false;
		}
		return true;
	}

	// 檢查目前輸入改變後是否不符合規定
	async function _checkSystemQuota(system){
		let systemString = ''
		const quota_amount = $('#'+system+'_admission_amount');
		const quota_used = $('#'+system+'_quota_used');
		const quota_passed = $('#'+system+'_quota_passed');
		const surplus_quota = $('#'+system+'_surplus_quota');
		const expanded_quota = $('#'+system+'_expanded_quota');

		const quota_amount_value = +quota_amount.text();
		const quota_used_value = +quota_used.val();
		const quota_passed_value = +quota_passed.val();
		const surplus_quota_value = +surplus_quota.val();
		const expanded_quota_value = +expanded_quota.val();

		switch(system){
			case "bachelor":
				systemString = '學士班（含港二技）';
				break;
			case "master":
				systemString = '碩士班';
				break;
			case "phd":
				systemString = '博士班';
				break;
		}

		// 核定總量為 0（無該班別或停招等），不得流用名額或申請增量
		if(quota_amount_value == 0 && (quota_passed_value + surplus_quota_value + expanded_quota_value)!=0){
			quota_used.val(0);
			quota_passed.val(0);
			surplus_quota.val(0);
			expanded_quota.val(0);
			await swal({title:systemString+"，未規劃名額，不得流用名額或申請增量", confirmButtonText:'確定', type:'warning'});
		}

		// 0 <= 欲使用名額 <= 總量10％
		if(quota_used_value > quota_amount_value){
			quota_used.val(quota_amount_value);
		} else if(quota_used.val() < 0){
			quota_used.val(0);
		}

		// 班別間流用若為負，絕對值不得超出欲使用名額
		if(quota_used_value + quota_passed_value < 0){
			quota_passed.val(parseInt('-' + quota_used_value));
			await swal({title: systemString+"，班別間流用不得流超出欲使用名額", confirmButtonText:'確定', type:'warning'});
		}

		// 欲使用名額 < 名額上限（總量10％） ，不得填本地生缺額、擴增名額
		if( (quota_used_value < quota_amount_value) && (surplus_quota_value + expanded_quota_value) > 0){
			surplus_quota.val(0);
			expanded_quota.val(0);
			await swal({title: systemString+"，未使用完名額上限，不得填寫本地生缺額、擴增名額", confirmButtonText:'確定', type:'warning'});
		}

		// 本地生缺額最小就是0
		if(surplus_quota_value < 0){
			surplus_quota.val(0);
		}

		// 擴增名額最小就是0
		if(expanded_quota_value < 0){
			expanded_quota.val(0);
		}

		// 如果有填寫擴增名額 就出現提示文字 沒有就刪除提示文字
		if( parseInt($bachelor_expanded_quota.val()) + parseInt($master_expanded_quota.val()) + parseInt($phd_expanded_quota.val()) > 0){
			$expanded_quota_directions.html(`<a class="text-danger">請記得填寫「招生名額增量申請表」並回傳</a>`);
		} else {
			$expanded_quota_directions.html('');
		}

		return;
	}

	async function _handleMedicineQuotaChanged() {
		if( parseInt($quota_medicine_selection.val()) < 0 || parseInt($quota_medicine_placement.val()) < 0 || parseInt($quota_medicine_self.val()) < 0){
			$quota_medicine_selection.val(0);
			$quota_medicine_placement.val(0);
			$quota_medicine_self.val(0);
		}

		if(  parseInt($quota_medicine_selection.val()) +  parseInt($quota_medicine_placement.val()) +  parseInt($quota_medicine_self.val()) > $allowTotal_bache.val() ){
			await swal({title:"醫學系 + 牙醫系 + 中醫系 之名額 大於 可招收名額！", confirmButtonText:'確定', type:'warning'});
			$quota_medicine_selection.val(0);
			$quota_medicine_placement.val(0);
			$quota_medicine_self.val(0);
		}

		$bachelor_except_medicine_quota_sum.val( parseInt($allowTotal_bache.val()) - parseInt($quota_medicine_selection.val()) - parseInt($quota_medicine_placement.val()) - parseInt($quota_medicine_self.val()));

	}

	async function _handleSave(argument){
		const action = argument.data.action;

		// 檢查班別間流用相加應為 0
		if ( (parseInt($bachelor_quota_passed.val()) || 0 ) + (parseInt($master_quota_passed.val()) || 0) + (parseInt($phd_quota_passed.val()) || 0) != 0){
			await swal({title:"班別間留用相加總和應為 0 ！", confirmButtonText:'確定', type:'warning'});
			return;
		}
		// 醫學各管道名額總計 要 <= 學士班可用總額
		if(has_medicine_dept && (parseInt($quota_medicine_selection.val()) + parseInt($quota_medicine_placement.val()) + parseInt($quota_medicine_self.val()) > parseInt($bachelor_sum.val()))){
			await swal({title:"學士班欲使用名額名額應大於等於醫學系各管道名額總和！", confirmButtonText:'確定', type:'warning'});
			return;
		}

		let data= {
			"Bachelor_quota_used": (parseInt($bachelor_quota_used.val()) || 0),
			"Bachelor_quota_passed": (parseInt($bachelor_quota_passed.val()) || 0),
			"Bachelor_last_year_surplus_admission_quota": (parseInt($bachelor_surplus_quota.val()) || 0),
			"Bachelor_expanded_quota": (parseInt($bachelor_expanded_quota.val()) || 0),
			"Bachelor_IACP_quota": (parseInt($bachelor_IACP_quota.val()) || 0),

			"Master_quota_used": (parseInt($master_quota_used.val()) || 0),
			"Master_quota_passed": (parseInt($master_quota_passed.val()) || 0),
			"Master_last_year_surplus_admission_quota": (parseInt($master_surplus_quota.val()) || 0),
			"Master_expanded_quota": (parseInt($master_expanded_quota.val()) || 0),

			"PhD_quota_used": (parseInt($phd_quota_used.val()) || 0),
			"PhD_quota_passed": (parseInt($phd_quota_passed.val()) || 0),
			"PhD_last_year_surplus_admission_quota": (parseInt($phd_surplus_quota.val()) || 0),
			"PhD_expanded_quota": (parseInt($phd_expanded_quota.val()) || 0),

			"description": $description.val(),
			"data_confirm": (action == "save") ?false :true
		}

		// if( has_medicine_dept == 1){
		// 	data["Bachelor_quota_medicine"] = $quota_medicine_selection.val();
		// 	data["Bachelor_quota_dentist"] = $quota_medicine_placement.val();
		// 	data["Bachelor_quota_chinese_medicine"] = $quota_medicine_self.val();
		// }

		let alertText = '';
		if(action == "save"){
			alertText = "儲存成功";
		} else {
			alertText = "已提交並鎖定資料";
		}

		School.setFirstSystemQuota(schoolid, data).then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res;
			}
		}).then(async function (json) {
			stopLoading();
			await swal({title: alertText, confirmButtonText:'確定', type:'success'});
			if( parseInt($bachelor_expanded_quota.val()) + parseInt($master_expanded_quota.val()) + parseInt($phd_expanded_quota.val()) > 0 && action == "confirm"){
				await swal({title:"您有申請僑、港澳生名額增量，請記得填列「113招生名額增量申請表」並回傳。 （詳情請看底下說明）", confirmButtonText:'確定', type:'info'});
			}
			location.reload();
		}).catch(function (err) {
			err.json && err.json().then((data) => {
				console.error(data);
				swal({title:data.messages[0], confirmButtonText:'確定', type:'error'});
			});
			stopLoading();
		});
	}

	function _handlePDF() {
		let dummy_id = Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1111111);
		window.open (env.baseUrl + '/schools/'+ schoolid + '/quotas-reply-form?dummy_id'+dummy_id, '_blank');
	}


})();
