var quotaDistirbutionBache = (function () {
	/**
	 * cacheDOM
	 */
	var $page = $('#pageContent');
	var $statusBadge = $page.find('#badge-status');

	/**
	 * bind event
	 */
	
	/**
	 * init
	 */
	// show bache only
	$page.find('.bacheOnly').removeClass('hide');
	_setData();

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
