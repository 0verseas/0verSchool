var quotaDistributionMaster = (function () {
	/**
	 * cacheDOM
	 */
	var $page = $('#pageContent');
	var $btn = $page.find('#btn-save, #btn-commit');
	var $lastEditionInfo = $page.find('#lastEditionInfo');

	//quota
	var $quota_allowTotal = $page.find('.quota.allowTotal'); // 本年度可招生總量
	var $quota_last_year_admission_amount = $page.find('.quota.last_year_admission_amount'); // 去年招生名額 * 10%
	var $quota_last_year_surplus_admission_quota = $page.find('.quota.last_year_surplus_admission_quota'); // 去年本地生招生缺額數*
	var $quota_ratify_expanded_quota = $page.find('.quota.ratify_expanded_quota'); // 本年度教育部核准擴增名額
	var $quota_used = $page.find('.quota.quota_used'); // 欲使用名額
	var $quota_passed = $page.find('.quota.quota_passed'); // 班別間流用
	var $quota_wantTotal = $page.find('.quota.wantTotal'); // 本年度欲招募總量
	var $quota_admissionSum = $page.find('.quota.admissionSum'); // 本年度聯招小計
	var $quota_selfSum = $page.find('.quota.graduated_self_enrollment_quota'); // 本年度自招小計

	// dept list
	var $deptList = $page.find('#table-masterPhdDeptList');
    var $allDept;
    var $schoolHasSelfEnrollment;

	/**
	 * bind event
	 */
	// 是否自招的 checkbox
	//$deptList.on('click.toggleSelf', '.dept .isSelf', _handleToggleCheck);
	// 填數字算總額
	$deptList.on('change.sumTotal', '.dept .editableQuota', _handleQuotaChange);
	// save/commit
	$btn.on('click', _handleSave);
	// 碩士班自招 change
    $quota_selfSum.on('change', _updateWantTotal);

	/**
	 * init
	 */
	// show master only
	$page.find('.masterOnly').removeClass('hide');
	$page.find('.hide .required').removeClass('required');
	_setData();

	function _handleToggleCheck() {
		var $this = $(this);
		var checked = $this.is(':checked');
		if (checked) {
			$this.parents('.dept')
				.find('.self_enrollment_quota')
				.attr('disabled', false)
				.addClass('required');
			_handleQuotaChange.call($this[0]);
		} else {
			$this.parents('.dept')
				.find('.self_enrollment_quota')
				.attr('disabled', true)
				.removeClass('required')
				.val(0);
			_handleQuotaChange.call($this[0]);
		}
	}

	function _handleQuotaChange() {
		var $this = $(this);
		var sum = 0;
		$this.parents('.dept').find('.editableQuota').each(function (i, input) {
			sum += +$(input).val() || 0;
		});
		$this.parents('.dept').find('.total').text(sum);

		// update sum admission_selection_quota / self_enrollment_quota
		var quotaType = $this.data('type');
		if (quotaType) {
			_updateQuotaSum(quotaType);
			_updateWantTotal();
		}
	}

	function _handleSave() {
		var $this = $(this);
		if (!_checkForm()) {
			return;
		}

		openLoading();

		var departments = $deptList.find('.dept').map(function (i, deptRow) {
			let $deptRow = $(deptRow);
			return {
				id: String($deptRow.data('id')),
                sort_order: +$deptRow.find('.order-num').val(),
				has_self_enrollment: $deptRow.find('.isSelf').is(':checked'),
				admission_selection_quota: +$deptRow.find('.admission_selection_quota').val(),
			};
		}).toArray();

		var data = {
			departments: departments,
            self_enrollment_quota: $quota_selfSum.val(),
		};

		$this.attr('disabled', true);
		School.setSystemQuota('master', data).then(function (res) {
			setTimeout(function () {
				$this.attr('disabled', false);
			}, 700);
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function (json) {
			alert('已儲存');
			location.reload();
		}).catch(function (err) {
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);

				stopLoading();
			})
		});
	}

	function _setData() {
		openLoading();

		School.getSystemQuota('master').then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function (json) {
            $allDept = json.departments;
            $schoolHasSelfEnrollment = json.school_has_self_enrollment;

			_renderData(json);

			if(json.review_at != null) {
				$('#btn-save').attr('disabled', true).text('已鎖定');
			}

            stopLoading();
		}).catch(function (err) {
			if (err.status === 404) {
				alert('沒有這個學制。 即將返回上一頁。');
				window.history.back();
			} else {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);

					stopLoading();
				});
			}
		});
	}

	function _checkForm() {
		var $inputs = $page.find('.required');
		var valid = true;
		for (let input of $inputs) {
			if (!$(input).val() || $(input).val() < 0) {
				$(input).focus();
				valid = false;
				alert('輸入有誤');
				break;
			}
		}
		// 本年度欲招募總量必須小於或等於可招生總量
		if (+$quota_wantTotal.val() > +$quota_allowTotal.val()) {
			valid = false;
			alert('各系所招生名額加總必須小於或等於可招生總量');
		}
		return valid;
	}

	function _renderData(json) {
		_setQuota(json);
		_setDeptList(json.departments, json.school_has_self_enrollment);
		_setEditor(json.creator, json.created_at);
		$page.find('#schoolHasSelf').text(json.school_has_self_enrollment ? '是' : '否');
	}

	function _setEditor(creator, created_at) {
		$lastEditionInfo.find('.who').text(creator ? creator.name : 'unknown');
		$lastEditionInfo.find('.when').text(moment(created_at).format('YYYY/MM/DD HH:mm:ss'));
	}

	function _setQuota(data) {
		var {
			last_year_admission_amount,
			last_year_surplus_admission_quota,
			ratify_expanded_quota,
            self_enrollment_quota,
			school_has_self_enrollment,
			quota_used,
			quota_passed
		} = data;
		$quota_last_year_admission_amount.val(last_year_admission_amount || 0);
		$quota_last_year_surplus_admission_quota.val(last_year_surplus_admission_quota || 0);
		$quota_ratify_expanded_quota.val(ratify_expanded_quota || 0);
		$quota_used.val(quota_used || 0);
		$quota_passed.val(quota_passed || 0);

        if (school_has_self_enrollment) {
            $quota_selfSum.val(self_enrollment_quota || 0);
        } else {
            $quota_selfSum.val(0);
            $quota_selfSum.attr('disabled', true);
        }

		_updateAllowTotal();
	}

	function _setDeptList(list, school_has_self_enrollment) {
        // 預設排序
        list.sort(function (a, b) {
            return a.sort_order - b.sort_order;
        });

		$deptList.find('tbody').html('');

		var count = 1;
		var sort_num;

		for (let dept of list) {
			var {
				id,
				sort_order,
				title,
				eng_title,
				admission_selection_quota,
				has_self_enrollment,
				self_enrollment_quota
			} = dept;
			var total = (+admission_selection_quota);

			if (school_has_self_enrollment && has_self_enrollment) {
				total += (+self_enrollment_quota);
			}

			if (sort_order !== count) {
                sort_num = count;
			} else {
                sort_num = sort_order;
			}

			let english_title = encodeHtmlCharacters(eng_title);

			$deptList
				.find('tbody')
				.append(`
					<tr class="dept" data-id="${id}">
						<td>
							<div class="input-group">
								<div class="input-group-prepend flex-column">
									<button type="button" data-orderNum="${sort_num}" class="btn btn-outline-secondary btn-sm up-arrow">
										<i class="fa fa-chevron-up" aria-hidden="true"></i>
									</button>
									<button type="button" data-orderNum="${sort_num}" class="btn btn-outline-secondary btn-sm down-arrow">
										<i class="fa fa-chevron-down" aria-hidden="true"></i>
									</button>
								</div>
								<input type="text" class="form-control order-num" size="3" value="${sort_num}">
							</div>
						</td>
						<td>${id}</td>
						<td>
							<div>${title}</div>
							<small>${english_title}</small>
						</td>
						<td><input type="number" min="0" class="form-control editableQuota required admission_selection_quota" data-type="admission_selection_quota" value="${+admission_selection_quota}" /></td>
						<td class="text-center"><input type="checkbox" class="isSelf" data-type="self_enrollment_quota" ${school_has_self_enrollment && has_self_enrollment ? 'checked' : ''} ${school_has_self_enrollment ? '' : 'disabled="disabled"'} ></td>
					</tr>
				`);

			count++;
		}
		_updateQuotaSum('admission_selection_quota');
		// _updateQuotaSum('self_enrollment_quota');
		_updateWantTotal();

        const $upArrow = $deptList.find('.up-arrow');
        const $downArrow = $deptList.find('.down-arrow');
        const $orderNum = $deptList.find('.order-num');

        $upArrow.on("click", _prevOrder);
        $downArrow.on("click", _nextOrder);
        $orderNum.on("change", _changeOrder);
	}

	function _updateQuotaSum(type) {
		var $ele = {
			admission_selection_quota: $quota_admissionSum,
			self_enrollment_quota: $quota_selfSum
		};
		var sum = 0;

		$deptList.find('.dept').each(function (i, deptRow) {
			if (type === "admission_selection_quota") {
                sum += +$(deptRow).find(`.${type}`).val();
            }
		});

		$ele[type].val(sum);
	}

	function _updateAllowTotal() {
		//var sum = +($quota_last_year_admission_amount.val()) +
		var sum = +($quota_used.val()) +
			+($quota_passed.val())+
			+($quota_last_year_surplus_admission_quota.val()) +
			+($quota_ratify_expanded_quota.val());
		$quota_allowTotal.val(sum);
	}

	function _updateWantTotal() {
		var sum = +($quota_admissionSum.val()) +
			+($quota_selfSum.val());
		$quota_wantTotal.val(sum);
	}

    function _prevOrder() { //系所排序上移
        const deptId = $(this).parents(".dept").data("id");
        const movedDept = $allDept.find(function(element) {
            return element.id === deptId.toString();
        });

        if (movedDept.sort_order > 1 && movedDept.sort_order <= $allDept.length + 1) {
            const targetOrder = movedDept.sort_order - 1;

            const changedDept = $allDept.find(function (element) {
                return element.sort_order === targetOrder;
            });

            movedDept.sort_order = targetOrder;

            if (changedDept) {
                changedDept.sort_order += 1;
            }

            _setDeptList($allDept, $schoolHasSelfEnrollment);
        }
    }

    function _nextOrder() { //系所排序下移
        const deptId = $(this).parents(".dept").data("id");
        const movedDept = $allDept.find(function(element) {
            return element.id === deptId.toString();
        });

        if (movedDept.sort_order >= 1 && movedDept.sort_order <= $allDept.length) {
            const targetOrder = movedDept.sort_order + 1;

            const changedDept = $allDept.find(function (element) {
                return element.sort_order === targetOrder;
            });

            movedDept.sort_order = targetOrder;

            if (changedDept) {
                changedDept.sort_order -= 1;
            }

            _setDeptList($allDept, $schoolHasSelfEnrollment);
        }
    }

    function _changeOrder() { // 修改排序數字
        const deptId = $(this).parents(".dept").data("id");
        const movedDept = $allDept.find(function(element) {
            return element.id === deptId.toString();
        });

        const origin_sort_order = movedDept.sort_order;

        let currentNum = +$(this).val();

        if (currentNum > $allDept.length || !Number.isInteger(currentNum)) {
            currentNum = $allDept.length;
        } else if (currentNum < 1) {
            currentNum = 1;
        } else {
            currentNum = parseInt(currentNum);
        }

        const changedDept = $allDept.find(function (element) {
            return element.sort_order === currentNum;
        });

        if (changedDept) {
            for (let dept of $allDept) {
                if (dept.id === movedDept.id) {
                    dept.sort_order = currentNum;
                } else {
                    if (origin_sort_order - currentNum > 0) { //排序由後往前移
                        if (dept.sort_order >= currentNum && dept.sort_order < origin_sort_order) {
                            dept.sort_order++;
                        }
                    } else {
                        if (dept.sort_order > origin_sort_order && dept.sort_order <= currentNum) {
                            dept.sort_order--;
                        }
                    }
                }
            }
        } else {
            movedDept.sort_order = currentNum;
        }

        _setDeptList($allDept, $schoolHasSelfEnrollment);
    }

	// 轉換一些敏感字元避免 XSS
	function encodeHtmlCharacters(bareString) {
		return bareString.replace(/&/g, "&amp;")  // 轉換 &
			.replace(/</g, "&lt;").replace(/>/g, "&gt;")  // 轉換 < 及 >
			.replace(/'/g, "&apos;").replace(/"/g, "&quot;")  // 轉換英文的單雙引號
			.replace(/ /g, " &nbsp;")
			;
	}

})();
