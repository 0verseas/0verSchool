var DeptInfo = (function () {

	// 此為 deptInfoBache, deptInfoTwoYear, deptInfoMaster, deptInfoPhd 共同引入的檔案
	// 內容為各系所資訊 API

	var _applicationDocumentTypes;

	/**
	 * cache DOM
	 */

	var $deptInfoForm = $('#form-deptInfo'); // 學制資訊
	var $deptInfoDescription = $deptInfoForm.find('#description'); // 中文備註
	var $deptInfoEngDescription = $deptInfoForm.find('#engDescription'); // 英文備註
	
	var $deptList = $('#dept-list'); // 系所列表
	var $deptFilterInput = $('#dept-filter-input'); // 搜尋欄

	var $modalDeptInfo = $('#modal-deptInfo');
	var $mainGroup = $modalDeptInfo.find('#mainGroup');
	var $subGroup = $modalDeptInfo.find('#subGroup');
	var $evaluation = $modalDeptInfo.find('#evaluation');

	/**
	 * bind event
	 */

	$deptFilterInput.on('keyup', _filterDeptInput); // 系所列表篩選

	/**
	 * events
	 */

	function renderDescription(json) { // 渲染備註欄
		$deptInfoDescription.text(json.description);
		$deptInfoEngDescription.text(json.eng_description);
	}

	function saveDeptDescription(system) { // Description 儲存｜送出
		var data = {
			'action': 'save',
			'description': $deptInfoDescription.val(),
			'eng_description': $deptInfoEngDescription.val()
		}

		School.setSystemInfo(system, data)
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
			location.reload();
		}).catch(function (err) {
			console.error(err);
		});
	}

	function renderDeptList(departments) { // 系所列表渲染
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
						<td>
							<span class="btn-editDeptInfo" data-deptid="${value.id}"><i class="fa fa-pencil" aria-hidden="true"></i></span>
						</td>
						<td>${value.sort_order}</td>
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

	function _filterDeptInput(e) { // 「系所列表」搜尋過濾列表
		let filter = $deptFilterInput.val().toUpperCase();
		var tr = $deptList.find('tr');

		for (i = 0; i < tr.length; i++) {
			let code = tr[i].getElementsByTagName("td")[2]; // 代碼
			let name = tr[i].getElementsByTagName("td")[3]; // 名稱

			if (code || name) {
				if (code.innerHTML.toUpperCase().indexOf(filter) > -1 || name.innerHTML.toUpperCase().indexOf(filter) > -1) {
					tr[i].style.display = "";
				} else {
					tr[i].style.display = "none";
				}
			} 
		}
	}

	function renderDeptselect(system) {
		var item = School.getDeptFormItem(system) // 產生系所詳細資料 Modal 中下拉式選單

		item.then(res => { return res[0].json(); }) // 學群
		.then(json => {
			// 列表初始化
			$mainGroup.html('');
			$subGroup.html('');
			json.forEach((value, index) => {
				$mainGroup
					.append(`
						<option value="${value.id}">${value.title}</option>
					`);
				$subGroup
					.append(`
						<option value="${value.id}">${value.title}</option>
					`);
			});
		})

		item.then(res => { return res[1].json(); }) // 評鑑等級
		.then(json => {
			$evaluation.html('');
			json.forEach((value, index) => {
				$evaluation
					.append(`
						<option value="${value.id}">${value.title}</option>
					`);
			});
		})

		item.then(res => { return res[2].json(); }) // 審查項目類別
		.then(json => {
			_applicationDocumentTypes = json;
		})
	}

	return {
		renderDescription,
		saveDeptDescription,
		renderDeptList,
		renderDeptselect
	}

})();
