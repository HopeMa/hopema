---
# sidebar: auto
---
# 前端面试手写题

## 防抖和节流
防抖动，意味着一段时间间隔内，重复触发，都按最新的算，然后等待这段时间过去在执行，

节流是一段时间间隔内不管来了多少任务，都只执行一次计算

防抖动代码：
~~~ js
function stabilization(fn, time){
    let curTimeout = null
    return function(){
        if(curTimeout !== null) clearTimeout(curTimeout);
        curTimeout = setTimeout(()=> {
            fn.call(this, arguments);
        }), time)
    }
}

function  throttle(fn, time){
    // let curTimeout = null
    let isRun = true
    return function(){
        if(!isRun) return;
        isRun = false
        curTimeout = setTimeout(()=> {
            fn.call(this, arguments);
            isRun = true
        }), time)
    }
}
~~~

## 深拷贝

~~~ js

~~~

## 数组去重、数组乱序

~~~ js

~~~

## 手写call、apply、bind
## 继承（ES5/ES6）
## sleep函数
## 实现promise
## 实现promise.all
## 实现promise.retry    
## 将一个同步callback包装成promise形式
## 写一个函数，可以控制最大并发数
## jsonp的实现
## eventEmitter(emit,on,off,once)
## 实现instanceof
## 实现new
## 实现数组flat、filter等方法
## lazyMan