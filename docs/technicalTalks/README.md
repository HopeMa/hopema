---
sidebar: auto
---
## vue3源码大体导读
千呼万唤的vue3终于发布了，不过我这样说是不是得被前端同学得打死，毕竟新技术发展太快，大家都开始感觉学不动了，不过没关系，我们可以来一点一点学习，大家一天进步一点点

vue3主要代码结构目录，后续在添加修改
1. reactivity 目录：
    - 数据响应式系统，这是一个单独的系统，可以与任何框架配合使用。
2. runtime-core 目录：
    - 与平台无关的运行时。其实现的功能有虚拟 DOM 渲染器、Vue 组件和 Vue 的各种API，我们可以利用这个 runtime 实现针对某个具体平台的高阶 runtime，比如自定义渲染器。
    - 很多跨平台的应用（小程序、weex）都是在这进行魔改的
3. runtime-dom 目录: 
    - 针对浏览器的 runtime。其功能包括处理原生 DOM API、DOM 事件和 DOM 属性等。
4. runtime-test 目录: 
    - 一个专门为了测试而写的轻量级 runtime。由于这个 rumtime 「渲染」出的 DOM 树其实是一个 JS 对象，所以这个 runtime 可以用在所有 JS 环境里。你可以用它来测试渲染是否正确。它还可以用于序列化 DOM、触发 DOM 事件，以及记录某次更新中的 DOM 操作。
5. server-renderer 目录: 
    - 用于 SSR。尚未实现。
6. compiler-core 目录: 
    - 平台无关的编译器. 它既包含可扩展的基础功能，也包含所有平台无关的插件。
7. compiler-dom 目录: 
    - 针对浏览器而写的编译器。
8. shared 目录: 
    - 没有暴露任何 API，主要包含了一些平台无关的内部帮助方法。
9. vue 目录: 
    - 用于构建「完整构建」版本，引用了上面提到的 runtime 和 compiler。

## package.json 分析
主要代码如下：
~~~ json
 "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "node scripts/dev.js",
    "build": "node scripts/build.js",
    "size-runtime": "node scripts/build.js runtime-dom -p -f esm-browser",
    "size-compiler": "node scripts/build.js compiler-dom -p -f esm-browser",
    "size": "yarn size-runtime && yarn size-compiler",
    "lint": "prettier --write --parser typescript 'packages/**/*.ts'",
    "test": "jest"
  },
  "gitHooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "node scripts/verifyCommit.js"
  },
  "lint-staged": {
    "*.js": [
      "prettier --write",
      "git add"
    ],
    "*.ts": [
      "prettier --parser=typescript --write",
      "git add"
    ]
  }
~~~
