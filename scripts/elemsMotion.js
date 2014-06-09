function getStyle(obj, attr)
{
	if(arguments.length == 2)
	{
		if(obj.currentStyle)
		{
			return obj.currentStyle[attr];
		}
		else
		{
			//getComputedStyle()为获取非行间样式函数
			return getComputedStyle(obj, false)[attr];
		}
	}
	else if(arguments.length == 3)
	{
		obj.style[attr] = value;
	}
}

function getByClass(oParn, sClass)
{
	var oParent = oParn || document;
	var aElems = oParent.getElementsByTagName('*');
	var aResult = [];
	for(var i = 0, len = aElems.length; i < len; i++)
	{
		if(aElems[i].className == sClass)
		{
			aResult.push(aElems[i]);
		}
	}
	return aResult;
}

//改变传参，添加一个属性参数
function elemsMotion(obj, attr, iTarget, fn)
{
	clearInterval(obj.timer);
	var repeat = function()
	{
		/*
		 * 用getStyle函数获取当前物体的属性值，代替所有offsetWidth
		 * BUG3:
		 * iCurr用parseInt取整对于宽高等属性取值不会出问题，但对透明度(0.3)无法取整(0)，
		 * 为支持透明度做判断条件
		 */
		var iCurr = 0;
		if(attr == 'opacity')
		{
			//将处理透明度值改为parseFloat，再*100取整作兼容
			//为解决小数点后的精确度导致闪烁问题再取整
			iCurr = parseInt(parseFloat(getStyle(obj, attr) * 100));
		}
		else
		{
			iCurr = parseInt(getStyle(obj, attr));
		}

		//缓冲运动定义速度并取整
		var iSpeed = (iTarget - iCurr) / 8;
		iSpeed = (iSpeed > 0) ? Math.ceil(iSpeed) : Math.floor(iSpeed);


		if(iCurr == iTarget)
		{
			clearInterval(obj.timer);
			if(fn)
			{
				fn();
			}
		}
		else
		{
			//为透明度处理作判断条件
			if(attr == 'opacity')
			{
				obj.style.filter = 'alpha(opacity: ' + (iCurr + iSpeed) + ')';
				obj.style.opacity = (iCurr + iSpeed) / 100;

				//解决闪烁问题：小数点后的精确度问题
				//document.getElementById('txt').value = obj.style.opacity;
			}
			else
			{
				obj.style[attr] = iCurr + iSpeed + 'px';
			}
		}
	};
	obj.timer = setInterval(repeat, 30);
}
