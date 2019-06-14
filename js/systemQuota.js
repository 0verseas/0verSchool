var systemQuota = (function () {

	/**
	 * cacheDOM
	 */
	var $lastEditionInfo = $('#lastEditionInfo');
	var $btnSave = $('#btn-save');
	var $btnConfirm = $('#btn-confirm');
	var $btnPdf = $('#btn-pdf');

	//quota
	var $last_year_admission_amount_bache_multiply_10 = $('#last_year_admission_amount_bache_multiply_10'); // 去年總招生名額
	var $last_year_admission_amount_bache = $('#last_year_admission_amount_bache'); // 去年招生名額 * 10%
	var $quota_used_bache = $('#quota_used_bache'); // 欲使用名額
	var $quota_passed_bache = $('#quota_passed_bache'); // 班別間流用
	var $last_year_surplus_admission_quota_bache = $('#last_year_surplus_admission_quota_bache'); // 去年本地生招生缺額數籲提供給今年
	var $expanded_quota_bache = $('#expanded_quota_bache'); // 擴增名額
	var $allowTotal_bache = $('#allowTotal_bache'); // 實際招收名額
	var $quota_medicine = $('#quota_medicine'); // 醫學名額
	var $quota_dentist = $('#quota_dentist'); // 牙醫名額
	var $quota_chinese_medicine = $('#quota_chinese_medicine'); // 中醫名額
	var $allowTotal_bache_2 = $('#allowTotal_bache_2'); // 實際招收名額 for 醫學顯示
	var $allow_except_medicine = $('#allow_except_medicine'); // 扣除醫牙可招收名額

	var $last_year_admission_amount_master_multiply_10= $('#last_year_admission_amount_master_multiply_10'); // 去年總招生名額
	var $last_year_admission_amount_master= $('#last_year_admission_amount_master'); // 去年招生名額 * 10%
	var $quota_used_master = $('#quota_used_master'); // 欲使用名額
	var $quota_passed_master = $('#quota_passed_master'); // 班別間流用
	var $last_year_surplus_admission_quota_master = $('#last_year_surplus_admission_quota_master'); // 去年本地生招生缺額數籲提供給今年
	var $expanded_quota_master = $('#expanded_quota_master'); // 擴增名額
	var $allowTotal_master = $('#allowTotal_master'); // 實際招收名額

	var $last_year_admission_amount_phd_multiply_10= $('#last_year_admission_amount_phd_multiply_10'); // 去年總招生名額
	var $last_year_admission_amount_phd = $('#last_year_admission_amount_phd'); // 去年招生名額 * 10%
	var $quota_used_phd = $('#quota_used_phd'); // 欲使用名額
	var $quota_passed_phd = $('#quota_passed_phd'); // 班別間流用
	var $last_year_surplus_admission_quota_phd= $('#last_year_surplus_admission_quota_phd'); // 去年本地生招生缺額數籲提供給今年
	var $expanded_quota_phd = $('#expanded_quota_phd'); // 擴增名額
	var $allowTotal_phd = $('#allowTotal_phd'); // 實際招收名額

	var $description= $('#description'); // 學制流用需求描述
	var schoolid;
	var has_medicine_dept;
	$last_year_surplus_admission_quota_bache.on('change', _handleQuotaChanged);
	$quota_used_bache.on('change', _handleQuotaChanged);
	$quota_passed_bache.on('change', _handleQuotaChanged);
	$expanded_quota_bache.on('change', _handleQuotaChanged);
	$last_year_surplus_admission_quota_master.on('change', _handleQuotaChanged);
	$quota_used_master.on('change', _handleQuotaChanged);
	$quota_passed_master.on('change', _handleQuotaChanged);
	$expanded_quota_master.on('change', _handleQuotaChanged);
	$last_year_surplus_admission_quota_phd.on('change', _handleQuotaChanged);
	$quota_used_phd.on('change', _handleQuotaChanged);
	$quota_passed_phd.on('change', _handleQuotaChanged);
	$expanded_quota_phd.on('change', _handleQuotaChanged);

	$quota_medicine.on('change', _handleMedicineQuotaChanged);
	$quota_dentist.on('change', _handleMedicineQuotaChanged);
	$quota_chinese_medicine.on('change', _handleMedicineQuotaChanged);

	_setData();

	$btnSave.on('click', _handleSave);
	$btnConfirm.on('click', _handleConfirm);
	$btnPdf.on('click', _handlePDF);

	function _setData() {
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
				//並不是每間學校都有學碩博
				if( json.bachelor == null)
					document.getElementById("bachelor_quota").style.display="none";
				if( json.master == null)
					document.getElementById("master_quota").style.display="none";
				if( json.phd == null)
					document.getElementById("phd_quota").style.display="none";
				if( json.master.confirmed_at != null ) {
					document.getElementById("btn-confirm").textContent = "已鎖定";
					document.getElementById("btn-confirm").disabled = true;
					document.getElementById("btn-save").disabled = true;
				}
				has_medicine_dept = json.has_medicine_dept;
				if( json.has_medicine_dept == 0)
					document.getElementById("medicine_quota").style.display="none";
				else{

				}
				_renderData(json);
			}).then(function () {
				stopLoading();
				}).catch(function (err) {
				if (err.status === 404) {
					alert('沒有這個學校。 即將返回上一頁。');
					window.history.back();
				} else {
					err.json && err.json().then((data) => {
						console.error(data);
						alert(`ERROR: \n${data.messages[0]}`);

						stopLoading();
					});
				}
			});
		}).catch(function(err) {
			if (err == 401) {
				$errMsg.finish().show().text('帳號密碼錯誤。').fadeOut(1500);
			}
		})

		function _renderData(json) {
			_setQuota(json);
			_setEditor(json.master.updated_by, json.master.updated_at);
		}

		function _setQuota(data) {
			if(data.bachelor != null) {
				$last_year_admission_amount_bache_multiply_10.val(data.bachelor.last_year_admission_amount_multiply_10);
				$last_year_surplus_admission_quota_bache.val(data.bachelor.last_year_surplus_admission_quota);
				$quota_used_bache.val(data.bachelor.quota_used);
				$quota_passed_bache.val(data.bachelor.quota_passed);
				$last_year_admission_amount_bache.val(data.bachelor.last_year_admission_amount);
				$expanded_quota_bache.val(data.bachelor.expanded_quota);
				$allowTotal_bache.val(data.bachelor.quota_used + data.bachelor.quota_passed + data.bachelor.last_year_surplus_admission_quota + data.bachelor.expanded_quota);
			}

			if( data.master != null) {
				$last_year_admission_amount_master_multiply_10.val(data.master.last_year_admission_amount_multiply_10);
				$last_year_surplus_admission_quota_master.val(data.master.last_year_surplus_admission_quota);
				$quota_used_master.val(data.master.quota_used);
				$quota_passed_master.val(data.master.quota_passed);
				$last_year_admission_amount_master.val(data.master.last_year_admission_amount);
				$expanded_quota_master.val(data.master.expanded_quota);
				$allowTotal_master.val(data.master.quota_used + data.master.quota_passed + data.master.last_year_surplus_admission_quota + data.master.expanded_quota);
			}
			if( data.phd != null) {
				$last_year_admission_amount_phd_multiply_10.val(data.phd.last_year_admission_amount_multiply_10);
				$last_year_surplus_admission_quota_phd.val(data.phd.last_year_surplus_admission_quota);
				$quota_used_phd.val(data.phd.quota_used);
				$quota_passed_phd.val(data.phd.quota_passed);
				$last_year_admission_amount_phd.val(data.phd.last_year_admission_amount);
				$expanded_quota_phd.val(data.phd.expanded_quota);
				$allowTotal_phd.val(data.phd.quota_used + data.phd.quota_passed + data.phd.last_year_surplus_admission_quota + data.phd.expanded_quota);
			}

			if( data.has_medicine_dept == 1) {
				$allowTotal_bache_2.val(data.bachelor.quota_used + data.bachelor.quota_passed + data.bachelor.last_year_surplus_admission_quota + data.bachelor.expanded_quota);
				$quota_medicine.val(data.bachelor.quota_medicine);
				$quota_dentist.val(data.bachelor.quota_dentist);
				$quota_chinese_medicine.val(data.bachelor.quota_chinese_medicine);
				$allow_except_medicine.val(
					parseInt($allowTotal_bache.val()) -
					parseInt($quota_medicine.val()) -
					parseInt($quota_dentist.val()) -
					parseInt($quota_chinese_medicine.val())
				);
			}
			$description.val(data.description);
		}
		function _setEditor(creator, created_at) {
			$lastEditionInfo.find('.who').text(creator ? creator.name : 'unknown');
			$lastEditionInfo.find('.when').text(moment(created_at).format('YYYY/MM/DD HH:mm:ss'));
		}

	}
	function _handleQuotaChanged() {
		checkQuotaValidate();

		$allowTotal_bache.val( parseInt($quota_used_bache.val()) + parseInt($quota_passed_bache.val()) + parseInt($last_year_surplus_admission_quota_bache.val()) + parseInt($expanded_quota_bache.val()));
		$allowTotal_master.val( parseInt($quota_used_master.val()) + parseInt($quota_passed_master.val()) + parseInt($last_year_surplus_admission_quota_master.val()) + parseInt($expanded_quota_master.val()));
		$allowTotal_phd.val( parseInt($quota_used_phd.val()) + parseInt($quota_passed_phd.val()) + parseInt($last_year_surplus_admission_quota_phd.val()) + parseInt($expanded_quota_phd.val()));
		$allowTotal_bache_2.val(parseInt($quota_used_bache.val()) + parseInt($quota_passed_bache.val()) + parseInt($last_year_surplus_admission_quota_bache.val()) + parseInt($expanded_quota_bache.val()));
		$allow_except_medicine.val(parseInt($allowTotal_bache.val()) - parseInt($quota_medicine.val()) - parseInt($quota_dentist.val()) -parseInt($quota_chinese_medicine.val()));
	}

	function checkQuotaValidate() {
		// 0 <= 欲使用名額 <= 總量10％
		if( $quota_used_bache.val() > $last_year_admission_amount_bache.val() ){
			$quota_used_bache.val( $last_year_admission_amount_bache.val() );
		}
		if( $quota_used_bache.val() < 0 ){
			$quota_used_bache.val( 0 );
		}

		if( $quota_used_master.val() > $last_year_admission_amount_master.val() ){
			$quota_used_master.val( $last_year_admission_amount_master.val() );
		}
		if( $quota_used_master.val() < 0 ){
			$quota_used_master.val( 0 );
		}

		if( $quota_used_phd.val() > $last_year_admission_amount_phd.val() ){
			$quota_used_phd.val( $last_year_admission_amount_phd.val() );
		}
		if( $quota_used_phd.val() < 0 ){
			$quota_used_phd.val( 0 );
		}

		// 欲使用名額為 0，班別間流用也需為 0
		if( $quota_used_bache.val() == 0 && $quota_passed_bache.val() != 0 ){
			$quota_passed_bache.val(0);
			alert("學士班未規劃名額，則不得流用名額至其他班別");
		}
		if( $quota_used_master.val() == 0 && $quota_passed_master.val() != 0 ){
			$quota_passed_master.val(0);
			alert("碩士班未規劃名額，則不得流用名額至其他班別");
		}
		if( $quota_used_phd.val() == 0 && $quota_passed_phd.val() != 0 ){
			$quota_passed_phd.val(0);
			alert("博士班未規劃名額，則不得流用名額至其他班別");
		}

		// 班別間流用若為負，絕對值不得超出欲使用名額
		if( parseInt($quota_passed_bache.val()) + parseInt($quota_used_bache.val()) < 0 ){
			$quota_passed_bache.val( 0 );
			alert("班別間流用不得流超出欲使用名額");
		}
		if( parseInt($quota_passed_master.val()) + parseInt($quota_used_master.val()) < 0 ){
			$quota_passed_master.val( 0 );
			alert("班別間流用不得流超出欲使用名額");
		}
		if( parseInt($quota_passed_phd.val()) + parseInt($quota_used_phd.val()) < 0){
			$quota_passed_phd.val( 0 );
			alert("班別間流用不得流超出欲使用名額");
		}

		// 欲使用名額 < 總量10％ ，不得填本地生缺額、擴增名額
		if( $quota_used_bache.val() < $last_year_admission_amount_bache.val() &&
			(
				$last_year_surplus_admission_quota_bache.val() != 0 ||
				$expanded_quota_bache.val() != 0
			)
		){
			$last_year_surplus_admission_quota_bache.val(0);
			$expanded_quota_bache.val(0);
			alert("學士班未使用完總量上限，不得填寫本地生缺額、擴增名額");
		}
		if( $quota_used_master.val() < $last_year_admission_amount_master.val() &&
			(
				$last_year_surplus_admission_quota_master.val() != 0 ||
				$expanded_quota_master.val() != 0
			)
		){
			$last_year_surplus_admission_quota_master.val(0);
			$expanded_quota_master.val(0);
			alert("碩士班未使用完總量上限，不得填寫本地生缺額、擴增名額");
		}
		if( $quota_used_phd.val() < $last_year_admission_amount_phd.val() &&
			(
				$last_year_surplus_admission_quota_phd.val() != 0 ||
				$expanded_quota_phd.val() != 0
			)
		){
			$last_year_surplus_admission_quota_phd.val(0);
			$expanded_quota_phd.val(0);
			alert("博士班未使用完總量上限，不得填寫本地生缺額、擴增名額");
		}
	}

	function _handleMedicineQuotaChanged() {
		if( $quota_medicine.val() < 0 || $quota_dentist.val() < 0 || $quota_chinese_medicine.val() < 0){
			$quota_medicine.val(0);
			$quota_dentist.val(0);
			$quota_chinese_medicine.val(0);
		}

		if(  parseInt($quota_medicine.val()) +  parseInt($quota_dentist.val()) +  parseInt($quota_chinese_medicine.val()) > $allowTotal_bache.val() ){
			alert("醫學系 + 牙醫系 + 中醫系 之名額 大於 可招收名額！");
			$quota_medicine.val(0);
			$quota_dentist.val(0);
			$quota_chinese_medicine.val(0);
		}

		$allow_except_medicine.val( parseInt($allowTotal_bache.val()) - parseInt($quota_medicine.val()) - parseInt($quota_dentist.val()) - parseInt($quota_chinese_medicine.val()));

	}

	function _handleSave(){
		// 檢查班別間流用相加應為 0
		if ( (parseInt($quota_passed_bache.val()) || 0 )+
				(parseInt($quota_passed_master.val()) || 0)+
				(parseInt($quota_passed_phd.val()) || 0) != 0 ){
			alert("班別間留用相加總和應為 0 ，請重新填寫");
			$quota_passed_bache.val(0);
			$quota_passed_master.val(0);
			$quota_passed_phd.val(0);
			return;
		}
		// 醫學 + 牙醫 + 中醫 應該<= 學士班可用總額
		if(parseInt($quota_medicine.val()) + parseInt($quota_dentist.val()) + parseInt($quota_chinese_medicine.val()) > parseInt($allowTotal_bache.val())){
			alert("醫學系、牙醫系、中醫系名額總和超過學士班名額");
			return;
		}
		var data= {
			"Bachelor_last_year_surplus_admission_quota": $last_year_surplus_admission_quota_bache.val(),
			"Bachelor_expanded_quota": $expanded_quota_bache.val(),
			"Bachelor_quota_used_bache": $quota_used_bache.val(),
			"Bachelor_quota_passed_bache": $quota_passed_bache.val(),
			"Master_last_year_surplus_admission_quota": $last_year_surplus_admission_quota_master.val(),
			"Master_expanded_quota": $expanded_quota_master.val(),
			"Master_quota_used_bache": $quota_used_master.val(),
			"Master_quota_passed_bache": $quota_passed_master.val(),
			"PhD_last_year_surplus_admission_quota": $last_year_surplus_admission_quota_phd.val(),
			"PhD_expanded_quota": $expanded_quota_phd.val(),
			"PhD_quota_used_bache": $quota_used_phd.val(),
			"PhD_quota_passed_bache": $quota_passed_phd.val(),
			"description": $description.val(),
			"data_confirm": false
		}

		if( has_medicine_dept == 1){
			data["Bachelor_quota_medicine"] = $quota_medicine.val();
			data["Bachelor_quota_dentist"] = $quota_dentist.val();
			data["Bachelor_quota_chinese_medicine"] = $quota_chinese_medicine.val();
		}
		School.setFirstSystemQuota(schoolid, data).then(function (res) {
			// setTimeout(function () {
			// 	$this.attr('disabled', false);
			// }, 200);
			if(res.ok) {
				return res.json();
			} else {
				throw res;
			}
		}).then(function (json) {
			alert('已儲存');
			location.reload();
		}).catch(function (err) {
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);

				stopLoading();
			})
		});
	}

	function _handleConfirm(){
		// 檢查班別間流用相加應為 0
		if ( (parseInt($quota_passed_bache.val()) || 0 )+
				(parseInt($quota_passed_master.val()) || 0)+
				(parseInt($quota_passed_phd.val()) || 0) != 0 ){
			alert("班別間留用相加總和應為 0 ，請重新填寫");
			$quota_passed_bache.val(0);
			$quota_passed_master.val(0);
			$quota_passed_phd.val(0);
			return;
		}
		// 醫學 + 牙醫 + 中醫 應該<= 學士班可用總額
		if(parseInt($quota_medicine.val()) + parseInt($quota_dentist.val()) + parseInt($quota_chinese_medicine.val()) > parseInt($allowTotal_bache.val())){
			alert("醫學系、牙醫系、中醫系名額總和超過學士班名額");
			return;
		}

		var isAllSet = confirm("確認後就「無法再次更改資料」，您真的確認送出嗎？");
		if (isAllSet === true) {
			var data = {
			"Bachelor_last_year_surplus_admission_quota": $last_year_surplus_admission_quota_bache.val(),
			"Bachelor_expanded_quota": $expanded_quota_bache.val(),
			"Bachelor_quota_used_bache": $quota_used_bache.val(),
			"Bachelor_quota_passed_bache": $quota_passed_bache.val(),
			"Master_last_year_surplus_admission_quota": $last_year_surplus_admission_quota_master.val(),
			"Master_expanded_quota": $expanded_quota_master.val(),
			"Master_quota_used_bache": $quota_used_master.val(),
			"Master_quota_passed_bache": $quota_passed_master.val(),
			"PhD_last_year_surplus_admission_quota": $last_year_surplus_admission_quota_phd.val(),
			"PhD_expanded_quota": $expanded_quota_phd.val(),
			"PhD_quota_used_bache": $quota_used_phd.val(),
			"PhD_quota_passed_bache": $quota_passed_phd.val(),
			"description": $description.val(),
			"data_confirm": true
			}

			if( has_medicine_dept == 1){
				data["Bachelor_quota_medicine"] = $quota_medicine.val();
				data["Bachelor_quota_dentist"] = $quota_dentist.val();
				data["Bachelor_quota_chinese_medicine"] = $quota_chinese_medicine.val();
			}

			School.setFirstSystemQuota(schoolid, data).then(function (res) {
				// setTimeout(function () {
				// 	$this.attr('disabled', false);
				// 	location.reload();
				// }, 400);
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			}).then(function (json) {
				alert('已儲存並鎖定');

				if( $expanded_quota_bache.val() > 0 || $expanded_quota_master.val() > 0 ||$expanded_quota_phd.val() > 0){
					alert("您有申請僑、港澳生名額增量，請記得填列「109招生名額增量調查表」並回傳！ （詳情請看底下說明）");
				}
				location.reload();
			}).catch(function (err) {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);

					stopLoading();
				})
			});
		}
	}

	function _handlePDF() {
		window.open (env.baseUrl + '/schools/'+ schoolid + '/quotas-reply-form', '_blank');
	}


})();
