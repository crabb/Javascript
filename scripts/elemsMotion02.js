function elemsMotion()
{
	var oDiv = document.getElementById('div1');
	var oBtn = document.getElementById('btn1');
	var timer = null;
	oBtn.onclick = function()
	{
		var repeat = function()
		{
			//在特定速度数的情况下，offsetLeft值加iSpeed值会出现大于300的情况导致停止运动条件失效，
			//为解决大数错位问题，将判断条件改为>=
			var iSpeed = 7;
			
			//为停止运动判断条件后消除定时器
			if(oDiv.offsetLeft >= 300)		//判断是否到达终点
			{
				clearInterval(timer);		//到达终点之后所处理的函数
			}
			//问题点：运动停止后再点击按钮仍会重新执行一次函数，导致物体仍会运动
			oDiv.style.left = oDiv.offsetLeft + iSpeed + 'px';		//到达终点之前所处理的函数
		};
		timer = setInterval(repeat, 30);
	};
}

addLoadEvent(elemsMotion);
