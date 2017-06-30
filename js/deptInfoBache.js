var deptInfoBache = (function () {

	/**
	 * cache DOM
	 */

	var $bachelorTotalPeople = $('#bachelorTotalPeople');
	var $bachelorPersonalApply = $('#bachelorPersonalApply');
	var $bachelorDistribution = $('#bachelorDistribution');
	var $addReviewItemBtn = $('#btn-addReviewItem');
	var $reviewItemsForm = $('#form-reviewItems');

	/**
	 * bind event
	 */

	$bachelorPersonalApply.on('keyup', _computeBachelorTotalPeople);
	$bachelorDistribution.on('keyup', _computeBachelorTotalPeople);
	$addReviewItemBtn.on('click', _addReviewItemRow);

	/**
	 * init
	 */

	_setData();

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
		deptInfo.setData('bachelor');
	}

})();
