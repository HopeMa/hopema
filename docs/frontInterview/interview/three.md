---
# sidebar: auto
# markdown:
#   -lineNumbers: true
---
## 前端性能优化
[2018 前端性能优化清单](https://juejin.im/post/5a966bd16fb9a0635172a50a)
### 前端性能优化方案
前端性能优化tree-shaking（无用代码移除）、scope hoisting（作用域提升）、code-splitting（按需加载）、 intersection observer 以及 clients hints、CSS containment、HTTP/2 和 service workers 这些技术都是有利于性能优化的
1. tree-shaking：tree-shaking 是 Webpack 2 引入的新功能，tree-shaking 是无用代码移除（DCE, dead code elimination）的一个方法，但和传统的方法不太一样。tree-shaking 找到需要的代码，灌入最终的结果；传统 DCE 找到执行不到的代码，从 AST 里清除。—— [如何评价 Webpack 2 新引入的 Tree-shaking 代码优化技术？](https://www.zhihu.com/question/41922432)
2. scope hoisting：scope hoisting 是 Webpack 3 的新功能，又译作“作用域提升”。Webpack 将所有模块都用函数包裹起来，然后自己实现了一套模块加载、执行与缓存的功能，使用这样的结构是为了更容易实现 Code Splitting（包括按需加载）、模块热替换等功能。—— [Webpack 3 的新功能：Scope Hoisting](https://zhuanlan.zhihu.com/p/27980441)
3. code-splitting：对于大型的 web 应用而言，把所有的代码放到一个文件的做法效率很差，特别是在加载了一些只有在特定环境下才会使用到的阻塞的代码的时候。Webpack有个功能会把你的代码分离成Chunk，后者可以按需加载。这个功能就是code-splitting。—— [在Webpack中使用Code Splitting实现按需加载](http://www.alloyteam.com/2016/02/code-split-by-routes/)
4. intersection observer：可以自动"观察"元素是否可见，由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做"交叉观察器"。—— [IntersectionObserver API 使用教程](http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)
5. clients hints：自动响应式图片 —— [Automatic responsive images with Client Hints](https://cloudinary.com/blog/automatic_responsive_images_with_client_hints)
6. CSS containment：新的 CSS 属性 Containment 允许开发者限制浏览器样式、布局和 paint 工作的范围。—— [CSS Containment in Chrome 52](https://developers.google.com/web/updates/2016/06/css-containment)
7. service workers：实现离线页面 —— [Service worker concepts and usage](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### 前端性能度量
1. 首次有效渲染（FMP，是指主要内容出现在页面上所需的时间），
2. 重要渲染时间（页面最重要部分渲染完成所需的时间），
3. 可交互时间（TTI，是指页面布局已经稳定，关键的页面字体已经可见，主进程可以足够的处理用户的输入 —— 基本的时间标记是，用户可以在 UI 上进行点击和交互），
4. 输入响应，接口响应用户操作所需的时间，
5. Speed Index，测量填充页面内容的速度。 分数越低越好，
6. 自定义度量，由你的业务需求和用户体验来决定。

### 前端性能优化之网络层面
缓存、请求合并、按需引入、cdn、离线
* HttpCache：通过一定规则让网络回来的资源缓存在本地，下次使用的时候可以直接从本地读取。stale-while-revalidate可以允许资源在过期之后，在一段时间内可以继续使用，同时发起一个异步请求，可以允许资源先使用，再验证。
* LocalStorage：前端可以使用LocalStorage将资源存储在本地，类似的还有IndexedDB。LocalStorage也有一些限制，比如一个域名只能存储5M数据，不能跨域读取。
* MemoryCache：内存缓存， Chrome中的MemoryCache主要由GC管理，资源进入MemoryCache的时候会关联一个弱引用，在主文档关闭的时候会被清除。目前Webkit资源分成两类，一类是主资源，比如HTML页面，或者下载项，一类是派生资源，比如HTML页面中内嵌的图片或者脚本链接，分别对应代码中两个类：MainResourceLoader和SubresourceLoader。虽然Webkit支持memoryCache，但是也只是针对派生资源，它对应的类为CachedResource，用于保存原始数据（比如CSS，JS等），以及解码过的图片数据。
* DiskCache顾名思义，就是将资源缓存到磁盘中，等待下次访问时不需要重新下载资源，而直接从磁盘中获取，它的直接操作对象为CurlCacheManager。
* 离线包（ZCache）：用户访问页面时，内核会通过shouldInterceptRequest询问外壳是否有可用资源，如果有可用资源，外壳会返回资源，不用再去网络请求资源。【ZCache会走到外壳拦截逻辑，效率比HttpCache低一些，一般资源到Blink内核需要100ms，主文档需要300ms】
* NetCache：DNS解析结果，长连接复用。
* V8 Bytecode Cache：V8字节码缓存。【JS执行过一次，第二次执行能明显减少时间】。
* Image Decode Cache：图片解码缓存。
* PageCache：页面级缓存，在UC上角WebViewCache，在UC浏览器上点击前进后退按钮，就会产生WebViewCache。

#### dns预热
我们来看下DNS的解析流程：浏览器缓存-系统缓存-路由器缓存-ISP DNS缓存-DNS源服务器

当我们访问过一次域名之后，就会在每个节点上生成DNS缓存，即完成DNS预热，这样同一地区（或网络服务商）的其他用户再次访问该域名时就不需要重新回源，直接读取最近的DNS缓存，从而减少请求次数，提升了网站访问速度。

预热的方式
1. 爬虫
1. APP
1. 网页meta
~~~ html
    <meta http-equiv="x-dns-prefetch-control" content="on" />
    <link rel="dns-prefetch" href="//webresource.english.c-ctrip.com" />
    <link rel="dns-prefetch" href="//webresource.c-ctrip.com" />
    <link rel="dns-prefetch" href="//s.c-ctrip.com" />
    <link rel="dns-prefetch" href="//pic.english.c-ctrip.com" />
    <link rel="dns-prefetch" href="//m.ctrip.com" />
~~~

#### 合并http请求
chrome在http和https下相同域名可以并发的请求数不同：http = 6，https > 13
所以在webpack打包的时候要进行一定的请求合并，配合按需加载



