var quotaDistirbutionBache = (function () {
	/**
	 * cacheDOM
	 */
	var $page = $('#pageContent');
	var $statusBadge = $page.find('#badge-status');

	//quota
	$quota_admission_selection_quota = $page.find('.quota.admission_selection_quota');

	// dept list
	var $deptList = $page.find('#table-bacheDeptList');

	/**
	 * bind event
	 */
	// 是否自招的 checkbox
	$deptList.on('click.toggleSelf', '.dept .isSelf', _handleToggleCheck);
	// 填數字算總額
	$deptList.on('change.sumTotal', '.dept .editableQuota', _handleQuotaChange);
	
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

		// update sum admission_selection_quota
		if ($this.hasClass('admission_selection_quota')) {
			_updateAdmissionSelectionQuotaSum();
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

	function _setQuota() {
		
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
						<td><input type="number" min="0" class="form-control editableQuota required admission_selection_quota" value="${admission_selection_quota || 0}" /></td>
						<td><input type="number" min="0" class="form-control editableQuota required admission_placement_quota" value="${admission_placement_quota || 0}" /></td>
						<td class="text-center"><input type="checkbox" class="isSelf" checked="${has_self_enrollment}" ></td>
						<td><input type="number" min="0" class="form-control editableQuota required self_enrollment_quota" value="${self_enrollment_quota || 0}" /></td>
						<td class="total">${total}</td>
					</tr>
				`);
		}
		_updateAdmissionSelectionQuotaSum();
	}

	function _updateAdmissionSelectionQuotaSum() {
		var sum = 0;
		$deptList.find('.dept').each(function (i, deptRow) {
			sum += +$(deptRow).find('.admission_selection_quota').val();
		});
		$quota_admission_selection_quota.val(sum);
	}

})();
