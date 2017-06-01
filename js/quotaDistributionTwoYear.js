var quotaDistirbutionTwoYear = (function () {
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
	var $quota_another_department_admission_selection_quota = $page.find('.quota.another_department_admission_selection_quota'); // 學士班個人申請
	var $quota_another_department_admission_placement_quota = $page.find('.quota.another_department_admission_placement_quota'); // 學士班聯合分發
	var $quota_admission_selection_quota = $page.find('.quota.admission_selection_quota'); // 港二技個人申請
	var $quota_another_department_self_enrollment_quota = $page.find('.quota.another_department_self_enrollment_quota'); // 學士班自招
	var $quota_self_enrollment_quota = $page.find('.quota.self_enrollment_quota'); // 港二技自招
	var $quota_wantTotal = $page.find('.quota.wantTotal'); // 本年度欲招募總量
	var $quota_admissionSum = $page.find('.quota.admissionSum'); // 本年度聯招小計
	var $quota_selfSum = $page.find('.quota.selfSum'); // 本年度自招小計

	// dept list
	var $deptList = $page.find('#table-bacheDeptList');

	/**
	 * bind event
	 */
	
	/**
	 * init
	 */
	// show bache only
	$page.find('.twoYearOnly').removeClass('hide');
	_setData();

	function _setData() {
		School.getSystemQuota('twoYear').then(function (res) {
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

	function _setDeptList() {

	}

	function _setStatus(status) {
		switch (status) {
			case 'waiting':
				$statusBadge.addClass('badge-warning').text('已送出');
				$page.find('input, textarea').attr('disabled', true);
				$btn.attr('disabled', true);
				break;
			case 'confirmed':
				$statusBadge.addClass('badge-success').text('已確認');
				$page.find('input, textarea').attr('disabled', true);
				$btn.attr('disabled', true);
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

	function _updateAllowTotal() {
		var sum = +($quota_last_year_admission_amount.val()) + 
			+($quota_last_year_surplus_admission_quota.val()) + 
			+($quota_ratify_expanded_quota.val());
		$quota_allowTotal.val(sum);
	}

})();
