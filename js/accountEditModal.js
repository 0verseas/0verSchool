var accountEditModal;
$(document).ready(function () {
	accountEditModal = (function () {
		/**
		 * cache DOM
		 */
		var $modal = $('#modal-editAccount');

		function open() {
			$modal.modal();
		}

		return {
			open
		}

	})();
});
