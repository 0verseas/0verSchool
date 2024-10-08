var quotaDistirbutionBache = (function () {
	/**
	 * cacheDOM
	 */
	var $page = $('#pageContent');
	var $btn = $page.find('#btn-save, #btn-commit');
	var $lastEditionInfo = $page.find('#lastEditionInfo');

	//quota
	var $quota_allowTotal = $page.find('.quota.allowTotal'); // 本年度可招生總量
	var $quota_used = $page.find('.quota.quota_used'); // 欲使用名額
	var $bachelor_quota_admission_selection_quota = $page.find('.quota.bacheloar_admission_selection_quota'); // 學士班個人申請
	var $bachelor_quota_admission_placement_quota = $page.find('.quota.bacheloar_admission_placement_quota'); // 學士班聯合分發
	var $bachelor_quota_self_enrollment_quota = $page.find('.quota.bacheloar_self_enrollment_quota'); // 學士班自招
	var $twoTech_admission_selection_quota = $page.find('.quota.twoTech_admission_selection_quota'); // 港二技個人申請
	var $twoTech_self_enrollment_quota = $page.find('.quota.twoTech_self_enrollment_quota'); // 港二技自招
	var $quota_wantTotal = $page.find('.quota.wantTotal'); // 本年度欲招募總量
	var $quota_admissionSum = $page.find('.quota.admissionSum'); // 本年度聯招小計
	var $quota_selfSum = $page.find('.quota.selfSum'); // 本年度自招小計
	const $symbol_add = $page.find('.sumAddSymbol');
	const $text_bachelor_self_enrollment = $page.find('.bacheloar_self_enrollment_text');
	// 一般系所相關物件
	const $general_department_admission_selection_quota = $page.find('.general_department_admission_selection_quota');
	const $general_department_admission_placement_quota = $page.find('.general_department_admission_placement_quota');
	const $two_year_general_department_admission_selection_quota = $page.find('.two_year_general_department_admission_selection_quota');
	const $general_department_self_enrollment_quota = $page.find('.general_department_self_enrollment_quota');
	const $two_year_general_department_self_enrollment_quota = $page.find('.two_year_general_department_self_enrollment_quota');
	const $general_department_sum = $page.find('.general_department_sum');
	// 重點產業系所相關物件
	const $main_industries_department_admission_selection_quota = $page.find('.main_industries_department_admission_selection_quota');
	const $main_industries_department_admission_placement_quota = $page.find('.main_industries_department_admission_placement_quota');
	const $two_year_main_industries_department_admission_selection_quota = $page.find('.two_year_main_industries_department_admission_selection_quota');
	const $main_industries_department_self_enrollment_quota = $page.find('.main_industries_department_self_enrollment_quota');
	const $two_year_main_industries_department_self_enrollment_quota = $page.find('.two_year_main_industries_department_self_enrollment_quota');
	const $main_industries_department_sum = $page.find('.main_industries_department_sum');
	// 國際專修部系所相關物件
	const $international_specialized_program_admission_selection_quota = $page.find('.international_specialized_program_admission_selection_quota');
	const $two_year_international_specialized_program_admission_selection_quota = $page.find('.two_year_international_specialized_program_admission_selection_quota');
	const $international_specialized_program_self_enrollment_quota = $page.find('.international_specialized_program_self_enrollment_quota');
	const $two_year_international_specialized_program_self_enrollment_quota = $page.find('.two_year_international_specialized_program_self_enrollment_quota');
	const $international_specialized_program_sum = $page.find('.international_specialized_program_sum');
	// 教育部核定額外系所名額
	const $ratify_quota_for_main_industries_department = $page.find('.ratify_quota_for_main_industries_department');
	const $ratify_quota_for_international_specialized_program = $page.find('.ratify_quota_for_international_specialized_program');

	// dept list
	var $deptList = $page.find('#table-bacheDeptList');
	var $allDept;
	var $schoolHasSelfEnrollment;
	var $schoolHasMyanmarTeacherEducation;

	/**
	 * bind event
	 */
	// 學士班單獨招生名額變動事件
	$general_department_self_enrollment_quota.on('change', _handleGeneralDepartmentSelfChanged);
	$main_industries_department_self_enrollment_quota.on('change', _handleMainIndustriesDepartmentSelfChanged);
	$international_specialized_program_self_enrollment_quota.on('change', _handleInternationalSpecializedProgramSelfChanged);
	// 填數字算總額
	$deptList.on('change.sumTotal', '.dept .editableQuota', _handleQuotaChange);
	// save/commit
	$btn.on('click', _handleSave);

	/**
	 * init
	 */
	if(env.stage == 1){
		location.href = "./systemQuota.html";
	}
	// show bache only
	$page.find('.bacheOnly').removeClass('hide');
	$page.find('*[data-toggle=tooltip]').tooltip();
	// 對部份物件做初始化調整
	$('.add_system_text').each(function (index){
		$(this).text('學士班'+$(this).text());
	});
	$page.find("small").each(function (index){
		$(this).html($(this).html().replace('一般系所',`<a class="font-weight-bold" style="color:#808080;">一般系所</a>`));
		$(this).html($(this).html().replace('重點產業系所',`<a class="font-weight-bold" style="color:#8035E4;">重點產業系所</a>`));
		$(this).html($(this).html().replace('國際專修部',`<a class="font-weight-bold" style="color:#E47535;">國際專修部</a>`));
	});
	$general_department_self_enrollment_quota.attr('disabled',false).get(0).type = 'number';
	$main_industries_department_self_enrollment_quota.attr('disabled',false).get(0).type = 'number';
	$international_specialized_program_self_enrollment_quota.attr('disabled',false).get(0).type = 'number';
	$general_department_self_enrollment_quota.get(0).min = 0;
	$main_industries_department_self_enrollment_quota.get(0).min = 0;
	$international_specialized_program_self_enrollment_quota.get(0).min = 0;
	$symbol_add.text('　　　').removeClass('operator');
	$text_bachelor_self_enrollment.text('*'+$text_bachelor_self_enrollment.text());
	$text_bachelor_self_enrollment.addClass('text-danger font-weight-bold');

	_setData();

	function _handleGeneralDepartmentSelfChanged() {
		if($(this).val()<0) {
			$(this).val(0);
		}
		$general_department_sum.val(
			+$general_department_admission_selection_quota.val() +
			+$general_department_admission_placement_quota.val() +
			+$two_year_general_department_admission_selection_quota.val() +
			+$general_department_self_enrollment_quota.val() +
			+$two_year_general_department_self_enrollment_quota.val()
		);

		_handleSelfChanged();
	}

	function _handleMainIndustriesDepartmentSelfChanged() {
		if($(this).val()<0) {
			$(this).val(0);
		}
		$main_industries_department_sum.val(
			+$main_industries_department_admission_selection_quota.val() +
			+$main_industries_department_admission_placement_quota.val() +
			+$two_year_main_industries_department_admission_selection_quota.val() +
			+$main_industries_department_self_enrollment_quota.val() +
			+$two_year_main_industries_department_self_enrollment_quota.val()
		);

		_handleSelfChanged();
	}

	function _handleInternationalSpecializedProgramSelfChanged() {
		if($(this).val()<0) {
			$(this).val(0);
		}
		$international_specialized_program_sum.val(
			+$international_specialized_program_admission_selection_quota.val() +
			+$two_year_international_specialized_program_admission_selection_quota.val() +
			+$international_specialized_program_self_enrollment_quota.val() +
			+$two_year_international_specialized_program_self_enrollment_quota.val()
		);

		_handleSelfChanged();
	}

	function _handleSelfChanged() {
		$bachelor_quota_self_enrollment_quota.val(
			+$general_department_self_enrollment_quota.val() +
			+$main_industries_department_self_enrollment_quota.val() +
			+$international_specialized_program_self_enrollment_quota.val()
		);
		_updateAdmissionSumSelfSum();
		_updateWantTotal();
	}

	function _handleDeptPassChange() {
		var $this = $(this);
		var $single_deptPass = $this.parents('.dept').find('.isDeptPass');
		var $single_admission_placement_quota = $this.parents('.dept').find('.admission_placement_quota').val()

		if( $single_deptPass.is(':checked') == true && $single_admission_placement_quota == 0){
			swal({title:"該系聯合分發名額為 0，確定要流用嗎？", confirmButtonText:'確定', type:'info'});
		}
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
		const deptType = $this.parents('.dept').data('type');
		if (quotaType) {
			_updateQuotaSum(quotaType);
			_updateDepartmentQuotaSum(deptType, quotaType);
			_updateAdmissionSumSelfSum();
			_updateWantTotal();
			_updateTypeDepartmentTotal(deptType);

			// 看看要不要寫減招原因
			if (quotaType == 'admission_placement_quota') {
				var $reference = $this.parents('.dept').find('.reference');
				var $decrease_reason_of_admission_placement = $this.parents('.dept').find('.decrease_reason_of_admission_placement');
				if ($this.val() < $reference.data('val')) {
					$decrease_reason_of_admission_placement
						.addClass('required')
						.attr('disabled', false);
				} else {
					$decrease_reason_of_admission_placement
						.val('')
						.removeClass('required')
						.attr('disabled', true);
				}
			}
		}
	}

	// 「是否招生緬甸師培生」核取方塊
	function _handleMyanmarTeacherEduChange() {
		var $this = $(this);
		var $admission_selection_quota = $this.parents('.dept').find('.admission_selection_quota').val();  // 個人申請名額
		var $myanmar_teacher_education = $this.parents('.dept').find('.isMyanmar');
		if($myanmar_teacher_education.is(':checked')==true && $admission_selection_quota==0){
			swal({title:"該系有招收緬甸師培生，但個人申請名額為 0", confirmButtonText:'確定', type:'warning'});
		}
	}

	function _handleSave() {
		var $this = $(this);
		if (!_checkForm()) {
			return;
		}

		let alertString = '';
		let allowTotalMin = +$quota_used.val() + +$main_industries_department_sum.val() + +$ratify_quota_for_international_specialized_program.val();
		let allowTotalMax = +$quota_used.val() + (2 * +$main_industries_department_sum.val()) + (3 * +$ratify_quota_for_international_specialized_program.val());
		// 本年度欲招募總量必須等於可招生總量
		if (+$general_department_sum.val() != +$quota_used.val()) {
			alertString += `一般系所欲招募總量必須等於可使用名額！<br/>`
		}
		// 本年度重點產業系所欲招募總量必須等於教育部核定擴增招收名額
		if (
			+$main_industries_department_sum.val() < +$ratify_quota_for_main_industries_department.val()
			|| +$main_industries_department_sum.val() > (2 * +$ratify_quota_for_main_industries_department.val())
		) {
			alertString += `重點產業系所欲招募總量，與教育部核定計畫不符（名額倍數；應在 1 ～ 2 倍之間）！<br/>`
		}
		if (
			+$international_specialized_program_sum.val() < +$ratify_quota_for_international_specialized_program.val()
			|| +$international_specialized_program_sum.val() > (3 * +$ratify_quota_for_international_specialized_program.val())
		) {
			alertString += `國際專修部欲招募總量，與教育部核定計畫不符（名額倍數；應在 1 ～ 3 倍之間）！<br/>`
		}
		// 本年度欲招募總量必須等於可招生總量
		if (+$quota_wantTotal.val() < allowTotalMin || +$quota_wantTotal.val() > allowTotalMax) {
			alertString += `各系所招生名額加總必須符合可招生總量！<br/>`
		}

		openLoading();

		var departments = $deptList.find('.dept').map(function (i, deptRow) {
			let $deptRow = $(deptRow);
			return {
				id: String($deptRow.data('id')),
                sort_order: +$deptRow.find('.order-num').val(),
				has_self_enrollment: $deptRow.find('.isSelf').is(':checked'),
				admission_quota_pass: $deptRow.find('.isDeptPass').is(':checked'),
				admission_selection_quota: +$deptRow.find('.admission_selection_quota').val(),
				admission_placement_quota: +$deptRow.find('.admission_placement_quota').val(),
				decrease_reason_of_admission_placement: $deptRow.find('.decrease_reason_of_admission_placement').val() || null,
				myanmar_teacher_education: +$deptRow.find('.isMyanmar').is(':checked'),
				is_extended_department: $deptRow.data('type'),
			};
		}).toArray();

		var data = {
			self_enrollment_quota: +$bachelor_quota_self_enrollment_quota.val(), // 學士班自招
			general_department_self_enrollment_quota: +$general_department_self_enrollment_quota.val(),
			main_industries_department_self_enrollment_quota: +$main_industries_department_self_enrollment_quota.val(),
			international_specialized_program_self_enrollment_quota: +$international_specialized_program_self_enrollment_quota.val(),
			departments: departments
		};

		$this.attr('disabled', true);
		// console.log(data);
		School.setSystemQuota('bachelor', data).then(function (res) {
			setTimeout(function () {
				$this.attr('disabled', false);
			}, 700);
			if(res.ok) {
				return res.json();
			} else {
				throw res;
			}
		}).then(async function (json) {
			stopLoading();
			if(alertString != ''){
				await swal({title:"請注意！",html: `最後鎖定時<br/>`+alertString, confirmButtonText:'確定', type:'warning'});
			}
			swal({title:"已儲存", confirmButtonText:'確定', type:'success'}).then(() => {
				location.reload();
			});
		}).catch(function (err) {
			err.json && err.json().then((data) => {
				console.error(data);
				swal({title:data.messages[0], confirmButtonText:'確定', type:'error'});
			});
			stopLoading();
		});
	}

	function _checkForm() {
		let $inputs = $page.find('.required');
		let valid = true;
		for (let input of $inputs) {
			if (!$(input).val() || $(input).val() < 0) {
				$(input).focus();
				valid = false;
				swal({title:"輸入有誤", html:"不得為空或負數", confirmButtonText:'確定', type:'error'});
				break;
			}
		}
		return valid;
	}

	function _setData() {
		openLoading();

		School.getSystemQuota('bachelor').then(function (res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function (json) {
			$allDept = json.departments;
			$schoolHasSelfEnrollment = json.school_has_self_enrollment;
			$schoolHasMyanmarTeacherEducation = json.school_has_myanmer_teacher_education

			if(!$schoolHasSelfEnrollment){
				$general_department_self_enrollment_quota.attr('disabled',true).get(0).type = 'text';
				$main_industries_department_self_enrollment_quota.attr('disabled',true).get(0).type = 'text';
				$international_specialized_program_self_enrollment_quota.attr('disabled',true).get(0).type = 'text';
			}

			_renderData(json);

			if(json.review_at != null) {
				$('#btn-save').attr('disabled', true).text('已鎖定');
			}

            stopLoading();
		}).catch(function (err) {
			if (err.status === 404) {
				swal({title:"沒有這個學制，即將返回上一頁。", confirmButtonText:'確定', type:'error'}).then(() => {
					window.history.back();
				});
			} else {
				err.json && err.json().then((data) => {
					console.error(data);
					swal({title:data.messages[0], confirmButtonText:'確定', type:'error'});
				});
				stopLoading();
			}
		});
	}

	function _renderData(json) {
		_setQuota(json);
		_setDeptList(json.departments, json.school_has_self_enrollment, json.school_has_myanmer_teacher_education);
		_setEditor(json.creator, json.created_at);
		$page.find('#schoolHasSelf').text(json.school_has_self_enrollment ? '是' : '否');
	}

	function _setEditor(creator, created_at) {
		$lastEditionInfo.find('.who').text(creator ? creator.name : 'unknown');
		$lastEditionInfo.find('.when').text(moment(created_at).format('YYYY/MM/DD HH:mm:ss'));
	}

	function _setQuota(data) {
		const {
			last_year_admission_amount,
			last_year_surplus_admission_quota,
			ratify_expanded_quota,
			ratify_quota_for_international_specialized_program,
			ratify_quota_for_main_industries_department,
			two_year_general_department_admission_selection_quota,
			two_year_main_industries_department_admission_selection_quota,
			two_year_international_specialized_program_admission_selection_quota,
			another_department_admission_selection_quota,
			two_year_general_department_self_enrollment_quota,
			two_year_main_industries_department_self_enrollment_quota,
			two_year_international_specialized_program_self_enrollment_quota,
			another_department_self_enrollment_quota,
			self_enrollment_quota,
			international_specialized_program_self_enrollment_quota,
			main_industries_department_self_enrollment_quota,
			general_department_self_enrollment_quota,
			school_has_self_enrollment,
			quota_used,
			quota_passed,
			IACP_ratify_quota
		} = data;
		let sum = 0;
		sum += +last_year_surplus_admission_quota;
		sum += +ratify_expanded_quota;
		sum += +quota_used;
		sum += +quota_passed;
		sum -= +IACP_ratify_quota;
		$twoTech_admission_selection_quota.val(another_department_admission_selection_quota || 0);
		$twoTech_self_enrollment_quota.val(another_department_self_enrollment_quota || 0);
		$quota_used.val(sum);
		$ratify_quota_for_main_industries_department.val(ratify_quota_for_main_industries_department || 0);
		$ratify_quota_for_international_specialized_program.val((ratify_quota_for_international_specialized_program) || 0);
		$general_department_self_enrollment_quota.val(general_department_self_enrollment_quota || 0);
		$main_industries_department_self_enrollment_quota.val(main_industries_department_self_enrollment_quota || 0);
		$international_specialized_program_self_enrollment_quota.val(international_specialized_program_self_enrollment_quota || 0);
		$two_year_general_department_admission_selection_quota.val(two_year_general_department_admission_selection_quota || 0);
		$two_year_main_industries_department_admission_selection_quota.val(two_year_main_industries_department_admission_selection_quota || 0);
		$two_year_international_specialized_program_admission_selection_quota.val(two_year_international_specialized_program_admission_selection_quota || 0);
		$two_year_general_department_self_enrollment_quota.val(two_year_general_department_self_enrollment_quota || 0);
		$two_year_main_industries_department_self_enrollment_quota.val(two_year_main_industries_department_self_enrollment_quota || 0);
		$two_year_international_specialized_program_self_enrollment_quota.val(two_year_international_specialized_program_self_enrollment_quota || 0);

        if (school_has_self_enrollment) {
            $bachelor_quota_self_enrollment_quota.val(self_enrollment_quota || 0);
            $twoTech_self_enrollment_quota.val(another_department_self_enrollment_quota || 0);
        } else {
			$bachelor_quota_self_enrollment_quota.val(0);
            $twoTech_self_enrollment_quota.val(0);
        }

		_updateAllowTotal();
	}

	function _setDeptList(list, school_has_self_enrollment, school_has_myanmer_teacher_education) {
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
				admission_placement_quota,
				last_year_admission_placement_amount,
				last_year_admission_placement_quota,
				has_self_enrollment,
				self_enrollment_quota,
				decrease_reason_of_admission_placement,
				admission_quota_pass,
				moe_check_failed,
				teacher_quality_passed,
				myanmar_teacher_education,
				is_extended_department
			} = dept;
			var total = (+admission_selection_quota) + (+admission_placement_quota) + (+self_enrollment_quota || 0);
			var reference = last_year_admission_placement_amount > last_year_admission_placement_quota ? last_year_admission_placement_quota : last_year_admission_placement_amount;
			var noNeedToWriteReason = +reference <= +admission_placement_quota;

			let extended_department = (is_extended_department != 2) ?false :true;
			let checked = school_has_self_enrollment ? ( has_self_enrollment ? 'checked' : '') : 'disabled';
			let checked2 = ( (admission_quota_pass && !extended_department) ? 'checked' : '');
			let checked3 = (school_has_myanmer_teacher_education && !extended_department)? ( myanmar_teacher_education ? 'checked' : '') : 'disabled';
			let checked4 = '';
			let checked5 = '';
			let checked6 = '';
			// console.log(title);
			if( title == "醫學系") {
				checked4 = "disabled";
				checked5 = "disabled";
			}
			else {
				checked4 = "";
				checked5 = "";
			}

			// 經教育部列管或師資未達標準 => 名額龜苓膏 + 不可修改
			if (!teacher_quality_passed || moe_check_failed){
				checked4 = "disabled";
				checked5 = "disabled";
			}

			if(extended_department){
				checked5 = 'disabled';
				checked6 = 'disabled';
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
				department_title = department_title+'&nbsp;&nbsp;<span class="badge table-primary">國際專修部</span>';
			}

			$deptList
			.find('tbody')
			.append(`
				<tr class="dept" data-id="${id}" data-type="${is_extended_department}">
					<td>
						<div class="input-group">
							<div class="btn-group-vertical"">
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
						<div>${english_title}</div>
					</td>
					<td><input type="number" min="0" ${checked4} class="form-control editableQuota required admission_selection_quota" data-type="admission_selection_quota" value="${admission_selection_quota || 0}" /></td>
					<td class="text-center"><input type="checkbox" class="isDeptPass" data-type="deptPass" ${checked2} ${checked6}></td>
					<td><input type="${checked5=="disabled" ?"text" :"number"}" min="0" ${checked5} class="form-control editableQuota required admission_placement_quota" data-type="admission_placement_quota" value="${admission_placement_quota || 0}" /></td>
					<td class="reference text-center" data-val="${reference}">${reference}</td>
					<td><textarea class="form-control decrease_reason_of_admission_placement" cols="50" rows="1" ${noNeedToWriteReason ? 'disabled' : ''} >${decrease_reason_of_admission_placement || ''}</textarea></td>
					<td class="text-center"><input type="checkbox" class="isSelf" data-type="self_enrollment_quota" ${checked} ></td>
					<td class="text-center"><input type="checkbox" class="isMyanmar" data-type="myanmar_teacher_education" ${checked3} ></td>
					<td class="total text-center">${total}</td>
				</tr>
			`);

            count++;
		}
		_updateQuotaSum('admission_selection_quota');
		_updateQuotaSum('admission_placement_quota');
		_updateAdmissionSumSelfSum();
		_updateWantTotal();
		_updateDepartmentQuotaSum(0, 'admission_selection_quota');
		_updateDepartmentQuotaSum(0, 'admission_placement_quota');
		_updateDepartmentQuotaSum(1, 'admission_selection_quota');
		_updateDepartmentQuotaSum(1, 'admission_placement_quota');
		_updateDepartmentQuotaSum(2, 'admission_selection_quota');
		_updateTypeDepartmentTotal(0);
		_updateTypeDepartmentTotal(1);
		_updateTypeDepartmentTotal(2);
		if($('.table-bachelor').height() >= 800){
			$('.table-bachelor').height(800);
		}

        const $upArrow = $deptList.find('.up-arrow');
        const $downArrow = $deptList.find('.down-arrow');
        const $orderNum = $deptList.find('.order-num');
		const $DeptPass = $deptList.find('.isDeptPass');
		const $single_admission_placement_quota = $deptList.find('.admission_placement_quota');
		const $myanmar_teacher_education = $deptList.find('.isMyanmar');  // 是否招生緬甸師培生
		const $admission_selection_quota = $deptList.find('.admission_selection_quota');  // 個人申請名額

        $upArrow.on("click", _prevOrder);
        $downArrow.on("click", _nextOrder);
        $orderNum.on("change", _changeOrder);
		// 餘額留用 change
		$DeptPass.on('change', _handleDeptPassChange);
		$single_admission_placement_quota.on('change', _handleDeptPassChange);
		$myanmar_teacher_education.on('change', _handleMyanmarTeacherEduChange);
		$admission_selection_quota.on('change', _handleMyanmarTeacherEduChange);
	}

	function _updateQuotaSum(type) {
		var $ele = {
			admission_selection_quota: $bachelor_quota_admission_selection_quota,
			admission_placement_quota: $bachelor_quota_admission_placement_quota
		};
		var sum = 0;
		$deptList.find('.dept').each(function (i, deptRow) {
			sum += +$(deptRow).find(`.${type}`).val();
		});
		$ele[type].val(sum);
	}

	function _updateAllowTotal() {
		let min = +($quota_used.val()) +
			+($ratify_quota_for_main_industries_department.val())+
			+($ratify_quota_for_international_specialized_program.val());
		let max = +($quota_used.val()) +
			+($ratify_quota_for_main_industries_department.val()*2)+
			+($ratify_quota_for_international_specialized_program.val()*3);

		if(min == max){
			$quota_allowTotal.val(min);
		} else {
			$quota_allowTotal.val(min + " ~ " + max);
		}
	}

	function _updateAdmissionSumSelfSum() {
		$quota_admissionSum.val(
			+$bachelor_quota_admission_selection_quota.val() +
			+$bachelor_quota_admission_placement_quota.val() +
			+$twoTech_admission_selection_quota.val()
		);

		$quota_selfSum.val(
			+$bachelor_quota_self_enrollment_quota.val() +
			+$twoTech_self_enrollment_quota.val()
		);
	}

	function _updateWantTotal() {
		var sum = +($quota_admissionSum.val()) +
			+($quota_selfSum.val());
		$quota_wantTotal.val(sum);
	}

	function _updateDepartmentQuotaSum(type, admissionType){
		let sum = 0;
		$deptList.find('.dept').each(function (i, deptRow) {
			let $deptRow = $(deptRow);
			if($deptRow.data('type') == type){
				sum += +$deptRow.find(`.${admissionType}`).val();
			}
		});
		if(admissionType == 'admission_selection_quota'){
			type += '0';
		} else {
			type += '1';
		}

		switch(type){
			case '00':
				$general_department_admission_selection_quota.val(sum);
				break;
			case '01':
				$general_department_admission_placement_quota.val(sum);
				break;
			case '10':
				$main_industries_department_admission_selection_quota.val(sum);
				break;
			case '11':
				$main_industries_department_admission_placement_quota.val(sum);
				break;
			case '20':
				$international_specialized_program_admission_selection_quota.val(sum);
				break;
		}
	}

	function _updateTypeDepartmentTotal(type) {
		switch(type){
			case 0:
				$general_department_sum.val(
					+$general_department_admission_selection_quota.val() +
					+$general_department_admission_placement_quota.val() +
					+$two_year_general_department_admission_selection_quota.val() +
					+$general_department_self_enrollment_quota.val() +
					+$two_year_general_department_self_enrollment_quota.val()
				);
				break;
			case 1:
				$main_industries_department_sum.val(
					+$main_industries_department_admission_selection_quota.val() +
					+$main_industries_department_admission_placement_quota.val() +
					+$two_year_main_industries_department_admission_selection_quota.val() +
					+$main_industries_department_self_enrollment_quota.val() +
					+$two_year_main_industries_department_self_enrollment_quota.val()
				)
				break;
			case 2:
				$international_specialized_program_sum.val(
					+$international_specialized_program_admission_selection_quota.val() +
					+$two_year_international_specialized_program_admission_selection_quota.val() +
					+$international_specialized_program_self_enrollment_quota.val() +
					+$two_year_international_specialized_program_self_enrollment_quota.val()
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

            _setDeptList($allDept, $schoolHasSelfEnrollment, $schoolHasMyanmarTeacherEducation);
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

            _setDeptList($allDept, $schoolHasSelfEnrollment, $schoolHasMyanmarTeacherEducation);
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

        _setDeptList($allDept, $schoolHasSelfEnrollment, $schoolHasMyanmarTeacherEducation);
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
