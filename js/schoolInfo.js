var schoolInfo = (function () {

	/**
	 * cache DOM
	 */

	// 審閱建議
	$reviewInfo = $('#reviewInfo');
	$reviewBy = $reviewInfo.find('#reviewBy');
	$reviewAt = $reviewInfo.find('#reviewAt');
	$reviewMemo = $reviewInfo.find('#reviewMemo');

	/**
	 * bind event
	 */



	function _placedReviewInfo(schoolData) {
		// 狀態為 `editing` 以及有被審閱過，則顯示審閱建議
		// 狀態為 `confirmed`(通過) 、 `waiting`(已 commit 待檢驗) 則不須顯示審閱建議
		if (schoolData.info_status === "editing" && schoolData.review_by !== null) {
			$reviewInfo.show("slow");
			$reviewBy.val(schoolData.review_by);
			$reviewAt.text(schoolData.review_at);
			$reviewMemo.text(schoolData.review_memo);
		}
	}

	function _placedSchoolInfoData(schoolData) {
		// 學校資料
	}

	function _getSchoolData() {
		fetch('https://api.overseas.ncnu.edu.tw/schools/me/histories/latest', {
			credentials: 'include'
		}).then(function(res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function(json) {
			_placedReviewInfo(json);
			_placedSchoolInfoData(json);
		}).catch(function(err) {
			alert("您沒有權限。");
			window.location.href = '/school/'
		})
	}

	return _getSchoolData();

})();
