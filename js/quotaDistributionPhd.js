var quotaDistributionPhd = (function () {
	/**
	 * cacheDOM
	 */
	var $page = $('#pageContent');
	var $btn = $page.find('#btn-save, #btn-commit');
	var $lastEditionInfo = $page.find('#lastEditionInfo');

	//quota
	var $quota_allowTotal = $page.find('.quota.allowTotal'); // 本年度可招生總量
	var $quota_used = $page.find('.quota.quota_used'); // 欲使用名額
	var $quota_wantTotal = $page.find('.quota.wantTotal'); // 本年度欲招募總量
	var $quota_admissionSum = $page.find('.quota.admissionSum'); // 本年度聯招小計
	const $quota_selfSum = $page.find('.quota.selfSum'); // 本年度自招小計

	const $ratify_quota_for_main_industries_department = $page.find('.ratify_quota_for_main_industries_department');

	const $general_department_admission_selection_quota = $page.find('.general_department_admission_selection_quota');
	const $general_department_self_enrollment_quota = $page.find('.general_department_self_enrollment_quota');
	const $general_department_sum = $page.find('.general_department_sum');

	const $main_industries_department_admission_selection_quota = $page.find('.main_industries_department_admission_selection_quota');
	const $main_industries_department_self_enrollment_quota = $page.find('.main_industries_department_self_enrollment_quota');
	const $main_industries_department_sum = $page.find('.main_industries_department_sum');

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
    // 博士班自招 change
    $general_department_self_enrollment_quota.on('change', _handleGeneralDepartmentSelfChanged);
	$main_industries_department_self_enrollment_quota.on('change', _handleMainIndustriesDepartmentSelfChanged);

    /**
	 * init
	 */
	if(env.stage == 1){
			location.href = "./systemQuota.html";
	}
	// show phd only
	$page.find('.phdOnly').removeClass('hide');
	$page.find('.hide .required').removeClass('required');
	// 對部份物件做初始化調整
	$('.add_system_text').each(function (index){
		$(this).text('博士班'+$(this).text());
	});
	$page.find("small").each(function (index){
		$(this).html($(this).html().replace('一般系所',`<a class="font-weight-bold" style="color:#808080;">一般系所</a>`));
		$(this).html($(this).html().replace('重點產業系所',`<a class="font-weight-bold" style="color:#8035E4;">重點產業系所</a>`));
	});
	$general_department_self_enrollment_quota.attr('disabled',false).get(0).type = 'number';
	$main_industries_department_self_enrollment_quota.attr('disabled',false).get(0).type = 'number';

	_setData();

	function _handleGeneralDepartmentSelfChanged() {
		$general_department_sum.val(
			+$general_department_admission_selection_quota.val() +
			+$general_department_self_enrollment_quota.val()
		);

		_handleSelfChanged();
	}

	function _handleMainIndustriesDepartmentSelfChanged() {
		$main_industries_department_sum.val(
			+$main_industries_department_admission_selection_quota.val() +
			+$main_industries_department_self_enrollment_quota.val()
		);

		_handleSelfChanged();
	}

	function _handleSelfChanged() {
		$quota_selfSum.val(
			+$general_department_self_enrollment_quota.val() +
			+$main_industries_department_self_enrollment_quota.val()
		);
        _updateWantTotal();
    }

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

		const deptType = $this.parents('.dept').data('type');
		// update sum admission_selection_quota / self_enrollment_quota
		var quotaType = $this.data('type');
		if (quotaType) {
			_updateDepartmentQuotaSum(deptType);
			_updateQuotaSum(quotaType);
			_updateTypeDepartmentTotal(deptType);
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
				is_extended_department: $deptRow.data('type'),
			};
		}).toArray();

		var data = {
			departments: departments,
            self_enrollment_quota: $quota_selfSum.val(),
			general_department_self_enrollment_quota: +$general_department_self_enrollment_quota.val(),
			main_industries_department_self_enrollment_quota: +$main_industries_department_self_enrollment_quota.val(),
		};

		$this.attr('disabled', true);
		School.setSystemQuota('phd', data).then(function (res) {
			setTimeout(function () {
				$this.attr('disabled', false);
			}, 700);
			if(res.ok) {
				return res.json();
			} else {
				throw res;
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

		School.getSystemQuota('phd').then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function (json) {
            $allDept = json.departments;
            $schoolHasSelfEnrollment = json.school_has_self_enrollment;

			if(!$schoolHasSelfEnrollment){
				$general_department_self_enrollment_quota.attr('disabled',true).get(0).type = 'text';
				$main_industries_department_self_enrollment_quota.attr('disabled',true).get(0).type = 'text';
			}

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
		// 本年度主要產業系所欲招募總量必須大於等於教育部核定擴增招收名額
		if (+$ratify_quota_for_main_industries_department.val() > +$main_industries_department_sum.val()) {
			valid = false;
			alert('主要產業系所欲招募總量必須大於等於重點產業系所招生名額');
		}
		// 本年度欲招募總量必須小於等於可招生總量
		if (+$quota_wantTotal.val() > +$quota_allowTotal.val()) {
			valid = false;
			alert('各系所招生名額加總必須小於等於可招生總量');
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
		$lastEditionInfo.find('.when').text(moment(created_at).format('YYYY/MM/DD hh:mm:ss a'));
	}

	function _setQuota(data) {
		const {
			last_year_admission_amount,
			last_year_surplus_admission_quota,
			ratify_expanded_quota,
			ratify_quota_for_main_industries_department,
            self_enrollment_quota,
			school_has_self_enrollment,
			quota_used,
			quota_passed,
			main_industries_department_self_enrollment_quota,
			general_department_self_enrollment_quota,
		} = data;
		let sum = 0;
		sum += +last_year_surplus_admission_quota;
		sum += +ratify_expanded_quota;
		sum += +quota_used;
		sum += +quota_passed;
		sum -= +ratify_quota_for_main_industries_department;
		$quota_used.val(sum);
		$ratify_quota_for_main_industries_department.val(ratify_quota_for_main_industries_department || 0);
		$general_department_self_enrollment_quota.val(general_department_self_enrollment_quota || 0);
		$main_industries_department_self_enrollment_quota.val(main_industries_department_self_enrollment_quota || 0);

		if (school_has_self_enrollment) {
            $quota_selfSum.val(self_enrollment_quota || 0);
        } else {
            $quota_selfSum.val(0);
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
				self_enrollment_quota,
				moe_check_failed,
				teacher_quality_passed,
				is_extended_department
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

			let department_title = encodeHtmlCharacters(title);
			let english_title = encodeHtmlCharacters(eng_title);

			if(is_extended_department == 1){
				department_title = department_title+'&nbsp;&nbsp;<span class="badge badge-warning">重點產業系所</span>';
			}
			if(is_extended_department == 2){
				department_title = department_title+'&nbsp;&nbsp;<span class="badge badge-warning">國際專修部</span>';
			}

			$deptList
			.find('tbody')
			.append(`
				<tr class="dept" data-id="${id}" data-type="${is_extended_department}">
					<td>
						<div class="input-group">
							<div class="btn-group-vertical">
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
						<div>${department_title}</div>
						<small>${english_title}</small>
					</td>
					<td><input type="number" min="0" class="form-control editableQuota required admission_selection_quota" data-type="admission_selection_quota" value="${+admission_selection_quota}" ${(teacher_quality_passed && !moe_check_failed) ? '' : 'disabled'} /></td>
					<td class="text-center"><input type="checkbox" class="isSelf" data-type="self_enrollment_quota" ${school_has_self_enrollment && has_self_enrollment ? 'checked' : ''} ${school_has_self_enrollment ? '' : 'disabled="disabled"'} ></td>
				</tr>
			`);

            count++;
		}
		_updateQuotaSum('admission_selection_quota');
		_updateDepartmentQuotaSum(0);
		_updateDepartmentQuotaSum(1);
		// _updateQuotaSum('self_enrollment_quota');
		_updateWantTotal();
		_updateTypeDepartmentTotal(0);
		_updateTypeDepartmentTotal(1);

		if($('.table-graduate').height() >= 800){
			$('.table-graduate').height(800);
		}

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
		let sum = +($quota_used.val()) +
			+($ratify_quota_for_main_industries_department.val());
		$quota_allowTotal.val(sum);
	}

	function _updateWantTotal() {
		var sum = +($quota_admissionSum.val()) +
			+($quota_selfSum.val());
		$quota_wantTotal.val(sum);
	}

	function _updateDepartmentQuotaSum(type){
		let sum = 0;
		$deptList.find('.dept').each(function (i, deptRow) {
			let $deptRow = $(deptRow);
			if($deptRow.data('type') == type){
				sum += +$deptRow.find(`.admission_selection_quota`).val();
			}
		});

		switch(type){
			case 0:
				$general_department_admission_selection_quota.val(sum);
				break;
			case 1:
				$main_industries_department_admission_selection_quota.val(sum);
				break;
		}
	}

	function _updateTypeDepartmentTotal(type) {
		switch(type){
			case 0:
				$general_department_sum.val(
					+$general_department_admission_selection_quota.val() +
					+$general_department_self_enrollment_quota.val()
				);
				break;
			case 1:
				$main_industries_department_sum.val(
					+$main_industries_department_admission_selection_quota.val() +
					+$main_industries_department_self_enrollment_quota.val()
				)
				break;	
		}			
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
            currentNum = $allDept.length + 1;
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
		if (bareString === null) return '';
		return bareString.replace(/&/g, "&amp;")  // 轉換 &
			.replace(/</g, "&lt;").replace(/>/g, "&gt;")  // 轉換 < 及 >
			.replace(/'/g, "&apos;").replace(/"/g, "&quot;")  // 轉換英文的單雙引號
			.replace(/ /g, " &nbsp;")
			;
	}

})();

