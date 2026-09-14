---
# sidebar: auto
---
## ES6总结文章
[《ECMAScript 6 入门》(阮一峰)](http://es6.ruanyifeng.com/)

[前端面试与进阶指南](https://www.cxymsg.com/guide/vue.html)

[FE-Interview](http://blog.poetries.top/FE-Interview-Questions/)

[1.5万字概括ES6全部特性(看图就能记下，值得收藏)](https://juejin.im/post/5d9bf530518825427b27639d)

## 强缓存和协商缓存
### 强缓存

**Cache-Control：**
* private: 客户端可以缓存
* public： 客户端和代理服务器都可以缓存
* max-age=t：缓存内容将在t秒后失效
* no-cache： 需要用协商缓存来验证缓存数据
* no-store： 所有内容都不会缓存

### 协商缓存
**last-modified**: 服务器请求时会告诉资源的最后修改时间
**if-modified-since**：浏览器请求服务器时，请求头会包含这个参数，后面跟着缓存中获得最后修改时间。服务端收到请求头发现该字段ifmodifiedsince，则与被请求资源的最后修改时间进行比对，如果一致则返回304和响应报文头，浏览器直接从缓存中获取信息。
* 如果被修改：返回200，以及新资源
* 如果没有修改： 那么只响应header，返回304
**if-Unmodified-Since**: 从某个时间点算起, 是否文件没有被修改，使用的是相对时间，不需要关心客户端和服务端的时间偏差。
* 如果被修改：则不传输，服务器返回: 412 Precondition failed (预处理错误)
* 如果没有修改： 则开始`继续'传送文件，服务器返回: 200 OK
**Etag**： 服务器响应请求时，会告诉浏览器当前资源在服务器生成的唯一标识(服务器决定生成规则)
**if-match**:条件请求，携带上一次请求中资源的ETag，服务器根据这个字段判断文件是否有新的修改
**if-None-match**:再次请求服务器时，浏览器的请求报文头部会包含此字段，后面的值为在缓存中获取的标识。服务器接收到次报文后发现If-None-Match则与被请求资源的唯一标识进行对比。
* 不同，说明资源被改动过，则响应整个资源内容，返回状态码200。
* 相同，说明资源无心修改，则响应header，浏览器直接从缓存中获取数据信息。返回状态码304.

## 首屏加载优化方案
* vue ssr服务端渲染
* vue-router路由懒加载（webpack做代码切割）
> 将异步组件定义为返回一个 Promise 的工厂函数 (该函数返回的 Promise 应该 resolve 组件本身)，然后在import动态引入
~~~ js 
const Foo = () => Promise.resolve({ /* 组件定义对象 */ })
const Foo = () => import('./Foo.vue')
~~~
* 使用CDN加速，将通用的库从vendor进行抽离，上传到CDN
* 使用gZip压缩
* 使用异步组件
* UI库的按需加载
* Service Worker缓存文件处理
* 使用link标签的rel属性设置   prefetch（这段资源将会在未来某个导航或者功能要用到，但是本资源的下载顺序权重比较低，prefetch通常用于加速下一次导航）、preload（preload将会把资源得下载顺序权重提高，使得关键数据提前下载好，优化页面打开速度

## http相关
### http2
#### **二进制分帧**：
帧：HTTP/2 数据通信的最小单位消息：指 HTTP/2 中逻辑上的 HTTP 消息。例如请求和响应等，消息由一个或多个帧组成。

流：存在于连接中的一个虚拟通道。流可以承载双向消息，每个流都有一个唯一的整数ID

HTTP/2 采用二进制格式传输数据，而非 HTTP 1.x 的文本格式，二进制协议解析起来更高效。
#### **头部压缩**：
HTTP/1.x会在请求和响应中中重复地携带不常改变的、冗长的头部数据，给网络带来额外的负担。

* HTTP/2在客户端和服务器端使用“首部表”来跟踪和存储之前发送的键－值对，对于相同的数据，不再通过每次请求和响应发送
* 首部表在HTTP/2的连接存续期内始终存在，由客户端和服务器共同渐进地更新;
* 每个新的首部键－值对要么被追加到当前表的末尾，要么替换表中之前的值。
#### **服务器推送**：
服务端可以**在发送页面HTML时主动推送其它资源**，而不用等到浏览器解析到相应位置，发起请求再响应。例如服务端可以主动把JS和CSS文件推送给客户端，而不需要客户端解析HTML时再发送这些请求。

服务端可以主动推送，客户端也有权利选择是否接收。如果服务端推送的资源已经被浏览器缓存过，**浏览器可以通过发送RST_STREAM帧来拒收**。主动推送也遵守同源策略，服务器不会随便推送第三方资源给客户端。

#### **多路复用**：
HTTP 1.x 中，如果想并发多个请求，必须使用多个 TCP 链接，且浏览器为了控制资源，还会对单个域名有 6-8个的TCP链接请求限制。

HTTP2中：

* 同域名下所有通信都在单个连接上完成。
* 单个连接可以承载任意数量的双向数据流。
* 数据流以消息的形式发送，而消息又由一个或多个帧组成，多个帧之间可以乱序发送，因为根据帧首部的流标识可以重新组装

### tcp 三次握手和四次握手的区别，为什么存在
#### 三次握手
所谓三次握手(Three-way Handshake)，是指建立一个 TCP 连接时，需要客户端和服务器总共发送3个包。
三次握手的目的是连接服务器指定端口，建立 TCP 连接，并同步连接双方的序列号和确认号，交换 TCP 窗口大小信息。在 socket 编程中，客户端执行 connect() 时。将触发三次握手。
* 第一次握手(SYN=1, seq=x):
客户端发送一个 TCP 的 SYN 标志位置1的包，指明客户端打算连接的服务器的端口，以及初始序号 X,保存在包头的序列号(Sequence Number)字段里。
发送完毕后，客户端进入 SYN_SEND 状态。
* 第二次握手(SYN=1, ACK=1, seq=y, ACKnum=x+1):
服务器发回确认包(ACK)应答。即 SYN 标志位和 ACK 标志位均为1。服务器端选择自己 ISN 序列号，放到 Seq 域里，同时将确认序号(Acknowledgement Number)设置为客户的 ISN 加1，即X+1。 发送完毕后，服务器端进入 SYN_RCVD 状态。
* 第三次握手(ACK=1，ACKnum=y+1)
客户端再次发送确认包(ACK)，SYN 标志位为0，ACK 标志位为1，并且把服务器发来 ACK 的序号字段+1，放在确定字段中发送给对方，并且在数据段放写ISN的+1
发送完毕后，客户端进入 ESTABLISHED 状态，当服务器端接收到这个包时，也进入 ESTABLISHED 状态，TCP 握手结束。

#### 四次握手
TCP 的连接的拆除需要发送四个包，因此称为四次挥手(Four-way handshake)，也叫做改进的三次握手。客户端或服务器均可主动发起挥手动作，在 socket 编程中，任何一方执行 close() 操作即可产生挥手操作。
* 第一次挥手(FIN=1，seq=x)
假设客户端想要关闭连接，客户端发送一个 FIN 标志位置为1的包，表示自己已经没有数据可以发送了，但是仍然可以接受数据。
发送完毕后，客户端进入 FIN_WAIT_1 状态。
* 第二次挥手(ACK=1，ACKnum=x+1)
服务器端确认客户端的 FIN 包，发送一个确认包，表明自己接受到了客户端关闭连接的请求，但还没有准备好关闭连接。
发送完毕后，服务器端进入 CLOSE_WAIT 状态，客户端接收到这个确认包之后，进入 FIN_WAIT_2 状态，等待服务器端关闭连接。
* 第三次挥手(FIN=1，seq=y)
服务器端准备好关闭连接时，向客户端发送结束连接请求，FIN 置为1。
发送完毕后，服务器端进入 LAST_ACK 状态，等待来自客户端的最后一个ACK。
*  第四次挥手(ACK=1，ACKnum=y+1)
客户端接收到来自服务器端的关闭请求，发送一个确认包，并进入 TIME_WAIT状态，等待可能出现的要求重传的 ACK 包。
服务器端接收到这个确认包之后，关闭连接，进入 CLOSED 状态。
客户端等待了某个固定时间（两个最大段生命周期，2MSL，2 Maximum Segment Lifetime）之后，没有收到服务器端的 ACK ，认为服务器端已经正常关闭连接，于是自己也关闭连接，进入 CLOSED 状态。
---

# 资深前端面试题全集
## 由浅入深 · 全面覆盖（基础 → 原理 → 架构 → 场景设计）

> **本文定位**：在原有笔记（缓存 / 首屏优化 / HTTP / TCP）之上，补全资深前端面试的完整知识版图。
> **资深的标准**：不仅会"用"，还能讲清"为什么、底层原理、权衡取舍、场景设计"。
> **学习建议**：初级题快过，中级题讲透原理，高级题练"方案对比 + 现场设计"。

### 📚 知识体系总览

```
JavaScript 核心(原理)   CSS/布局(功底)      浏览器原理(内功)     网络(通信)
Vue/框架深度(主栈)      TypeScript(类型)    工程化(效率)        性能优化(深度)
安全(防线)              手写题(硬通货)      场景设计(资深标志)   架构软素质(高度)
```

---

## 第一部分：JavaScript 核心（基础 → 原理）

### Q1：JavaScript 有哪些数据类型？如何准确判断类型？

**答：**

* **基本类型（8 种）**：`number / string / boolean / undefined / null / symbol / bigint`
* **引用类型**：`object`（含数组、函数、日期、正则、Map/Set）

**判断方式对比（资深必答差异）**：

| 方式 | 能判断 | 局限 |
| --- | --- | --- |
| `typeof` | 基本类型、function | `typeof null === 'object'`（历史 bug）；数组/对象都是 object |
| `instanceof` | 引用类型具体是谁 | 不能判断基本类型；跨 iframe 会失真；原型可被修改 |
| `Object.prototype.toString.call(x)` | **最准确** | 返回 `'[object Array]'` 等，稍繁琐 |
| `Array.isArray` | 数组 | 只能判断数组 |

```javascript
Object.prototype.toString.call(null);      // '[object Null]'
Object.prototype.toString.call([]);        // '[object Array]'
Object.prototype.toString.call(new Map()); // '[object Map]'
```

**追问点**：`typeof null === 'object'` 的原因——JS 初版用低位标记类型，对象的标记是 `000`，而 null 全零被误判，为兼容保留至今。

---

### Q2：== 和 === 的区别？隐式转换规则是什么？

**答：**

* `===` 严格相等：类型不同直接 false，不转换
* `==` 宽松相等：类型不同时先**隐式转换**再比较

**隐式转换核心规则（面试按此讲）**：

```
1. null == undefined → true（且它们不等于其他任何值）
2. 数字 vs 字符串  → 字符串转数字
3. 布尔 vs 任何     → 布尔先转数字(true→1, false→0)
4. 对象 vs 基本类型 → 对象先 valueOf/toString 转基本类型
5. NaN 与任何比较   → 都是 false(包括 NaN == NaN)
```

**经典输出题**：

```javascript
[] == false        // true  ([] → '' → 0, false → 0)
[] == ![]          // true  (![] → false → 0)
null == 0          // false (null 只与 undefined 相等)
'' == 0            // true
```

**工程结论**：除判断 `x == null`（同时覆盖 null/undefined）外，一律用 `===`。

---

### Q3：什么是闭包？有哪些应用和坑？

**答：**

**定义**：函数与其词法作用域的组合——**内部函数引用了外部函数的变量，在外部函数执行完后，这些变量仍被保留**。

```javascript
function createCounter() {
  let count = 0;                 // 本该销毁的局部变量
  return function () {
    return ++count;              // 被闭包引用 → 常驻内存
  };
}
const counter = createCounter();
counter(); // 1   counter(); // 2
```

**三大应用**：

1. **数据私有/封装**：模拟私有变量（如上例的 count 外部无法直接访问）
2. **函数工厂/柯里化**：`add(1)(2)(3)` 每层记住参数
3. **回调与异步**：事件处理函数、定时器天然持有外部状态

**资深必谈的坑**：

* **内存泄漏**：闭包持有大对象（如 DOM 引用）不释放 → 及时置 null
* **循环中的经典坑**：`var + 闭包` 输出全是最后一个（let 块级作用域解决）
* **性能**：被闭包的变量无法被 GC，滥用导致内存增长

---

### Q4：讲讲原型与原型链？继承有哪些方式？

**答：**

**核心三句话**：

```
1. 每个函数都有 prototype 属性(指向原型对象)
2. 每个对象都有 __proto__ 属性(指向构造函数的 prototype)
3. 访问属性时, 本身没有 → 沿 __proto__ 往上找 → 直到 null → undefined
   这条查找路径就是原型链
```

```
instance ──__proto__→ 构造函数.prototype ──__proto__→ Object.prototype ──→ null
```

**继承方式演进（资深按"痛点→改进"讲）**：

```javascript
// 1. 原型链继承: Child.prototype = new Parent()
//    痛点: 引用类型属性被所有实例共享, 无法传参

// 2. 借用构造函数: Parent.call(this, args)
//    痛点: 只继承实例属性, 原型上的方法拿不到

// 3. 组合继承(经典): 原型链 + 借用构造函数
//    痛点: 父构造函数被调用两次

// 4. 寄生组合继承(最优):
function inherit(Child, Parent) {
  const prototype = Object.create(Parent.prototype); // 复制父原型
  prototype.constructor = Child;                      // 修正构造器
  Child.prototype = prototype;
}

// 5. ES6 class extends: 本质是寄生组合继承的语法糖(但 class 有自己的特性)
```

**加分点**：`Object.create(null)` 创建无原型的纯净字典，避免原型污染。

---

### Q5：this 的指向规则？call/apply/bind 的区别？

**答：** this 在**函数调用时**确定（不是定义时），按优先级从高到低：

```
1. new 绑定          → 新创建的对象
2. 显式绑定          → call/apply/bind 指定的对象
3. 隐式绑定          → 谁调用指向谁( obj.fn() → obj )
4. 默认绑定          → 非严格模式 window, 严格模式 undefined
特例: 箭头函数没有自己的 this, 继承定义时外层的 this(不可被 call 改变)
```

**三兄弟对比**：

| 方法 | 参数 | 执行时机 | 返回 |
| --- | --- | --- | --- |
| `call` | 参数列表 `(obj, a, b)` | **立即调用** | 函数返回值 |
| `apply` | 参数数组 `(obj, [a, b])` | **立即调用** | 函数返回值 |
| `bind` | 参数列表 | **不调用**，返回新函数 | 绑定后的新函数 |

**高频坑**：`obj.fn.call(window)` 改变 this；箭头函数 + call 无法改 this；事件回调里用箭头函数可继承外层 this。

---

### Q6：讲讲事件循环 Event Loop？（必考输出题原理）

**答：**

**核心流程**：

```
1. 同步代码在主线程执行(调用栈)
2. 遇到异步任务: 宏任务与微任务分别进入各自的队列
3. 同步代码执行完 → 清空整个微任务队列
4. 取一个宏任务执行 → 再清空微任务 → 浏览器渲染(可能) → 循环
```

**任务分类（必背）**：

* **微任务**：`Promise.then/catch/finally`、`queueMicrotask`、`MutationObserver`
* **宏任务**：`script(整体代码)`、`setTimeout/setInterval`、`setImmediate(Node)`、I/O、UI 事件

**经典输出题（自己做一遍）**：

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
queueMicrotask(() => console.log('4'));
console.log('5');
// 输出: 1 5 3 4 2
// 解析: 同步(1,5) → 微任务按序(3,4) → 宏任务(2)
```

**资深追问**：

* `await` 后面的代码相当于 `.then` 的回调（微任务）
* `setTimeout(fn, 0)` 实际是最小 4ms 左右，且要等微任务清空才执行
* 浏览器渲染时机：宏任务之间、微任务清空后（requestAnimationFrame 在渲染前）

---

### Q7：Promise 的原理？手写一个简易 Promise 要点？

**答：**

**三态两原则**：

```
三态: pending → fulfilled / rejected(不可逆)
原则: .then 返回新 Promise → 实现链式调用
      回调异步执行(微任务)
```

**关键 API 手写思路**：

```javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.callbacks = [];                      // then 的回调先收集
    const resolve = (val) => {
      if (this.state !== 'pending') return;   // 状态不可逆
      this.state = 'fulfilled';
      this.value = val;
      this.callbacks.forEach(cb => queueMicrotask(() => cb(val)));
    };
    // reject 同理...
    executor(resolve, reject);
  }
  then(onFulfilled) {
    return new MyPromise((resolve) => {       // 返回新 Promise → 链式
      if (this.state === 'fulfilled') {
        queueMicrotask(() => resolve(onFulfilled(this.value)));
      } else {
        this.callbacks.push((val) => resolve(onFulfilled(val)));
      }
    });
  }
}
```

**必会组合 API**：

```javascript
// Promise.all: 全成功才成功, 一个失败立即失败
// Promise.race: 第一个敲定的结果(无论成败)
// Promise.allSettled: 等全部敲定, 返回每个的状态
// Promise.any: 第一个成功的结果
```

---

### Q8：async/await 的原理是什么？

**答：**

* **语法糖**：`async/await` = **Generator + Promise + 自动执行器** 的封装

```
async function → 返回 Promise
await xxx      → 暂停当前函数, 等待 Promise 敲定
                await 之后的代码 ≈ .then 的回调(微任务)
```

* **错误处理**：`await` 的 reject 会被后续 `try/catch` 捕获；没有 catch 则沿链向上抛

**资深对比**：

```javascript
// 串行(总耗时 = a + b) ❌ 常见性能坑
const a = await fetchA();
const b = await fetchB();

// 并行(总耗时 = max(a, b)) ✅
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

**演进史一句话**：回调地狱 → Promise 链 → Generator(yield 手动挡) → async/await(自动挡)。

---

### Q9：深拷贝与浅拷贝的区别？如何实现深拷贝？

**答：**

* **浅拷贝**：只复制第一层，嵌套对象仍**共享引用**（`Object.assign`、扩展运算符 `...`、`slice`）
* **深拷贝**：递归复制所有层级，完全独立

**实现方案对比**：

| 方案 | 优点 | 缺点 |
| --- | --- | --- |
| `JSON.parse(JSON.stringify(x))` | 简单 | 丢失函数/undefined/Symbol；Date 变字符串；**循环引用报错**；丢弃原型 |
| `structuredClone(x)`（原生） | 支持循环引用/Date/Map | 不支持函数、DOM |
| **递归手写**（面试要求） | 可控 | 需处理循环引用/特殊类型 |

```javascript
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;   // 基本类型
  if (map.has(obj)) return map.get(obj);                     // ★循环引用
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  const clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone);                                       // 先登记再递归
  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], map);
  }
  return clone;
}
```

**加分点**：WeakMap 登记"原对象→克隆对象"防止循环引用爆栈，且 WeakMap 不阻止 GC。

---

### Q10：防抖和节流的区别？手写增强版？

**答：**

* **防抖 debounce**：事件停止触发后再执行——**只执行最后一次**（搜索框联想、resize 结束计算）
* **节流 throttle**：固定间隔内只执行一次——**稀释执行频率**（滚动加载、鼠标移动）

**生活类比**：防抖 = 电梯没人进了才关门；节流 = 公交车每 10 分钟发一班。

```javascript
// 防抖(支持立即执行 + 取消)
function debounce(fn, delay, immediate = false) {
  let timer = null;
  const debounced = function (...args) {
    if (timer) clearTimeout(timer);
    if (immediate && !timer) fn.apply(this, args);   // 先执行
    timer = setTimeout(() => {
      timer = null;
      if (!immediate) fn.apply(this, args);          // 后执行
    }, delay);
  };
  debounced.cancel = () => { clearTimeout(timer); timer = null; };
  return debounced;
}

// 节流(时间戳版: 首次立即执行)
function throttle(fn, interval) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

---

### Q11：Vue3 用 Proxy，Vue2 用 defineProperty，为什么？

**答：**

| 维度 | defineProperty (Vue2) | Proxy (Vue3) |
| --- | --- | --- |
| 监听能力 | 只能劫持**已有属性**的读写 | 监听**增删属性、数组下标、length 等 13 种**操作 |
| 新增属性 | 无法检测 → 需要 `$set` | 原生支持 |
| 数组 | 需重写 7 个变异方法 | 直接拦截 |
| 初始化 | 递归遍历整个对象（初始化成本高） | **惰性代理**（访问到才深层代理，性能好） |
| 兼容性 | IE9+ | 不支持 IE（Vue3 放弃 IE 的原因之一） |

**Proxy 核心用法**：

```javascript
const proxy = new Proxy(target, {
  get(target, key, receiver) {
    track(target, key);                    // 依赖收集
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    trigger(target, key);                  // 派发更新
    return result;
  },
});
```

**追问**：为什么不监听数组下标也能让 Vue2 数组响应？——重写 `push/pop/splice` 等原型方法插入通知逻辑。

---

### Q12：垃圾回收机制？前端内存泄漏怎么排查？

**答：**

**两种算法**：

* **标记清除（主流）**：从根（全局对象、当前调用栈）出发遍历标记可达对象，**不可达的回收**
* 引用计数（早期）：引用数为 0 回收 → **循环引用致命缺陷**，已被淘汰

**V8 分代回收（加分）**：新生代（Scavenge 复制算法，频繁短命对象）+ 老生代（标记清除 + 标记整理，减少碎片）。

**常见内存泄漏场景**：

```
1. 意外的全局变量(未用 let/const)
2. 被遗忘的定时器(setInterval 未 clear)
3. 闭包持有大对象/DOM 引用
4. 渲染列表后未解绑事件(尤其 SPA 路由切换)
5. 脱离 DOM 树的节点仍被 JS 变量引用
6. console.log 持有对象(某些环境)
```

**排查工具链**：Chrome DevTools → Memory → **堆快照对比**（操作前后两次快照看增量）、Performance 录制看内存曲线、`performance.memory` 埋点上报。

---

### Q13：ES Module 与 CommonJS 的区别？

**答：**

| 维度 | CommonJS | ES Module |
| --- | --- | --- |
| 加载 | **运行时**加载（同步） | **编译时**静态确定依赖 |
| 输出 | 值的**拷贝** | 值的**引用（绑定）** |
| this | 指向模块本身 | undefined |
| 循环依赖 | 返回已执行部分 | 引用本身（TDL 时取值） |
| Tree Shaking | 不支持（动态无法静态分析） | **支持** ✅ |
| 顶层 await | 不支持 | 支持 |

**值的拷贝 vs 引用（高频代码题）**：

```javascript
// CJS: 导出值拷贝, 模块内部变化不影响已导入的
// ESM: 导出绑定, 模块内变量变了, 导入方取到的也变
export let count = 0;
setTimeout(() => { count = 1; }, 1000);
// 导入方 1 秒后读到 count === 1 (ESM 才如此)
```

---

### Q14：0.1 + 0.2 !== 0.3 为什么？怎么解决？

**答：**

* 原因：IEEE 754 双精度浮点数用二进制存小数，0.1/0.2 是**无限循环二进制**，存储时被截断产生精度误差
* 解决方案：

```javascript
// 方案1: 转整数运算(金额处理首选, 分为单位)
(0.1 * 10 + 0.2 * 10) / 10 === 0.3   // true

// 方案2: 误差容限
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON

// 方案3: toFixed 配合 parseFloat(展示场景)
parseFloat((0.1 + 0.2).toFixed(10))
```

---
## 第二部分：CSS 与页面布局

### Q15：盒模型是什么？box-sizing 的区别？

**答：**

```
标准盒模型 content-box:  width = 内容宽度(不含 padding/border)
怪异盒模型 border-box:   width = 内容 + padding + border(直观好用)
```

```css
* { box-sizing: border-box; }   /* 工程标配初始化 */
```

**加分点**：outline 不占布局；margin 不算在盒模型内（但有 margin 塌陷问题）。

---

### Q16：什么是 BFC？哪些场景用它解决布局问题？

**答：** BFC（块级格式化上下文）= 一个**独立隔离的渲染区域**，内部布局不影响外部。

**触发条件（任一即可）**：

```
根元素 html / float 非 none / position: absolute|fixed
display: inline-block|flex|grid|flow-root / overflow 非 visible(hidden,auto)
```

**四大应用场景（资深必背）**：

```
1. 清除浮动塌陷:        父元素 overflow: hidden 触发 BFC 包住浮动子元素
2. 阻止 margin 塌陷:    相邻 BFC 之间 margin 不合并
3. 自适应两栏布局:       左浮动 + 右 overflow: hidden, 右侧不与浮动重叠
4. 防文字环绕:          经典应用
```

**现代推荐**：`display: flow-root`——**无副作用**地创建 BFC（不像 overflow: hidden 会剪裁内容）。

---

### Q17：flex 布局的核心属性？常见的复杂用法？

**答：**

```
容器属性: flex-direction(方向) / flex-wrap(换行) / justify-content(主轴对齐)
         / align-items(交叉轴) / align-content(多行对齐)
子项属性: flex-grow(放大) / flex-shrink(缩小) / flex-basis(基准)
         flex: 1 = 1 1 0%(平分剩余空间, 必考!)
```

**高频场景**：

```css
/* 1. 完美居中(最简) */
.parent { display: flex; justify-content: center; align-items: center; }

/* 2. 左固定右自适应 */
.left  { width: 200px; }
.right { flex: 1; }

/* 3. 底部固定, 中间滚动(移动端页面骨架) */
.page { display: flex; flex-direction: column; height: 100vh; }
.main { flex: 1; overflow-y: auto; }

/* 4. 等分且带间距 */
.item { flex: 1; }
.item + .item { margin-left: 10px; }
```

**flex: 1 与 flex: auto 的区别**（追问高频）：`flex: 1` = `1 1 0%`（忽略内容宽度平分）；`flex: auto` = `1 1 auto`（基于内容宽度按比例分配）。

**grid 一句话**：二维布局首选 `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))`——自适应卡片流。

---

### Q18：水平垂直居中有哪些方案？

**答：**（按现代程度排序，至少说三种）

```css
/* 1. flex(首选) */
.parent { display: flex; justify-content: center; align-items: center; }

/* 2. grid(最简) */
.parent { display: grid; place-items: center; }

/* 3. 绝对定位 + transform(不需知道子元素尺寸) */
.child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }

/* 4. 绝对定位 + margin: auto(需设置宽高) */
.child { position: absolute; inset: 0; margin: auto; width: 100px; height: 100px; }
```

**加分**：能对比优劣——transform 不引起重排；绝对定位方案脱离文档流；inline 元素可用 `line-height` 对齐。

---

### Q19：重排（回流）与重绘的区别？如何优化？

**答：**

* **重排 Reflow**：几何属性（宽高/位置）变化 → 重新计算布局，**代价大**
* **重绘 Repaint**：视觉样式（颜色/背景）变化 → 只重新绘制，代价小
* **合成 Composite**：transform/opacity 在合成层处理，**不触发重排重绘，性能最好**

**触发重排的典型操作**：增删 DOM、改宽高、`offsetWidth` 等布局属性读取、窗口 resize、字体变化。

**优化清单（资深背熟）**：

```
1. 动画优先 transform/opacity(跳过 layout/paint)
2. 批量 DOM 修改: DocumentFragment / display:none 后改 / 脱离文档流改完再放回
3. 避免逐条改样式 → 切换 class 一次性应用
4. 读写分离: 别在循环里又读 offsetWidth 又改样式(强制同步布局)
5. will-change 提升合成层(慎用, 过多反而费内存)
```

**渲染流水线（必答）**：`JS → Style → Layout → Paint → Composite`，优化思路就是让变更**尽量发生在流水线后端**。

---

### Q20：移动端适配方案有哪些？

**答：**

| 方案 | 原理 | 适用 |
| --- | --- | --- |
| **rem + postcss-pxtorem** | 按 html 字号缩放 | 传统 H5（vw 普及前主流） |
| **vw/vh（当前主流）** | 1vw = 视口宽 1%，天然自适应 | 新项目首选 |
| 百分比 | 相对父元素 | 局部布局 |
| 媒体查询 | 断点切换样式 | 响应式官网 |
| **safe-area-inset** | 刘海屏/底部安全区适配 | 全面屏必备 |

```css
/* vw 方案 + 安全区 */
.button { padding-bottom: calc(12px + env(safe-area-inset-bottom)); }
/* 1px 边框问题 */
.thin-border { border: 0.5px solid #ddd; }  /* 或伪元素 + transform: scaleY(0.5) */
```

**必答追问**：1px 问题的成因——CSS 像素与物理像素 DPR 换算后边框显示变粗。

---

## 第三部分：浏览器原理

### Q21：从输入 URL 到页面展示，发生了什么？（旗舰题）

**答：**（在原有缓存笔记基础上补全全链路）

```
1. URL 解析与补全(协议/域名合法性)
2. 缓存查找: 强缓存(Cache-Control) → 协商缓存(Etag/Last-Modified)   ← 详见前文
3. DNS 解析: 浏览器缓存 → 系统 → 路由器 → 运营商 → 递归查询(耗时, 有缓存)
4. TCP 三次握手(HTTPS 再加 TLS 握手)                                ← 详见前文
5. 发送 HTTP 请求(请求头/请求体, HTTP2 多路复用)
6. 服务端处理并响应
7. 浏览器解析渲染:
   HTML → DOM 树;  CSS → CSSOM 树;  两者 → Render 树
   → Layout 布局计算 → Paint 绘制 → Composite 合成上屏
8. 异步加载: 图片/脚本按各自的加载策略执行, JS 可能阻塞解析(defer/async)
```

**资深加分**：能指出每一步的性能优化点（DNS 预解析、CDN、HTTP2、关键渲染路径优化、SSR 提前首屏）。

---

### Q22：script 的 defer 和 async 区别？

**答：**

```
默认:     下载和执行都阻塞 HTML 解析 ❌
async:    并行下载, 下载完立即执行(执行时阻塞), 顺序不保证
defer:    并行下载, 等 DOM 解析完后按顺序执行(DOMContentLoaded 前)
```

**使用结论**：有依赖关系的脚本用 `defer`；独立统计类脚本用 `async`；`defer` 是工程默认推荐。

---

### Q23：跨域的原因与解决方案？

**答：**

**同源策略**：协议 + 域名 + 端口全相同才是同源——浏览器限制**脚本**跨源读取响应（防 CSRF 类攻击），img/script 标签的加载不受限。

| 方案 | 原理 | 要点 |
| --- | --- | --- |
| **CORS（标准）** | 服务端放行响应头 | `Access-Control-Allow-Origin`；带 cookie 需 `withCredentials` + 明确Origin |
| **代理（开发/工程常用）** | 同源服务器转发请求 | Vite/webpack devServer proxy、Nginx 反向代理 |
| JSONP（了解历史） | `<script>` 标签不受同源限制 | 只支持 GET，需服务端配合回调 |
| postMessage | 跨窗口/iframe 通信 | 验证 origin |

**CORS 细节（高频追问）**：

```
简单请求: GET/POST/HEAD + 常规头部 → 直接发送, 带 Origin 头
复杂请求: 先发 OPTIONS 预检 → 服务端放行 → 才发真实请求
预检缓存: Access-Control-Max-Age 减少预检次数
```

---

### Q24：Cookie / localStorage / sessionStorage / IndexedDB 怎么选？

**答：**

| 特性 | Cookie | localStorage | sessionStorage | IndexedDB |
| --- | --- | --- | --- | --- |
| 容量 | ~4KB | 5~10MB | 5~10MB | 数百 MB+ |
| 生命周期 | 可设过期 | 永久 | 关标签页清 | 永久 |
| 随请求携带 | **每次自动带**（性能负担） | ❌ | ❌ | ❌ |
| API | 原始 | 同步简单 | 同步简单 | 异步事务 |
| 场景 | 鉴权令牌(配合 httpOnly) | 主题/偏好/缓存 | 表单暂存 | 离线数据/大文件 |

**加分点**：`token` 放哪？——`httpOnly + Secure + SameSite` 的 Cookie 防 XSS 窃取；localStorage 存 token 有 XSS 风险但可避 CSRF，需权衡。

---

### Q25：Web Worker 和 Service Worker 的区别？

**答：**

* **Web Worker**：开一个**后台线程**跑重计算（图像处理、大数据解析），**不能操作 DOM**，通过 postMessage 通信
* **Service Worker**：浏览器/服务器之间的**可编程代理**——拦截请求、缓存资源，是实现 **PWA 离线可用**的核心；生命周期独立于页面，必须 HTTPS

```
Web Worker:  页面内的"计算助理"(短命, 页面关了就没了)
Service Worker: 浏览器与网络之间的"秘书"(长命, 可离线)
```

---

## 第四部分：网络进阶

### Q26：HTTP/1.1、HTTP/2、HTTP/3 的演进要点？

**答：**（原文详解了 HTTP2 特性，这里补演进脉络）

```
HTTP/1.1 痛点: 队头堵塞(请求-响应串行) + 每个请求一个 TCP 连接
             缓解: 长连接 + 管道化(失败) + 域名分片(6个连接限制)
HTTP/2: 二进制分帧 + 多路复用(一个连接并行多流) + 头部压缩(HPACK) + 服务端推送
        遗留: TCP 层队头阻塞(丢包时所有流都等待重传)
HTTP/3: 传输层换成 QUIC(基于 UDP)
        彻底解决队头阻塞 + 0-RTT 建连 + 连接迁移(切网络不断线)
```

**面试金句**：HTTP/2 解决了"HTTP 层的队头阻塞"，HTTP/3 解决了"TCP 层的队头阻塞"。

---

### Q27：HTTPS 的握手过程？

**答：**（对称 + 非对称混合加密）

```
1. 客户端发 ClientHello(支持的加密套件+随机数1)
2. 服务端回 ServerHello(选定套件+随机数2) + 数字证书
3. 客户端验证证书(CA 链) → 生成预主密钥, 用服务端公钥加密发送
4. 双方用(随机数1+随机数2+预主密钥)生成会话密钥(对称)
5. 之后所有通信用会话密钥对称加密
```

**为什么混合**：非对称安全但慢（只用于交换密钥）；对称快（用于传输数据）。

**追问**：如何防中间人？——数字证书由 CA 私钥签名，操作系统内置 CA 公钥可验证。

---

### Q28：WebSocket 与 HTTP 的区别？

**答：**

| 维度 | HTTP | WebSocket |
| --- | --- | --- |
| 模式 | 请求-响应（单向拉） | **全双工**（双向推） |
| 头开销 | 每次带完整头 | 握手后帧头仅 2~14 字节 |
| 实时性 | 轮询/长轮询（伪实时） | 真实时 |

**建立过程**：先发 HTTP 请求带 `Upgrade: websocket` 头 → 101 Switching Protocols → 升级为 WS 长连接。

**选型**：聊天/协同编辑/推送用 WS；简单服务端推送可考虑 SSE（单向、更简单）。

---
## 第五部分：Vue 深度（主栈核心）

### Q29：Vue 的响应式原理？Vue2 与 Vue3 的差异？

**答：**

**Vue2**：`Object.defineProperty` 递归劫持 getter/setter

```
初始化: observe(data) 递归遍历所有属性 → defineReactive 定义 get/set
get  → 收集依赖(Dep 收集 Watcher)
set  → 派发更新(dep.notify → watcher.update → 异步批量更新视图)
痛点: 新增/删除属性检测不到($set/$delete)、数组需重写方法、初始化全递归
```

**Vue3**：`Proxy + Reflect + effect`

```
new Proxy 只代理第一层(惰性, 性能好)
get → track(target, key)   依赖收集(存入 targetMap: target → key → effectSet)
set → trigger(target, key) 触发该 key 关联的所有 effect 重新执行
深层对象在 get 时才继续 proxy(懒代理)
```

**核心数据结构（能画出来）**：

```
targetMap: WeakMap {
  target → Map {
    key → Set { effect1, effect2... }
  }
}
```

---

### Q30：虚拟 DOM 是什么？diff 算法的策略？

**答：**

* **虚拟 DOM**：用 JS 对象描述真实 DOM 树，变更时先对比新旧虚拟树（diff），再把**最小差异**打补丁到真实 DOM——**把昂贵的 DOM 操作转化为可控的 JS 计算**。

```javascript
// vnode 示意
{ tag: 'div', props: { class: 'box' }, children: [ { tag: 'span', children: 'hi' } ] }
```

**diff 策略（同层比较 + 三板斧）**：

```
1. 新旧节点不同(tag/key 都变) → 直接替换整棵子树
2. 相同 → 复用 DOM, 只更新属性
3. 子节点列表对比(Vue2 双端 diff):
   新头旧头 / 新尾旧尾 / 旧头新尾 / 旧尾新头 四组指针比较
   都不命中 → key→index 哈希查找
```

**key 的作用（必考）**：diff 时**靠 key 精准匹配新旧节点**，实现复用与移动；用 index 作 key，在头部插入/删除时会错误复用导致状态错乱与性能退化。

---

### Q31：Vue3 的 diff 有什么优化？

**答：**（资深加分题）

```
1. 静态提升(hoistStatic): 静态节点只创建一次, 提到 render 外复用
2. PatchFlag 补丁标记: 编译时标记动态部分(仅 class 变/仅 text 变...)
   → 运行时 diff 跳过静态内容, 只对比动态节点
3. Block Tree: 收集动态后代的扁平数组, diff 时直接遍历数组
4. 最长递增子序列(LIS): 预处理 II 的核心
   只对"需要移动"的节点做移动, LIS 中的节点视为不动, DOM 移动次数最少化
```

**一句话**：Vue3 = **编译时优化（跳过静态）+ 运行时优化（LIS 减少移动）**，diff 性能大幅提升。

---

### Q32：组件通信有哪些方式？各适用什么场景？

**答：**

| 方式 | 方向 | 场景 |
| --- | --- | --- |
| props / emit | 父 ↔ 子 | 标准方式，首选 |
| `v-model` | 父子双向 | 表单组件（语法糖 = modelValue + update:modelValue） |
| `provide / inject` | 祖先 → 后代 | 深层注入（主题、国际化），配合 readonly 防篡改 |
| refs | 父 → 子实例 | 直接调用子组件方法（defineExpose） |
| 事件总线 mitt | 任意 | Vue3 移除了 $on，用 mitt 替代（慎用，难追踪） |
| 状态管理 Pinia | 任意 | 跨页面/复杂共享状态，**中大型项目标配** |
| 插槽 slot | 父 → 子内容分发 | 组件库布局 |

**工程原则**：能用 props/emit 不上全局状态；事件总线只做低频解耦。

---

### Q33：computed 与 watch 的区别？

**答：**

| 维度 | computed | watch |
| --- | --- | --- |
| 定位 | **派生值**（依赖变了自动重算） | **副作用**（值变了执行逻辑） |
| 缓存 | ✅ 依赖不变直接返回缓存 | ❌ 每次变化都执行 |
| 可否异步 | 不应有异步 | 可以异步（请求等） |
| 返回 | 必须返回值 | 回调不需要返回 |

**Vue3 细节**：

```javascript
const dbl = computed(() => num.value * 2);          // 派生值
watch(num, (v, old) => { fetchData(v); });           // 副作用
watchEffect(() => console.log(num.value));           // 立即执行+自动收集依赖
// watch 默认惰性; deep: true 深层监听(性能代价); immediate: true 立即执行一次
```

---

### Q34：v-if 与 v-show 的区别？v-for 与 v-if 为什么不能同用？

**答：**

```
v-if:   真正的条件渲染(销毁/重建 DOM), 切换开销大 → 切换不频繁
v-show: display: none 切换, 首次就渲染 → 切换频繁的场景
```

**v-for + v-for 同标签**：v-for 优先级高于 v-if → 每次循环都对每项做判断（浪费）；Vue3 中 v-if 优先级反而更高但拿不到循环变量直接报错。**正解**：computed 先过滤再渲染。

---

### Q35：Vue 生命周期？Vue3 组合式 API 对应关系？

**答：**

```
Vue2                    Vue3(setup 内)
beforeCreate/created  → setup 本身
beforeMount           → onBeforeMount
mounted               → onMounted     (可访问 DOM, 请求常放这)
beforeUpdate          → onBeforeUpdate
updated               → onUpdated
beforeDestroy         → onBeforeUnmount   ★改名
destroyed             → onUnmounted       ★改名
-                     → onErrorCaptured / onActivated / onDeactivated(keep-alive)
```

**请求放 created 还是 mounted？**——SPA 中通常都行（数据不依赖 DOM 放 setup/onBeforeMount 更早更快）；SSR 中没有 mounted，只能放 setup。

**父子生命周期顺序（必背）**：挂载 = 父 beforeMount → 子 beforeMount → 子 mounted → 父 mounted（**子先挂完父才挂完**）。

---

### Q36：Composition API 相比 Options API 解决了什么？

**答：**

```
Options API 的痛点: 一个功能的代码散落在 data/methods/computed 各处
                  (跨 300 行维护同一个逻辑) → 大组件难维护
Composition API:   同一功能的响应式数据+计算+监听+方法 写在一起
                  → 逻辑可提取为 useXxx() 组合函数复用
```

**其他收益**：更好的 TS 类型推导、Tree-shaking（未用的 API 不打包）、更灵活的逻辑组织。

**官方建议**：小型/低复杂组件 Options 依然可读；中大型/逻辑复用场景 Composition 优势明显。

---

### Q37：Vue Router 的 hash 与 history 模式原理？

**答：**

```
hash 模式:     url 带 #, 改 hash 不发请求(hashchange 监听) → 无需服务端配置
history 模式:  pushState/replaceState 操作路径(美观) → 刷新时发真实请求
              → 需服务端把所有路径兜底到 index.html(nginx try_files)
```

**追问**：history 刷新 404 的原因与解决——服务器收到 `/user/1` 去找该路径文件，需配置回退到 SPA 入口。

**导航守卫（常考执行顺序）**：`beforeEach → 路由独享 beforeEnter → 组件 beforeRouteEnter → afterEach`。

---

### Q38：Pinia 相比 Vuex 好在哪？

**答：**

```
1. 去 mutation: 只有 state/getter/action(异步直接在 action 里写)
2. 天然 TS 友好: 完整类型推导, 无需手动类型
3. 模块化天然: 每个 store 独立 defineStore, 没有 modules 嵌套
4. 更轻: 体积约为 Vuex 一半
5. 支持 composition 风格: const useStore = defineStore('id', () => {...})
```

---

## 第六部分：TypeScript 与框架对比

### Q39：type 与 interface 的区别？

**答：**

| 维度 | interface | type |
| --- | --- | --- |
| 对象声明合并 | ✅ 支持（自动合并同名） | ❌ 重复声明报错 |
| 继承扩展 | `extends` | 交叉类型 `&` |
| 联合/元组/映射类型 | ❌ | ✅（type 表达力更强） |
| 库的公共 API | ✅（使用者可扩展） | — |

**实践结论**：对外可扩展的类型用 interface，联合/工具/复杂类型用 type，团队统一即可。

---

### Q40：常用工具类型与泛型约束？

**答：**

```typescript
Partial<T>          // 全变可选      (更新表单场景)
Required<T>         // 全变必填
Pick<T, K>          // 挑选部分键
Omit<T, K>          // 排除部分键    (去除 id 后新建)
Record<K, V>        // 键值映射
ReturnType<F>       // 函数返回值类型
Awaited<T>          // 解 Promise

// 泛型约束
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];              // 安全访问任意属性
}
```

**加分**：能手写 `Partial`——`{ [K in keyof T]?: T[K] }`（映射类型）。

---

### Q41：Vue 与 React 的核心差异？（资深对比题）

**答：**

| 维度 | Vue | React |
| --- | --- | --- |
| 响应式 | 细粒度自动追踪依赖 | `setState`/不可变数据 + 重渲染组件 |
| 模板 | template（编译时优化空间大） | JSX（就是 JS，灵活） |
| diff | 编译时标记 + LIS 优化 | Fiber 可中断调度 + Hook 规则 |
| 状态可变 | ✅ 直接改 ref.value | ❌ 强调 immutable |
| 心智 | 约定多、上手快 | 更接近原生 JS、灵活自由 |

**表达技巧**：不说"谁好谁坏"，说"团队技术栈/项目类型/生态依赖决定选型"。

---

## 第七部分：工程化

### Q42：Webpack 的构建流程？

**答：**

```
1. 初始化参数(配置合并)
2. 开始编译: 创建 Compiler, 注册所有插件(apply)
3. 从 entry 出发递归解析依赖
   → 对每个模块按 rules 匹配 loader 转换(如 vue/babel/css)
   → 再找出该模块依赖的模块, 递归(依赖图 Dependency Graph)
4. 根据依赖图组装成 chunk, 再渲染成 bundle 文件输出
5. 插件在各个钩子节点(tapable 事件流)介入: 如 HtmlWebpackPlugin 在输出后生成 html
```

**一句话**：入口递归 → loader 转换 → 依赖图 → chunk → bundle，插件全程插手。

---

### Q43：Loader 和 Plugin 的区别？

**答：**

* **Loader**：文件**转换器**——把非 JS 模块（vue/css/图片）转成 webpack 能处理的模块；**单一职责**，链式调用（从右到左）
* **Plugin**：基于 **tapable 事件流**的**全流程扩展**——打包优化、资源注入、环境变量，监听钩子在任意阶段介入

```
Loader = 车间的"加工设备"     (处理单个文件怎么转)
Plugin = 工厂的"质检/调度员"   (介入整个生产流程)
```

**追问**：常见配置——`css-loader` 解析 @import/url → `style-loader` 注入 style 标签 / MiniCssExtractPlugin 抽离成文件。

---

### Q44：Webpack 有哪些性能优化手段？

**答：**（构建速度 + 产物体积两条线）

```
构建速度:
  cache: { type: 'filesystem' }  持久化缓存(二次构建飞快)
  多进程: thread-loader 处理 babel
  缩小范围: exclude node_modules / resolve.alias / noParse
  DllPlugin(旧方案, 现多用 externals + CDN)

产物体积:
  代码分割: splitChunks 拆公共包 + 路由懒加载 import()
  Tree Shaking(ESM + sideEffects: false)
  压缩: TerserPlugin / CssMinimizer
  图片: asset module 限宽 + image-webpack-loader
  按需引入组件库(babel-plugin-import / unplugin-auto-import)

运行时体验:
  CDN externals(jQuery/moment 这类)
  预加载 prefetch/preload
```

---

### Q45：Vite 为什么快？

**答：**

```
开发时:
  1. 不打包! 基于浏览器原生 ESM, 按需编译(请求到哪个模块才编译哪个)
  2. esbuild(Go 编写) 做依赖预构建: 比 JS 工具链快 10-100 倍
  3. 模块级 HMR: 改一个模块只热替换该模块(不整页刷新)
生产时:
  依旧 Rollup 打包(成熟产物优化) — Vue3/Vite 团队正在用 Rolldown(Rust) 替换
```

**对比 webpack**：dev 阶段 webpack 要全量构建 bundle 再起服务，项目越大启动越慢；Vite 启动时间与项目复杂度**基本解耦**。

---

### Q46：Babel 的原理？AST 是什么？

**答：**

```
Babel 三步: parse(源码→AST) → transform(遍历 AST 改写) → generate(AST→代码)
```

```javascript
// 手写简易插件: 把 === 替换成 Object.is
module.exports = function () {
  return {
    visitor: {
      BinaryExpression(path) {
        if (path.node.operator === '===') {
          // 改写节点...
        }
      },
    },
  };
};
```

**AST 应用场景**：Babel 转译、ESLint 检查、Prettier 格式化、代码压缩、按需引入改写、低代码 schema → 代码生成。

---

### Q47：微前端 qiankun 的原理与坑？

**答：**

**原理三件套**：

```
1. JS 隔离: Proxy 沙箱(legacy: window 快照)
   - 激活时劫持 window, 子应用对全局的修改都被拦截在沙箱内
2. CSS 隔离: scoped style(动态改写选择器加前缀) / shadow DOM
3. HTML Entry: 像 iframe 一样加载子应用入口, 但共享一个 document(比 iframe 通信好)
```

**常见的坑与解**：

```
样式冲突 → BEM + scoped / experimentalStyleIsolation
公共依赖重复 → externals 共享基础库 / 模块联邦
通信 → initGlobalState 发布订阅 / CustomEvent / URL 参数
路由冲突 → base 前缀 + activeRule 精确匹配
```

---
## 第八部分：性能优化（资深分水岭）

### Q48：Core Web Vitals 有哪些指标？

**答：**

| 指标 | 含义 | 良好标准 | 主要影响因素 |
| --- | --- | --- | --- |
| **LCP** 最大内容绘制 | 主内容加载完成 | ≤ 2.5s | 服务端响应、关键资源阻塞、图片 |
| **INP** 交互到下一帧（新） | 页面响应速度 | ≤ 200ms | 长任务、JS 主线程阻塞 |
| **CLS** 累积布局偏移 | 视觉稳定性 | ≤ 0.1 | 无尺寸图片/广告、动态插入内容 |

**配套指标**：FCP 首次内容绘制、TTFB 首字节时间、TTI 可交互时间。

**测量**：`performance.getEntriesByType('paint')`、`PerformanceObserver`、Lighthouse、Web Vitals 库上报。

---

### Q49：首屏加载优化，你会从哪几方面入手？

**答：**（在原有笔记基础上系统化）

```
网络层:
  CDN 部署 / HTTP2-3 / 资源预加载(dns-prefetch, preconnect, preload)
  gzip/brotli 压缩 / 强缓存长效 + 内容哈希文件名

资源层:
  路由级代码分割 import() / 组件库按需加载 / Tree Shaking
  关键 CSS 内联, 非关键异步加载 / 字体子集化 + font-display: swap
  图片: WebP/AVIF + 懒加载 + 合适尺寸(srcset)

渲染层:
  SSR/SSG 直出首屏 / 骨架屏 / 关键请求提前(内联首屏数据)
  defer 脚本避免阻塞解析

代码层:
  拆长任务(requestIdleCallback / setTimeout 分片)
  虚拟列表 / 防抖节流 / 事件委托

度量层:
  设定 LCP/INP/CLS 目标 → 埋点上报 → 持续监控回归
```

---

### Q50：长列表（十万条数据）怎么优化？虚拟列表原理？

**答：**

**思路分级**：

```
1. 分页/无限滚动(最简单, 产品允许优先)
2. 时间分片: requestAnimationFrame 每帧渲染一段, 避免长任务卡死
3. 虚拟列表(根本解): 只渲染可视区域 ± 缓冲区的条目
```

**虚拟列表原理（必会手写思路）**：

```
容器(固定高度, overflow: auto)
  ↑ 总高度占位元素 = 全部数据 × 单条高度    → 撑出真实滚动条
  ↑ 可视区列表(absolute 定位 / transform: translateY)
      只渲染 startIndex 到 endIndex 的条目
      startIndex = Math.floor(scrollTop / itemHeight)
      偏移量 = startIndex × itemHeight
```

**追问不定高怎么办**：先预估高度渲染，真实渲染后测量缓存更新（ResizeObserver）。

---

### Q51：前端监控与埋点系统怎么设计？

**答：**（资深场景题）

```
采集:
  性能: PerformanceObserver(LCP/INP/CLS/FCP)
  错误: window.onerror / unhandledrejection / 资源错误(capture)
  行为: PV/UV/点击/路由(history 劫持+popstate)
  自定义: 业务关键事件 API 上报

上报策略:
  sendBeacon(页面卸载不丢) / 图片打点(1px gif) / 批量合并 + 空闲上报
  采样率控制 + 失败重试 + 队列

平台能力:
  错误聚类(同一报错聚合成一个issue) / SourceMap 反解线上压缩代码
  告警规则(错误率突变) / 大盘(按版本/页面/浏览器维度)
```

**加分**：SourceMap 反解原理——构建时上传 map 文件（不部署到生产），报错行列号反查源码。

---

## 第九部分：前端安全

### Q52：XSS 是什么？如何防御？

**答：** XSS（跨站脚本）= 恶意脚本被注入页面执行（窃取 cookie、伪造请求）。

**类型**：存储型（存库后展示）、反射型（URL 参数回显）、DOM 型（前端操作 DOM 引入）。

**防御纵深**：

```
1. 输出转义(核心): 按上下文 HTML/JS/URL/属性分别转义(框架默认转义插值, 危险在 v-html/innerHTML)
2. CSP 内容安全策略: 限制脚本来源(Content-Security-Policy)
3. HttpOnly Cookie: JS 读不到, 窃取失效
4. 输入校验: 白名单校验格式
5. 慎用 v-html/dangerouslySetInnerHTML, 需要时用 DOMPurify 消毒
```

---

### Q53：CSRF 是什么？如何防御？

**答：** CSRF（跨站请求伪造）= 借用用户在 A 站的登录态，在恶意 B 站**诱导浏览器自动携带 Cookie** 发起 A 站请求。

```
防御:
1. SameSite Cookie(Lax/Strict) — 现代浏览器默认, 大幅缓解
2. CSRF Token: 服务端下发随机 token, 请求必须携带(第三方拿不到)
3. 验证 Origin/Referer 来源
4. 敏感操作二次验证(验证码/密码)
```

**XSS vs CSRF 一句话**：XSS 是"在受害者页面执行脚本"；CSRF 是"借用受害者身份发请求"（不需要执行脚本）。

---

### Q54：点击劫持与中间人攻击怎么防？

**答：**

```
点击劫持: 透明 iframe 覆盖诱导点击 → X-Frame-Options: DENY / CSP frame-ancestors
中间人:   篡改传输内容 → 全站 HTTPS + HSTS(强制 https) + SRI(资源完整性哈希)
```

---

## 第十部分：手写题合集（硬通货，必须白板级熟练）

### Q55：手写 call / apply / bind

```javascript
// call: 借用对象调用, 参数列表
Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx ?? globalThis;
  const key = Symbol('fn');          // 防覆盖同名属性
  ctx[key] = this;                   // this = 调用的函数
  const result = ctx[key](...args);
  delete ctx[key];
  return result;
};

// bind: 返回绑定 this 的新函数, 支持柯里化 + new 场景
Function.prototype.myBind = function (ctx, ...outer) {
  const fn = this;
  return function bound(...inner) {
    // new 调用时 this 指向实例, 忽略绑定的 ctx
    return fn.apply(this instanceof bound ? this : ctx, [...outer, ...inner]);
  };
};
```

### Q56：手写 new 的过程

```javascript
function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);  // ① 空对象继承原型
  const result = Ctor.apply(obj, args);       // ② this 指向它并执行
  return result instanceof Object ? result : obj; // ③ 返回对象优先
}
```

### Q57：手写 instanceof

```javascript
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left);
  while (proto) {
    if (proto === right.prototype) return true;  // 沿原型链找
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

### Q58：手写数组去重、扁平化、柯里化

```javascript
// 去重(含 NaN 正确处理)
const unique = arr => [...new Set(arr)];

// 扁平化(递归版)
function flatten(arr) {
  return arr.reduce((res, x) =>
    res.concat(Array.isArray(x) ? flatten(x) : x), []);
}

// 柯里化: add(1)(2)(3) / add(1,2)(3) 都可
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}
```

### Q59：手写发布订阅（EventEmitter）

```javascript
class EventEmitter {
  constructor() { this.events = new Map(); }
  on(type, fn) {
    if (!this.events.has(type)) this.events.set(type, new Set());
    this.events.get(type).add(fn);
    return this;                                    // 支持链式
  }
  once(type, fn) {
    const wrap = (...args) => { fn(...args); this.off(type, wrap); };
    this.on(type, wrap);
  }
  off(type, fn) { this.events.get(type)?.delete(fn); }
  emit(type, ...args) {
    this.events.get(type)?.forEach(fn => fn(...args));
  }
}
```

### Q60：手写并发控制（限流调度器，高频）

```javascript
// 最多同时执行 limit 个任务, 全部完成后 resolve
async function limitConcurrency(tasks, limit) {
  const results = [];
  const executing = new Set();
  for (const task of tasks) {
    const p = Promise.resolve().then(task).then(r => {
      executing.delete(p);
      return r;
    });
    executing.add(p);
    results.push(p);
    if (executing.size >= limit) {
      await Promise.race(executing);   // 等最快完成的让出位置
    }
  }
  return Promise.all(results);
}
```

### Q61：手写 LRU（JS Map 版）

```javascript
class LRUCache {
  constructor(cap) { this.cap = cap; this.map = new Map(); }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key); this.map.set(key, val);   // 移到"最新"
    return val;
  }
  put(key, val) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, val);
    if (this.map.size > this.cap) {
      this.map.delete(this.map.keys().next().value); // 删最旧
    }
  }
}
```

---

## 第十一部分：场景与系统设计题（资深标志）

### Q62：设计一个大文件上传（分片 + 断点续传 + 秒传）

**答：**

```
1. 分片上传:
   前端 File.slice(0, 5MB) 切块 → 逐片/并发上传 → 全部完成后通知服务端合并
2. 秒传:
   上传前算文件 Hash(SparkMD5, 大文件抽样算) → 服务端查到相同 Hash → 直接返回成功
3. 断点续传:
   上传前请求服务端"该 Hash 已上传的分片列表"
   → 只补传缺失的分片 → 刷新/重试不重传
4. 工程细节:
   并发控制(4-6 片并发) + 失败重试 + 进度条(已传字节/总字节)
   页面隐藏时暂停(requestIdleCallback 节流计算 hash 防卡顿)
```

---

### Q63：设计一个组件库，重点考虑什么？

**答：**

```
分层设计: 基础组件(Button/Input) → 组合组件(Form/Table) → 业务组件
API 设计: 受控/非受控统一(props + v-model 双向) / 插槽自定义渲染 / 事件语义化
主题定制: CSS 变量 + 配置化主题(换肤), 样式隔离
工程质量: TypeScript 类型完备 / 单元测试(Vitest) / 文档系统(VitePress)
包管理: 按需加载(unplugin-vue-components 自动导入) / monorepo 管理(pnpm workspace)
版本策略: 语义化版本(major/minor/patch) + 变更日志 + 废弃 API 缓冲期
```

---

### Q64：SSR 的原理与代价？什么时候用？

**答：**

```
原理: 服务端把组件渲染成 HTML 字符串直出 → 客户端"水合(hydration)"
     绑定事件恢复交互 → 首屏不等待 JS 下载执行
收益: 首屏快(FCP/LCP) + SEO 友好(爬虫直接拿到内容)
代价: 服务器成本 / 开发限制(window 等浏览器 API 需守卫)
     水合耗时(TTI 反而可能变慢) / 缓存策略复杂
方案: Nuxt(Vue) / Next(React); 静态内容用 SSG 更省
结论: 重 SEO(C 官网/内容站)用 SSR/SSG; 内部管理系统基本不需要
```

---

### Q65：多人协同编辑怎么实现？（思路题）

**答：**

```
核心难题: 多人并发修改同一文档, 如何不互相覆盖
两大方案:
  OT(Operational Transformation): 操作变换, 同步服务器对并发操作做变换
    → 成熟(Google Docs/语雀), 实现复杂
  CRDT(冲突无关复制数据类型): 数据结构天然可合并(Yjs)
    → 去中心化友好, 前端库成熟, 内存占用略高
配套: WebSocket 实时广播 + 光标/选区同步 + 版本历史(快照+增量)
```

---

## 第十二部分：架构与软素质

### Q66：怎么做技术选型？

**答：**（展示方法论而非偏好）

```
1. 明确约束: 团队规模/技能栈/项目周期/长期维护成本
2. 候选对比: 生态/文档/社区活跃度/体积/性能/TS 支持/测试
3. 原型验证: 关键场景各写 demo, 用数据说话
4. 风险评估: 学习成本/踩坑成本/迁移成本/锁死风险
5. 决策记录: 写 ADR(架构决策记录), 说明为什么选/不选
```

### Q67：Code Review 主要看什么？

**答：**

```
正确性: 逻辑/边界/异常处理          > 风格(交给 ESLint/Prettier)
可读性: 命名/函数职责/注释是否解释 why
可维护: 是否重复代码/是否该抽象/耦合度
安全: XSS 风险/敏感信息/权限校验
性能: 明显的 N+1 请求/内存泄漏/长任务
测试: 关键逻辑是否有单测覆盖
```

### Q68：高级工程师 vs 前端架构师的区别？

**答：**

```
高级工程师: 独立负责模块/攻克疑难(性能/复杂交互), 输出高质量代码
架构师:    定义技术标准与规范, 跨团队技术决策, 体系建设(监控/组件库/CI),
           权衡业务与技术债, 用架构放大团队效率
一句话: 高级工程师把"事"做好; 架构师设计"做事的方式"
```

---

## 第十三部分：React 深度解析

> 前文 Q41 已对比 Vue 与 React 的表层差异，本部分深入 React 内部机制：设计理念 → Fiber 架构 → Hooks 原理 → 并发特性 → 性能优化 → 生态选型，覆盖资深面试对 React 的完整考察链路。

### 📚 React 知识地图

```
理念层: 声明式 / 组件化 / 单向数据流 / UI = f(state)
机制层: Fiber 架构 / 双缓存树 / 调度器 / 合成事件 / 批处理
API 层: Hooks 家族原理 / Context / Error Boundary / Portal
性能层: memo 家族 / 不可变数据 / 虚拟列表 / 并发特性
生态层: 状态管理 / React Router / Next.js / RSC
```

---

### Q69：React 的设计理念？UI = f(state) 是什么意思？

**答：**

```
UI = f(state)：界面是状态的函数——状态相同, 界面必然相同
你只负责: 修改状态(state)
React 负责: 根据 state 计算出最新界面并更新 DOM
```

* **声明式**：描述"界面应该长什么样"，而不是"怎么一步步改 DOM"（对比 jQuery 命令式的 `$('#x').show()`）
* **组件化**：UI 拆成可组合、可复用的独立单元
* **单向数据流**：数据自上而下（props），子组件不直接改父数据（回调上报）
* **一次学习，随处编写**：同一套组件思想跑在 DOM（web）、Native（移动端）、SSR

**资深表达**：声明式的本质是把"界面同步"这个最易出错的命令式问题，交给框架用 diff 兜底——开发者心智只剩"状态管理"。

---

### Q70：JSX 的本质是什么？

**答：** JSX ≠ 模板字符串，也 ≠ HTML——它是 **`React.createElement` 的语法糖**，编译产物是**普通 JS 对象（React 元素）**。

```jsx
// 你写的 JSX
const el = <h1 className='title'>hello {name}</h1>;

// Babel 编译后(@babel/plugin-transform-react-jsx)
const el = jsx('h1', { className: 'title', children: ['hello ', name] });

// 得到的本质是一个描述界面的对象
// { type: 'h1', props: { className: 'title', children: [...] }, key: null }
```

**由此推出的三个结论（面试加分）**：

1. JSX 里可以写任意 JS 表达式（`{}`），因为它本来就是 JS
2. 插值内容默认**转义**，天然防 XSS（对比 `innerHTML`）
3. JSX 是**不可变对象**——React 靠"新对象树 vs 旧对象树"做 diff

---

### Q71：React 元素、组件、组件实例的区别？

**答：**

```
元素 Element:   普通对象, 描述某一刻的界面(最小单元, 不可变)
组件 Component: 返回元素的函数(或类) —— 造元素的"工厂"
实例 Instance:  类组件 new 出来的 this; 函数组件没有实例
              → 这正是需要 Hooks 的原因: 状态无处挂, 只能挂在 Fiber 上
```

```jsx
const Welcome = (props) => <h1>hi {props.name}</h1>;  // 组件(函数)
const el = <Welcome name='Tom' />;                     // 元素(type 指向组件)
```

---

### Q72：React 的渲染流程：render 与 commit 两个阶段？

**答：**（Fiber 架构下的一次更新）

```
1. 触发更新: setState/useState 等
2. render 阶段(可中断 ⚡):
   从根节点开始, 沿 Fiber 链表对比新旧节点
   → 找出所有要做的 DOM 变更, 打上副作用标记(effects)
   → 产出 workInProgress 树(下一帧界面)
   此阶段纯计算, 不碰真实 DOM → 可分片、可被高优先级打断
3. commit 阶段(不可中断, 同步执行):
   beforeMutation → mutation(真实 DOM 变更) → layout(useLayoutEffect)
   一次性把所有 DOM 变更提交, 避免用户看到中间态
4. 浏览器 paint → useEffect 异步执行
```

**为什么这样分**：把昂贵的调和计算变成可中断的任务，保证用户输入等高优先级事件随时插队，页面不掉帧。

---

### Q73：Fiber 是什么？React 为什么需要它？

**答：**

**背景痛点（React 15 时代）**：递归遍历组件树做 diff，**一旦开始不可中断**——大组件树的更新是几百毫秒的长任务，动画掉帧、输入卡顿。

**Fiber 的两层含义**：

1. **数据结构**：组件树节点从"递归嵌套"改为**链表结构**（`child / sibling / return` 指针），可以随时暂停、记录位置、下次继续
2. **架构**：把渲染拆成一个个小任务（Fiber 节点单元），交给**调度器（Scheduler）**按优先级分片执行

```
可中断 → 高优先级任务(用户输入)可插队
可恢复 → 暂停后从断点继续(记住当前位置)
可复用 → 旧 Fiber 树的结构与状态可被复用(bailout 优化)
```

**面试金句**：Fiber 把"同步的递归 diff"改造成"基于链表的可中断增量渲染"——这是 React 17/18 一切并发能力（Transition、Suspense、流式 SSR）的地基。

---

### Q74：什么是双缓冲树（current / workInProgress）？

**答：**

```
current 树:        当前屏幕上对应的 Fiber 树
workInProgress 树: 内存中正在构建的下一帧 Fiber 树(复用 current 的节点克隆)

构建完成 → commit → root.current = workInProgress  (指针切换)
```

* 类比**显卡双缓冲**：后台画好新画面再整体上屏，避免闪烁中间态
* 更新被打断时，workInProgress 可整体丢弃重来，current 不受影响
* bailout：子树 props 未变可跳过克隆直接复用（性能优化基础）

---

### Q75：setState 是同步还是异步的？

**答：**（高频陷阱题，按版本演进回答）

```
本质: "异步"其实是【批处理 + 调度】, 不是 Promise 那种异步
React 17: 合成事件/生命周期内 → 批量合并
          setTimeout/原生事件/Promise 回调里 → 同步(立即 re-render)
React 18: Automatic Batching —— 任何场景都自动批处理 ✅
```

```jsx
// 经典陷阱: 同一事件里连续 setCount(count + 1) 三次
// 三次读到的都是旧的 count → 只 +1 ❌
// 解法: 函数式更新, 基于最新值计算 ✅
setCount(c => c + 1);
setCount(c => c + 1);
setCount(c => c + 1);
```

**怎么拿更新后的值**：`useEffect(() => {...}, [count])`；或 `flushSync(() => setX(v))` 强制同步刷新。

---

### Q76：Hooks 的实现原理？为什么不能写在 if 里？

**答：**

**核心机制**：每个函数组件在 Fiber 上挂一条 **`memoizedState` 链表**，每个 Hook 是链表上的一个节点——**Hook 的"记忆"不在函数闭包里，而在 Fiber 上**（函数组件没有实例也能有状态的原因）。

```
render 1: useState(0) → 节点A    useState(0) → 节点B    useEffect → 节点C
render 2: 依然按【调用顺序】从头到尾一一对应读取节点 A/B/C
```

**为什么不能条件调用**：某次 render 跳过了节点 B，之后所有 Hook 会**错位对应**到错误的节点（C 读走 B 的状态）——数据全乱。

**三条规则（必背）**：

```
1. 只在函数最顶层调用 Hook(不能在 if/for/嵌套函数里)
2. 只在 React 函数组件或自定义 Hook 里调用
3. 自定义 Hook 必须 use 开头(ESLint 静态检查的依据)
```

---

### Q77：useState 的两个进阶用法？

**答：**

```jsx
// 1. 惰性初始化: 传函数, 只在首次 render 执行一次
// ❌ useState(expensiveInit())  每次渲染都白算一遍
// ✅
const [state, setState] = useState(() => expensiveInit());

// 2. 引用类型必须不可变更新(新对象触发渲染)
// ❌ state.list.push(x); setState(state)   同一引用 → 不渲染
// ✅
setState(s => ({ ...s, list: [...s.list, x] }));
```

**原理挂钩**：React 用 `Object.is` 比较新旧 state，**引用没变就跳过渲染**——这就是"不可变数据"在 React 里的底层原因。

---

### Q78：useEffect 的执行时机与清理函数？

**答：**

**时机（与家族对比）**：

```
DOM 变更(commit) → 浏览器 paint → useEffect 异步执行   (不阻塞画面)
DOM 变更 → useLayoutEffect 同步执行(paint 前)          (需测量布局时用)
```

**依赖数组语义**：

```
省略       → 每次 render 后都执行
[]         → 仅挂载后一次(卸载时跑清理)
[a, b]     → 任一变化才执行(先跑上次清理, 再跑本次)
```

**清理函数**：**下次 effect 执行前 + 组件卸载前**都会执行——定时器/订阅必须清理，否则内存泄漏与重复执行。

---

### Q79：useEffect 的闭包陷阱？（必考代码题）

**答：**

```jsx
// 现象: 定时器里 count 永远打印 0
useEffect(() => {
  const t = setInterval(() => {
    console.log(count);          // 捕获的是【那次渲染的 count 快照】
  }, 1000);
  return () => clearInterval(t);
}, []);                           // 依赖为空 → 快照永远是初始 0
```

**原因**：函数组件每次 render 都是新函数调用，effect 闭包捕获的是**当次渲染的状态值**。

**三种解法**：

```jsx
// 1. 函数式更新(状态计算场景)
setInterval(() => setCount(c => c + 1), 1000);

// 2. 把依赖写全(每次变化重建 effect)
useEffect(() => { ... }, [count]);

// 3. useRef 保存最新值(定时器等不想重建的场景)
const latest = useRef(count);
useEffect(() => { latest.current = count; });
useEffect(() => {
  const t = setInterval(() => console.log(latest.current), 1000);
  return () => clearInterval(t);
}, []);
```

---

### Q80：useMemo / useCallback 什么时候该用、什么时候是负优化？

**答：**

```jsx
const value = useMemo(() => expensive(a, b), [a, b]);   // 缓存计算结果
const fn    = useCallback(handleClick, [dep]);           // 缓存函数引用
// useCallback(fn, deps) ≈ useMemo(() => fn, deps)
```

**该用的场景**：

```
1. 昂贵计算(大量过滤/排序/大对象构建)
2. 引用敏感性消费: 作为其他 Hook 的依赖 / 传给 memo 包裹的子组件
3. 自定义 Hook 返回的函数(给外部稳定引用)
```

**负优化场景（资深必答）**：

```
1. 计算本身比"缓存+比较依赖"还便宜 → 白白多耗内存
2. 接收方没配 memo, 引用稳定了也照样重渲染
结论: 先用 Profiler 定位, 有数据再优化; 滥用不如不用
```

---

### Q81：useRef 有哪些用途？

**答：** useRef = 一个**修改不触发渲染的可变值盒子**。

```jsx
// 1. 访问真实 DOM
const inputRef = useRef(null);
<input ref={inputRef} />;
useEffect(() => inputRef.current.focus(), []);

// 2. 保存定时器 id 等句柄
const timerRef = useRef(null);
timerRef.current = setInterval(fn, 1000);

// 3. 跨渲染保存"最新值"(闭包陷阱解法, 见 Q79)

// 4. 手写 usePrevious(经典)
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });   // render 后更新
  return ref.current;                           // 返回上一次的值
}
```

**对比 state**：`ref.current` 变化不渲染；state 变化才渲染——需要上屏的数据用 state，不上屏的"后台变量"用 ref。

---

### Q82：useContext 的性能陷阱与正确用法？

**答：**

**机制**：Provider 的 `value` 变化 → **所有消费该 Context 的组件全部重渲染**（无论用的是 value 里的哪个字段）。

**两大坑**：

```jsx
// 坑1: value 每次渲染都是新对象 → 全体消费者白白重渲染
<UserContext.Provider value={{ user, setUser }}>   // ❌ 每次新对象

// 解法: useMemo 稳定引用
const value = useMemo(() => ({ user, setUser }), [user]);
<UserContext.Provider value={value}>                // ✅

// 坑2: 高频更新数据放进全局 Context → 雪崩式重渲染
// 解法: 按【更新频率与字段】拆分多个 Context
```

**选型结论**：Context 适合**低频全局数据**（主题、语言、当前用户）；高频细粒度更新交给状态库的 selector 订阅（见 Q91）。

### Q83：自定义 Hook 怎么设计？手写几个常用的？

**答：** 自定义 Hook = **组合内置 Hook 的普通函数**——复用**逻辑**不复用 UI（对比 HOC/Render Props 复用的是渲染结构）。

```jsx
// 1. useDebounce: 防抖值(搜索联想场景)
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);              // 每次变化清掉旧定时器
  }, [value, delay]);
  return debounced;
}
const keyword = useDebounce(inputValue, 500);   // 使用

// 2. useLocalStorage: 状态持久化
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; }
    catch { return initial; }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

// 3. useFetch: 通用请求(含取消与防竞态)
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    const ac = new AbortController();
    setState(s => ({ ...s, loading: true }));
    fetch(url, { signal: ac.signal })
      .then(r => r.json())
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => { if (error.name !== 'AbortError') setState({ data: null, loading: false, error }); });
    return () => ac.abort();                    // 卸载/换 url 时取消旧请求
  }, [url]);
  return state;
}
```

**设计原则**：一个 Hook 只做一件事；返回值用数组（灵活命名）或对象（可扩展）；所有副作用必须有清理。

---

### Q84：合成事件是什么？和原生事件的区别？

**答：** React 把事件统一包装成 **SyntheticEvent**，通过**事件委托**挂载到根容器（React 17+，此前是 document）。

```
收益:
1. 抹平浏览器差异(统一 API)
2. 减少事件绑定数量(委托), 内存友好
3. 配合 Fiber 优先级调度(事件即优先级来源)
区别与注意:
1. e.target 是真实元素; e.nativeEvent 才是原生事件对象
2. 合成事件不冒泡到 document 之外的原生监听(17 后边界变化是经典坑)
3. 想拿到异步后的 event 需 e.persist() 或提前取值(17 后已无事件池)
```

---

### Q85：受控组件与非受控组件？

**答：**

```jsx
// 受控: 表单值 = state, 修改必须走 onChange(单向数据流)
const [v, setV] = useState('');
<input value={v} onChange={e => setV(e.target.value)} />

// 非受控: DOM 自己管值, ref 按需取
<input defaultValue='hello' ref={inputRef} />
```

| 维度 | 受控 | 非受控 |
| --- | --- | --- |
| 数据源 | React state（单一真相） | DOM 内部 |
| 即时校验/联动 | ✅ 天然支持 | 麻烦 |
| 性能 | 每键触发渲染 | 更好 |
| 场景 | 绝大多数表单 | 文件上传、简单表单、性能极端场景 |

---

### Q86：HOC、Render Props、Hooks 三种逻辑复用方式怎么演进？

**答：**

```jsx
// 1. HOC 高阶组件: 组件包装组件, 透传 props 注入能力
function withUser(Comp) {
  return (props) => <Comp user={getUser()} {...props} />;
}
// 痛点: 嵌套地狱 / props 命名冲突 / 来源不明(调试难)

// 2. Render Props: 通过函数子组件暴露能力
<DataProvider render={(data) => <List data={data} />} />
// 痛点: 依然嵌套难看 / 类型推导繁琐

// 3. Hooks: 逻辑直接抽成函数, 在组件内调用
const data = useData();                        // ✅
// 无嵌套 / 无命名冲突 / 逻辑内聚 / TS 友好 → 当前最佳实践
```

---

### Q87：错误边界（Error Boundary）是什么？

**答：** 捕获**子树渲染期错误**、展示兜底 UI 的类组件（Hook 版暂无官方实现）。

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {          // 渲染阶段: 返回新 state
    return { hasError: true };
  }
  componentDidCatch(error, info) {              // 提交阶段: 上报日志
    reportError(error, info);
  }
  render() {
    return this.state.hasError ? <Fallback /> : this.props.children;
  }
}
```

**捕获不了的（必答）**：事件回调里的错误、异步代码（setTimeout）、服务端渲染、Error Boundary 自身错误——这些用 `window.onerror` / `unhandledrejection` 全局兜底。生产用 react-error-boundary 库。

---

### Q88：React 性能优化全景图？

**答：**（按"减少渲染次数 → 降低单次渲染成本 → 缩小渲染范围"三层作答）

```
减少不必要的渲染:
  React.memo 包裹子组件 + useCallback/useMemo 稳定 props 引用
  列表用稳定 key(禁用 index 当 key 于增删场景)
  父组件 state 就近放置, 只让真正依赖的子树更新

降低渲染成本:
  虚拟列表(react-window)扛十万行
  拆小组件粒度, 让 memo 的比较范围变小
  昂贵计算 useMemo

缩小渲染范围:
  Context 拆分(低频/高频隔离) / 状态库 selector 精确订阅
  状态下放: 只有一个叶子组件用的 state 别放父组件

代码分割与加载:
  React.lazy(() => import('./Page')) + <Suspense fallback={<Spin />}>
  路由级懒加载 / 组件级按需

并发降级(18+):
  useTransition 标记非紧急更新 / useDeferredValue 延迟派生值

度量(先测量再优化):
  React DevTools Profiler 看每次渲染耗时与原因
```

---

### Q89：React 18 的并发特性有哪些？

**答：**

```
1. Automatic Batching: 所有场景自动批处理状态更新(见 Q75)

2. Transitions 把更新分两类:
   紧急更新: 输入框打字、点击 → 立即响应
   过渡更新: 搜索结果列表渲染 → 可中断、可放弃
   const [isPending, startTransition] = useTransition();
   startTransition(() => setResults(filter(data)));  // 慢渲染不再卡输入

3. useDeferredValue: 延迟派生一份"滞后值"渲染重列表, 输入保持丝滑
   const deferredKeyword = useDeferredValue(keyword);

4. Suspense: 声明式等待(组件"未就绪"就显示 fallback)
   配合 lazy 做代码分割 / 配合数据库做流式加载

5. 流式 SSR: renderToPipeableStream 边生成边发送
```

**一句话总结**：并发 = 让 React 能**中断低优先级渲染、优先处理用户交互**——Fiber 架构欠了三年的能力终于兑现。

---

### Q90：StrictMode 为什么会导致双重调用？

**答：**

* 开发模式下 StrictMode 会**模拟"挂载→卸载→再挂载"**（也把函数组件执行两次）
* 目的：提前暴露两类问题——**不纯的渲染函数**（每次渲染产生副作用）与**缺清理的 effect**（订阅/定时器没在 cleanup 里释放）
* 为未来的**可复用状态（Offscreen/Activity）**做准备：组件可能被卸载后重建且状态保留，双调用帮你发现隐藏 bug
* **生产构建完全不生效**，不必担心性能

---

### Q91：React 状态管理怎么选型？

**答：**（先分类再选，资深思路）

```
第一问: 这是【客户端状态】还是【服务端状态】?
服务端状态(列表/详情/缓存): 交给 React Query / SWR
  → 自带缓存、重试、失效、去重, 别塞进全局 store

客户端状态按规模选:
  组件间少量共享 → 状态提升 + Context(低频)
  中大型应用     → Zustand(轻量, 无 Provider, selector 精确订阅)
                   Redux Toolkit(规范, DevTools 时间旅行, 中间件生态)
  原子化细粒度   → Jotai / Recoil(依赖图驱动更新)
```

**Zustand 为什么快**：组件通过 selector 只订阅自己用的字段，字段没变就不渲染（对比 Context 的全量广播）。

**Redux 核心三原则**：单一 store / state 只读 / 纯函数 reducer 改变状态（`(state, action) => newState`）。

---

### Q92：React 与 Vue 的深度对比？（深化 Q41）

**答：**

| 维度 | React | Vue |
| --- | --- | --- |
| 响应式 | **推模型**：setState 声明"哪变了"，React 重跑组件 | **拉模型**：Proxy 精确追踪依赖，自动只更新关联视图 |
| 更新粒度 | 组件级（rerender 后 diff） | 依赖级（更细） |
| 优化方向 | 运行时调度（Fiber 并发）+ memo 手动缓存 | 编译时优化（静态提升/PatchFlag）+ 自动缓存 |
| 模板能力 | JSX=纯 JS（全灵活） | 模板（受限换来更强编译优化） |
| 状态可变性 | 不可变（新对象触发） | 可变（直接改 ref.value） |
| 上手曲线 | 需理解闭包/重渲染心智 | 模板直观、约定多 |

**面试金句**：Vue 把优化做在**编译时**（框架替你优化），React 把优化做在**运行时**（调度并发，给你工具自己优化）——哲学不同，没有绝对优劣。

---

### Q93：React Router 的实现原理？

**答：**

```
核心: history 库封装 + Context 广播
1. <BrowserRouter> 监听 popstate(hash 模式监听 hashchange)
2. <Link> 点击 → history.pushState(不刷新改 URL) → 触发内部 state 更新
3. 路由上下文重新计算匹配 → 渲染命中的 <Route> 与嵌套 <Outlet />
```

* 与 vue-router 同源思想：hash（无需服务端配置）vs history（需回退到 index.html）
* v6 变化：`<Routes>` 替代 `<Switch>`、嵌套路由用 `<Outlet>`、`useNavigate` 替代 `useHistory`
* 路由懒加载：`const Page = React.lazy(() => import('./Page'))` + Suspense

---

### Q94：Next.js 与 React Server Components（RSC）？

**答：**

```
Next.js = React 全栈框架:
  文件即路由(app 目录) / 数据获取约定 / SSR·SSG·ISR 混合渲染
  ISR 增量静态再生成: 静态页 + 后台定时失效重建(内容站神器)

RSC 服务端组件('use client' 划定边界):
  Server Component: 在服务端运行, 打包产物不含其 JS
    → 可直连数据库/读文件/用大依赖, 0 客户端体积
  Client Component: 声明 'use client' 后才进交互世界(state/effect)

与 SSR 的区别(易混):
  SSR = 渲染【时机】在服务端(HTML 直出, 水合后仍是客户端组件)
  RSC = 组件【运行位置】在服务端(水合时无需带走其代码)
```

---

## 第十四部分：Vue × React 双栈贯通（串联对比 + 深度补强）

> **本部分定位**：不再零散地背"两个框架的区别"，而是沿**同一条更新流水线**把 Vue 和 React 串起来——从一次点击开始，经过**感知变化 → 调度 → diff → DOM 提交 → 钩子**，每一站看两家分别怎么做、为什么这么设计，并把关键机制讲到源码级细节。
> **一句话总纲**：面对"状态变了，界面怎么更新"这同一个问题——**Vue 选择"细粒度依赖追踪 + 编译时优化"，React 选择"组件级重渲染 + 运行时调度"**。其余所有差异都是这两种哲学的推论。

### 14.0 总纲：一张图串起两大框架

```
             一次状态更新在两个框架中的旅程(同一条流水线, 两种实现)

用户交互
   │
   ▼
┌─────────────── ① 感知变化 ───────────────┐
│ Vue:   Proxy 的 set 拦截 → trigger        │  ← 精确知道"哪个数据"变了
│ React: setState 调用 → 标记一次更新       │  ← 只知道"哪个组件"要更新
├─────────────── ② 收集与调度 ──────────────┤
│ Vue:   targetMap 依赖表 → effect 入队     │
│        微任务(nextTick)统一批量 flush     │  ← 无优先级, 但单次成本低
│ React: Lane 优先级 → Scheduler 时间片     │
│        5ms 分片, 高优先级可打断低优先级    │  ← 有优先级抢占
├─────────────── ③ 计算差异(diff) ──────────┤
│ Vue:   编译时已知动态点(PatchFlag/Block)  │  ← diff 前就跳过静态
│        Vue2 双端 / Vue3 预处理+LIS        │
│ React: 运行时逐 Fiber 对比                │
│        memo+浅比较可 bailout 跳过子树      │  ← 优化靠开发者手动标注
├─────────────── ④ 提交 DOM ────────────────┤
│ Vue:   patch 过程中直接改 DOM             │
│        (同步 flush 在微任务里一次完成)     │
│ React: commit 阶段一次性同步提交           │
│        (mutation → layout effects)        │
├─────────────── ⑤ 钩子与上屏 ──────────────┤
│ Vue:   updated → 浏览器 paint             │
│ React: useEffect(paint 后异步) → paint    │
└────────────────────────────────────────────┘
```

---

### Q95：串讲开场：用 60 秒把两个框架讲成"一个故事"？

**答：**（面试可直接使用的开场白）

"两个框架解决的都是 `UI = f(state)`，分野在于**对'变化'的感知粒度**。Vue 用 Proxy 拦截读写，**精确订阅到字段级**——改 `count` 只有依赖 `count` 的地方更新，所以 Vue 敢把优化做在编译期：模板是受限的，编译器知道哪些节点是动态的，diff 时直接跳过静态内容。React 不劫持数据，`setState` 只是**组件级失效声明**——整个函数重新执行，diff 全量对比，运行时谁也不知道哪是动态的，所以 React 把力气花在**运行时调度**上：Fiber 把 diff 拆成可中断的小任务，按优先级执行，用户输入永远优先。由此推出所有差异：Vue 有 computed 自动缓存而 React 要手写 useMemo；Vue 可以直接改 `ref.value` 而 React 必须不可变更新；Vue 用微任务批量就够了而 React 要时间片调度。"

**这段话的价值**：把 Q41/Q92 的"对比表"变成"因果链"——面试官听到的是设计理解，不是知识罗列。

---

### Q96：深度①：Vue3 响应式的完整链路（源码级）

**答：**（比 Q29 更深一层，按"依赖收集 → 触发 → 调度"三段讲）

**第一段：依赖收集（get / track）**

```javascript
// 数据结构(必画):
// targetMap: WeakMap { target → Map { key → Dep(Set<effect>) } }

function track(target, key) {
  if (!activeEffect) return;          // 不在 effect 中读取 → 不收集
  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));
  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));
  dep.add(activeEffect);              // 双向记录
  activeEffect.deps.push(dep);        // 反向: effect 也记住 dep(为了清理)
}
```

**关键细节（资深分水岭）**：

* `activeEffect` 是全局指针——**正在执行的 effect**。组件渲染函数本身就是一个 effect（render effect）
* **分支清理**：effect 每次执行前会先清空自己的 deps 再重新收集——解决 `flag ? a : b` 切换后，对旧分支依赖的残留（否则改 b 还会触发只看 a 的副作用）

**第二段：触发更新（set / trigger）**

```javascript
function trigger(target, key) {
  const dep = targetMap.get(target)?.get(key);
  if (!dep) return;
  // 遍历执行; 但组件的 render effect 有 scheduler → 不立即跑!
  for (const effect of dep) {
    if (effect.scheduler) effect.scheduler(effect);
    else effect.run();
  }
}
```

**第三段：调度去重（queueJob）**——Vue 批处理的真相：

```javascript
// 组件更新的 scheduler 做的事:
function queueJob(job) {
  if (!queue.includes(job)) queue.push(job);   // ★ 同一组件多次修改 → 任务去重
  Promise.resolve().then(flushJobs);           // 微任务中统一执行
}
```

```
一个事件里改了同一组件的 3 个 ref → 3 次 trigger → 1 个组件 job(去重)
→ nextTick(微任务)里才真正 re-render 一次
→ 这就是"Vue 天然批处理"的源码级解释, 也是 nextTick 能拿到新 DOM 的原因
```

---

### Q97：深度②：React 的更新标记与 Lane 优先级（源码级）

**答：**（与 Vue 的 trigger 对位）

**第一步：setState 做了什么**——不直接改数据，而是：

```
1. 创建一个 Update 对象挂到对应 Hook/Fiber 的更新队列上
2. 从该 Fiber 向上冒泡到根, 给整条路径标记"有待处理更新"
3. 根据【触发事件的类型】分配优先级(Lane) → 交给 Scheduler
```

**第二步：Lane 优先级模型**（18 的核心，替代 17 的 expirationTime）：

```
Lane = 一个 31 位二进制数, 数值越小优先级越高
SyncLane(同步, 最高):   离散事件 click 提交表单
InputContinuousLane:     连续事件 拖拽/mousemove
TransitionLane:          startTransition 标记的更新
IdleLane:                空闲才做(日志上报)
调度时按 Lane 分组, 高优先级的更新可以"插队"打断低的
```

**第三步：Scheduler 时间切片**：

```
用 MessageChannel(宏任务)驱动, 而不是 setTimeout(有 4ms 最小延迟)
每个时间片约 5ms: 做不完 → 让出主线程 → 下个切片从断点继续
饥饿保护: 任务过期(expired)后强制同步执行, 不会被无限插队
```

**串讲句式**：Vue 的 trigger 之后是"微任务里批量做一次"；React 的 setState 之后是"按优先级排进调度器、切片着做"——前者赢在单次更新便宜，后者赢在能保证高优先级响应。

---

### Q98：深度③：为什么 Vue 不需要 Fiber 式时间切片？

**答：**（对 14.0 第②③站的追问，资深高频）

```
1. 粒度不同: Vue 的更新精确到"字段 → 依赖它的组件"
   → 单次更新通常只重渲染一个小子树, 同步做完也就零点几毫秒
   React 更新从 setState 的组件开始往下全量 re-render → 大树可能几十上百 ms
   → 不切片就会掉帧, 所以必须 Fiber

2. 但 Vue 也有软肋: 一个巨大的 v-for 列表(几千行, 全部依赖同一数据)
   组件级依赖会退化为"整个大组件重渲染" → 同样卡顿
   → 解法仍是业务层: 拆子组件 / v-memo / 虚拟列表

3. 结论: 时间切片解决的是"单次更新太贵"的问题
   Vue 用"细粒度依赖"从源头让单次更新变便宜
   React 用"可中断调度"让贵的更新不阻塞交互 —— 两条路, 一个目标
```

---

### Q99：深度④：Vue2 双端 diff 的完整过程（手推级）

**答：** 双端 diff = **新旧列表各持头尾两个指针**，四组两两比较，命中任意一组就处理并移动指针：

```
旧: [a, b, c, d]      头指针 oldStart=a  尾指针 oldEnd=d
新: [d, a, c, b]      头指针 newStart=d  尾指针 newEnd=b

第 1 轮:
  ① 新头 d vs 旧头 a ✗   ② 新尾 b vs 旧尾 d ✗
  ③ 旧头 a vs 新尾 b ✗   ④ 旧尾 d vs 新头 d ✓ !!
  → d 是旧尾移到了最前: 真实 DOM 把 d 移到 a 前面
  → newStart 后移, oldEnd 前移
  旧: [a, b, c]  新: [a, c, b]

第 2 轮:
  ① 新头 a vs 旧头 a ✓ → 原地复用, 双头指针后移
  旧: [b, c]  新: [c, b]

第 3 轮:
  ④ 旧尾 b... 新头 c vs 旧头 b ✗; 四组都不命中
  → 用 key 建映射 {b:0, c:1}, 查 c 在旧列表位置 → 找到 → 移动到最前
  旧: [b]  新: [b]

第 4 轮: 头头命中 b → 结束
```

**四组指针的意义**：首尾移动是最常见的 DOM 变化（头插/尾插/倒序），四组指针先兜住这些高频场景，把"哈希查找"留给真正乱序的残余部分。

**双端的盲区**：中间节点整体平移（如把中间一个节点移到头部）时，双端要移动多个节点——这正是 Vue3 用 LIS 优化的场景（见 Q100）。

---

### Q100：深度⑤：Vue3 的预处理 + 最长递增子序列（手推经典例）

**答：** Vue3 的 `patchKeyedChildren` 分五步：**同步头部 → 同步尾部 → 处理多余旧节点 → 挂载多余新节点 → 未知序列（核心）**。

**经典例子手推**（必须会现场推）：

```
旧: [a, b, c, d, e, f, g]
新: [a, b, f, c, d, e, g]
    ↑ 头部同步: a✓ b✓       ↑ 尾部同步: g✓
中间剩余: 旧 [c, d, e, f]   新 [f, c, d, e]
```

```
第 1 步: 为新中间节点建 key → 新下标映射
         { f:0, c:1, d:2, e:3 }

第 2 步: 从左到右扫旧节点, 查 key 映射, 填 newIndexToOldIndexMap:
         c→1, d→2, e→3, f→0
         map = [旧下标(f)=3, 旧下标(c)=0, 旧下标(d)=1, 旧下标(e)=2]
              = [3, 0, 1, 2]

第 3 步: 求 map 的最长【递增】子序列 LIS:
         [3, 0, 1, 2] 的 LIS 是 [0, 1, 2] (即 c, d, e)

第 4 步: 结论 —— LIS 中的节点【不需要移动】!
         只需把 f 移动到 c 前面 → 全程仅 1 次 DOM 移动 ✅
```

**为什么 LIS = 不动集**：在新列表中**保持相对顺序递增**的旧节点们，说明它们的相对顺序本来就没乱——不用动；不在 LIS 里的才需要移动。**用最少的 DOM 移动完成更新**，这就是 Vue3 diff 的灵魂。

**配套的编译优化（串起 Q31）**：

```
PatchFlag: 编译时给动态节点打标(仅文本变/仅class变/props变了哪些)
Block:    收集所有动态后代为扁平数组 dynamicChildren
          → patch 时遍历这个数组, 静态内容整棵直接跳过
本质: 运行时 diff 不知道谁动态, 编译器知道 —— 模板受限换来的红利
```

---

### Q101：深度⑥：React 的 diff 策略与 bailout 机制

**答：** React（无编译信息）的对比发生在 render 阶段逐 Fiber 进行：

```
三个预设(降低复杂度 O(n³) → O(n)):
  1. 只同层比较(type 不同整树替换)
  2. 不同 type 直接删旧建新
  3. 同层靠 key 匹配复用

对比时:
  beginWork: 从上往下, 对比 props/state 是否变化
  变了 → 继续往子树走(re-render)
  没变 → 子树整棵跳过 ← 这就是 bailout
```

**bailout 的三个触发条件（资深细节）**：

```
1. props 浅比较相等(引用没变) 且 state 没变
2. 该子树上下文(Context)没变
3. 没有待处理的更新
→ React.memo 的作用: 把"props 浅比较"变成记忆化的检查点
→ useCallback/useMemo 的作用: 维持 props 引用稳定, 让浅比较能通过
串讲: React 的性能优化三板斧(memo/useMemo/useCallback)
     本质都是在为 bailout 创造条件 —— 手动为运行时提供"编译信息"
```

**与 Vue 对照成一句话**：Vue3 编译器把"谁是动态的"写在代码里（PatchFlag）；React 把"谁没变"交给人来承诺（memo + 不可变引用）。

---

### Q102：双栈核心 API 全景映射表（串起所有写法）

**答：**（一表打通，左 Vue3 / 右 React18）

| 能力 | Vue 3 | React 18 | 深层差异 |
| --- | --- | --- | --- |
| 声明状态 | `ref(0)` / `reactive({})` | `useState(0)` | Vue 需 `.value`（ref）；React 返回 `[值, setter]` |
| 修改状态 | 直接改（可变） | 调 setter（不可变，新对象） | 依赖追踪 vs Object.is 比较 |
| 派生值 | `computed(() => ...)` | `useMemo(() => ..., deps)` | Vue **自动缓存**（依赖追踪），React 要手写依赖 |
| 副作用 | `watch(src, cb)` | `useEffect(cb, deps)` | watch 明确监听源；effect 声明式依赖 |
| 自动追踪副作用 | `watchEffect(cb)` | 无（必须手写 deps） | Vue 运行时收集，React 靠自觉+ESLint |
| 挂载后 | `onMounted` | `useEffect(cb, [])` | — |
| 卸载清理 | `onUnmounted` | effect 的 return | — |
| 更新后 | `onUpdated` | `useLayoutEffect`/useEffect 无依赖 | — |
| 上下文注入 | `provide / inject` | `createContext + useContext` | Vue 可配 readonly 防篡改；React value 引用稳定性要自己管 |
| 插槽 | `<slot>` / 作用域插槽 | `props.children` / render props | 作用域插槽 ≈ 函数式 children |
| 双向绑定 | `v-model` | `value + onChange`（自己组合） | 见 Q104 |
| 条件渲染 | `v-if / v-show` | `&& / 三元`（或 style 控制） | v-show≈display 切换 |
| 列表 | `v-for + :key` | `map + key` | key 语义两家一致（见 Q105） |
| 缓存组件 | `keep-alive` | 无原生（社区/Await 未来 Offscreen） | Vue 内建路由级缓存 |
| 异步组件 | `defineAsyncComponent` | `React.lazy + Suspense` | Suspense 语义更宽（数据） |
| 逻辑复用 | 组合式函数 `useXxx` | 自定义 Hook `useXxx` | 形态几乎一样，约束来源不同 |
| 状态库 | Pinia | Zustand / Redux Toolkit | 见 Q105 选型 |

**记忆心法**：先记"能力"（状态/派生/副作用/注入/插槽），再记两家的"拼写"——能力是骨架，API 只是方言。

---

### Q103：副作用系统对照：watch / watchEffect vs useEffect（串联细讲）

**答：**（这是两框架哲学差异最直观的切口）

```jsx
// ─── Vue: 依赖自动追踪 ───
watch(count, (newV, oldV) => { ... });   // 显式声明监听谁
watchEffect(() => {                       // 自动收集: 执行中读了谁就依赖谁
  console.log(count.value);
});

// ─── React: 依赖手动声明 ───
useEffect(() => {                          // deps 不写 → 闭包陷阱(Q79)
  console.log(count);
}, [count]);                               // 忘写 = stale closure
```

**三个深层差异**：

```
1. 依赖确定方式: Vue 运行时读哪个收集哪个(自动但隐式)
               React 人写数组(显式但会忘) → exhaustive-deps ESLint 是救命稻草
2. 执行时机:    Vue watch 默认"pre"(组件更新前), 可配 post/sync
               React useEffect 固定 paint 后异步
3. 清理模型:    两家都是"下次执行前+销毁时"跑清理 —— 唯一高度一致的部分
```

**串讲金句**：Vue 的 `watchEffect` 之所以能自动追踪，靠的还是 Proxy 的 get——**副作用系统就是响应式系统的延伸**；React 没有代理，所以依赖只能由人声明，闭包陷阱是这个设计的价格。

---

### Q104：双向绑定的本质：v-model 是语法糖还是真双向？

**答：**（纠正一个高频误解）

```
v-model 本质 = :modelValue + @update:modelValue  两根单向数据流拼起来的语法糖

// Vue 组件内
<input :modelValue='text' @update:modelValue='v => text = v' />
// 等价于
<input v-model='text' />

// React 等价写法(自己组合)
<input value={text} onChange={e => setText(e.target.value)} />
```

**结论**：两个框架都是**单向数据流 + 事件回传**，没有"真双向"。差异只在语法：Vue 把这个高频组合固化成指令（多个修饰符 `.lazy .number .trim`），React 保持显式组合。

**加分延伸**：Vue2 的 `v-model` 是 `value + input` 事件且受限于HTML表单语义冲突（自定义组件要 model 选项），Vue3 改名 `modelValue` 支持多个 `v-model:title`——一次演进讲出框架设计权衡。

---

### Q105：状态管理双栈对照与互译（Pinia vs Zustand/Redux）

**答：**（按"服务端状态先剥离"的同一方法论）

```
第一问两家相同: 这是服务端数据吗? → React Query / VueQuery(SWR 思想通用)
第二问客户端状态: 
  Vue:    Pinia —— 定义即 store, 组件里直接读(响应式追踪自动精确)
          const { count, increment } = storeToRefs(counterStore)
  React:  Zustand —— 手动 selector 精确订阅
          const count = useStore(s => s.count)
          Redux Toolkit —— 规范化/中间件/DevTools 时间旅行
```

**深层对照（为什么 Vue 状态库可以"直接读"，React 必须传 selector）**：

```
Pinia 的 store 本身就是 reactive 对象 → 组件模板读 count 时
依赖追踪精确到字段 → 改 title 不会重渲染只读 count 的组件 ✅ 自动

React 组件读 store 没有追踪 → 必须由 selector 声明"我只关心这个字段"
useStore(s => s.count) 返回基本类型 → Object.is 比较 → 未变不渲染 ✅ 手动
```

**一句话**：又是同一个故事的翻版——**Vue 把精确订阅内建于响应式，React 把它外化成 API**。

---

### Q106：性能优化双栈对照表（同目标，不同手段）

**答：**

| 优化目标 | Vue 手段 | React 手段 | 底层原理 |
| --- | --- | --- | --- |
| 跳过子树重渲染 | 组件没依赖到数据天然不更新 / `v-memo` | `React.memo` + 稳定 props | 精确依赖 vs 浅比较+bailout |
| 缓存计算 | `computed`（自动） | `useMemo`（手动 deps） | 依赖追踪 vs 依赖数组 |
| 稳定函数引用 | 一般不需要（模板里方法不比较） | `useCallback` | diff 不比函数 vs memo 需要引用相等 |
| 长列表 | `vue-virtual-scroller` / `v-virtual-list` | `react-window` | 虚拟滚动原理相同 |
| 组件缓存 | `keep-alive`（原生） | 无原生（社区方案） | 保活实例 vs 卸载 |
| 代码分割 | `defineAsyncComponent` | `React.lazy + Suspense` | 动态 import 相同 |
| 大更新不卡输入 | 拆组件降低单次更新粒度 | `useTransition / useDeferredValue` | 粒度 vs 调度优先级 |
| 定位工具 | Vue DevTools 性能面板 | Profiler / why-did-you-render | — |

**面试表达模板**："性能优化两家的目标一致：**让不必要的更新不发生，让必要的更新足够便宜**。Vue 靠依赖追踪+编译优化自动完成大半；React 需要开发者用 memo 三件套手动标注，换来 JSX 的完全自由。"

---

### Q107：高频双栈对比十连问（快问快答）

**答：**

```
1. 为什么 React 要 useMemo 而 Vue 基本不用?
   → Vue computed 依赖追踪自动缓存; React 无追踪, 缓存需手动声明

2. 为什么 React 强调不可变、Vue 可以直接改?
   → React 用 Object.is 判变(引用比较); Vue 用 get/set 拦截, 改了就 trigger

3. 两家的 key 语义一样吗?
   → 一样: diff 时复用匹配; index 作 key 的坑两家都存在

4. 谁的性能更好? 怎么答才专业?
   → 没有绝对答案: 依赖多而散的更新 Vue 占优;
     高频大子树更新+需要抢占时 React 并发占优; 先说"看场景"再展开

5. Composition API 和 Hooks 最大的区别?
   → 形态相似; 本质差异是依赖追踪自动 vs 手动声明
     (setup 只跑一次 vs 函数组件每次渲染重跑)

6. Vue3 为什么放弃 defineProperty?
   → 拦截不了增删/数组下标, 需 $set; 初始化全递归; Proxy 全解决(见 Q11)

7. React 做并发, Vue 为什么不跟进?
   → 细粒度更新单次成本低, 微任务批处理已够; 大列表场景靠业务拆分

8. 闭包陷阱为什么 React 有而 Vue 没有?
   → React 每次渲染新函数捕获旧快照; Vue setup 只执行一次, 引用常驻

9. 微前端里能混用两个框架吗?
   → 能(qiankun 子应用各自打包); 代价是体积与双运行时, 尽量避免

10. 从 Vue 转 React 最大的心智转变?
    → 从"改了就生效"到"一切都是重渲染": 不可变、依赖数组、
      引用相等、渲染即函数执行 —— 四个词刻进脑子
```

---

### Q108：双栈学习方法论：怎么"串着学"效率最高？

**答：**（把整份文档的用法串起来）

```
第一遍(纵向): 各自学 —— Vue 按 Q29~Q38, React 按 Q69~Q94 打地基
第二遍(横向): 按 14.0 流水线逐站对照:
              感知变化 → 调度 → diff → 提交 → 钩子 → 状态 → 性能
              每站问三个问题: 这家怎么做的? 为什么? 另一家为什么不同?
第三遍(输出): 用 Q95 的 60 秒故事讲给面试官/朋友听, 讲不顺就是没串起来
白板自测: 能画 targetMap 结构 / LIS 手推 / Fiber 时间片示意 → 三张图定乾坤
```

**终极串联图（背下这张，双栈即通）**：

```
        感知         调度          diff          优化哲学
Vue:   Proxy      微任务批量     编译时知动态    框架替你优化
       字段级      无需抢占       PatchFlag+LIS  (受限模板的红利)
React: setState   Lane+时间片    运行时全量比   你教框架优化
       组件级     可中断可插队    memo+bailout   (自由JSX的价格)
```

---

## 第十五部分：全模块深度扩展（源码级 / 协议级）

> 前十四部分覆盖广度，本部分补**深度**：把每个模块里最值得深挖的主题——内存回收、渲染管线、TLS/QUIC、编译器、Tree Shaking、CSP——讲到能应对"再深一层"连环追问的程度。
> 重点重灾区：**A 模块内存管理**（GC 全流程 + 排查实操），面试被追问到这里，多数人就开始露馅了。

---

### A. 内存管理与 V8 引擎（重点深挖）

### Q109：V8 的堆内存是怎么划分的？对象的一生怎么流转？

**答：**（Q12 只讲了"两种算法"，这里讲全生命周期）

```
V8 堆(Heap)
├── 新生代 Young Generation (默认 1~8MB, 小而快)
│     ├── From-Semi-space(活动空间)
│     └── To-Semi-space(闲置空间)
├── 老生代 Old Generation (默认 上限约 1.4GB(64位), 大而稳)
│     ├── 老生代对象区
│     └── 大对象空间 Large Object Space(直接进, 不复制)
└── 代码空间 / 只读空间 等
```

**一个对象的完整旅程（必背）**：

```
新对象诞生
   │ 分配在新生代 From 区(顶指针碰撞分配, 极快)
   ▼
第一次 Minor GC 到来
   ├── 死了 → 直接被遗弃在 From 区(零成本回收 ✅ 复制算法对短命对象极友好)
   └── 活着 → 复制到 To 区, 年龄 +1
   ▼ (From/To 角色互换)
第二次 Minor GC 又活着 → 年龄再 +1
   │
   ├── 年龄 ≥ 2(经验值) ──┐
   ├── To 区存活 > 25% ────┤ 晋升(promotion)
   └── 对象过大(超限定) ───┘
                            ▼
                     复制到老生代
                            │
                 老生代 Major GC(Mark-Sweep + Compact)
                 长期驻留 / 最终被回收
```

**设计哲学**：统计规律显示大多数对象"朝生夕死"（函数局部变量、临时数组）——所以新生代用**空间换时间**的复制算法（只复制活对象，死的零成本）；老生代存活率高、复制太亏——用**标记清除**只回收死对象。

---

### Q110：新生代 Scavenger 算法（Cheney 半空间复制）详细过程？

**答：**

```
初始:
  From: [A死][B活][C死][D活][E死]...   To: [ 空 ]
        ↑分配指针(新对象往后堆)

Minor GC 触发(From 满了):
  ① 从根(GC Roots: 全局对象/当前调用栈/活动闭包)出发遍历
  ② 活对象 B、D → 复制到 To 区(紧凑排列, 天然无碎片)
     B、D 各自年龄 +1
  ③ 其余 A、C、E → 直接无视(整块 From 视为空闲)
  ④ From 与 To 角色互换(原 To 变成新 From 继续分配)

代价: 牺牲一半空间, 换来:
  - 回收成本正比于【存活对象数】而不是总对象数(死得越多越赚)
  - 分配永远是指针碰撞(bump allocation), 极快
  - 天然内存紧凑, 无碎片
```

**追问点**：为什么新生代要拆两个 Semi-space 而不是标记清除？——标记清除要遍历全部对象算死活（死的也要标记）；复制算法只碰活的，短命对象占绝大多数时几乎零成本。

---

### Q111：老生代的标记清除、标记整理、三色标记与增量并发？

**答：**（GC 被追问的最深处，按四层递进讲）

**第一层：Mark-Sweep 标记清除**

```
① 标记: 从 GC Roots 深度遍历, 可达对象打标记
② 清除: 全堆扫描, 未标记对象的内存加入空闲链表(free list)
问题: 内存碎片! (空闲块不连续, 大对象放不下)
```

**第二层：Mark-Compact 标记整理**

```
标记后, 把所有【存活对象向一端移动】, 然后清掉边界外内存
解决了碎片, 但移动对象成本高(还要更新所有指向它的引用)
V8 策略: 平时用 Sweep, 碎片化到阈值才触发 Compact
```

**第三层：三色标记法（并发标记的基础）**

```
白: 尚未访问(最终仍是白 = 垃圾)
灰: 自己已访问, 但【子引用还没扫完】(在扫描栈里)
黑: 自己和所有子引用都已扫完(存活)

流程: 根置灰 → 取灰对象, 把它引用的白色对象置灰, 自己变黑
     → 重复直到无灰 → 白即垃圾
关键不变式: 黑色对象不允许直接指向白色对象
```

**第四层：增量标记 + 写屏障（消灭长停顿的核心）**

```
问题: 老生代标记要几十上百 ms, 一次性做完 → 页面卡死一帧
方案① 增量标记(Incremental):
     把标记拆成许多小步, 穿插在 JS 执行之间(GC 10ms, JS 5ms, 交替)
     危险: 标记期间 JS 改了引用怎么办?
     → 写屏障(Write Barrier): 每次修改对象引用时,
       若黑色对象新指向了白色对象 → 强制把白转灰(重新入队)
方案② 并发标记(Concurrent): 标记主要由后台 GC 线程做, 主线程几乎不停顿
     同样依赖写屏障维持三色不变式
方案③ 并行(Parallel): 多个 GC 线程同时标记(主线程仍参与)
```

**面试金句**：三色标记 + 写屏障的意义是——**允许"标记到一半停下来去执行 JS"而不丢正确性**，这是 V8 把 Major GC 停顿从百毫秒压到毫秒级的关键。

---

### Q112：WeakMap/WeakSet 为什么不影响 GC？WeakRef 呢？

**答：**

```
普通 Map 的键是【强引用】: 对象进 Map 后, 即使没人用了也不会被回收
WeakMap 的键是【弱引用】: 不计入 GC Roots 可达性
  → 键对象在其他地方没了引用, 就直接被回收, 条目自动消失

应用:
  1. 对象元数据: user → 权限缓存(user 被回收, 缓存自动释放)
  2. deepClone 的 map = new WeakMap() 防循环引用
  3. 私有数据存储
限制: 键必须是对象; 不可遍历(防止随时被回收导致遍历结果不确定)
```

**WeakRef + FinalizationRegistry（ES2021，加分）**：

```javascript
let target = { data: new Array(1e6).fill(0) };
const ref = new WeakRef(target);            // 弱引用
const registry = new FinalizationRegistry((held) => {
  console.log('target 被回收了', held);      // 回收后的回调(时机不保证)
});
registry.register(target, 'metadata');

target = null;                               // 释放强引用
// 之后某次 GC: 对象可能被回收, ref.deref() 返回 undefined
// 注意: 回调只是"通知", 不能依赖它做关键逻辑
```

---

### Q113：内存泄漏排查的完整实操 SOP（DevTools 三板斧）

**答：**（结合具体案例讲，不是背名词）

**第 0 步：确认泄漏存在**

```
Performance 面板录制: 反复执行可疑操作(开关弹窗/切换路由)
看 JS Heap 与 Nodes 曲线:
  正常: 锯齿状(分配→GC 回落)
  泄漏: 台阶式只涨不跌 ⚠️
Performance Monitor(Cmd+Shift+P 输入): 实时看 JS Heap size / DOM Nodes
```

**第 1 板斧：三快照对比法（定位泄漏对象）**

```
① Heap snapshot(操作前)
② 执行可疑操作 N 次(如开关弹窗 5 次)
③ 再拍 Heap snapshot
④ 选 Comparison 视图: 看 Delta 增量
   例: Detached HTMLDivElement +5 → 每次操作泄漏一个脱离文档的 DOM
⑤ 点开对象看 Retainers(保留链):
   谁还抓着它不放 → 顺着链条找到肇事变量
```

**第 2 板斧：Allocation Timeline（定位分配点）**

```
Memory 面板选 'Allocation instrumentation on timeline' 录制
蓝色条 = 分配后仍存活; 灰色 = 已回收
反复操作后仍大量蓝色 → 点开看 constructor 与分配堆栈
```

**第 3 板斧：代码层常见泄漏修复对照**

```javascript
// 泄漏1: 定时器持闭包
const data = { huge: new ArrayBuffer(1e8) };
let timer = setInterval(() => console.log(data.huge), 1000);
// ✅ 不用时 clearInterval(timer); timer = null;

// 泄漏2: Detached DOM(移出了文档, 但 JS 变量还抓着)
let detached = null;
btn.onclick = () => {
  detached = document.querySelector('.list');  // 保存引用
  detached.remove();                            // 移出文档
};  // detached 一直持有 → 整棵子树无法回收
// ✅ 用完置 null; 或干脆别缓存 DOM 引用

// 泄漏3: observer 未断开
const io = new IntersectionObserver(cb);
io.observe(el);
// 路由切换后没 io.disconnect() → el 与回调常驻
// ✅ onUnmounted/unmount 里 disconnect()

// 泄漏4: 无上限缓存
const cache = new Map();
cache.set(user, profile);   // user 流失后仍占内存
// ✅ 元数据场景换 WeakMap; 或加 LRU 上限

// 泄漏5: 全局变量(非严格模式隐式)
function leak() { leaked = new Array(1e6); }   // 没声明 → 挂到 window
// ✅ 'use strict' + ESLint no-undef
```

**Node 侧补充**：`node --max-old-space-size=4096` 调大堆上限；`process.memoryUsage()` 监控；heapdump/vscode-js-profile 生成快照分析 OOM。

---

### Q114：V8 执行管线：从源码到机器码（引擎全貌）

**答：**（JS 为什么"越跑越快"的答案）

```
源码
 │ ① Parser: 词法+语法分析 → AST
 │ ② Ignition(解释器): AST → 字节码, 立即执行(启动快)
 │    └ 执行中收集类型反馈(Type Feedback)存入 Feedback Vector
 ▼
热点代码被识别(同一函数多次执行)
 │ ③ TurboFan(优化编译器): 字节码+类型反馈 → 高度优化机器码(跑得快)
 ▼
运行中类型假设被打破?
 │ ④ 去优化(Deoptimization): 退回字节码重新解释执行
```

**两个核心优化（资深必知）**：

```
1. 隐藏类 Hidden Class(内部叫 Map):
   形状相同的对象共享同一隐藏类 → 属性访问走【内联缓存】直接命中偏移量
   反模式: 动态增删属性 / 乱序初始化 → 隐藏类分裂, 缓存失效
   ✅ 构造函数里把所有属性一次性初始化, 顺序固定

2. 内联缓存 Inline Cache(IC):
   obj.x 访问多次后, 引擎缓存"这个形状下 x 在偏移量 N"
   下次直接取, 跳过查找
   这就是"monomorphic 快, polymorphic 慢"的微观原理
```

**实用结论**：保持对象形状稳定、避免 `try-catch` 包热点、别在热路径用 `with/eval`（优化杀手）——这些"玄学优化"背后都是这条管线。

---

### B. 浏览器渲染深度

### Q115：合成器、图层与 GPU——transform 为什么不触发重排？

**答：**（Q19 讲了流水线，这里讲流水线背后的多进程/多线程机制）

```
渲染进程(Renderer Process)里的分工:
├── 主线程: JS 执行 / Style / Layout / Paint(生成绘制指令)
├── 合成器线程(Compositor Thread): 接收绘制指令, 管理图块(tile)
├── 栅格化线程池(Raster Threads): 把图块画成位图(可走 GPU)
└── GPU 进程: 最终把位图合成上屏
```

**一次滚动为什么流畅（合成器线程的特权）**：

```
页面滚动时, 合成器线程可以直接移动已栅格化的图层 → 不用主线程参与
即使主线程被 JS 长任务卡死, 滚动/transform 动画依然丝滑 ✅
(这就是"CSS 动画比 JS 动画流畅"的底层原因)
```

**transform/opacity 免重排的原理**：

```
普通属性(宽高/位置): 改变 → Style → Layout → Paint → Composite (全流程)
transform: translate: 图层整体变换 → 只在合成阶段应用矩阵运算
           Layout/Paint 全部跳过, 直接 Composite ⚡
opacity: 同理, 只影响合成时的混合
```

**图层提升（Layer Promotion）**：

```
会提升为独立图层的: 3D transform(translateZ(0)) / will-change / video/canvas
/ position: fixed / animation 中的 transform
⚠️ 图层不是越多越好: 每层占显存, 过多导致内存暴涨与合成耗时
   will-change 用完要及时移除
```

---

### Q116：一帧 16.6ms 的时间账本（rAF 的准确时机）

**答：**（把 Event Loop 和渲染串起来的关键图）

```
60Hz 下每一帧 ≈ 16.6ms, 浏览器按【帧】调度:

┌─ 宏任务(上帧遗留) ──► 微任务队列清空 ──────────────┐
│                                                      │
│  requestAnimationFrame 回调(渲染前, JS 最后机会改样式) │
│         ▼                                            │
│  Style 计算 → Layout → Paint → Composite → 上屏       │
│                                                      │
└─ 下一帧宏任务 ◄──────────────────────────────────────┘

关键结论:
1. rAF 回调在下一次重绘【之前】执行 → 改样式恰好赶上本帧 ✅
   (对比 setTimeout(fn,0): 可能错过本帧 → 掉帧/跳变)
2. rAF 由显示器刷新率驱动(120Hz 设备回调更频繁)
3. 页面不可见(切后台)时 rAF 暂停 → 动画自动节能
4. requestIdleCallback: 帧内还有剩余时间才执行(低优先级任务专用)
```

**实战模板（平滑动画）**：

```javascript
function animate() {
  // 读布局(如 offsetHeight) 与 写样式 分开, 避免强制同步布局
  element.style.transform = `translateX(${next()}px)`;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

---

### C. 网络深度

### Q117：TLS 1.3 与 QUIC 的关键改进？

**答：**

```
TLS 1.2: 需要 2-RTT 才能开始传数据
TLS 1.3: 1-RTT(握手合并), 且支持 0-RTT 会话恢复
  ① 删掉不安全算法(RC4/CBC/SHA1), 只留 AEAD 加密
  ② ClientHello 直接带上 key share → 少一轮往返
  ③ 0-RTT: 复用上次会话密钥, 第一个包就带数据
     ⚠️ 0-RTT 数据有【重放攻击】风险 → 只用于幂等请求(GET)

QUIC(HTTP/3 的传输层, 基于 UDP):
  ① 流级独立: 一个流丢包只阻塞自己 → 解决 TCP 队头阻塞
  ② 0-RTT/1-RTT 建连(传输+加密握手合并)
  ③ 连接迁移: 用 Connection ID 而非 四元组 标识连接
     → 手机从 WiFi 切 4G 不断线 ✅
  ④ 用户态实现 → 协议升级不依赖操作系统内核(迭代快)
```

---

### Q118：HTTP 缓存的完整决策树（Cache-Control 组合拳）

**答：**（把原文缓存笔记升级成可用的决策流程）

```
请求发出
 ▼
① 有缓存? ──否──► 请求服务器, 存入缓存(按响应头) ──► 返回
 ▼ 有
② 强缓存未过期?
   Cache-Control: max-age 未到 / Expires 未到
   ├── 是 → 200 (from memory/disk cache) 网络零请求 ✅
   ▼ 否(或 no-cache)
③ 发协商请求验证:
   If-None-Match: 上次的 ETag     ← 优先
   If-Modified-Since: 上次的 Last-Modified
   ├── 服务器: 304 Not Modified(无 body) → 用本地缓存
   └── 服务器: 200 + 新资源 + 新验证头
```

**关键指令速查**：

```
no-store: 完全不存(敏感数据)
no-cache: 可以存, 但每次必须协商验证(名字有歧义, 实为"must revalidate")
max-age=N + immutable: 永不重验(配合文件名 hash 的最佳实践)
public / private: 中间代理可否缓存(private=仅浏览器)
s-maxage: CDN 代理的过期时间(与 max-age 独立)

工程范式(必答):
  index.html → Cache-Control: no-cache(每次协商, 保证拿到最新入口)
  app.a3f9c2.js → max-age=31536000, immutable(一年强缓存)
  内容变 → 文件名 hash 变 → 天然失效
```

---

### D. Vue 深度扩展

### Q119：Vue 编译器的三阶段与产物对比？

**答：**（补 Q31 编译优化的"编译器怎么工作"）

```
template 字符串
 │ ① parse: 模板 → AST(抽象语法树, 记录节点类型/指令/props)
 │ ② transform: 遍历 AST 加工
 │     - 分析静态节点(static hoisting 标记)
 │     - 打 PatchFlag(动态节点标记: TEXT/CLASS/PROPS...)
 │     - 收集 dynamicChildren 生成 Block
 │     - 指令转换(v-if → if(){} 块, v-for → renderList 调用)
 ▼ ③ generate: AST → render 函数代码字符串
```

**同一个模板的产物对比（看懂即懂编译优化）**：

```html
<div>
  <h1>标题</h1>              <!-- 静态 -->
  <p>{{ msg }}</p>           <!-- 动态文本 -->
</div>
```

```javascript
// 产物(render 函数):
const _hoisted_1 = createElementVNode('h1', null, '标题');  // ① 静态提升

function render(_ctx) {
  return (openBlock(), createElementBlock('div', null, [
    _hoisted_1,                                              // ② 直接复用
    createElementVNode('p', null, toDisplayString(_ctx.msg),
      1 /* TEXT */                                           // ③ PatchFlag
    )
  ]));
}
// h1 被提到 render 外(模块级常量) → 永远只创建一次
// p 带 TEXT 标记 → patch 时只对比文本, 跳过其他属性
```

---

### Q120：Vue 自定义渲染器 createRenderer——跨端的原理？

**答：**

```
Vue3 把"操作 DOM 的 API"从运行时抽成可注入的配置:

createRenderer({
  createElement(type) { ... },   // 平台: 怎么创建元素
  insert(child, parent) { ... }, // 怎么挂载
  remove(node) { ... },
  patchProp(el, key, value) { ... },
  createText(text) { ... },
})
// 浏览器版: @vue/runtime-dom 注入 DOM API
// 自定义版: 注入 Canvas/WebGL/小程序 Native API
//   → 同一套响应式+虚拟DOM+diff, 渲染到任意平台(vue-threejs 等)
```

**面试金句**：Vue3 的"编译时优化（runtime-core 不感知）+ 运行时与平台解耦（renderer 可替换）”是一个分层架构典范——虚拟 DOM 的本质是**中间指令集**，DOM 只是默认后端。

---

### E. React 深度扩展

### Q121：Suspense 的实现原理与 Hydration 细节？

**答：**

**Suspense 的工作机制（"throw promise"）**：

```
<Suspense fallback={<Spin />}>
  <LazyComponent />
</Suspense>

1. LazyComponent 内部数据未就绪时, 渲染函数【抛出一个 Promise】
2. React 捕获这个 Promise → 渲染 fallback
3. Promise resolve 后 → React 重试渲染该子树 → 成功显示
(React 内部把'抛异常'当作控制流 —— 这也是 render 函数必须纯净的原因之一)
```

**Hydration（水合）与选择性水合（18 深度）**：

```
SSR 输出 HTML → 浏览器先看到完整画面
JS 到达后需要把'死的 HTML'变成'活的组件':
  绑定事件 / 对齐状态 / 建立虚拟DOM → 这就是 hydration

传统问题: 必须从根到叶全部水合完, 任何交互才能用
React 18 改进(配合 Suspense):
  ① 分块水合: 每个 Suspense 边界独立水合
  ② 选择性水合: 用户点了哪块 → 优先水合哪块(带优先级插队)
  ③ 流式 SSR: 服务端先发骨架, 慢数据到了再流式补发(html 流)
```

---

### F. 工程化深度

### Q122：Tree Shaking 的机制级原理？为什么 CJS 剔除不了死代码？

**答：**

```
前提: 静态分析 —— 编译时就能确定'谁导入了谁、用到了哪个导出'

ESM(可摇 ✅):
  import { debounce } from 'lodash-es'
  → import/export 是【顶层静态声明】
  → 打包器把模块间依赖建成静态图 → 未被引用的导出直接不打包
  → 配合副作用标记: package.json "sideEffects": false
    (告诉打包器: 这个模块的文件没有'模块级副作用', 放心删)

CJS(不可摇 ❌):
  const lib = require(getName())   // 运行时才能确定模块
  module.exports = { a, b }
  → 导入是动态表达式, 静态图建不起来 → 只能全量保留

工程要点:
  ① 用 ESM 版本的库(lodash-es 而非 lodash, dayjs 原生 ESM)
  ② sideEffects 数组可排除有副作用的文件(如 polyfill.css)
  ③ 生产模式 + usedExports + minimize 才真正删除
```

---

### Q123：Source Map 的原理？线上报错怎么还原？

**答：**

```
构建时: app.js + app.js.map
  map 文件: { version, sources(原文件路径), mappings, names, ... }
  mappings: 用 VLQ(Base64 变体)编码的【行列号映射表】
           压缩后形如 'AAAA,CAAC,EAAE'
  原理: 记录'产物第几行第几列 ↔ 源码第几行第几列'的对应关系

报错还原流程:
  线上报错: app.js 第3行第520列 → 上报行列号
  平台用 source-map 库: originalPositionFor({line:3, column:520})
  → { source: 'src/views/Home.vue', line: 108, name: 'onSubmit' }

工程关键:
  ① map 文件【不部署】到生产(防源码泄露), 构建后单独上传到监控平台
  ② hidden-source-map: 产物不带 sourceMappingURL 注释
  ③ 上报时带 git commit 版本号 → 匹配对应 map
```

---

### G. 性能与安全深度

### Q124：LCP / INP 的归因细分怎么查？

**答：**（能"定位到责任环节"才算会性能优化）

```
LCP 四段归因(PerformanceObserver 拿到 LCP 条目分解):
  ① TTFB 过长     → 服务端慢/重定向 → 查后端与 CDN
  ② 资源加载延迟   → preload 没加/图片未优化 → 关键资源提前
  ③ 资源加载耗时   → 图片太大/CDN 远 → WebP/CDN/合理尺寸
  ④ 渲染延迟      → 被其他资源阻塞(同步 script) → defer/关键CSS

INP 归因:
  Long Tasks: PerformanceObserver 监听 longtask(>50ms) 定位主线程阻塞源
  interaction 条目: 拿到 inputDelay/processingDuration/presentationDelay
    inputDelay 大     → 前面有长任务排队
    processing 大     → 事件处理器本身慢(拆任务/让出主线程)
    presentation 大   → 渲染重(减 DOM/合成层)
```

---

### Q125：CSP 的进阶配置与 SRI？

**答：**

```
CSP 内容安全策略(防 XSS 的纵深防御):

基础版:
  Content-Security-Policy: default-src 'self'
  → 只允许同源资源, 禁止内联脚本

进阶(解决'内联脚本被禁'的矛盾):
  ① nonce: 每次响应生成随机串, 只信任带该 nonce 的内联脚本
     Content-Security-Policy: script-src 'nonce-r4nd0m'
     <script nonce='r4nd0m'>...</script>          ← 动态生成, 不可预测
  ② hash: 直接给出脚本内容的 SHA256 哈希(适合固定内联脚本)
  ③ report-only 模式: 先观察不拦截, 收集违规上报再收紧

SRI 子资源完整性(防 CDN 投毒):
  <script src='https://cdn.com/lib.js'
          integrity='sha384-Base64哈希...'
          crossorigin='anonymous'></script>
  浏览器下载后重算哈希 → 与 integrity 不符 → 拒绝执行
  ⚠️ 配合构建工具自动生成(webpack-subresource-integrity)
```

---

### 15.X 深挖方法论：这些深度从哪继续挖？

```
1. 看一手资料: V8 官方博客(内存/优化) / Chrome Developers(渲染/性能)
   / React RFC / Vue 设计与实现(霍春阳)
2. 源码最小闭环: 只追一条主线读, 如 Vue3 的 track→trigger→queueJob 三百行
3. 做实验验证: DevTools Memory/Performance 亲手复现一次泄漏与修复
4. 输出倒逼输入: 每个深度主题画一张图 + 写一段 60 秒口播
记住: 深度不是背出来的, 是【问题链】追问出来的
      —— 每个答案都问一句'再往下一层是什么'
```

## 附录 A：Event Loop 输出题自测（3 道）

```javascript
// 题1
console.log('a');
setTimeout(() => console.log('b'), 0);
Promise.resolve().then(() => console.log('c'));
console.log('d');
// a d c b

// 题2
async function f() {
  console.log(1);
  await Promise.resolve();
  console.log(2);
}
f();
setTimeout(() => console.log(3), 0);
console.log(4);
// 1 4 2 3

// 题3
Promise.resolve().then(() => {
  console.log('p1');
  setTimeout(() => console.log('s1'), 0);
});
setTimeout(() => {
  console.log('s2');
  Promise.resolve().then(() => console.log('p2'));
}, 0);
// p1 s2 p2 s1
```

## 附录 B：一句话答案速查

| 问题 | 一句话 |
| --- | --- |
| BFC | 独立渲染区域，内部布局不影响外部 |
| 重排 vs 重绘 | 几何变化重算布局 vs 只重画样式；transform 两者都不触发 |
| 虚拟 DOM | JS 对象描述 DOM，diff 出最小补丁再更新 |
| key 的作用 | diff 精准匹配复用节点，index 作 key 有坑 |
| defer vs async | 解析完后顺序执行 vs 下载完立即乱序执行 |
| 微任务 vs 宏任务 | 每个宏任务后清空全部微任务再渲染 |
| 深浅拷贝 | 浅拷一层共享引用；深拷递归独立 |
| 防 debounce / 节 throttle | 停止触发后执行最后一次 / 固定频率执行一次 |
| ESM vs CJS | 编译时静态+值引用+可摇树 vs 运行时+值拷贝 |
| HTTP3 | QUIC(UDP) 解决 TCP 队头阻塞 |
| XSS vs CSRF | 注脚本窃数据 vs 借身份发请求 |
| Vite 快的原因 | 原生 ESM 按需编译 + esbuild 预构建 |
| Pinia vs Vuex | 去 mutation + 天然 TS + 更轻 |

## 附录 C：面试官高频追问清单

* 你的项目最大的技术难点是什么？怎么解决的？（准备 STAR 故事）
* 这个方案有没有考虑过替代方案？为什么没选？（考权衡）
* 线上出过什么线上事故？复盘改进是什么？（考责任与成长）
* 如果让你重新做这个项目，你会改进什么？（考反思）
* 你平时怎么跟进新技术？最近在学什么？（考自驱）
## 附录 D：React 术语速查表

| 术语 | 含义 |
| --- | --- |
| UI = f(state) | 界面是状态的函数，声明式核心 |
| JSX | createElement 的语法糖，产物是普通对象 |
| Fiber | 链表结构的调度单元 + 可中断增量渲染架构 |
| 双缓冲树 | current（屏上）/ workInProgress（内存构建），指针切换上屏 |
| render / commit | 可中断的调和阶段 / 不可中断的 DOM 提交阶段 |
| 批处理 | 多次 setState 合并为一次更新（18 全自动） |
| memoizedState 链表 | Hooks 的存储结构，按调用顺序对应 |
| 闭包陷阱 | effect 捕获旧渲染的状态快照，定时器里最常见 |
| 函数式更新 | `setX(x => x + 1)`，基于最新值防批处理丢更新 |
| 惰性初始化 | `useState(fn)` 只在首次渲染执行 |
| 合成事件 | SyntheticEvent + 根容器事件委托 |
| bailout | 子树无变化跳过克隆复用 Fiber |
| Suspense | 声明式等待组件就绪，显示 fallback |
| Transition | 把更新标记为可中断的非紧急任务 |
| RSC | 服务端组件，运行在服务端、0 客户端体积 |
| 水合 hydration | SSR 的 HTML 与客户端 JS 状态、事件绑定对接 |
| selector 订阅 | 状态库按字段订阅，未变不渲染（Zustand/Redux） |
| Error Boundary | 类组件捕获子树渲染错误展示兜底 UI |