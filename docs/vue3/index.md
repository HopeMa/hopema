---
sidebar: auto
---
# vue3源码学习
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
### gitHooks和lint-staged
使用的是尤大改写的yorkie，yorkie实际是fork husky，然后做了一些定制化的改动，使得钩子能从package.json的 "gitHooks"属性中读取。
所以生成了githooks相关文件，githooks才能起作用

可以看出gitHooks以及lint-staged是代码检查工具，当不符合规范时，commit的时候会提示提交不了，保证了代码的规范性

### workspaces

#### 为什么这个，这个是干嘛的
前端项目越来越大，成熟的团队免不了分模块开发再集成，有时候我们也会发布一些npm包用于拆分维护各种模块，这种时候，在正式发布前，我们的包往往不太方便测试，比如要输出bin等操作。

- 您的依赖关系可以链接在一起，这意味着您的工作区可以相互依赖，同时始终使用最新的可用代码。这也是一个相对于yarn link更好的机制，因为它只影响你的工作空间树，而不是整个系统。
- 您所有的项目依赖关系都将被安装在一起，为Yarn提供更多的自由度来更好地优化它们。
- 对于每个项目，Yarn将使用一个单独的锁文件而不是为每个工程使用一个不同的锁文件，这意味着更少的冲突和更容易的审查。

#### 已有方案npm link/yarn link
还好，npm以及后起之秀yarn都为我们提供了便捷的方式。

1. npm link/yarn link

在希望同步开发的组件包下执行（假设为component-a）

~~~ powershell
npm link
// or
yarn link
~~~

如果是npm，执行后如果项目没有node依赖，会在根目录创建一个空的node_modules，yarn则不会

回到使用依赖的项目下（假设为component-b），执行

~~~ powershell
npm link component-a
// or
yarn link component-a
~~~ 
现在我们就可以在component-b下正常使用component-a的功能了，且component-a改动会实时响应到component-b，其实实质上就是一个软连接，npm给我们提供了一个便捷的创建方法

2. yarn workspaces

workspaces字段是包含每个工作区的路径的数组。由于追踪每个路径可能很乏味，因此该字段也接受glob模式！例如，Babel通过一个packages/*指令来引用它们的所有包。

工作空间足够稳定，可用于大规模应用程序，不应该改变常规安装的工作方式，但如果您认为他们正在破坏某些东西，可以通过将以下行添加到Yarnrc文件中来禁用它们：工作区 - 实验错误

npm link/yarn link的方式不够便捷，yarn为我们提供了另一种方式，不过按照官方说法，只能适用于"private": true的项目

在package.json中增加workspaces字段，写入同目录下的目录名，然后在dependencies中指定workspaces中指定的目录下的包名，最后执行
~~~ json
 "workspaces": [
    "packages/*"
  ],
~~~
~~~ powershell
yarn
// or
yarn install
~~~ 

## 运行环境 dev 分析

### dev.js分析
~~~ js
const execa = require('execa')
/*
execa是可以调用shell和本地外部程序的javascript封装。会启动子进程执行。
支持多操作系统，包括windows。
如果父进程退出，则生成的全部子进程都被杀死。
*/
const { targets, fuzzyMatchTarget } = require('./utils')

const args = require('minimist')(process.argv.slice(2))
// minimist: 轻量级的命令行参数解析引擎
const target = args._.length ? fuzzyMatchTarget(args._)[0] : 'vue'
const formats = args.formats || args.f
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)
// 获取最新commit的前7位

// Rollup 是一个 JavaScript 模块打包器 -wc监听文件变化 --environment使用根目录的配置文件rollup.config.js
execa(
  'rollup',
  [
    '-wc',
    '--environment',
    [
      `COMMIT:${commit}`,
      `TARGET:${target}`,
      `FORMATS:${formats || 'global'}`
    ].join(',')
  ],
  {
    stdio: 'inherit'
  }
)
//  COMMIT:57a5c61,TARGET:vue,FORMATS:global

~~~

### rollup.config.js 分析 代码入口

~~~ js
const fs = require('fs')
const path = require('path')
const ts = require('rollup-plugin-typescript2')
const replace = require('rollup-plugin-replace')
const alias = require('rollup-plugin-alias')
const json = require('rollup-plugin-json')

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.')
}

const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const name = path.basename(packageDir)
const resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`))
const packageOptions = pkg.buildOptions || {}

// build aliases dynamically
const aliasOptions = { resolve: ['.ts'] }
fs.readdirSync(packagesDir).forEach(dir => {
  if (dir === 'vue') {
    return
  }
  if (fs.statSync(path.resolve(packagesDir, dir)).isDirectory()) {
    aliasOptions[`@vue/${dir}`] = path.resolve(packagesDir, `${dir}/src/index`)
  }
})
const aliasPlugin = alias(aliasOptions)

// ensure TS checks only once for each build
let hasTSChecked = false

const configs = {
  esm: {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`
  },
  'esm-browser': {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: `es`
  }
}

const defaultFormats = ['esm', 'cjs']
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats
const packageConfigs = process.env.PROD_ONLY
  ? []
  : packageFormats.map(format => createConfig(configs[format]))

if (process.env.NODE_ENV === 'production') {
  packageFormats.forEach(format => {
    if (format === 'cjs') {
      packageConfigs.push(createProductionConfig(format))
    }
    if (format === 'global' || format === 'esm-browser') {
      packageConfigs.push(createMinifiedConfig(format))
    }
  })
}

module.exports = packageConfigs

function createConfig(output, plugins = []) {
  const isProductionBuild =
    process.env.__DEV__ === 'false' || /\.prod\.js$/.test(output.file)
  const isGlobalBuild = /\.global(\.prod)?\.js$/.test(output.file)
  const isBunlderESMBuild = /\.esm\.js$/.test(output.file)
  const isBrowserESMBuild = /esm-browser(\.prod)?\.js$/.test(output.file)

  if (isGlobalBuild) {
    output.name = packageOptions.name
  }

  const shouldEmitDeclarations =
    process.env.TYPES != null &&
    process.env.NODE_ENV === 'production' &&
    !hasTSChecked

  const tsPlugin = ts({
    check: process.env.NODE_ENV === 'production' && !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations
      },
      exclude: ['**/__tests__']
    }
  })
  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true

  const externals = Object.keys(aliasOptions).filter(p => p !== '@vue/shared')

  return {
    input: resolve(`src/index.ts`),
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    external: isGlobalBuild || isBrowserESMBuild ? [] : externals,
    plugins: [
      json({
        namedExports: false
      }),
      tsPlugin,
      aliasPlugin,
      createReplacePlugin(
        isProductionBuild,
        isBunlderESMBuild,
        (isGlobalBuild || isBrowserESMBuild) &&
          !packageOptions.enableNonBrowserBranches
      ),
      ...plugins
    ],
    output,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }
}

function createReplacePlugin(isProduction, isBunlderESMBuild, isBrowserBuild) {
  return replace({
    __COMMIT__: `"${process.env.COMMIT}"`,
    __DEV__: isBunlderESMBuild
      ? // preserve to be handled by bundlers
        `process.env.NODE_ENV !== 'production'`
      : // hard coded dev/prod builds
        !isProduction,
    // If the build is expected to run directly in the browser (global / esm-browser builds)
    __BROWSER__: isBrowserBuild,
    // support options?
    // the lean build drops options related code with buildOptions.lean: true
    __FEATURE_OPTIONS__: !packageOptions.lean,
    __FEATURE_SUSPENSE__: true,
    // this is only used during tests
    __JSDOM__: false
  })
}

function createProductionConfig(format) {
  return createConfig({
    file: resolve(`dist/${name}.${format}.prod.js`),
    format: configs[format].format
  })
}

function createMinifiedConfig(format) {
  const { terser } = require('rollup-plugin-terser')
  return createConfig(
    {
      file: resolve(`dist/${name}.${format}.prod.js`),
      format: configs[format].format
    },
    [
      terser({
        module: /^esm/.test(format)
      })
    ]
  )
}

~~~