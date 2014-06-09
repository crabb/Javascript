function getStyle(obj, attr, value)
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
	//添加正则完全匹配类名
	var reg = new RegExp('\\b' + sClass + '\\b');
	for(var i = 0, len = aElems.length; i < len; i++)
	{
//		if(aElems[i].className == sClass)
		if(reg.test(aElems[i].className))
		{
			aResult.push(aElems[i]);
		}
	}
	return aResult;
}

//改变传参，添加一个属性参数
function elemsMotion(obj, json, fn)
{
	if(obj.timer)
	{
		clearInterval(obj.timer);
	}
	var repeat = function()
	{
		/*
		 * BUG1:
		 * 传参加一个obj，为指明当前须运动的是哪个物体，
		 * 多物体运动会造成多个物体抢用一个定时器的bug，
		 * 解决办法：为每个物体自定义一个定时器aDiv[i].timer = null;
		 * 清除定时器时改为清除当前物体的定时器clearInterval(obj.timer);
		 * 重开定时器时改为重开当前物体的定时器timer = setInterval(obj.repeat, 30);
		 */
		/*
		 * BUG2:
		 * 为避免多个物体的alpha值共用一个全局变量alpha值，
		 * 须为每个物体增加一个自定义alpha属性obj.alpha
		 *
		 * 总结：
		 * 多物体运动框架所有属性值不能共用;
		 * 为物体绑定自己的属性
		 */
		/*
		 * 用getStyle函数获取当前物体的属性值，代替所有offsetWidth
		 * BUG3:
		 * iCurr用parseInt取整对于宽高等属性取值不会出问题，但对透明度(0.3)无法取整(0)，
		 * 为支持透明度做判断条件
		 */
		var bStop = true;  //标志，假设当前所有需运动的值都到达了目标点
		for(var attr in json)
		{
			//取当前值
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

			//计算速度
			//缓冲运动定义速度并取整
			var iSpeed = (json[attr] - iCurr) / 8;
			iSpeed = (iSpeed > 0) ? Math.ceil(iSpeed) : Math.floor(iSpeed);

			//检测停止条件
			if(iCurr != json[attr])
			{
				bStop = false;
			}

			//为透明度处理作判断条件
			if(attr == 'opacity')
			{
				obj.style.filter = 'alpha(opacity: ' + (iCurr + iSpeed) + ')';
				obj.style.opacity = (iCurr + iSpeed) / 100;

				//解决闪烁问题：小数点后的精确度问题
				//document.getElementById('txt').value = obj.style.opacity;
			}
			else if(attr == 'background')
			{
				obj.style[attr] = json[attr];
			}
			else
			{
				obj.style[attr] = iCurr + iSpeed + 'px';
			}
		}
		if(bStop)
		{
			clearInterval(obj.timer);
			if(fn && typeof(fn) === 'function')
			{
				fn();
			}
		}
	};
	obj.timer = setInterval(repeat, 30);
}
