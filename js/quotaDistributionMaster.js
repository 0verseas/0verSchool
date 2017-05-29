var quotaDistributionMaster = (function () {
	/**
	 * cacheDOM
	 */
	var $page = $('#pageContent');
	var $statusBadge = $page.find('#badge-status');
	var $btn = $page.find('#btn-save, #btn-commit');

	//quota
	var $quota_allowTotal = $page.find('.quota.allowTotal'); // 本年度可招生總量
	var $quota_last_year_admission_amount = $page.find('.quota.last_year_admission_amount'); // 去年招生名額 * 10%
	var $quota_last_year_surplus_admission_quota = $page.find('.quota.last_year_surplus_admission_quota'); // 去年本地生招生缺額數*
	var $quota_ratify_expanded_quota = $page.find('.quota.ratify_expanded_quota'); // 本年度教育部核准擴增名額
	var $quota_wantTotal = $page.find('.quota.wantTotal'); // 本年度欲招募總量
	var $quota_admissionSum = $page.find('.quota.admissionSum'); // 本年度聯招小計
	var $quota_selfSum = $page.find('.quota.selfSum'); // 本年度自招小計

	// dept list
	var $deptList = $page.find('#table-masterPhdDeptList');

	/**
	 * bind event
	 */
	// 填數字算總額
	$deptList.on('change.sumTotal', '.dept .editableQuota', _handleQuotaChange);
	$quota_last_year_surplus_admission_quota.on('change', _updateAllowTotal);
	
	/**
	 * init
	 */
	// show bache only
	$page.find('.masterOnly').removeClass('hide');
	_setData();

	function _setData() {
		School.getSystemQuota('master').then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function (json) {
			console.log(json);
			_setQuota(json);
			_setDeptList(json.departments);
			_setStatus(json.quota_status);
			// TODO: 上次編輯資訊(右上角)
		}).catch(function (err) {
			console.error(err);
		});
	}

	function _handleQuotaChange() {
		var $this = $(this);
		var sum = 0;
		$this.parents('.dept').find('.editableQuota').each(function (i, input) {
			sum += +$(input).val() || 0;
		});
		$this.parents('.dept').find('.total').text(sum);

		// update sum admission_selection_quota / self_enrollment_quota
		var quotaType = $this.data('type');
		if (quotaType) {
			_updateQuotaSum(quotaType);
			_updateWnatTotal();
		}
	}

	function _setQuota(data) {
		var {
			last_year_admission_amount,
			last_year_surplus_admission_quota,
			ratify_expanded_quota
		} = data;
		$quota_last_year_admission_amount.val(last_year_admission_amount || 0);
		$quota_last_year_surplus_admission_quota.val(last_year_surplus_admission_quota || 0);
		$quota_ratify_expanded_quota.val(ratify_expanded_quota || 0);
		_updateAllowTotal();
	}

	function _setDeptList(list) {
		$deptList.find('tbody').html('');
		for (let dept of list) {
			var {
				id,
				sort_order,
				title,
				eng_title,
				admission_selection_quota,
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
						<td><input type="number" min="0" class="form-control editableQuota required admission_selection_quota" data-type="admission_selection_quota" value="${+admission_selection_quota}" /></td>
						<td><input type="number" min="0" class="form-control editableQuota required self_enrollment_quota" data-type="self_enrollment_quota" value="${+self_enrollment_quota}" /></td>
						<td class="total text-center">${total}</td>
					</tr>
				`);
		}
		_updateQuotaSum('admission_selection_quota');
		_updateQuotaSum('self_enrollment_quota');
		_updateWnatTotal();
	}

	function _setStatus(status) {
		switch (status) {
			case 'waiting':
				$statusBadge.addClass('badge-warning').text('已送出');
				$page.find('input, textarea').attr('disabled', true);
				break;
			case 'confirmed':
				$statusBadge.addClass('badge-success').text('已確認');
				$page.find('input, textarea').attr('disabled', true);
				break;
			case 'editing':
				$statusBadge.addClass('badge-danger').text('編輯中');
				break;
			case 'returned':
				$statusBadge.addClass('badge-danger').text('編輯中');
				$page.find('#reviewInfo').removeClass('hide');
				break;
		}
	}

	function _updateQuotaSum(type) {
		var $ele = {
			admission_selection_quota: $quota_admissionSum,
			self_enrollment_quota: $quota_selfSum
		};
		var sum = 0;
		$deptList.find('.dept').each(function (i, deptRow) {
			sum += +$(deptRow).find(`.${type}`).val();
		});
		$ele[type].val(sum);
	}

	function _updateAllowTotal() {
		var sum = +($quota_last_year_admission_amount.val()) + 
			+($quota_last_year_surplus_admission_quota.val()) + 
			+($quota_ratify_expanded_quota.val());
		$quota_allowTotal.val(sum);
	}

	function _updateWnatTotal() {
		var sum = +($quota_admissionSum.val()) +
			+($quota_selfSum.val());
		$quota_wantTotal.val(sum);
	}

})();
