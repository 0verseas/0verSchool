var deptInfoBache = (function () {

	/**
	 * cache DOM
	 */

	var $deptInfoForm = $('#form-deptInfo');
	var $deptInfoDescription = $deptInfoForm.find('#description');
	var $deptInfoEngDescription = $deptInfoForm.find('#engDescription');
	var $deptInfoSaveBtn = $deptInfoForm.find('#btn-deptInfoSave');
	var $deptInfoCommitBtn = $deptInfoForm.find('#btn-deptInfocommit');

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

	function _setData() {
		School.getSystemInfo('bachelor').then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function (json) {
			console.log(json);
			$deptInfoDescription.text(json.description);
			$deptInfoEngDescription.text(json.eng_description);
		}).catch(function (err) {
			console.error(err);
		})
	}

})();

