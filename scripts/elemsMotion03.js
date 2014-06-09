function elemsMotion()
{
	var oDiv = document.getElementById('div1');
	var oBtn = document.getElementById('btn1');
	var timer = null;
	oBtn.onclick = function()
	{
		clearInterval(timer);
		var repeat = function()
		{
			//在特定速度数的情况下，offsetLeft值加iSpeed值会出现大于300的情况导致停止运动条件失效，
			//为解决大数错位问题，将判断条件改为>=
			//framework1.2.3在iSpeed速度不变情况下做运动，称为匀速运行
			var iSpeed = 10;
			
			//为停止运动判断条件后消除定时器
			if(oDiv.offsetLeft >= 300)		//判断是否到达终点
			{
				clearInterval(timer);		//到达终点之后所处理的函数
			}
			else
			{
				//运行和停止的处理函数必须分离
				oDiv.style.left = oDiv.offsetLeft + iSpeed + 'px';		//到达终点之前所处理的函数
			}
		};
		timer = setInterval(repeat, 30);
	};
}

addLoadEvent(elemsMotion);