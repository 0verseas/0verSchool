var deptInfo = (function () {

	// 此為 deptInfoBache, deptInfoTwoYear, deptInfoMaster, deptInfoPhd 共同引入的檔案
	// 包含：
	// 1. 各學制學制資料備註呈現、儲存，以及系所列表呈現、排序、搜尋
	// 2. 各系所詳細資訊 API

	var $currentSystem = '';

	/**
	 * cache DOM
	 */

	var $deptInfoForm = $('#form-deptInfo'); // 學制資訊
	var $deptInfoDescription = $deptInfoForm.find('#description'); // 中文備註
	var $deptInfoEngDescription = $deptInfoForm.find('#engDescription'); // 英文備註
	var $deptInfoBtn = $deptInfoForm.find('#btn-deptInfoSave, #btn-deptInfoCommit'); // 學制資訊儲存｜送出按鈕

	var $deptList = $('#dept-list'); // 系所列表
	var $deptFilterInput = $('#dept-filter-input'); // 搜尋欄
	var $editDeptInfoBtn; // 系所列表每項資料的編輯按鈕，資料取回後再綁定 event
	var $editDeptInfoModal = $('#editDeptInfoModal'); // 系所列表每項資料的編輯框

	/**
	 * bind event
	 */

	$deptInfoBtn.on('click', _handleDeptInfoSaveOrCommit); // 儲存｜送出學制資料
	$deptFilterInput.on('keyup', _filterDeptInput); // 系所列表篩選

	/**
	 * events
	 */

	function _renderDescription(json) { // 渲染備註欄
		$deptInfoDescription.text(json.description);
		$deptInfoEngDescription.text(json.eng_description);
	}

	function _handleDeptInfoSaveOrCommit() { // Description 儲存｜送出
		var action = $(this).data('action');
		var data = {
			'action': action,
			'description': $deptInfoDescription.val(),
			'eng_description': $deptInfoEngDescription.val()
		}

		School.setSystemInfo($currentSystem, data)
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

	function _renderDeptList(departments) { // 系所列表渲染
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
							<span class="btn-editDeptInfo"><i class="fa fa-pencil" aria-hidden="true"></i></span>
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
	
	function _handleEditDeptInfo() { // 系所列表 Modal 觸發
		$editDeptInfoModal.modal();
	}

	function setData(system) { // init page
		School.getSystemInfo(system)
		.then((res) => {
			if(res.ok) {
				$currentSystem = system;
				return res.json();
			} else {
				throw res
			}
		}).then((json) => {
			_renderDescription(json);
			_renderDeptList(json.departments);
		}).then(() => {
			$.bootstrapSortable(true);
			$editDeptInfoBtn = $('.btn-editDeptInfo'); // 系所列表每項資料的編輯按鈕
			$editDeptInfoBtn.on('click', _handleEditDeptInfo); // 打開 Modal
		})
		.catch((err) => {
			console.error(err);
		})
	}

	return {
		setData
	}

})();
