var deptInfoTwoYear = (function () {
	/**
	 * cache DOM
	 */
	var $deptInfoForm = $('#form-deptInfo');
	var $deptInfoDescription = $deptInfoForm.find('#description');
	var $deptInfoEngDescription = $deptInfoForm.find('#engDescription');
	var $deptInfoBtn = $deptInfoForm.find('#btn-deptInfoSave, #btn-deptInfoCommit');

	/**
	 * bind event
	 */
	$deptInfoBtn.on('click', _handleDeptInfoSaveOrCommit);

	/**
	 * init
	 */

	_setData();

	function _setData() {
		School.getSystemInfo('twoYear')
		.then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function (json) {
			$deptInfoDescription.text(json.description);
			$deptInfoEngDescription.text(json.eng_description);
		}).catch(function (err) {
			console.error(err);
		})
	}

	function _handleDeptInfoSaveOrCommit() {
		var action = $(this).data('action');
		var data = {
			'action': action,
			'description': $deptInfoDescription.val(),
			'eng_description': $deptInfoEngDescription.val()
		}

		School.setSystemInfo('twoYear', data)
		.then(function (res) {
			if(res.ok) {
				alert('儲存成功')
				return res.json();
			} else {
				alert('儲存失敗')
				throw res
			}
		}).then(function (json) {
			console.log(json);
		}).catch(function (err) {
			console.error(err);
		});
	}
})();
