var quotaDistirbutionBache = (function () {
	/**
	 * cacheDOM
	 */
	var $page = $('#pageContent');
	var $statusBadge = $page.find('#badge-status');

	// dept list
	var $deptList = $page.find('#table-bacheDeptList');

	/**
	 * bind event
	 */
	// 是否自招的 checkbox
	$deptList.on('click.toggleSelf', '.dept .isSelf', _handleToggleCheck);
	
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
		} else {
			$this.parents('.dept')
				.find('.self_enrollment_quota')
				.attr('disabled', true)
				.removeClass('required')
				.val(0);
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
				break;
			case 'confirmed':
				break;
			case 'editing':
				$statusBadge.addClass('badge-danger').text('編輯中');
				break;
		}
	}

	function _setQuota() {

	}

	function _setDeptList() {

	}

})();
