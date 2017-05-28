var quotaDistirbutionBache = (function () {
	/**
	 * cacheDOM
	 */
	var $page = $('#pageContent');
	var $statusBadge = $page.find('#badge-status');

	//quota
	$quota_allowTotal = $page.find('.quota.allowTotal'); // 本年度可招生總量
	$quota_last_year_admission_amount = $page.find('.quota.last_year_admission_amount'); // 去年招生名額 * 10%
	$quota_last_year_surplus_admission_quota = $page.find('.quota.last_year_surplus_admission_quota'); // 去年本地生招生缺額數*
	$quota_ratify_expanded_quota = $page.find('.quota.ratify_expanded_quota'); // 本年度教育部核准擴增名額
	$quota_admission_selection_quota = $page.find('.quota.admission_selection_quota'); // 學士班個人申請
	$quota_admission_placement_quota = $page.find('.quota.admission_placement_quota'); // 學士班聯合分發
	$quota_self_enrollment_quota = $page.find('.quota.self_enrollment_quota'); // 學士班自招

	// dept list
	var $deptList = $page.find('#table-bacheDeptList');

	/**
	 * bind event
	 */
	// 是否自招的 checkbox
	$deptList.on('click.toggleSelf', '.dept .isSelf', _handleToggleCheck);
	// 填數字算總額
	$deptList.on('change.sumTotal', '.dept .editableQuota', _handleQuotaChange);
	$quota_last_year_surplus_admission_quota.on('change', _updateAllowTotal);
	
	/**
	 * init
	 */
	// show bache only
	$page.find('.bacheOnly').removeClass('hide');
	_setData();

	function _handleToggleCheck() {
		var $this = $(this);
		var checked = $this.is(':checked');
		if (checked) {
			$this.parents('.dept')
				.find('.self_enrollment_quota')
				.attr('disabled', false)
				.addClass('required');
			_handleQuotaChange.call($this[0]);
		} else {
			$this.parents('.dept')
				.find('.self_enrollment_quota')
				.attr('disabled', true)
				.removeClass('required')
				.val(0);
			_handleQuotaChange.call($this[0]);
		}
	}

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
		}
	}

	function _setData() {
		fetch('https://api.overseas.ncnu.edu.tw/schools/me/systems/bachelor/histories/latest?data_type=quota', {
			credentials: 'include'
		}).then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function (json) {
			console.log(json);
			_setStatus(json.quota_status);
			_setQuota(json);
			_setDeptList(json.departments);
		}).catch(function (err) {
			console.error(err);
		});
	}

	function _setStatus(status) {
		switch (status) {
			case 'waiting':
				$statusBadge.addClass('badge-warning').text('已送出');
				// TODO: lock input
				break;
			case 'confirmed':
				$statusBadge.addClass('badge-success').text('已確認');
				// TODO: lock input
				break;
			case 'editing':
				$statusBadge.addClass('badge-danger').text('編輯中');
				break;
			case 'returned':
				$statusBadge.addClass('badge-danger').text('編輯中');
				// TODO: show review comment
				break;
		}
	}

	function _setQuota(data) {
		var {
			last_year_admission_amount,
			last_year_surplus_admission_quota,
			ratify_expanded_quota
		} = data;
		$quota_last_year_admission_amount.val(last_year_admission_amount);
		$quota_last_year_surplus_admission_quota.val(last_year_surplus_admission_quota);
		$quota_ratify_expanded_quota.val(ratify_expanded_quota);
		_updateAllowTotal();
	}

	function _setDeptList(list) {
		$deptList .find('tbody') .html('');
		for (let dept of list) {
			var {
				id,
				title,
				sort_order,
				title,
				eng_title,
				admission_selection_quota,
				admission_placement_quota,
				has_self_enrollment,
				self_enrollment_quota
			} = dept;
			var total = (+admission_selection_quota) + (+admission_placement_quota) + (+self_enrollment_quota || 0);

			$deptList
				.find('tbody')
				.append(`
					<tr class="dept" data-id="${id}">
						<td>${sort_order}</td>
						<td>${id}</td>
						<td>
							<div>${title}</div>
							<div>${eng_title}</div>
						</td>
						<td><input type="number" min="0" class="form-control editableQuota required admission_selection_quota" data-type="admission_selection_quota" value="${admission_selection_quota || 0}" /></td>
						<td><input type="number" min="0" class="form-control editableQuota required admission_placement_quota" data-type="admission_placement_quota" value="${admission_placement_quota || 0}" /></td>
						<td class="text-center"><input type="checkbox" class="isSelf" checked="${has_self_enrollment}" ></td>
						<td><input type="number" min="0" class="form-control editableQuota required self_enrollment_quota" data-type="self_enrollment_quota" value="${self_enrollment_quota || 0}" /></td>
						<td class="total">${total}</td>
					</tr>
				`);
		}
		_updateQuotaSum('admission_selection_quota');
		_updateQuotaSum('admission_placement_quota');
		_updateQuotaSum('self_enrollment_quota');
	}

	function _updateQuotaSum(type) {
		var $ele = {
			admission_selection_quota: $quota_admission_selection_quota,
			admission_placement_quota: $quota_admission_placement_quota,
			self_enrollment_quota: $quota_self_enrollment_quota
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

})();
