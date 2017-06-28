var deptInfoMaster = (function () {
	/**
	 * cache DOM
	 */
	var $deptInfoForm = $('#form-deptInfo');
	var $deptInfoDescription = $deptInfoForm.find('#description');
	var $deptInfoEngDescription = $deptInfoForm.find('#engDescription');
	var $deptInfoBtn = $deptInfoForm.find('#btn-deptInfoSave, #btn-deptInfoCommit');

	var $deptList = $('#dept-list');

	/**
	 * bind event
	 */
	$deptInfoBtn.on('click', _handleDeptInfoSaveOrCommit);

	/**
	 * init
	 */

	_setData();

	function _setDeptList(departments) {
		// 預設排序
		departments.sort(function (a, b) {
		  return a.sort_order - b.sort_order;
		});

		// 狀態名稱對應中文
		var infoStatus = {
			editing: '編輯中',
			returned: '退回',
			confirmed: '通過',
			waiting: '待審閱'
		}

		// 列表初始化
		$deptList.find('tbody').html('');
		departments.forEach(function (value, index) {
			var updateAt = moment(value.creator.updated_at);
			$deptList
				.find('tbody')
				.append(`
					<tr>
						<td><span class="btn-editDeptInfo"><i class="fa fa-pencil" aria-hidden="true"></i></span></td>
						<td>${index}</td>
						<td>${value.id}</td>
						<td>
							<div>${value.title}</div>
							<div>${value.eng_title}</div>
						</td>
						<td>${infoStatus[value.info_status]}</td>
						<td>${value.creator.name}</td>
						<td>${updateAt.format('M月D日 H:m:s (YYYY)')}</td>
					</tr>
				`);
		});
	}

	function _setData() {
		School.getSystemInfo('master')
		.then((res) => {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then((json) => {
			$deptInfoDescription.text(json.description);
			$deptInfoEngDescription.text(json.eng_description);
			_setDeptList(json.departments);
		}).then(() => {
			$.bootstrapSortable(true);
		})
		.catch((err) => {
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

		School.setSystemInfo('master', data)
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
