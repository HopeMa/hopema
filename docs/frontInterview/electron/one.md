---
# sidebar: auto
---
# electron遇到问题积累
1. [electron窗口插入js](#electron窗口插入js)
## electron窗口插入js
   可以通过下面的形式加入在electron中插入定义的js   
~~~ js
    ciscoWindow.webContents.executeJavaScript('',true)
~~~