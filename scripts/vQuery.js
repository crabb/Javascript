//为对象绑定事件
function myAddEvent(obj, sEv, fn)
{
	if(obj.attachEvent)
	{
		obj.attachEvent('on' + sEv, function(){
			//利用call方法将this指向obj，当指定事件的回调函数需阻止事件时，让fn接住将返回值false并返回
			if(fn.call(obj) == false)
			{
				//IE中可以阻止默认事件
				return false;
				//IE中阻止冒泡
				event.cancelBubble = true;
			}
		});
	}
	else if(obj.addEventListener)
	{
		obj.addEventListener(sEv, function(ev){
			if(fn.call(obj) == false)
			{
				//FF,CHR中阻止默认事件所专用函数
				ev.preventDefault();
				//FF,CHR中阻止冒泡
				ev.cancelBubble = true;
			}
		}, false);
	}
}

//按类名获取元素
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

//获取元素样式值
function getStyle(obj, attr)
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

function Vquery(vArg)
{
	//保存选中的元素的数组
	this.elements = [];
	
	//选择器
	switch(typeof vArg)
	{
		//1.第一传参情况为函数时
		case 'function':
			myAddEvent(window, 'load', vArg);
			break;
		//2.第二传参情况为字符串：#->id .->class xxx->TagName
		case 'string':
			switch(vArg.charAt(0))
			{
				case '#':	//ID
					//截取从第1位开始的子字符串
					var obj = document.getElementById(vArg.substring(1));
					this.elements.push(obj);
					break;
				case '.':	//class
					//elements初始为空数组，将结果直接返回
					this.elements = getByClass(document, vArg.substring(1));
					break;
				default:	//TagName
					this.elements = document.getElementsByTagName(vArg);
			}
			break;
		//3.直接插入对象
		case 'object':
			this.elements.push(vArg);
	}
}

//为vquery对象原型上添加一个点击方法
Vquery.prototype.click = function(fn)
{
	for(var i = 0, len = this.elements.length;i < len; i++)
	{
		myAddEvent(this.elements[i], 'click', fn);
	}
	//返回自身形成链式操作
	return this;
};

Vquery.prototype.show = function()
{
	for(var i = 0, len = this.elements.length; i < len; i++)
	{
		this.elements[i].style.display = 'block';
	}
	//返回自身形成链式操作
	return this;
};

Vquery.prototype.hide = function()
{
	for(var i = 0, len = this.elements.length; i < len; i++)
	{
		this.elements[i].style.display = 'none';
	}
	//返回自身形成链式操作
	return this;
};

//移入移出事件
Vquery.prototype.hover = function(fnOver, fnOut)
{
	for(var i = 0, len = this.elements.length; i < len; i++)
	{
		myAddEvent(this.elements[i], 'mouseover', fnOver);
		myAddEvent(this.elements[i], 'mouseout', fnOut);
	}
	//返回自身形成链式操作
	return this;
};

//设置-获取样式:值
Vquery.prototype.css = function(attr, value)
{
	if(arguments.length == 2)
	{
		for(var i = 0, len = this.elements.length; i < len; i++)
		{
			
			this.elements[i].style[attr] = value;
		}
	}
	else
	{
		if(typeof attr == 'string')
		{
			return getStyle(this.elements[0], attr);
		}
		else
		{
			for(var i = 0, len = this.elements.length; i < len; i++)
			{
				for(var j in attr)
				{
					this.elements[i].style[j] = attr[j];
				}
			}
		}
	}
	//返回自身形成链式操作
	return this;
};

//设置-获取属性:值
Vquery.prototype.attr = function(attr, value)
{
	if(arguments.length == 2)
	{
		for(var i = 0, len = this.elements.length; i < len; i++)
		{
			this.elements[i][attr] = value;
		}
	}
	else
	{
		return this.elements[0][attr];
	}
	//返回自身形成链式操作
	return this;
};

//切换操作
Vquery.prototype.toggle = function()
{
	//包装arguments
	var _arguments = arguments;
	for(var i = 0, len = this.elements.length; i < len; i++)
	{
		addToggle(this.elements[i]);
	}
	
	function addToggle(obj)
	{
		//闭包计算器
		var count = 0;
		myAddEvent(obj, 'click', function(){
			//要计算出要执行的是第几函数，执行到第几次
			_arguments[count++ % _arguments.length].call(obj);
		});
	}
	//返回自身形成链式操作
	return this;
};

//获取单个元素
Vquery.prototype.eq = function(n)
{
	//用Vquery包装器包装当前元素为Vquery对象
	return V(this.elements[n]);
};

function appendArr(arr1, arr2)
{
	for(var i = 0, len = arr2.length; i < len; i++)
	{
		arr1.push(arr2[i]);
	}
}

//获取当前元素的子集
Vquery.prototype.find = function(str)
{
	//接收临时数据的变量数组
	var aResult = [];
	for(var i = 0, len = this.elements.length; i < len; i++)
	{
		switch(str.charAt(0))
		{
			case '.':	//以class获取
				var aEles = getByClass(this.elements[i], str.substring(1));
				//concat方法为连接数组的方法
				aResult = aResult.concat(aEles);
				break;
			default:	//以元素名称、ID获取
				var aEles = this.elements[i].getElementsByTagName(str);
				/*concat方法只能连接所有数组的对象，getElementsByTagName返回的aEles是HTML对象，非数组对象
				  所以不可用concat连接aEles对象到aResult数组对象*/
				//aResult = aResult.concat(aEles);
				appendArr(aResult, aEles);
		}
	}
	var vquery = V();
	vquery.elements = aResult;
	return vquery;
};

//获取对象的索引值
function getIndex(obj)
{
	var aSibling = obj.parentNode.children;
	for(var i = 0, len = aSibling.length; i < len; i++)
	{
		if(aSibling[i] == obj)
		{
			return i;
		}
	}
}

//获取包装集中元素的索引值
Vquery.prototype.index = function()
{
	return getIndex(this.elements[0]);
};

Vquery.prototype.bind = function(sEv, fn)
{
	for(var i = 0, len = this.elements.length; i < len; i++)
	{
		myAddEvent(this.elements[i], sEv, fn);
	}
};

//扩展插件机制
Vquery.prototype.extend = function(name, fn)
{
	Vquery.prototype[name] = fn;
};

//扩展自定义动画animate函数
V().extend('animate', function(json)
{
	for(var i = 0, len = this.elements.length; i < len; i++)
	{
		elemsMotion(this.elements[i], json);
	}
	
	function getStyle(obj, attr)
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
	
	function getByClass(oParent, sClass)
	{
		var aElems = document.getElementsByTagName('*');
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
	function elemsMotion(obj, json, fn)
	{
		clearInterval(obj.timer);
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
					obj.style.filter = 'filter: alpha(opacity: ' + (iCurr + iSpeed) + ')';
					obj.style.opacity = (iCurr + iSpeed) / 100;
					
					//解决闪烁问题：小数点后的精确度问题
					//document.getElementById('txt').value = obj.style.opacity;
				}
				else
				{
					obj.style[attr] = iCurr + iSpeed + 'px';
				}
			}
			if(bStop)
			{
				clearInterval(obj.timer);
				if(fn)
				{
					fn();
				}
			}
		};
		obj.timer = setInterval(repeat, 30);
	}
});

//扩展获取元素个数size函数
V().extend('size', function()
{
	return this.elements.length;
});

//扩展拖曳drag函数
V().extend('drag', function()
{
	for(var i = 0, len = this.elements.length; i < len; i++)
	{
		drag(this.elements[i]);
	}
	
	function drag(obj)
	{
	    if(!document.getElementById) return false;
	    if(!document.getElementsByTagName) return false;
	    
//	    var dragElem = document.getElementById(oDiv);
	    var disX = 0;
	    var disY = 0;
	    
	    var x = getCookie('x');
	    var y = getCookie('y');
	    
	    if(x)
	    {
	        obj.style.left = x + 'px';
	        obj.style.top = y + 'px';
	    }
	    
	    obj.onmousedown = function(ev)
	    {
	        var oEvent = ev || event;
	        disX = oEvent.clientX - obj.offsetLeft;
	        disY = oEvent.clientY - obj.offsetTop;
	        
	        document.onmousemove = function(ev)
	        {
	            var oEvent = ev || event;
	            var l = oEvent.clientX - disX;
	            var t = oEvent.clientY - disY;
	            var dl = document.documentElement.clientWidth;
	            var dt = document.documentElement.clientHeight;
	            
	            if(l < 0)
	            {
	                l = 0;
	            }
	            else if(l > dl - obj.offsetWidth)
	            {
	                l = dl - obj.clientWidth;
	            }
	            
	            if(t < 0)
	            {
	                t = 0;
	            }
	            else if(t > dt - obj.offsetHeight)
	            {
	                t = dt - obj.offsetHeight;
	            }
	            
	            obj.style.left = l + 'px';
	            obj.style.top = t + 'px';
	        };
	        
	        document.onmouseup = function()
	        {
	            document.onmousemove = null;
	            document.onmouseup = null;
	            setCookie('x', obj.offsetLeft, 5);
	            setCookie('y', obj.offsetTop, 5);
	        };
	    };
	    
	    return false;
	}
	
	//设置cookie
	function setCookie(name, value, expiresdays)
	{
	    var exday = new Date();
	    exday.setDate(exday.getDate() + expiresdays);
	    document.cookie = name + '=' + value + ';expires=' + exday.toGMTString();
	}
	
	//获取cookie
	function getCookie(name)
	{
	    var arr = document.cookie.split('; ');
	//    var i = 0;
	    for(var i = 0, len = arr.length; i < len; i++)
	    {
	        var arr2 = arr[i].split('=');
	        if(arr2[0] == name)
	        {
	            return arr2[1];
	        }
	    }
	    
	    return '';
	}
	
	//删除cookie
	function delCookie(name)
	{
	    setCookie(name, '1', -1);
	}
});

//提供简易写法的封装函数
function V(vArg)
{
	return new Vquery(vArg);
}



