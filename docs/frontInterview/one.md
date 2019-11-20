---
# sidebar: auto
# markdown:
#   -lineNumbers: true
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

~~~ js

Function.prototype.mycall = function(context){
    console.log('this type', typeof this)
    if (typeof this !== 'function') {
        throw new TypeError('Error')
    }
    context = context || windows
    context.fn = this
    let args = [...arguments].slice(1)
    let result = context.fn(...args)
    delete context.fn
    return result
}
Function.prototype.myapply = function(context){
    console.log('this type', typeof this)
    if (typeof this !== 'function') {
        throw new TypeError('Error')
    }
    context = context || windows
    context.fn = this
    let result 
    // 处理参数和 call 有区别
    if (arguments[1]) {
        result = context.fn(...arguments[1])
    } else {
        result = context.fn()
    }
    delete context.fn
    return result
}

Function.prototype.mybind = function(oThis){
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
          return fToBind.apply(this instanceof fBound
                 ? this
                 : oThis,
                 // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    // 维护原型关系
    if (this.prototype) {
      // 当执行Function.prototype.bind()时, this为Function.prototype 
      // this.prototype(即Function.prototype.prototype)为undefined
      fNOP.prototype = this.prototype; 
    }
    // 下行的代码使fBound.prototype是fNOP的实例,因此
    // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
    fBound.prototype = new fNOP();

    return fBound;
}

function MyBind(oThis){
    if(typeof this !== 'function'){
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }
    let arg = Array.prototype.slice.call(arguments, 1)
    let fToBind = this 
    let fNOP = function(){}
    let fBound = function(){
        return fToBind.apply(this instanceof fBound ? this:oThis, arg.concat([...arguments]))
    }
    if(this.prototype){
        fNOP.prototype = this.prototype; 
    }
    fBound.prototype = new fNOP();
    return fBound
}

function myNew(fn){
    //   创建一个空对象
    let obj = {}
    //  设置空对象的原型
    let fn = [].shift.call(arguments)
    //  获取构造函数
    obj.__proto__ = fn.prototype
    // obj.__proto__.constructor = fn.prototype
    // 绑定 this 并执行构造函数
    let result = fn.apply(obj, arguments)
    // obj.construtor = con  
    // 确保返回值为对象
    return result instanof Object ? result : obj
}

~~~

## 继承（ES5/ES6）
## sleep函数
## 实现promise
### Promis注意点
Promise有三种状态  
等待中（pending）  
完成了（resolved）  
拒绝了（rejected）

当我们在构造 Promise 的时候，构造函数内部的代码是立即执行的, 所以里面的异步会根据时间来判断是否会比外面的先执行
~~~ js
let pro = new Promise((resolve, reject) => {
  console.log('new Promise')
  setTimeout(()=>{
        console.log('异步')
        resolve('success')
  })
})
setTimeout(()=>{
    console.log('ceshi')
    pro.then(()=>{
        console.log('setPro')
    })
},5000)

console.log('finifsh')
// new Promise -> finifsh -> 异步 -> ceshi ->  setPro

// Promise 链式调用，如果在then里面return了值，始终是promise，如果不是，会被promise.resolve()包装
Promise.resolve('ceshi')
  .then(res => {
    console.log(res) // => ceshi
    return 'ceshi2' // 包装成 Promise.resolve('ceshi2')
  })
  .then(res => {
    console.log(res) // => 'ceshi2'
  })
~~~

### 手写promise

~~~ js
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'
function MyPromise(fn){
    let self = this
    this.state = PENDING
    this.value = null
    this.resolvedCallbacks = []
    this.rejectedCallbacks = []
    function resolve(value){
        if(value instanceof MyPromise){
            return value.then(resolve, reject)
        }
        setTimeout(()=>{

        })
        if(self.state === PENDING){
            self.state = RESOLVED
            self.value = value
            self.resolvedCallbacks.map(cb=> cb(self.value))
        }
    }
    function reject(value){
         if(self.state === PENDING){
            self.state = REJECTED
            self.value = value
            self.rejectedCallbacks.map(cb=> cb(self.value))
        }
    }
    try {
        fn(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

MyPromise.prototype.then = function (onFulfilled, onRejected){
    const self = this
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function'? onRejected : r => {throw r}
    if (self.state === RESOLVED) {
        onFulfilled(self.value)
    }
    if (that.state === REJECTED) {
        onRejected(self.value)
    }
    if (self.state === PENDING) {
        self.resolvedCallbacks.push(onFulfilled)
        self.rejectedCallbacks.push(onRejected)
    } 
}

~~~

## 实现promise.all

Promise 实现 遵循promise/A+规范
~~~ js
/**
 * Promise 实现 遵循promise/A+规范
 * Promise/A+规范译文:
 * https://promisesaplus.com 
 */

// promise 三个状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function Promise(excutor) {
    let that = this; // 缓存当前promise实例对象
    that.status = PENDING; // 初始状态
    that.value = undefined; // fulfilled状态时 返回的信息
    that.reason = undefined; // rejected状态时 拒绝的原因
    that.onFulfilledCallbacks = []; // 存储fulfilled状态对应的onFulfilled函数
    that.onRejectedCallbacks = []; // 存储rejected状态对应的onRejected函数

    function resolve(value) { // value成功态时接收的终值
        if(value instanceof Promise) {
            return value.then(resolve, reject);
        }

        // 为什么resolve 加setTimeout?
        // 2.2.4规范 onFulfilled 和 onRejected 只允许在 execution context 栈仅包含平台代码时运行.
        // 注1 这里的平台代码指的是引擎、环境以及 promise 的实施代码。实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。

        setTimeout(() => {
            // 调用resolve 回调对应onFulfilled函数
            if (that.status === PENDING) {
                // 只能由pending状态 => fulfilled状态 (避免调用多次resolve reject)
                that.status = FULFILLED;
                that.value = value;
                that.onFulfilledCallbacks.forEach(cb => cb(that.value));
            }
        });
    }

    function reject(reason) { // reason失败态时接收的拒因
        setTimeout(() => {
            // 调用reject 回调对应onRejected函数
            if (that.status === PENDING) {
                // 只能由pending状态 => rejected状态 (避免调用多次resolve reject)
                that.status = REJECTED;
                that.reason = reason;
                that.onRejectedCallbacks.forEach(cb => cb(that.reason));
            }
        });
    }

    // 捕获在excutor执行器中抛出的异常
    // new Promise((resolve, reject) => {
    //     throw new Error('error in excutor')
    // })
    try {
        excutor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

/**
 * resolve中的值几种情况：
 * 1.普通值
 * 2.promise对象
 * 3.thenable对象/函数
 */

/**
 * 对resolve 进行改造增强 针对resolve中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {  // 如果从onFulfilled中返回的x 就是promise2 就会导致循环引用报错
        return reject(new TypeError('循环引用'));
    }

    let called = false; // 避免多次调用
    // 如果x是一个promise对象 （该判断和下面 判断是不是thenable对象重复 所以可有可无）
    if (x instanceof Promise) { // 获得它的终值 继续resolve
        if (x.status === PENDING) { // 如果为等待态需等待直至 x 被执行或拒绝 并解析y值
            x.then(y => {
                resolvePromise(promise2, y, resolve, reject);
            }, reason => {
                reject(reason);
            });
        } else { // 如果 x 已经处于执行态/拒绝态(值已经被解析为普通值)，用相同的值执行传递下去 promise
            x.then(resolve, reject);
        }
        // 如果 x 为对象或者函数
    } else if (x != null && ((typeof x === 'object') || (typeof x === 'function'))) {
        try { // 是否是thenable对象（具有then方法的对象/函数）
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {
                    if(called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, reason => {
                    if(called) return;
                    called = true;
                    reject(reason);
                })
            } else { // 说明是一个普通对象/函数
                resolve(x);
            }
        } catch(e) {
            if(called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

/**
 * [注册fulfilled状态/rejected状态对应的回调函数]
 * @param  {function} onFulfilled fulfilled状态时 执行的函数
 * @param  {function} onRejected  rejected状态时 执行的函数
 * @return {function} newPromsie  返回一个新的promise对象
 */
Promise.prototype.then = function(onFulfilled, onRejected) {
    const that = this;
    let newPromise;
    // 处理参数默认值 保证参数后续能够继续执行
    onFulfilled =
        typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected =
        typeof onRejected === "function" ? onRejected : reason => {
            throw reason;
        };

    // then里面的FULFILLED/REJECTED状态时 为什么要加setTimeout ?
    // 原因:
    // 其一 2.2.4规范 要确保 onFulfilled 和 onRejected 方法异步执行(且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行) 所以要在resolve里加上setTimeout
    // 其二 2.2.6规范 对于一个promise，它的then方法可以调用多次.（当在其他程序中多次调用同一个promise的then时 由于之前状态已经为FULFILLED/REJECTED状态，则会走的下面逻辑),所以要确保为FULFILLED/REJECTED状态后 也要异步执行onFulfilled/onRejected

    // 其二 2.2.6规范 也是resolve函数里加setTimeout的原因
    // 总之都是 让then方法异步执行 也就是确保onFulfilled/onRejected异步执行

    // 如下面这种情景 多次调用p1.then
    // p1.then((value) => { // 此时p1.status 由pending状态 => fulfilled状态
    //     console.log(value); // resolve
    //     // console.log(p1.status); // fulfilled
    //     p1.then(value => { // 再次p1.then 这时已经为fulfilled状态 走的是fulfilled状态判断里的逻辑 所以我们也要确保判断里面onFuilled异步执行
    //         console.log(value); // 'resolve'
    //     });
    //     console.log('当前执行栈中同步代码');
    // })
    // console.log('全局执行栈中同步代码');
    //

    if (that.status === FULFILLED) { // 成功态
        return newPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                try{
                    let x = onFulfilled(that.value);
                    resolvePromise(newPromise, x, resolve, reject); // 新的promise resolve 上一个onFulfilled的返回值
                } catch(e) {
                    reject(e); // 捕获前面onFulfilled中抛出的异常 then(onFulfilled, onRejected);
                }
            }); 
        })
    }

    if (that.status === REJECTED) { // 失败态
        return newPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(that.reason);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch(e) {
                    reject(e);
                }
            });
        });
    }

    if (that.status === PENDING) { // 等待态
        // 当异步调用resolve/rejected时 将onFulfilled/onRejected收集暂存到集合中
        return newPromise = new Promise((resolve, reject) => {
            that.onFulfilledCallbacks.push((value) => {
                try {
                    let x = onFulfilled(value);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch(e) {
                    reject(e);
                }
            });
            that.onRejectedCallbacks.push((reason) => {
                try {
                    let x = onRejected(reason);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch(e) {
                    reject(e);
                }
            });
        });
    }
};

/**
 * Promise.all Promise进行并行处理
 * 参数: promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 当这个数组里的所有promise对象全部变为resolve状态的时候，才会resolve。
 */
Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
        let done = gen(promises.length, resolve);
        promises.forEach((promise, index) => {
            promise.then((value) => {
                done(index, value)
            }, reject)
        })
    })
}

function gen(length, resolve) {
    let count = 0;
    let values = [];
    return function(i, value) {
        values[i] = value;
        if (++count === length) {
            console.log(values);
            resolve(values);
        }
    }
}

/**
 * Promise.race
 * 参数: 接收 promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理(取决于哪一个更快)
 */
Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
        promises.forEach((promise, index) => {
           promise.then(resolve, reject);
        });
    });
}

// 用于promise方法链时 捕获前面onFulfilled/onRejected抛出的异常
Promise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected);
}

Promise.resolve = function (value) {
    return new Promise(resolve => {
        resolve(value);
    });
}

Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
        reject(reason);
    });
}

/**
 * 基于Promise实现Deferred的
 * Deferred和Promise的关系
 * - Deferred 拥有 Promise
 * - Deferred 具备对 Promise的状态进行操作的特权方法（resolve reject）
 *
 *参考jQuery.Deferred
 *url: http://api.jquery.com/category/deferred-object/
 */
Promise.deferred = function() { // 延迟对象
    let defer = {};
    defer.promise = new Promise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
}

/**
 * Promise/A+规范测试
 * npm i -g promises-aplus-tests
 * promises-aplus-tests Promise.js
 */

try {
  module.exports = Promise
} catch (e) {
}

~~~
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