(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{209:function(t,a,s){"use strict";s.r(a);var e=s(0),r=Object(e.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"如何制作自己的微信机器人"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#如何制作自己的微信机器人","aria-hidden":"true"}},[t._v("#")]),t._v(" 如何制作自己的微信机器人")]),t._v(" "),s("h2",{attrs:{id:"通过图灵机器人"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#通过图灵机器人","aria-hidden":"true"}},[t._v("#")]),t._v(" 通过图灵机器人")]),t._v(" "),s("p",[t._v("之前给各位介绍过别样的微信，可以实现一些自动化的功能。今天来分享如何制作一个微信机器人陪你聊天？工具依然是强大的python，而代码也只有几行而已。")]),t._v(" "),s("p",[t._v("在制作之前，需要在图灵机器人的官方网站注册申请一个APIKey，等会需要用到。")]),t._v(" "),s("p",[t._v("在官方注册之后，创建一个机器人之后，就会分配一个APIKey。")]),t._v(" "),s("p",[t._v("安装好python和wxpy库之后，在桌面新建一个python文件，输入如下的代码：")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" wxpy "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v("\nbot "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" Bot"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#api可以直接用，也可去图灵机器人官网申请")]),t._v("\ntuling "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" Tuling（api_key"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("''")]),t._v("）\n@bot"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("register"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("msg_types"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("TEXT"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("auto_reply_all")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("msg"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    tuling"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("do_reply"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("msg"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nbot"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("join\n")])])]),s("p",[t._v("记得把上面获得的APIKey输入到代码当中去，运行。")]),t._v(" "),s("p",[t._v("接下来会弹出一个二维码，用微信扫码登录之后，你的微信便成为一个聊天机器人。这个时候可以用另外一个微信和它聊天了。如下演示：（左边为机器人微信）")]),t._v(" "),s("h2",{attrs:{id:"通过itchat"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#通过itchat","aria-hidden":"true"}},[t._v("#")]),t._v(" 通过itchat")]),t._v(" "),s("p",[t._v("https://itchat.readthedocs.io/zh/latest/")]),t._v(" "),s("h2",{attrs:{id:"通过wechatrobot"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#通过wechatrobot","aria-hidden":"true"}},[t._v("#")]),t._v(" 通过WeChatRobot")]),t._v(" "),s("p",[t._v("https://github.com/TonyChen56/WeChatRobot")]),t._v(" "),s("h2",{attrs:{id:"通过wechaty"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#通过wechaty","aria-hidden":"true"}},[t._v("#")]),t._v(" 通过wechaty")]),t._v(" "),s("p",[t._v("https://github.com/Chatie/wechaty")]),t._v(" "),s("h2",{attrs:{id:"通过wkteam"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#通过wkteam","aria-hidden":"true"}},[t._v("#")]),t._v(" 通过wkteam")]),t._v(" "),s("p",[t._v("https://wkteam.gitbook.io/doc/")])])}),[],!1,null,null,null);a.default=r.exports}}]);