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

funtion deepCopy(obj){
    if (!isObject(source)) return source; 
    if (hash.has(source)) return hash.get(source); 
      
    let target = Array.isArray(source) ? [...source] : { ...source }; // 改动 1
    hash.set(source, target);
    
  	Reflect.ownKeys(target).forEach(key => { // 改动 2
        if (isObject(source[key])) {
            target[key] = cloneDeep4(source[key], hash); 
        } else {
            target[key] = source[key];
        }  
  	});
    return target;
}

function isObject(obj) {
    // return Object.prototype.toString.call(obj) === '[object Object]'; // 数组不行
    return typeof obj === 'object' && obj != null;
}

~~~

## 数组去重、数组乱序

~~~ js

function dupRemove(arr){
    return [...new Set(arr)]
}

~~~

## 手写call、apply、bind
## 继承（ES5/ES6）
## sleep函数
## 实现promise
## 实现promise.all
## 实现promise.retry    
## 将一个同步callback包装成promise形式
## 写一个函数，可以控制最大并发数

1，请实现如下的函数，可以批量请求数据，所有的URL地址在urls参数中，同时可以通过max参数 控制请求的并发度。当所有的请求结束后，需要执行callback回调。发请求的函数可以直接使用fetch。

~~~ js
function sendRequest (urls: string[], max: number, callback: () => void) {
}

function sendRequest (urls: string[], max: number, callback: () => void) {
    let fetchArr = [], // 存储当前要执行的所有并发函数
        i = 0; // 执行到第几个了
    function toFetch(){
        if(i=== urls.length){ 
            return Promise.resolve()
        }
        let curUrl = fetch(urls[i++])
        fetchArr.push(curUrl)
        curUrl.then(() => fetchArr.splice(fetchArr.indexOf(curUrl),1)); // 把执行完的删掉
        if(fetchArr.length >= max){ // 超过最大的就等待最快的那个执行完在执行
            return Promise.race(fetchArr).then(() => toFetch())
        }
        return Promise.resolve().then(()=> toFetch())
    }
    toFetch()
    // arr循环完后， 现在fetchArr里面剩下最后max个promise对象， 使用all等待所有的都完成之后执行callback
    .then(() => Promise.all(fetchArr)) 
    .then(() => {
        callback();
    })
}

~~~

## jsonp的实现
## eventEmitter(emit,on,off,once)
## 实现instanceof
## 实现new
## 实现数组flat、filter等方法
## lazyMan