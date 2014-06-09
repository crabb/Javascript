function drag(dragElem) {
	if (!document.getElementById)
		return false;
	if (!document.getElementsByTagName)
		return false;

	var disX = 0;
	var disY = 0;

	var x = getCookie('x');
	var y = getCookie('y');

	dragElem.onmousedown = function(ev) {
		var oEvent = ev || event;
		disX = oEvent.clientX - dragElem.offsetLeft;
		disY = oEvent.clientY - dragElem.offsetTop;

		//鼠标按下时创建虚线物体
		var oDashDiv = document.createElement('div');
		oDashDiv.className = 'dashdiv';
		//将原物体的大小及位置赋予虚线物体
		oDashDiv.style.left = dragElem.offsetLeft + 'px';
		oDashDiv.style.top = dragElem.offsetTop + 'px';
		//减少上下左右各1像素边框
		oDashDiv.style.width = dragElem.offsetWidth - 2 + 'px';
		oDashDiv.style.height = dragElem.offsetHeight - 2 + 'px';

		//将虚线物体插入页面中
		document.body.appendChild(oDashDiv);

		document.onmousemove = function(ev) {
			var oEvent = ev || event;
			var l = oEvent.clientX - disX;
			var t = oEvent.clientY - disY;
			var dl = document.documentElement.clientWidth;
			var dt = document.documentElement.clientHeight;

			//磁性吸附只需将l<0改为l<50
			if (l < 50) {
				l = 0;
			} else if (l > dl - oDashDiv.offsetWidth - 50) {
				l = dl - oDashDiv.offsetWidth;
			}

			if (t < 50) {
				t = 0;
			} else if (t > dt - oDashDiv.offsetHeight - 50) {
				t = dt - oDashDiv.offsetHeight;
			}

			oDashDiv.style.left = l + 'px';
			oDashDiv.style.top = t + 'px';
			//不再移动原物体
			//			dragElem.style.left = l + 'px';
			//          dragElem.style.top = t + 'px';

		};

		document.onmouseup = function() {
			document.onmousemove = null;
			document.onmouseup = null;

			//将原物体移动至虚线物体的当前位置
			dragElem.style.left = oDashDiv.style.left;
			dragElem.style.top = oDashDiv.style.top;

			//鼠标抬起时将虚线框消除
			document.body.removeChild(oDashDiv);

			//判断释放IE下的事件捕获
			if (dragElem.releaseCapture) {
				oDashDiv.releaseCapture();
			}
			setCookie('x', oDashDiv.offsetLeft, 5);
			setCookie('y', oDashDiv.offsetTop, 5);
			return false;
		};
		//判断IE下为拖拽特例添加事件捕获
		if (oDashDiv.setCapture) {
			oDashDiv.setCapture();
		}
		return false;
	};
}

addLoadEvent(drag); 