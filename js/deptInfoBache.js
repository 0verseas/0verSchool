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

	/**
	 * bind event
	 */

	$deptFilterInput.on('keyup', _filterDeptInput);
	$editDeptInfoBtn.on('click', _handleEditDeptInfo);
	$bachelorPersonalApply.on('keyup', _computeBachelorTotalPeople);
	$bachelorDistribution.on('keyup', _computeBachelorTotalPeople);

	function _filterDeptInput(e){
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

	function _handleEditDeptInfo(){
		$editDeptInfoModal.modal();
	}

	function _computeBachelorTotalPeople() {
		var totalPeople = Number($bachelorPersonalApply.val()) + Number($bachelorDistribution.val());
		$bachelorTotalPeople.val(totalPeople);
	}

})();

