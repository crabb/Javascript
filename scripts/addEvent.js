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