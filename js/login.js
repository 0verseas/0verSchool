var login = (function () {

	/**
	 * cache DOM
	 */

	var $username = $('#username');
	var $password = $('#password');
	var $loginBtn = $('#btn-login');
	var $errMsg = $('#errMsg');
	var $getStatus = $('#getStatus');
	const $identifyingCanvas = $('#identifying-canvas');  // 圖形驗證碼區域
	const $identifyingCode = $('#identifying-code');  // 使用者輸入的圖形驗證碼
	let identifyingCode = '';  // 隨機產生的圖形驗證碼

	/**
	 * bind event
	 */

	$loginBtn.on('click', _login);
	$identifyingCode.on('keydown', _login);
	$getStatus.on('click', _getStatus);
	$identifyingCanvas.on('click', generateCode);  // 點擊圖片可更新驗證碼

	/**
	 * init
	 */

	generateCode();

	// 登入：
	// 200: 跳轉至 /school
	// 401: 顯示錯誤訊息
	function _login(e) {
		if (e.type == 'keydown' && e.keyCode != 13) {
			return;
		}

		// 確認驗證碼是否一致
		let code = $identifyingCode.val();
		// 通通轉大寫後比對
		if(code.toUpperCase() !== identifyingCode){
			alert('驗證碼不正確');
			generateCode();  // 打錯就要重來
			return;
		}
		generateCode();

		var username = $username.val();
		var password = $password.val();

		if (!username || !password) {
			return;
		}

		var loginForm = {
			username: username,
			password: sha256(password)
		}

		User.login(loginForm).then(function(res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res.status;
			}
		}).then(function(json) {
			console.log(json);
			window.location.href = '/school/index.html';
			// window.location.href = '/school/systemQuota.html'
		}).catch(function(err) {
			if (err == 401) {
				$errMsg.finish().show().text('帳號密碼錯誤。').fadeOut(1500);
			} else if(err == 429){  // 429 Too Many Requests
				$errMsg.finish().show().text('錯誤次數太多，請稍後再試。').fadeOut(3000);
			}
		})
	}

	function _getStatus() {
		User.isLogin().then(function(res) {
			if(res.ok) {
				return res.json();
			} else {
				throw res
			}
		}).then(function(json) {
			console.log(json);
		}).catch(function(err) {
			console.log(err);
		})
	}

	// 產生圖形驗證碼
	function generateCode(){

		// 隨機產生數字
		function randomNumber(min, max){
			return Math.floor(Math.random()*(max-min)+min);  // 隨機產生一個在min~max之間的整數
		}

		// 隨機顏色色碼
		function randomColor(min, max){

			let r = randomNumber(min, max);
			let g = randomNumber(min, max);
			let b = randomNumber(min, max);

			return "rgb("+r+","+g+","+b+")";
		}

		// 取得畫布物件屬性
		let canvas = document.getElementById('identifying-canvas');
		let width = canvas.width;
		let height = canvas.height;
		let context = canvas.getContext('2d');

		// 基礎設定 設置文本基線在底部  背景顏色  方形繪製
		context.textBaseline = 'bottom';
		context.fillStyle = randomColor(200,240);
		context.fillRect(0,0,width,height);

		// 隨機字母表   去除相似的 1 I   0 O
		let codeList = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

		let codeString = '';

		// 隨機產生4個字母
		for(let i = 0; i<4 ; i++){
			let code = codeList[randomNumber(0,codeList.length)];
			codeString += code;

			context.fillStyle = randomColor(50,160);
			context.font = randomNumber(25,30)+ 'px Arial';  // 字體大小25~30隨機

			let x = 10+i*25;
			let y = randomNumber(30,35);  // 隨機高度
			let angle = randomNumber(-30,30);  // 隨機旋轉角度

			context.translate(x,y);  //移動繪製初始位置
			context.rotate(angle*Math.PI/180);  // 旋轉繪製初始位置

			context.fillText(code,0,0);

			context.rotate(-angle*Math.PI/180);  // 返回繪製初始位置
			context.translate(-x,-y);  // 返回繪製初始位置
		}

		// 產生干擾線
		for(let i =0;i<2;i++){
			context.strokeStyle = randomColor(40,180);

			context.beginPath();

			context.moveTo( randomNumber(0,width), randomNumber(0,height));

			context.lineTo( randomNumber(0,width), randomNumber(0,height));

			context.stroke();
		}

		// 產生干擾點
		for(let i=0 ; i<50 ; i++){
			context.fillStyle = randomColor(0,255);

			context.beginPath();

			context.arc( randomNumber(0,width), randomNumber(0,height),1,0,2*Math.PI);

			context.fill();
		}

		// 紀錄驗證碼
		identifyingCode = codeString;
	}

})();
