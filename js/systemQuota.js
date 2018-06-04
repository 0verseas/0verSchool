var systemQuota = (function () {

	/**
	 * cacheDOM
	 */
	var $lastEditionInfo = $('#lastEditionInfo');
	var $btnSave = $('#btn-save');
	var $btnConfirm = $('#btn-confirm');
	var $btnPdf = $('#btn-pdf');

	//quota
	var $last_year_admission_amount_bache = $('#last_year_admission_amount_bache'); // 去年招生名額 * 10%
	var $last_year_surplus_admission_quota_bache = $('#last_year_surplus_admission_quota_bache'); // 去年本地生招生缺額數籲提供給今年
	var $expanded_quota_bache = $('#expanded_quota_bache'); // 擴增名額
	var $allowTotal_bache = $('#allowTotal_bache'); // 擴增名額

	var $last_year_admission_amount_master= $('#last_year_admission_amount_master'); // 去年招生名額 * 10%
	var $last_year_surplus_admission_quota_master = $('#last_year_surplus_admission_quota_master'); // 去年本地生招生缺額數籲提供給今年
	var $expanded_quota_master = $('#expanded_quota_master'); // 擴增名額
	var $allowTotal_master = $('#allowTotal_master'); // 擴增名額

	var $last_year_admission_amount_phd = $('#last_year_admission_amount_phd'); // 去年招生名額 * 10%
	var $last_year_surplus_admission_quota_phd= $('#last_year_surplus_admission_quota_phd'); // 去年本地生招生缺額數籲提供給今年
	var $expanded_quota_phd = $('#expanded_quota_phd'); // 擴增名額
	var $allowTotal_phd = $('#allowTotal_phd'); // 擴增名額

	$last_year_surplus_admission_quota_bache.on('change', _handleQuotaChanged);
	$expanded_quota_bache.on('change', _handleQuotaChanged);
	$last_year_surplus_admission_quota_master.on('change', _handleQuotaChanged);
	$expanded_quota_master.on('change', _handleQuotaChanged);
	$last_year_surplus_admission_quota_phd.on('change', _handleQuotaChanged);
	$expanded_quota_phd.on('change', _handleQuotaChanged);

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
				console.log(json.bachelor.confirmed_at)
				//並不是每間學校都有學碩博
				if( json.bachelor == null)
					document.getElementById("bachelor_quota").style.display="none";
				if( json.master == null)
					document.getElementById("master_quota").style.display="none";
				if( json.phd == null)
					document.getElementById("phd_quota").style.display="none";
				if( json.bachelor.confirmed_at != null) {
					document.getElementById("btn-confirm").textContent = "已鎖定";
					document.getElementById("btn-confirm").disabled = true;
				}
				else{
					document.getElementById("btn-pdf").disabled = true;
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
			_setEditor(json.bachelor.updated_by, json.bachelor.updated_at);
		}

		function _setQuota(data) {
			$last_year_surplus_admission_quota_bache.val(data.bachelor.last_year_surplus_admission_quota);
			$last_year_admission_amount_bache.val(data.bachelor.last_year_admission_amount);
			$expanded_quota_bache.val(data.bachelor.expanded_quota);
			$allowTotal_bache.val(data.bachelor.last_year_surplus_admission_quota + data.bachelor.last_year_admission_amount + data.bachelor.expanded_quota);

			$last_year_surplus_admission_quota_master.val(data.master.last_year_surplus_admission_quota);
			$last_year_admission_amount_master.val(data.master.last_year_admission_amount);
			$expanded_quota_master.val(data.master.expanded_quota);
			$allowTotal_master.val( data.master.last_year_surplus_admission_quota + data.master.last_year_admission_amount + data.master.expanded_quota);

			$last_year_surplus_admission_quota_phd.val(data.phd.last_year_surplus_admission_quota);
			$last_year_admission_amount_phd.val(data.phd.last_year_admission_amount);
			$expanded_quota_phd.val(data.phd.expanded_quota);
			$allowTotal_phd.val( data.phd.last_year_surplus_admission_quota + data.phd.last_year_admission_amount + data.phd.expanded_quota);
		}
		function _setEditor(creator, created_at) {
			$lastEditionInfo.find('.who').text(creator ? creator.name : 'unknown');
			$lastEditionInfo.find('.when').text(moment(created_at).format('YYYY/MM/DD HH:mm:ss'));
		}

	}
	function _handleQuotaChanged() {
		$allowTotal_bache.val( parseInt($last_year_surplus_admission_quota_bache.val())+ parseInt($last_year_admission_amount_bache.val()) + parseInt($expanded_quota_bache.val()));
		$allowTotal_master.val( parseInt($last_year_surplus_admission_quota_master.val())+ parseInt($last_year_admission_amount_master.val()) + parseInt($expanded_quota_master.val()));
		$allowTotal_phd.val( parseInt($last_year_surplus_admission_quota_phd.val())+ parseInt($last_year_admission_amount_phd.val()) + parseInt($expanded_quota_phd.val()));
	}

	function _handleSave(){

		var data= {
			"Bachelor_last_year_surplus_admission_quota": $last_year_surplus_admission_quota_bache.val(),
			"Bachelor_expanded_quota": $expanded_quota_bache.val(),
			"Master_last_year_surplus_admission_quota": $last_year_surplus_admission_quota_master.val(),
			"Master_expanded_quota": $expanded_quota_master.val(),
			"PhD_last_year_surplus_admission_quota": $last_year_surplus_admission_quota_phd.val(),
			"PhD_expanded_quota": $expanded_quota_phd.val(),
			"data_confirm": false
		}
		School.setFirstSystemQuota(schoolid, data).then(function (res) {
			setTimeout(function () {
				$this.attr('disabled', false);
			}, 700);
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
		var isAllSet = confirm("確認後就「無法再次更改資料」，您真的確認送出嗎？");
		if (isAllSet === true) {
			var data = {
				"Bachelor_last_year_surplus_admission_quota": $last_year_surplus_admission_quota_bache.val(),
				"Bachelor_expanded_quota": $expanded_quota_bache.val(),
				"Master_last_year_surplus_admission_quota": $last_year_surplus_admission_quota_master.val(),
				"Master_expanded_quota": $expanded_quota_master.val(),
				"PhD_last_year_surplus_admission_quota": $last_year_surplus_admission_quota_phd.val(),
				"PhD_expanded_quota": $expanded_quota_phd.val(),
				"data_confirm": true
			}
			School.setFirstSystemQuota(schoolid, data).then(function (res) {
				setTimeout(function () {
					$this.attr('disabled', false);
				}, 700);
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			}).then(function (json) {
				alert('已儲存並鎖定');
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
		School.getFirstSystemQoutaPDF(schoolid).then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function (json) {

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
	}


})();
