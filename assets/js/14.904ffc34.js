(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{234:function(t,r,e){"use strict";e.r(r);var a=e(0),v=Object(a.a)({},(function(){var t=this,r=t.$createElement,e=t._self._c||r;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h2",{attrs:{id:"chrome进程"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#chrome进程","aria-hidden":"true"}},[t._v("#")]),t._v(" chrome进程")]),t._v(" "),e("p",[t._v("目前新chrome浏览器是多进程架构的\n包括的主要进程：")]),t._v(" "),e("ul",[e("li",[t._v("Browser浏览器进程")]),t._v(" "),e("li",[t._v("网络进程")]),t._v(" "),e("li",[t._v("GPU进程")]),t._v(" "),e("li",[t._v("多个插件进程")]),t._v(" "),e("li",[t._v("多个渲染进程")])]),t._v(" "),e("h3",{attrs:{id:"渲染进程"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#渲染进程","aria-hidden":"true"}},[t._v("#")]),t._v(" 渲染进程")]),t._v(" "),e("p",[t._v("其中渲染进程包括了")]),t._v(" "),e("ul",[e("li",[t._v("GUI渲染线程")]),t._v(" "),e("li",[t._v("JS引擎线程")]),t._v(" "),e("li",[t._v("事件触发线程（和EventLoop密切相关）")]),t._v(" "),e("li",[t._v("定时触发器线程")]),t._v(" "),e("li",[t._v("异步HTTP请求线程")])]),t._v(" "),e("blockquote",[e("p",[t._v("GUI渲染线程和JS引擎线程是互斥的，为了防止DOM渲染的不一致性，其中一个线程执行时另一个线程会被挂起。")])]),t._v(" "),e("h2",{attrs:{id:"js协程概念"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#js协程概念","aria-hidden":"true"}},[t._v("#")]),t._v(" js协程概念")]),t._v(" "),e("p",[t._v("协程在js的主要用处是Generator函数，以及基于generator的异步终极解决方案async和await函数\n"),e("a",{attrs:{href:"http://zhangchen915.com/index.php/archives/719/",target:"_blank",rel:"noopener noreferrer"}},[t._v("JS 中的协程（Coroutine）"),e("OutboundLink")],1)]),t._v(" "),e("h3",{attrs:{id:"协程优点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#协程优点","aria-hidden":"true"}},[t._v("#")]),t._v(" 协程优点")]),t._v(" "),e("ol",[e("li",[e("strong",[t._v("单线程环境中的并发")]),t._v("：一些编程语言/环境只有一个线程。这时如果需要并发，协程是唯一的选择。（注意JS规范没有事件循环）")]),t._v(" "),e("li",[e("strong",[t._v("简化代码")]),t._v("：可以避免回调地狱")]),t._v(" "),e("li",[e("strong",[t._v("有效利用操作系统资源和硬件")]),t._v("：协程相比线程，占用资源更少，上下文更快")])])])}),[],!1,null,null,null);r.default=v.exports}}]);