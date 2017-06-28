var deptInfoBache = (function () {

	/**
	 * cache DOM
	 */

	var $deptInfoForm = $('#form-deptInfo');
	var $deptInfoDescription = $deptInfoForm.find('#description');
	var $deptInfoEngDescription = $deptInfoForm.find('#engDescription');
	var $deptInfoBtn = $deptInfoForm.find('#btn-deptInfoSave, #btn-deptInfoCommit');

	var $deptFilterInput = $('#dept-filter-input');
	var $deptList = $('#dept-list');
	var $editDeptInfoBtn = $('.btn-editDeptInfo');
	var $editDeptInfoModal = $('#editDeptInfoModal');
	var $bachelorTotalPeople = $('#bachelorTotalPeople');
	var $bachelorPersonalApply = $('#bachelorPersonalApply');
	var $bachelorDistribution = $('#bachelorDistribution');
	var $addReviewItemBtn = $('#btn-addReviewItem');
	var $reviewItemsForm = $('#form-reviewItems');

	/**
	 * bind event
	 */

	$deptInfoBtn.on('click', _handleDeptInfoSaveOrCommit);

	$deptFilterInput.on('keyup', _filterDeptInput);
	$editDeptInfoBtn.on('click', _handleEditDeptInfo);
	$bachelorPersonalApply.on('keyup', _computeBachelorTotalPeople);
	$bachelorDistribution.on('keyup', _computeBachelorTotalPeople);
	$addReviewItemBtn.on('click', _addReviewItemRow);

	/**
	 * init
	 */

	_setData();

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

	function _computeBachelorTotalPeople() { // 「聯招人數（學士專用）」自動計算
		var totalPeople = Number($bachelorPersonalApply.val()) + Number($bachelorDistribution.val());
		$bachelorTotalPeople.val(totalPeople);
	}

	function _addReviewItemRow() { // 新增審查的項目
		var $newReviewItemRow = $(`
			<div class="row">
				<div class="form-group col-sm-4">
					<label for="">審查項目</label>

					<select class="form-control">
						<optgroup label="分類？">
							<option>畢業證書</option>
							<option>作品</option>
						</optgroup>
						<optgroup label="分類？">
							<option>其他</option>
						</optgroup>
					</select>
				</div>

				<div class="col-sm-8">
					<div class="form-check">
						<label class="form-check-label">
						<input type="checkbox" class="form-check-input">
						是否為必備
						</label>
					</div>
					<div class="form-group">
						<label for="">審查項目中文說明</label>
						<textarea class="form-control" rows="3"></textarea>
					</div>

					<div class="form-group">
						<label for="">審查項目英文說明</label>
						<textarea class="form-control" rows="3"></textarea>
					</div>
				</div>
			</div>
			<hr>`);
		$reviewItemsForm.append($newReviewItemRow);
	}

	function _handleDeptInfoSaveOrCommit() {
		var action = $(this).data('action');
		var data = {
			'action': action,
			'description': $deptInfoDescription.val(),
			'eng_description': $deptInfoEngDescription.val()
		}

		School.setSystemInfo('bachelor', data)
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
		School.getSystemInfo('bachelor')
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

})();

