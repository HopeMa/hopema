---
# sidebar: auto
---
# electron遇到问题积累
1. [electron窗口插入js](#electron窗口插入js)
1. [electron加载其他窗口设置csp](#electron加载其他窗口设置csp)
## electron窗口插入js
   可以通过下面的形式加入在electron中插入定义的js   
~~~ js
    ciscoWindow.webContents.executeJavaScript('',true)
~~~

## electron加载其他窗口设置csp
遇到的场景是在electorn加载网站时会遇到csp问题
::: danger
Refused to load the image 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAI40lEQVR4Xu2cf3BU1RXHPy8hECAJJCFkE0AigSAJonGqYB1RW39QqyWUBmh16A9ba8dWkWJ/THVqZ7RYC4oy/mGxWCqtaKNiMoPg2CJTlEIFhISmBmKAZEjSQBISAuFH8jqHuy+72X37fuxCWpJ3Z3Zm9717zrn3e889v97bq2HSdF1PKG+gSNOZrcO1mkaWrpNs1vdSvaZptOs69Rr8M05jfb6PdzRNOxs6Hy30wt5GvUjrZpmuk3upTj6acWsa1XocS6ZlauuD6XsA0nU9rryBpej8JBoB/YZG45krffxc07RumVMPQHvr9d8MeHCMVdZ4ZlqW9tMegGRb0cXb/UYLLsRE4pkj200Tg1zRQOVAszl2GIpNmupjira3Xi9G5w07ggF5X2OeVn5EX6vDPQMSAJtJa/Anbe8R/VMgzwPIFIEqrbxeb+tvQ...w+t13lbEYTIGX7S1l2alD/qMsdwjjagpm1Hjm7K0mmFPC/Uwo7/YtgUGYmwdwrlBu3ivhFm1btgq21vWVK+vHSnaoGFHXBTFhGW3J1BoF1L6PkWloFj21Wtk3iHMnMbxjnLDo2JOxvhjV7YMMBVeO+rxAevk5F4TGVXEXA/0PRvqQSZl4Go2N8YCnVzvWfKs2TxY+5aG+swP/qsY88t5IKn/FY+UJopvC4oI99hKH34NDBa8Deo2eH+nsxbFK/eHkhGD/v9ReH2tTXLzT1tTwDBtuXF+zw6utX4vpaXswA2QF4qd/3ALJZQQ8gD6DYNrmnQZ4GeRoUGwKeBsWGn/enXgv8jD/1en8LjwxSlXewgJUGnT9YwDuaIiJE8RrF3uEmEeDpOdxE7pc36nP0Lt6Kzd73M2rjeBxjWt4BS0ELHHrAktzyjujyAxTpiK4eTfIOeTM/5C3Yggy0YwJ1jXeu9LHe7JjA/wKFdlXLWR6K0AAAAABJRU5ErkJggg==' because it violates the following Content Security Policy directive: "default-src 'self'". Note that 'img-src' was not explicitly set, so 'default-src' is used as a fallback.
:::
解决方案：
~~~ js
 const {session} = require('electron');
 app.on('ready', function(){
    session.defaultSession.webRequest.onHeadersReceived(
        { urls: ['https://xxx.xxx.com']},
        (details, callback) => {
            callback({
                responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': 'img-src * data:;default-src *',
                }
            })
        }
    )
 })
~~~