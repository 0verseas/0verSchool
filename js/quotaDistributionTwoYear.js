var quotaDistirbutionTwoYear = (function () {
	/**
	 * cacheDOM
	 */
	var $page = $('#pageContent');
	var $btn = $page.find('#btn-save, #btn-commit');
	var $lastEditionInfo = $page.find('#lastEditionInfo');

	//quota
	var $quota_allowTotal = $page.find('.quota.allowTotal'); // 本年度可招生總量
	var $quota_last_year_admission_amount = $page.find('.quota.last_year_admission_amount'); // 去年招生名額 * 10%
	var $quota_last_year_surplus_admission_quota = $page.find('.quota.last_year_surplus_admission_quota'); // 去年本地生招生缺額數*
	var $quota_ratify_expanded_quota = $page.find('.quota.ratify_expanded_quota'); // 本年度教育部核准擴增名額
	var $quota_another_department_admission_selection_quota = $page.find('.quota.another_department_admission_selection_quota'); // 學士班個人申請
	var $quota_another_department_admission_placement_quota = $page.find('.quota.another_department_admission_placement_quota'); // 學士班聯合分發
	var $quota_admission_selection_quota = $page.find('.quota.admission_selection_quota'); // 港二技個人申請
	var $quota_another_department_self_enrollment_quota = $page.find('.quota.another_department_self_enrollment_quota'); // 學士班自招
	var $quota_self_enrollment_quota = $page.find('.quota.self_enrollment_quota'); // 港二技自招
	var $quota_wantTotal = $page.find('.quota.wantTotal'); // 本年度欲招募總量
	var $quota_admissionSum = $page.find('.quota.admissionSum'); // 本年度聯招小計
	var $quota_selfSum = $page.find('.quota.selfSum'); // 本年度自招小計

	// dept list
	var $deptList = $page.find('#table-twoYearDeptList');

	/**
	 * bind event
	 */
	// 填數字算總額
	$deptList.on('change.sumTotal', '.dept .editableQuota', _handleQuotaChange);
	// save/commit
	$btn.on('click', _handleSave);

	/**
	 * init
	 */
	// show bache only
	$page.find('.twoYearOnly').removeClass('hide');
	$page.find('.hide .required').removeClass('required');
	_setData();

	function _handleQuotaChange() {
		var $this = $(this);
		var sum = 0;
		$this.parents('.dept').find('.editableQuota').each(function (i, input) {
			sum += +$(input).val() || 0;
		});
		$this.parents('.dept').find('.total').text(sum);

		// update sum admission_selection_quota / admission_placement_quota / self_enrollment_quota
		var quotaType = $this.data('type');
		if (quotaType) {
			_updateQuotaSum(quotaType);
			_updateAdmissionSumSelfSum();
			_updateWantTotal();
		}
	}

	function _handleSave() {
		var $this = $(this);
		if (!_checkForm()) {
			return;
		}

    openLoading();

		var departments = $deptList.find('.dept').map(function (i, deptRow) {
			let $deptRow = $(deptRow);
			return {
				id: String($deptRow.data('id')),
				admission_selection_quota: +$deptRow.find('.admission_selection_quota').val(),
				self_enrollment_quota: +$deptRow.find('.self_enrollment_quota').val()
			};
		}).toArray();

		var data = {
			departments: departments
		};

		$this.attr('disabled', true);
		School.setSystemQuota('twoYear', data).then(function (res) {
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

	function _checkForm() {
		var $inputs = $page.find('.required');
		var valid = true;
		for (let input of $inputs) {
			if (!$(input).val() || $(input).val() < 0) {
				$(input).focus();
				valid = false;
				alert('輸入有誤');
				break;
			}
		}

		// 本年度欲招募總量必須小於或等於可招生總量
		if (+$quota_wantTotal.val() > +$quota_allowTotal.val()) {
			valid = false;
			alert('各系所招生人數加總必須小於或等於可招生總量');
		}
		return valid;
	}

	function _setData() {
		openLoading();

		School.getSystemQuota('twoYear').then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function (json) {
			_renderData(json)
			if(json.review_at != null) {
				$('#btn-save').attr('disabled', true).text('已鎖定');
			}
			stopLoading();
		}).catch(function (err) {
			if (err.status === 404) {
				alert('沒有這個學制。 即將返回上一頁。');
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

	function _renderData(json) {
		_setQuota(json);
		_setDeptList(json.departments);
		_setEditor(json.creator, json.created_at);
		$page.find('#schoolHasSelf').text(json.school_has_self_enrollment ? '是' : '否');
	}

	function _setEditor(creator, created_at) {
		$lastEditionInfo.find('.who').text(creator ? creator.name : 'unknown');
		$lastEditionInfo.find('.when').text(moment(created_at).format('YYYY/MM/DD HH:mm:ss'));
	}

	function _setQuota(data) {
		var {
			last_year_admission_amount,
			last_year_surplus_admission_quota,
			ratify_expanded_quota,
			another_department_admission_selection_quota,
			another_department_admission_placement_quota,
			another_department_self_enrollment_quota
		} = data;
		$quota_last_year_admission_amount.val(last_year_admission_amount || 0);
		$quota_last_year_surplus_admission_quota.val(last_year_surplus_admission_quota || 0);
		$quota_ratify_expanded_quota.val(ratify_expanded_quota || 0);
		$quota_another_department_admission_selection_quota.val(another_department_admission_selection_quota || 0);
		$quota_another_department_self_enrollment_quota.val(another_department_self_enrollment_quota || 0);
		$quota_another_department_admission_placement_quota.val(another_department_admission_placement_quota || 0);
		_updateAllowTotal();
	}

	function _setDeptList(list, school_has_self_enrollment) {
        // 預設排序
        list.sort(function (a, b) {
            return a.sort_order - b.sort_order;
        });
        
		$deptList.find('tbody').html('');
		for (let dept of list) {
			var {
				id,
				sort_order,
				title,
				eng_title,
				admission_selection_quota,
				has_self_enrollment,
				self_enrollment_quota
			} = dept;
			var total = (+admission_selection_quota) + (+self_enrollment_quota);

			$deptList
				.find('tbody')
				.append(`
					<tr class="dept" data-id="${id}">
						<td>${sort_order}</td>
						<td>${id}</td>
						<td>
							<div>${title}</div>
							<small>${eng_title}</small>
						</td>
						<td class="text-center"><param class="admission_selection_quota" value="${+admission_selection_quota}" />${+admission_selection_quota}</td>
						<td class="text-center"><span class="isSelf" data-type="self_enrollment_quota">${has_self_enrollment ? '是' : '否'}</span></td>
						<td class="text-center"><param class="self_enrollment_quota" value="${+self_enrollment_quota}" />${+self_enrollment_quota}</td>
						<td class="total text-center">${total}</td>
					</tr>
				`);
		}
		_updateQuotaSum('admission_selection_quota');
		_updateQuotaSum('self_enrollment_quota');
		_updateAdmissionSumSelfSum();
		_updateWantTotal();
	}

	function _updateQuotaSum(type) {
		var $ele = {
			admission_selection_quota: $quota_admission_selection_quota,
			self_enrollment_quota: $quota_self_enrollment_quota
		};
		var sum = 0;
		$deptList.find('.dept').each(function (i, deptRow) {
			sum += +$(deptRow).find(`.${type}`).val();
		});
		$ele[type].val(sum);
	}

	function _updateAdmissionSumSelfSum() {
		$quota_admissionSum.val(
			+$quota_another_department_admission_selection_quota.val() +
			+$quota_another_department_admission_placement_quota.val() +
			+$quota_admission_selection_quota.val()
		);

		$quota_selfSum.val(
			+$quota_another_department_self_enrollment_quota.val() +
			+$quota_self_enrollment_quota.val()
		);
	}

	function _updateAllowTotal() {
		var sum = +($quota_last_year_admission_amount.val()) +
			+($quota_last_year_surplus_admission_quota.val()) +
			+($quota_ratify_expanded_quota.val());
		$quota_allowTotal.val(sum);
	}

	function _updateWantTotal() {
		var sum = +($quota_admissionSum.val()) +
			+($quota_selfSum.val());
		$quota_wantTotal.val(sum);
	}

})();
