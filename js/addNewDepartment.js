(()=>{
    const $paginationContainer = $('#pagination-container'); // 分頁器區域
    const $applyList = $('#apply-list') // 請求列表
    const $applyModal = $('#editApplyModal'); // 請求編輯模板
    const $actionSelector = $('#action-selector'); // 動作選擇選項
    const $systemSelector = $('#system-selector'); // 學制選擇選項
    const $typeSelector = $('#type-selector'); // 類型選擇選項
    const $groupSelector = $('#group-selector'); // 類組選擇選項
    const $titleInput = $('#title-input'); // 核定系名輸入物件
    const $newBtn = $('#new-btn'); // 新增請求按鈕

    // 請求編輯模板物件
    const $applyTitle = $('#applyModalHeader'); // 模板的Title
    const $action = $('#action') // 請求之動作
    const $system = $('#system') // 請求之系所學制
    const $departmentType = $('#department-type') // 請求之系所類型
    const $departmentGroup = $('#department-group') // 請求之系所類組
    const $departmentTitle = $('#department-title') // 請求之核定系名
    const $applyDetailedInput = $('.apply-detailed-input'); // 請求之詳細資訊輸入區域
    const $deptIdForm = $('#deptIdForm');
    const $changeDepartmentTitleForm = $('#changeDepartmentTitleForm');
    const $changeGroupCodeForm = $('#changeGroupCodeForm');
    const $ConbineDeptIdForm = $('#ConbineDeptIdForm');
    const $deptIdInput = $('#dept-id');
    const $oldDepeTitleInput = $('#old-dept-title');
    const $newDepeTitleInput = $('#new-dept-title');
    const $oldGroupCodeSelector = $('#old-group-code-selector');
    const $newGroupCodeSelector = $('#new-group-code-selector');
    const $conbineDeptIdInput1 = $('#conbine-dept-id-1');
    const $conbineDeptIdInput2 = $('#conbine-dept-id-2');
    
    const $saveBtn = $('#save-btn'); // 儲存按鈕
    const $appliedBtn = $('#applied-btn'); // 發送按鈕
    const $deleteBtn = $('#delete-btn'); // 刪除按鈕

    // 編輯模板上傳檔案相關物件
    const $uploadedFileArea = document.getElementById('uploadedFileArea');
    const $uploadFileBtn = $('#file-upload');
    const $deleteFileBtn = $('.delete-file');
    const $imgModal = $('#img-modal');
    const $imgModalBody= $('#img-modal-body');

    // 中文名稱陣列 方便 代碼轉換
    const action_array = ['','新增系所','更改系名','更換類組','合併系所'];
    const system_array = ['','學士班','港二技','碩士班','博士班'];
    const type_array = ['一般系所','重點產業系所','國際專修部'];
    const group_array = ['','第一類組','第二類組','第三類組'];

    class applyData{
        constructor({
            id = 0,
            action_id,
            system_id,
            dept_type,
            group_code,
            dept_title = null,
            dept_id = null,
            old_group_code = null,
            new_group_code = null,
            old_dept_title = null,
            new_dept_title = null,
            conbine_dept_id_1 = null,
            conbine_dept_id_2 = null,
            applied = false
        }={}){
            this.id =id;
            this.action_id =action_id;
            this.system_id =system_id;
            this.dept_type =dept_type;
            this.group_code =group_code;
            this.dept_title =dept_title;
            this.dept_id =dept_id;
            this.old_group_code =old_group_code;
            this.new_group_code =new_group_code;
            this.old_dept_title =old_dept_title;
            this.new_dept_title =new_dept_title;
            this.conbine_dept_id_1 =conbine_dept_id_1;
            this.conbine_dept_id_2 =conbine_dept_id_2;
            this.applied =applied;
        }
    }

    let applyListArray = []; // 目前請求有哪些
    let $uploadedFiles = []; // 當前請求有哪些檔案
    let currentApplyID = 0; // 當前請求的ID

    $systemSelector.on('change',_handleSystemChoose);
    $newBtn.on('click', _handleNew);
    $saveBtn.on('click', false, _handleSave);
    $appliedBtn.on('click', true, _handleSave);
    $deleteBtn.on('click', _handleDelete);
    $uploadFileBtn.on('change',_handleUploadFile);
    $deleteFileBtn.on('click', _handleDeleteFile);
    $('body').on('click', '.img-thumbnail', _handleShowFile);
    // 如果關閉已上傳檔案modal 依舊保持focus在文憑成績編輯modal上
    $imgModal.on('hidden.bs.modal', function(e){
        $('body').addClass('modal-open');
    });

    init();

    function init() {
        openLoading();
        School.getAddNewDepartmentApplyList()
        .then((res) => {
			if(res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
        .then((json) => {
            // console.log(json[1]);
            applyListArray = json[0];

            _handleSystemSelectorRender(json[1]); // 渲染學制選項

            // 進行文憑列表分頁初始化渲染工作
            $paginationContainer.pagination({
                dataSource: applyListArray,
                pageSize: 10,
                callback: function(applyListArray,pagination) {
                    _applyListTamplate(applyListArray, pagination.pageNumber);
                    const $editApplyInfoBtn = $('.btn-editApplyInfo'); // 新增編輯按鈕的觸發事件（開啟 Modal）
                    $editApplyInfoBtn.on('click', _handleEditModalShow);
                }
            });
		})
        .then(() =>{
            _handleSystemChoose();
            stopLoading();
        })
		.catch((err) => {
            stopLoading();
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
                location.reload();
			});
		});
    }

    // 請求列表轉換並渲染
    function _applyListTamplate(datas,page) {
        // 渲染 請求列表
        $applyList.html('');
        // console.log(datas);
        datas.forEach(function (data, index) {
            const action = action_array[data.action_id];
            const system = system_array[data.system_id];
            const type = type_array[data.dept_type];
            const group = group_array[data.group_code];
            const deptTitle = (data.dept_title) ?data.dept_title:'';
            let status = '';
            let buttonStatus = '';
            let buttonColor = '';
            if(data.applied_at != null){
                if(data.completed_at == null){
                    status  = '<i class="fa fa-hourglass-half fa-fw" aria-hidden="true"></i> 等候處理';
                    buttonColor = 'btn-warning';
                } else {
                    status  = '<i class="fa fa-check fa-fw" aria-hidden="true"></i> 處理完畢';
                    buttonColor = 'btn-success';
                }
                buttonStatus = 'disabled';
            } else {
                status = '<i class="fa fa-pencil fa-fw" aria-hidden="true"></i> 點擊編輯';
                buttonColor = 'btn-outline-info';
            }
            
            let listHtml = `<tr class="btn-editApplyInfo" data-id="${data.id}">`;
            listHtml += `<td>${index+1+((page-1)*10)}</td>`;
            listHtml += `<td>${system}</td>`;
            listHtml += `<td>${action}</td>`;
            listHtml += `<td>${type}</td>`;
            listHtml += `<td>${group}</td>`;
            listHtml += `<td>${deptTitle}</td>`;
            listHtml += `<td><button class="btn ${buttonColor}" id="btn-apply-edit" ${buttonStatus}>${status}</button></td>`;
            listHtml += `<td></td>`;
            listHtml += `</tr>`
            $applyList.append(listHtml);
        });
    }

    // 開啟編輯model
    function _handleEditModalShow() {
        // show modal
        $applyModal.modal();
        // 取得 請求的id
        currentApplyID = $(this).data('id');
        // 呼叫渲染文憑成績資料事件
        _setApplyData(currentApplyID);
    }

    // 學制選項渲染
    function _handleSystemSelectorRender(data) {

        const system_id = $systemSelector.val();

        $systemSelector.html('');
        // 該校不只一個學制
        if(data.length > 1){
            $systemSelector.append(`<option value="0" selected disabled hidden>請選擇</option>`);
        }

        // 渲染各學制選項
        data.forEach((system) => {
            switch(system.type_id){
                case 1:
                    $systemSelector.append(`<option value="1">學士班</option>`);
                    break;
                case 2:
                    $systemSelector.append(`<option value="2">港二技</option>`);
                    break;
                case 3:
                    $systemSelector.append(`<option value="3">碩士班</option>`);
                    break;
                case 4:
                    $systemSelector.append(`<option value="4">博士班</option>`);
                    break;
            }
        });

        // 如果只有一個學制幫它選，如果已經選過學制也幫它選
        if(data.length == 1 && system_id == null){
            $systemSelector.val(data[0].type_id);
        } else if(system_id != null){
            $systemSelector.val(system_id);
        }

        $systemSelector.attr('disabled',false);

        _handleSystemChoose();
    }

    // 學制變換偵測
    function _handleSystemChoose() {
        const system_id = $systemSelector.val();
        const action_id = $actionSelector.val();
        const dept_type = $typeSelector.val();

        if(system_id == null){
            return;
        }

        $actionSelector.attr('disabled',false);
        $typeSelector.attr('disabled',false);

        if(action_id == null || (system_id > 1 && action_id == 3)){
            $actionSelector.html(`
                <option value="0" selected disabled hidden>請選擇</option>
            `);
        } else {
            $actionSelector.html(``);
        }

        if(dept_type == null || (system_id > 1 && dept_type == 2) || (system_id == 2 && dept_type == 1)){
            $typeSelector.html(`
                <option value="-1" selected disabled hidden>請選擇</option>
            `);
        } else {
            $typeSelector.html(``);
        }

        $actionSelector.append(`
            <option value="1">新增系所</option>
            <option value="2">更改系名</option>
        `);
        if(system_id==1){
            $actionSelector.append(`
                <option value="3">更換類組</option>
            `)
        }
        $actionSelector.append(`
            <option value="4">合併系所</option>
        `);

        $typeSelector.append(`
            <option value="0">一般系所</option>
        `);

        if(system_id != 2){
            $typeSelector.append(`
                <option value="1">重點產業系所</option>
            `);
        }

        if(system_id==1){
            $typeSelector.append(`
                <option value="2">國際專修部</option>
            `);
        }

        if(action_id != null && !(system_id > 1 && action_id == 3)){
            $actionSelector.val(action_id);
        }

        if(dept_type != null && !(system_id > 1 && dept_type == 2) && !(system_id == 2 && dept_type == 1)){
            $typeSelector.val(dept_type);
        }
    }

    // 渲染請求資訊到編輯模板
    function _setApplyData(id) {
        openLoading();
        School.getAddNewDepartmentApplyInfo(id)
        .then((res) => {
			if(res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
        .then((json) => {
            // console.log(json[1]);
            const actionText = action_array[json[0].action_id];
            const systemText = system_array[json[0].system_id];
            const typeText = type_array[json[0].dept_type];
            const groupText = group_array[json[0].group_code];
            const departmentTitleText = (json[0].dept_title) ?json[0].dept_title:'';

            $action.val(actionText);
            $system.val(systemText);
            $departmentType.val(typeText);
            $departmentGroup.val(groupText);
            $departmentTitle.val(departmentTitleText);
            $deptIdInput.val(json[0].dept_id);
            $oldDepeTitleInput.val(json[0].old_dept_title);
            $newDepeTitleInput.val(json[0].new_dept_title);
            $oldGroupCodeSelector.val(json[0].old_group_code);
            $newGroupCodeSelector.val(json[0].new_group_code);
            $conbineDeptIdInput1.val(json[0].conbine_dept_id_1);
            $conbineDeptIdInput2.val(json[0].conbine_dept_id_2);

            $departmentTitle.attr('disabled',true);
            $deptIdInput.attr('disabled',true);
            $oldDepeTitleInput.attr('disabled',true);
            $newDepeTitleInput.attr('disabled',true);
            $oldGroupCodeSelector.attr('disabled',true);
            $newGroupCodeSelector.attr('disabled',true);
            $conbineDeptIdInput1.attr('disabled',true);
            $conbineDeptIdInput2.attr('disabled',true);

            $deptIdForm.hide();
            $changeDepartmentTitleForm.hide();
            $changeGroupCodeForm.hide();
            $ConbineDeptIdForm.hide();

            const $applied = (json[0].applied_at != null);
            $applyDetailedInput.show();
            if($applied){
                $saveBtn.attr('disabled',true).hide();
                $appliedBtn.attr('disabled',true).hide();
                $deleteBtn.attr('disabled',true).hide();
                $uploadFileBtn.attr('disabled',true);
                $deleteFileBtn.attr('disabled',true).hide();
                $('.btn-upload').hide();
                if(json[0].completed_at != null){
                    $applyTitle.html(`<i class="text-success fa fa-check" aria-hidden="true"> 處理完畢</i>`);
                } else {
                    $applyTitle.html(`<i class="text-warning fa fa-hourglass-half" aria-hidden="true"> 等候處理</i>`);
                }
            } else {
                $applyTitle.html(`<i class="text-primary fa fa-file-text" aria-hidden="true"> 尚未發送</i>`);
                $departmentTitle.attr('disabled',false);
                $saveBtn.attr('disabled',false).show();
                $appliedBtn.attr('disabled',false).show();
                $deleteBtn.attr('disabled',false).show();
                $uploadFileBtn.attr('disabled',false);
                $deleteFileBtn.attr('disabled',false).show();
                $('.btn-upload').show();
            }
            switch(json[0].action_id){
                case 1:
                    $applyDetailedInput.hide();
                    break;
                case 2:
                    $deptIdForm.show();
                    $changeDepartmentTitleForm.show();
                    if(!$applied){
                        $deptIdInput.attr('disabled',false);
                        $oldDepeTitleInput.attr('disabled',false);
                        $newDepeTitleInput.attr('disabled',false);
                    }
                    break;
                case 3:
                    $deptIdForm.show();
                    $changeGroupCodeForm.show();
                    if(!$applied){
                        $deptIdInput.attr('disabled',false);
                        $oldGroupCodeSelector.attr('disabled',false);
                        $newGroupCodeSelector.attr('disabled',false);
                    }
                    break;
                case 4:
                    $ConbineDeptIdForm.show();
                    if(!$applied){
                        $deptIdInput.attr('disabled',false);
                        $conbineDeptIdInput1.attr('disabled',false);
                        $conbineDeptIdInput2.attr('disabled',false);
                    }
                    break;
            }
            $uploadedFiles = json[1];            
		}).then(()=>{
            _handleRenderFile();
            stopLoading();
        })
		.catch((err) => {
            stopLoading();
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
                location.reload();
			});
		});
    }

    // 請求新增事件
    function _handleNew() {
        // 取得 選取的文憑類別及年度
        const action_id = $actionSelector.val();
        const system_id = $systemSelector.val();
        const dept_type = $typeSelector.val();
        const group_code = $groupSelector.val();
        const dept_title = $titleInput.val();

        if(action_id == null || system_id == null || dept_type == null || group_code == null || dept_title == ''){
            alert('請確認是否所有欄位都選擇或輸入完畢。');
            return;
        } else {
            openLoading();
            // 準備好要傳遞的資料
            const data = new applyData({
                action_id: action_id,
                system_id: system_id,
                dept_type: dept_type,
                group_code: group_code,
                dept_title: dept_title
            });

            School.saveAddNewDepartmentApplyInfo(data)
            .then((res) => {
                if(res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then((json) => {
                // console.log(json);
                alert(json.messages[0]);
                $actionSelector.val(0);
                $systemSelector.val(0);
                $typeSelector.val(-1);
                $groupSelector.val(0);
                $titleInput.val('');
                $actionSelector.attr('disabled',true);
                $typeSelector.attr('disabled',true);
                stopLoading();
                location.reload();
            })
            .catch((err) => {
                err.json && err.json().then((data) => {
                    console.error(data);
                    alert(`ERROR: \n${data.messages[0]}`);
                    location.reload();
                    stopLoading();
                });
            });
        }
    }

    // 請求儲存事件
    function _handleSave(event) {
        let data = new applyData({
            id: currentApplyID,
            action_id: action_array.indexOf($action.val()),
            system_id: system_array.indexOf($system.val()),
            dept_type: type_array.indexOf($departmentType.val()),
            group_code: group_array.indexOf($departmentGroup.val()),
            dept_title: $departmentTitle.val(),
            applied: event.data
        });
        switch(data.action_id){
            default :
                break;
            case 2:
                data.dept_id = $deptIdInput.val();
                data.old_dept_title = $oldDepeTitleInput.val();
                data.new_dept_title = $newDepeTitleInput.val();
                break;
            case 3:
                data.dept_id = $deptIdInput.val();
                data.old_group_code = $oldGroupCodeSelector.val();
                data.new_group_code = $newGroupCodeSelector.val();
                break;
            case 4:
                data.conbine_dept_id_1 = $conbineDeptIdInput1.val();
                data.conbine_dept_id_2 = $conbineDeptIdInput2.val();
                break;
        }

        openLoading();
        School.saveAddNewDepartmentApplyInfo(data)
        .then((res) => {
            if(res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then((json) => {
            // console.log(json);
            alert(json.messages[0]);
            stopLoading();
            location.reload();
        })
        .catch((err) => {
            err.json && err.json().then((data) => {
                console.error(data);
                alert(`ERROR: \n${data.messages[0]}`);
                stopLoading();
            });
        });
    }

    // 請求刪除事件
    function _handleDelete() {
        if(confirm('確定要刪除此請求？')){
            openLoading();
            School.deleteAddNewDepartmentApply(currentApplyID)
            .then((res) => {
                if(res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then((json) => {
                // console.log(json);
                alert(json.messages[0]);
                stopLoading();
                location.reload();
            })
            .catch((err) => {
                err.json && err.json().then((data) => {
                    console.error(data);
                    alert(`ERROR: \n${data.messages[0]}`);
                    stopLoading();
                });
            });
        }
    }

    // 上傳檔案事件
    function _handleUploadFile() {
        // 可以一次上傳多個檔案 所以先取得遇上傳檔案清單
		const fileList = this.files;
        // 沒有上傳檔案 直接return
		if(fileList.length <= 0){
			return;
		}
        // 將檔案放到 FormData class中 方便後續request傳送檔案
		let sendData = new FormData();
		for (let i = 0; i < fileList.length; i++) {
            //偵測是否超過4MB
			if(sizeConversion(fileList[i].size,4)){
                alert(`Error: ${fileList[i].name}檔案過大，檔案大小不能超過4MB`)
				return;
			}
			sendData.append('files[]', fileList[i]);
		}

        openLoading();
        School.uploadAddNewDepartmentApplyFile(currentApplyID, sendData)
        .then((res) => {
            if(res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then((json) => {
            // console.log(json);
            $uploadedFiles = json;
        })
        .then(()=>{
            _handleRenderFile();
        })
        .then(()=>{
            stopLoading();
        })
        .catch((err) => {
            err.json && err.json().then((data) => {
                console.error(data);
                alert(`ERROR: \n${data.messages[0]}`);
                stopLoading();
            });
        });
    }

    // 檔案渲染事件
    function _handleRenderFile() {
        let uploadedAreaHtml = '';
        $uploadedFiles.forEach((file) => {
            const fileType = _getFileType(file.split('.')[1]);
            if(fileType === 'img'){
                uploadedAreaHtml += `
                    <img
                        class="img-thumbnail"
                        src="${env.baseUrl}/editors/add-new-department-apply-list/file/${currentApplyID}/${file}"
                        data-toggle="modal"
                        data-filename="${file}"
						data-target=".img-modal"
                        data-filetype="img"
                        data-filelink="${env.baseUrl}/editors/add-new-department-apply-list/file/${currentApplyID}/${file}"
                    />
                `
            } else {
                uploadedAreaHtml += `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-filelink="${env.baseUrl}/editors/add-new-department-apply-list/file/${currentApplyID}/${file}"
						data-filename="${file}"
                        data-filetype="${fileType}"
						data-icon="fa-file-${fileType}-o"
					>
						<i class="fa fa-file-${fileType}-o" data-filename="${file}" data-icon="fa-file-${fileType}-o" aria-hidden="true"></i>
					</div>
				`;
            }
        })
        $uploadedFileArea.innerHTML = uploadedAreaHtml;
    }

    // 檔案放大顯示事件
    function _handleShowFile(){
        // 取得點選的檔案名稱及類別
		const fileName = $(this).data('filename');
		const fileType = $(this).data('filetype');

		// 清空 modal 內容
		$imgModalBody.html('');

		// 是圖用 img tag pdf用 embed tag
		if (fileType === 'img') {
			$imgModalBody.html(`
				<img
					src="${this.src}"
					class="img-fluid rounded img-ori"
				>
			`);
		} else {
			$imgModalBody.html(`
				<div style="margin: 0 auto">
					<embed src="${this.dataset.filelink}" width="550" height="800" type="application/pdf">
				</div>
			`);
		}
        // 刪除檔案按鈕紀錄點選的檔案名稱及類別
		$deleteFileBtn.attr({
			'filetype': fileType,
			'filename': fileName,
		});
    }

    // 檔案刪除事件
    function _handleDeleteFile() {
        let fileName = $deleteFileBtn.attr('filename');
        if(confirm('確定要刪除此檔案？')){
            openLoading();
            School.deleteAddNewDepartmentApplyFile(currentApplyID,fileName)
            .then((res) => {
                if(res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then((json) => {
                // console.log(json);
                $uploadedFiles = json;
            })
            .then(()=>{
                _handleRenderFile();
            })
            .then(()=>{
                $imgModal.modal('hide');
                alert('刪除成功');
                stopLoading();
            })
            .catch((err) => {
                err.json && err.json().then((data) => {
                    console.error(data);
                    alert(`ERROR: \n${data.messages[0]}`);
                    stopLoading();
                });
            });
        }
    }

    //檔案大小計算是否超過 limit MB
	function sizeConversion(size,limit) {
		let maxSize = limit*1024*1024;

		return size >=maxSize;
	}

    // 副檔名與檔案型態對應（回傳值須符合 font-awesome 規範）
	function _getFileType(fileNameExtension = '') {
		switch (fileNameExtension) {
			case 'doc':
			case 'docx':
				return 'word';

			case 'mp3':
				return 'audio';

			case 'mp4':
			case 'avi':
				return 'video';

			case 'pdf':
				return 'pdf';

			default:
				return 'img';
		}
	}

})();