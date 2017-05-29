var quotaDistirbutionTwoYear = (function () {
	/**
	 * cacheDOM
	 */
	var $page = $('#pageContent');

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
		School.getSystemQuota('two_year').then(function (res) {
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

	function _setQuota() {

	}

	function _setDeptList() {

	}

	function _setStatue() {
		
	}

})();
