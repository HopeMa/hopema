---
# sidebar: auto
---
# 工作遇到的问题积累
1. [input框js自动输入触发change改变](#input框js自动输入触发change改变)
2. [nvm安装的默认system不起作用](#nvm安装的默认system不起作用)
## input框js自动输入触发change改变
   如何通过js脚本修改input.value触发onchange，以及oninput，应用，比如在其他的网页端，你需要跳过一些步骤，通过js脚本注入实现自动输入  
### 通过UIEvents监听change事件
~~~ js
// 
var evtObj = document.createEvent('UIEvents');
evtObj.initUIEvent('input', true, true, window, 1 )               
ele.dispatchEvent(evtObj);
~~~

### UIEvent不起作用时
~~~ js
var element = document.getElementById('idTxtBx_SAOTCC_OTC');    
var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        element.dispatchEvent(evt);
~~~

### react里面如何触发change改变
~~~ js
    // 因为react本身劫持了数据，所以光是上面的事件已经不够用了，所以需要加入下面的一句话
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  
  setValue.call(inputele, '会议室607');
  var event = new Event('input', { bubbles: true });
  inputele.dispatchEvent(event);
~~~

## nvm安装的默认system不起作用
mac每次都会出现下面这个问题
~~~ sh
nvm is not compatible with the npm config "prefix" option: currently set to "/usr/local"
Run `npm config delete prefix` or `nvm use --delete-prefix v10.16.2 --silent` to unset it.
~~~
修改.bash_profile
~~~ sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
~~~
修改nvm权限
~~~ sh
xxx@n12313:~$ chmod 777 .nvm
~~~
