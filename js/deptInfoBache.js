var Sidebar = (function () {
	/**
	 * cache DOM
	 */

	$deptFilterInput = $('#dept-filter-input');
	$deptList = $('#dept-list');

	/**
	 * bind event
	 */

	$deptFilterInput.on('keyup', _filterDeptInput);

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

})();

