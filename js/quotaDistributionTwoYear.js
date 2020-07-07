var quotaDistirbutionTwoYear = (function () {
	/**
	 * cacheDOM
	 */
	var $page = $('#pageContent');
	var $btn = $page.find('#btn-save, #btn-commit');
	var $lastEditionInfo = $page.find('#lastEditionInfo');
    var baseUrl = env.baseUrl;

	//quota
	var $quota_allowTotal = $page.find('.quota.allowTotal'); // 本年度可招生總量
	var $quota_last_year_admission_amount = $page.find('.quota.last_year_admission_amount'); // 去年招生名額 * 10%
	var $quota_last_year_surplus_admission_quota = $page.find('.quota.last_year_surplus_admission_quota'); // 去年本地生招生缺額數*
	var $quota_ratify_expanded_quota = $page.find('.quota.ratify_expanded_quota'); // 本年度教育部核准擴增名額
	var $quota_used = $page.find('.quota.quota_used'); // 欲使用名額
	var $quota_passed = $page.find('.quota.quota_passed'); // 班別間流用
	var $quota_another_department_admission_selection_quota = $page.find('.quota.another_department_admission_selection_quota'); // 學士班個人申請
	var $quota_another_department_admission_placement_quota = $page.find('.quota.another_department_admission_placement_quota'); // 學士班聯合分發
	var $quota_admission_selection_quota = $page.find('.quota.admission_selection_quota'); // 港二技個人申請
	var $quota_another_department_self_enrollment_quota = $page.find('.quota.another_department_self_enrollment_quota.twoyear'); // 學士班自招
	var $quota_self_enrollment_quota = $page.find('.quota.self_enrollment_quota.twoyear'); // 港二技自招
	var $quota_wantTotal = $page.find('.quota.wantTotal'); // 本年度欲招募總量
	var $quota_admissionSum = $page.find('.quota.admissionSum'); // 本年度聯招小計
	var $quota_selfSum = $page.find('.quota.selfSum'); // 本年度自招小計

	// dept list
	var $deptList = $page.find('#table-twoYearDeptList');
    var $allDept;
    var $schoolHasSelfEnrollment;
	/**
	 * bind event
	 */
    // 港二技自招 change
    $quota_self_enrollment_quota.on('change', _handleSelfChanged);
    // 學士班自招 change
    $quota_another_department_self_enrollment_quota.on('change', _handleSelfChanged);
	// 填數字算總額
	$deptList.on('change.sumTotal', '.dept .editableQuota', _handleQuotaChange);
    // hasRiJian 聯動
    $deptList.on('change', '.dept .hasRiJian', _switchHasRiJian);
    // hasSpecialClass 聯動
    $deptList.on('change', '.dept .hasSpecialClass', _switchHasSpecialClass);
    // 檔案轉 base64
    $deptList.on('change', '.dept .approvalDocOfSpecialClass', _handleFiletoB64);
	// save/commit
	$btn.on('click', _handleSave);

	/**
	 * init
	 */
	// show bache only
	$page.find('.twoYearOnly').removeClass('hide');
	$page.find('.hide .required').removeClass('required');
	_setData();

    function _handleSelfChanged() {
        _updateAdmissionSumSelfSum();
        _updateWantTotal();
    }

	function _handleQuotaChange() {
		var $this = $(this);
		var sum = 0;
		$this.parents('.dept').find('.editableQuota').each(function (i, input) {
			sum += +$(input).val() || 0;
		});
		$this.parents('.dept').find('.total').text(sum);

		// update sum admission_selection_quota / admission_placement_quota / self_enrollment_quota
		var quotaType = $this.data('type');
		if (quotaType) {
			_updateQuotaSum(quotaType);
			_updateAdmissionSumSelfSum();
			_updateWantTotal();
		}
	}

	function _handleFiletoB64() {
        var $this = $(this);
        var $approvalDocOfSpecialClass = $this.parents('.dept').find('.approvalDocOfSpecialClass');

        if ($approvalDocOfSpecialClass.prop('files').length > 0) {
            var reader = new FileReader();

            reader.readAsDataURL($approvalDocOfSpecialClass.prop('files')[0]);

            reader.onload = function (e) {
                $this.parents('.dept').find('.approvalDocOfSpecialClassfileb64').val(e.target.result);
            }
        }
	}

	function _handleSave() {
		var $this = $(this);
		if (!_checkForm()) {
			return;
		}
        var validateStatus = true;
		openLoading();

		var departments = $deptList.find('.dept').map(function (i, deptRow) {
			let $deptRow = $(deptRow);
			var $hasSpecialClass = $deptRow.find('.hasSpecialClass');
            var $approvalNoOfSpecialClass = $deptRow.find('.approvalNoOfSpecialClass');
            var $hasSelfEnrollment = $deptRow.find('.isSelf');
            var $hasRiJian = $deptRow.find('.hasRiJian');
            var $admissionSelectionQuota = $deptRow.find('.admission_selection_quota');


            $deptRow.find('td').removeClass("has-danger");

            if ($hasSpecialClass.prop("checked")) {
                if (!$approvalNoOfSpecialClass.val()) {
                    $approvalNoOfSpecialClass.parent().addClass("has-danger");
                	validateStatus = false;
                }
            }

            if ($hasRiJian.prop('checked') || $hasSpecialClass.prop('checked')) {
                if (!$admissionSelectionQuota.val()) {
                    $admissionSelectionQuota.parent().addClass("has-danger");
                	validateStatus = false;
                }
            }

			return {
				id: String($deptRow.data('id')),
                sort_order: +$deptRow.find('.order-num').val(),
				admission_selection_quota: +$admissionSelectionQuota.val(),
				has_self_enrollment: $hasSelfEnrollment.is(':checked'),
                has_RiJian: $hasRiJian.is(':checked'),
                has_special_class: $hasSpecialClass.is(':checked'),
                approval_no_of_special_class: $approvalNoOfSpecialClass.val(),
                approval_doc_of_special_class: $deptRow.find('.approvalDocOfSpecialClassfileb64').val(),
			};
		}).toArray();

		if (validateStatus) {
            var data = {
                departments: departments,
                self_enrollment_quota: +$quota_self_enrollment_quota.val(), // 港二技自招
            };

            $this.attr('disabled', true);
            School.setSystemQuota('twoYear', data).then(function (res) {
                setTimeout(function () {
                    $this.attr('disabled', false);
                }, 700);
                if (res.ok) {
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
        } else {
            alert("有欄位輸入錯誤，請重新確認。");
            stopLoading();
		}
	}

	function _checkForm() {
		var valid = true;

		// 本年度欲招募總量必須小於等於可招生總量
		if (+$quota_wantTotal.val() > +$quota_allowTotal.val()) {
			valid = false;
			alert('各系所招生名額加總必須小於等於可招生總量');
		}
		return valid;
	}

	function _setData() {
		openLoading();

		School.getSystemQuota('twoYear').then(function (res) {
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
			another_department_admission_selection_quota,
			another_department_admission_placement_quota,
			another_department_self_enrollment_quota,
            school_has_self_enrollment,
			self_enrollment_quota,
			quota_used,
			quota_passed
		} = data;
		$quota_last_year_admission_amount.val(last_year_admission_amount || 0);
		$quota_last_year_surplus_admission_quota.val(last_year_surplus_admission_quota || 0);
		$quota_ratify_expanded_quota.val(ratify_expanded_quota || 0);
		$quota_another_department_admission_selection_quota.val(another_department_admission_selection_quota || 0);
		$quota_used.val(quota_used || 0);
		$quota_passed.val(quota_passed || 0);


        if (school_has_self_enrollment) {
            $quota_another_department_self_enrollment_quota.val(another_department_self_enrollment_quota || 0);
            $quota_self_enrollment_quota.val(self_enrollment_quota || 0);
        } else {
            $quota_another_department_self_enrollment_quota.val(0);
            $quota_another_department_self_enrollment_quota.attr('disabled', true);
            $quota_self_enrollment_quota.val(0);
            $quota_self_enrollment_quota.attr('disabled', true);
        }

		$quota_another_department_admission_placement_quota.val(another_department_admission_placement_quota || 0);
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
                has_RiJian,
                has_special_class,
                approval_no_of_special_class,
                approval_doc_of_special_class,
				teacher_quality_passed
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
						<td class="text-center"><input type="checkbox" class="hasRiJian" ${has_RiJian ? 'checked' : ''}></td>
						<td class="text-center"><input type="checkbox" class="isSelf" data-type="self_enrollment_quota" ${school_has_self_enrollment && has_self_enrollment ? 'checked' : ''} ${has_RiJian ? '' : 'disabled'} ${school_has_self_enrollment ? '' : 'disabled'}></td>
						<td class="text-center"><input type="checkbox" class="hasSpecialClass" ${has_special_class ? 'checked' : ''}></td>
						<td class="text-center"><input type="text" class="form-control approvalNoOfSpecialClass" value="${approval_no_of_special_class || ''}" ${has_special_class ? '' : 'disabled'}></td>
						<td><input type="file" class="approvalDocOfSpecialClass" ${has_special_class ? '' : 'disabled'}><br />已上傳檔案：<a class="approvalDocOfSpecialClassUrl" href="${baseUrl + "/storage/" + approval_doc_of_special_class}">${approval_doc_of_special_class || ''}</a><textarea class="approvalDocOfSpecialClassfileb64" hidden disabled ></textarea></td>
						<td class="text-center"><input type="number" min="0" class="form-control editableQuota required admission_selection_quota" data-type="admission_selection_quota" value="${+admission_selection_quota}" ${has_RiJian || has_special_class ? '' : 'disabled'} ${teacher_quality_passed ? '' : 'disabled'}/></td>
					</tr>
				`);

            count++;
		}
		_updateQuotaSum('admission_selection_quota');
		_updateAdmissionSumSelfSum();
		_updateWantTotal();

        const $upArrow = $deptList.find('.up-arrow');
        const $downArrow = $deptList.find('.down-arrow');
        const $orderNum = $deptList.find('.order-num');

        $upArrow.on("click", _prevOrder);
        $downArrow.on("click", _nextOrder);
        $orderNum.on("change", _changeOrder);
	}

    function _switchHasRiJian() { // 開日間 => 可自招、開聯招人數
        var $this = $(this);
        var $isSelf = $this.parents('.dept').find('.isSelf');
        var $admission_selection_quota = $this.parents('.dept').find('.editableQuota');
        var $hasRiJian = $this.parents('.dept').find('.hasRiJian');
        var $hasSpecialClass = $this.parents('.dept').find('.hasSpecialClass');

        // $schoolHasSelfEnrollment

        if ( !$hasRiJian.prop('checked') ) {
            $isSelf.prop("checked", false);
            $isSelf.prop('disabled', true);
        } else {
        	if ($schoolHasSelfEnrollment) {
				$isSelf.prop('disabled', false);
			}
		}

        if ($hasRiJian.prop('checked') || $hasSpecialClass.prop('checked')) {
            $admission_selection_quota.prop('disabled', false);
        } else {
            $admission_selection_quota.prop('disabled', true);
            $admission_selection_quota.val(0);
            _updateQuotaSum('admission_selection_quota');
            _updateAdmissionSumSelfSum();
            _updateWantTotal();
        }
    }

    function _switchHasSpecialClass() { // 開專班 => 開專班文號、電子檔，以及開聯招人數
        var $this = $(this);
        var $hasSpecialClass = $this.parents('.dept').find('.hasSpecialClass');
        var $hasRiJian = $this.parents('.dept').find('.hasRiJian');
        var $approvalNoOfSpecialClass = $this.parents('.dept').find('.approvalNoOfSpecialClass');
        var $approvalDocOfSpecialClass = $this.parents('.dept').find('.approvalDocOfSpecialClass');
        var $admissionSelectionQuota = $this.parents('.dept').find('.editableQuota');

        $approvalNoOfSpecialClass.prop('disabled', !$hasSpecialClass.prop('checked'));
        $approvalDocOfSpecialClass.prop('disabled', !$hasSpecialClass.prop('checked'));
        if ($hasRiJian.prop('checked') || $hasSpecialClass.prop('checked')) {
        	$admissionSelectionQuota.prop('disabled', false);
        } else {
        	$admissionSelectionQuota.prop('disabled', true);
            $admissionSelectionQuota.val(0);
            _updateQuotaSum('admission_selection_quota');
            _updateAdmissionSumSelfSum();
            _updateWantTotal();
        }
    }

	function _updateQuotaSum(type) {
		var $ele = {
			admission_selection_quota: $quota_admission_selection_quota,
		};
		var sum = 0;
        $deptList.find('.dept').each(function (i, deptRow) {
            if (type === "admission_selection_quota") {
                sum += +$(deptRow).find(`.${type}`).val();
            }
        });
		$ele[type].val(sum);
	}

	function _updateAdmissionSumSelfSum() {
		$quota_admissionSum.val(
			+$quota_another_department_admission_selection_quota.val() +
			+$quota_another_department_admission_placement_quota.val() +
			+$quota_admission_selection_quota.val()
		);

		$quota_selfSum.val(
			+$quota_another_department_self_enrollment_quota.val() +
			+$quota_self_enrollment_quota.val()
		);
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
		return bareString.replace(/&/g, "&amp;")  // 轉換 &
			.replace(/</g, "&lt;").replace(/>/g, "&gt;")  // 轉換 < 及 >
			.replace(/'/g, "&apos;").replace(/"/g, "&quot;")  // 轉換英文的單雙引號
			.replace(/ /g, " &nbsp;")
			;
	}

})();
