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

addLoadEvent(setCookie);
addLoadEvent(getCookie);
addLoadEvent(delCookie);