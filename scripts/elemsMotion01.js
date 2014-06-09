function elemsMotion()
{
	var oDiv = document.getElementById('div1');
	var oBtn = document.getElementById('btn1');
	oBtn.onclick = function()
	{
		var repeat = function()
		{
			oDiv.style.left = oDiv.offsetLeft + 5 + 'px';
		};
		timer = setInterval(repeat, 30);
	};
}

addLoadEvent(elemsMotion);
