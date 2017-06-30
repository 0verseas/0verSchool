var deptInfoBache = (function () {

	/**
	 * cache DOM
	 */

	var $deptInfoForm = $('#form-deptInfo'); // 學制資訊
	var $saveDeptDescriptionBtn = $deptInfoForm.find('#btn-deptInfoSave'); // 學制資訊儲存｜送出按鈕

	var $editDeptInfoBtn; // 系所列表每項資料的編輯按鈕，資料取回後再綁定 event
	var $editDeptInfoModal = $('#editDeptInfoModal'); // 系所列表每項資料的編輯框
	
	var $bachelorTotalPeople = $('#bachelorTotalPeople');
	var $bachelorPersonalApply = $('#bachelorPersonalApply');
	var $bachelorDistribution = $('#bachelorDistribution');
	var $addReviewItemBtn = $('#btn-addReviewItem');
	var $reviewItemsForm = $('#form-reviewItems');

	/**
	 * bind event
	 */

	$saveDeptDescriptionBtn.on('click', _saveDeptDescription); // 儲存｜送出學制資料

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

	function _saveDeptDescription() {
		DeptInfo.saveDeptDescription('bachelor');
	}

	function _handleEditDeptInfo() { // 系所列表 Modal 觸發
		console.log($(this).data('deptid'));
		$editDeptInfoModal.modal();
	}

	function _setData() {
		School.getSystemInfo('bachelor')
		.then((res) => {
			if(res.ok) {
				return res.json();
			} else {
				throw res;
			}
		}).then((json) => {
			DeptInfo.renderDescription(json);
			DeptInfo.renderDeptList(json.departments);
		}).then(() => {
			$.bootstrapSortable(true);
			$editDeptInfoBtn = $('.btn-editDeptInfo'); // 系所列表每項資料的編輯按鈕
			$editDeptInfoBtn.on('click', _handleEditDeptInfo); // 打開 Modal
		})
		.catch((err) => {
			console.error(err);
		})

		var item = School.getDeptFormItem('bachelor')

		item.then(res => { return res[0].json(); }) // 學群
		.then(json => { console.log(json); })

		item.then(res => { return res[1].json(); }) // 評鑑等級
		.then(json => { console.log(json); })

		item.then(res => { return res[2].json(); }) // 審查項目類別
		.then(json => { console.log(json); })
	}

})();
