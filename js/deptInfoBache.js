var deptInfoBache = (function () {
	/**
	 * cache DOM
	 */

	$deptFilterInput = $('#dept-filter-input');
	$deptList = $('#dept-list');
	$editDeptInfoBtn = $('.btn-editDeptInfo');
	$editDeptInfoModal = $('#editDeptInfoModal');
	$bachelorTotalPeople = $('#bachelorTotalPeople');
	$bachelorPersonalApply = $('#bachelorPersonalApply');
	$bachelorDistribution = $('#bachelorDistribution');
	$addReviewItemBtn = $('#btn-addReviewItem');
	$reviewItemsForm = $('#form-reviewItems');

	/**
	 * bind event
	 */

	$deptFilterInput.on('keyup', _filterDeptInput);
	$editDeptInfoBtn.on('click', _handleEditDeptInfo);
	$bachelorPersonalApply.on('keyup', _computeBachelorTotalPeople);
	$bachelorDistribution.on('keyup', _computeBachelorTotalPeople);
	$addReviewItemBtn.on('click', _addReviewItemRow);

	function _filterDeptInput(e) {
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

	function _handleEditDeptInfo() {
		$editDeptInfoModal.modal();
	}

	function _computeBachelorTotalPeople() {
		var totalPeople = Number($bachelorPersonalApply.val()) + Number($bachelorDistribution.val());
		$bachelorTotalPeople.val(totalPeople);
	}

	function _addReviewItemRow() {
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

})();

