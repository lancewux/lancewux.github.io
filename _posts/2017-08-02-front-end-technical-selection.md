<h1 align="center">兼容IE8的React+Router+Redux+Webpack+ES6+AJAX全套解决方案</h1>

Angular 1.x版本是个比较旧的东西了，比如依赖注入、自己独特的模块化，这些东西在ES6下已经很好地被解决了。AngularJS 1.3抛弃了对IE8的支持。Angular的2.0几乎是一个推翻重做的框架。

React 15.x.x版本已经不支持IE8的DOM了，最后的支持版本为0.14.8，发布时间是2016.3.30，不算太过时，所以决定采用React v0.14.8来做。文档为<a href="http://react-ie8.xcatliu.com/react/index.html">react-ie8</a>。建议先看15版本的文档<a href="https://facebook.github.io/react/">react</a>，因为写得更好。

React的定位是UI组件，所以做前端框架还要搭配其他插件来做，比如react-router, react-redux。

首先说明怎么从零开始创建一个简单的兼容IE8的React+Webpack的工程，然后讲解本demo的用法和功能。

从零开始
-

#### 创建React项目

安装脚手架命令行工具

```bash
sudo npm install -g create-react-app@1.0.3
```

用脚手架生成项目（会同时生成脚手架脚本）

```bash
create-react-app demo-react
```

进入项目

```bash
cd demo-react
```

卸载最新版本的react

```bash
npm uninstall --save react react-dom
```

安装旧版本的react

```bash
npm install --save react@0.14.8 react-dom@0.14.8
```

用脚手架脚本eject出配置文件，以便修改配置

```bash
npm run eject
```

#### 安装插件解决兼容性问题

兼容ES6语法：

```bash
npm install --save-dev babel-preset-es2015 babel-preset-es2016
```

兼容ES5的各种函数：

```bash
npm install --save es5-shim
```

处理ES5对象定义没有冒号的问题：

```bash
npm install --save es5to3-webpack-plugin
```

处理require加载模块会引入defineProperty函数的问题：

```bash
npm install --save-dev babel-plugin-add-module-exports
```

安装插件支持jsx语法

```bash
npm install --save-dev babel-plugin-transform-react-jsx
```

在根目录下新建.eslintrc文件，写入以下配置内容

```javascript
{
  "rules": {
    "react/no-deprecated": 0,
  },
  "parserOptions": {
    "ecmaVersion": 6,
      "sourceType": "module",
      "ecmaFeatures": {
        "experimentalObjectRestSpread": true,
        "jsx": true,
        "modules": true
      }
  }
}
```
在根目录下新建.babelrc文件，写入以下配置内容

```javascript
{
  "plugins": ["transform-react-jsx", "add-module-exports"],
  "presets": ["es2015", "es2016"]
}
```

在config/webpack.config.prod.js文件的第15行附件加上

```javascript
const ES5to3OutputPlugin = require("es5to3-webpack-plugin");
```

在第325行附件加上

```javascript
new ES5to3OutputPlugin(),
```

在public/index.html文件的head里加上一个meta设置，使IE浏览器以最新的标准模式渲染文本

```html
<meta http-equiv="X-UA-Compatible" content="IE=11,IE=10,IE=9;IE=8;IE=7;" />
```

#### 打包配置

在config/webpackDevServer.config.js文件的首行加上一行配置，以便非本机的网络也能访问devserver

```javascript
process.env.HOST = '0.0.0.0';
```

在package.json里加上homepage属性，默认是根目录，修改成发布文件路径（用于build命令）

```javascript
"homepage": "/~wuliang/demo-react/build",
```

在config/webpack.config.prod.js和config/webpack.config.dev.js的第93行加上以下配置，在项目中就可以使用绝对路径了

```javascript
'src': path.join(__dirname, '../src'),
```

#### 新建自己的代码文件

删除src文件夹下的所有文件，并新建src/index.js文件，代码如下

```html
/**
 * CANNOT use `import` to import `es5-shim`,
 * because `import` will be transformed to `Object.defineProperty` by babel,
 * `Object.defineProperty` doesn't exists in IE8,
 * (but will be polyfilled after `require('es5-shim')` executed).
*/
//  es5-shim.js是给Javascript engine打补丁的, 所以必须最先加载。
//  es5-shim 如实地模拟EcmaScript 5的函数，比如Array.prototype.forEach；而es5-sham是尽可能地模拟EcmaScript 5的函数，比如 Object.create
require('es5-shim');
require('es5-shim/es5-sham');

/**
 * CANNOT use `import` to import `react` or `react-dom`,
 * because `import` will run `react` before `require('es5-shim')`.
*/
// import React from 'react';
// import ReactDOM from 'react-dom';

const React = require('react');
const ReactDOM = require('react-dom');

const Timer = React.createClass({
  getInitialState: function () {
    return {secondsElapsed: 0}
  },
  tick: function () {
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  },
  componentDidMount: function () {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function () {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <div>
        <h3>welcome {this.props.name}</h3>
        <h3>Time Elapsed: {this.state.secondsElapsed} seconds.</h3>
      </div>
    );
  }
});

ReactDOM.render(
    <Timer name="Jone"/>,
    document.getElementById('root')
);
```

运行npm run start命令使用devserver进行调试，用'http://192.168.204.49:3000/'（改成你自己的路径）访问

运行npm run build命令来build文件，用'http://192.168.204.49/~wuliang/demo-react/build/'（改成你自己的路径）访问

#### 路由

如果想使用路由，就需要安装react-router，考虑兼容性建议使用2.x.x版本，用法参见<a href="https://github.com/ReactTraining/react-router/tree/v2.8.1/docs">React Router v2.8.1</a>

```bash
npm install --save react-router@2.1.0
```

#### 全局状态管理

如果想使用全局状态管理，可以使用Redux，用法参见<a href="http://redux.js.org/docs/basics/UsageWithReact.html">UsageWithReact</a>。

```bash
npm install --save redux@3.3.0

npm install --save react-redux@4.4.0
```

#### 异步请求

官方推荐使用fetch函数，但是暂时解决不了在IE下的兼容性问题，所以用一个ajax插件<a href="https://github.com/ForbesLindesay/ajax">ForbesLindesay/ajax</a>

```bash
npm install --save ForbesLindesay/ajax
```

注意，要注释掉node_modules/component-ajax/index.js的catch里的两行代码，不然会编译出错

```javascript
var type
try {
  type = require('type-of')
} catch (ex) {
  //hide from browserify
  // var r = require
  // type = r('type')
}
```

关于本demo
-

### 项目结构

```javscript
.
  |--build                                  // 打包输出文件
  |--config                                 // 构建配置文件
    |--jest
    |--env.js
    |--paths.js
    |--polyfill.js
    |--webpack.config.dev.js
    |--webpack.config.prod.js
    |--webpackDevServer.config.js
  |--public                                 // 构建公开文件，里面的文件在打包时会被自动复制到build文件夹
    |--index.html                           // 构建用的模板文件，生成的js代码会挂载在这里
    |--favicon.ico
    |--manifest.json
  |--script                                 // 构建脚本文件
    |--start.js
    |--build.js
    |--test.js
  |--src                                    // 项目代码文件
    |--api                                  // 公用api文件
    |--components                           // 组件
      |--person
        |--AddPerson.jsx
        |--PersonList.jsx
        |--FilterItem.jsx
        |--FilterBar.jsx
    |--pages                                // 页面
      |--Home.jsx
      |--Person.jsx
      |--Comment.jsx
    |--redux                                // redux文件
      |--actionCreators.js
      |--reducers.js
      |--store.js
    |--router                               // 路由文件
      |--index.jsx
    |--static                               // 静态文件
      |--css
        |--base.css
        |--home.css
        |--person.css
        |--comment.css
      |--media
        |--katon.jpg
    |--index.jsx                             // 打包入口文件
  |--.babelrc                                // babel配置文件
  |--.eslintrc                               // eslint配置文件
  |--.gitignore                              // git忽略上传文件配置
  |--package.json                            // npm包管理信息文件
  |--README.md
```

### 运行方式

进入项目文件运行

```bash
npm install

npm run start //调试

npm run build //构建
```
### 实现功能

- 组件化
- 路由
- redux全局状态管理
- js文件合并打包
- css和图片文件单独打包
- webpack构建
- 按需加载

### 具体页面功能

#### Home页面

- props和state用法
- html和js两种方式实现页面跳转
- 生命周期钩子函数使用
- 用ES6的class创建组件
- jsx内加载图片
- 事件绑定
- 通过className实现样式控制
- 使用base.css定义的样式

#### Person页面

- redux用法
- css文件内加载图片
- jsx行内设置样式
- 用函数创建组件
- 组件嵌套

#### Comment页面

- ajax
- 表单操作

使用本页面功能时，要先运行后台脚本。进入项目文件，输入下面的命令

```bash
node server/server.js
```

### 特别说明

#### 路由

使用browserHistory功能时，路由配置的path要加上发布路径，用process.env.PUBLIC_URL获得。

可以在路由的时候实现按需加载。

#### 静态图片加载

本demo实现了三种静态图片加载的场景。

在index.html文件加载图片，要把图片放到public文件夹里，然后用'%PUBLIC_URL%/'获得发布路径。

在jsx内加载静态图片，要用require函数加载，可以使用配置好的绝对路径别名。

在css文件内加载静态图片，不需要使用require函数，不能使用配置好的绝对路径别名。

#### css文件

css文件是单独引入和打包的，和组件没有耦合，所以和组件嵌套没关系，只要加载了，其设置的style就对任何组件有效。

#### Redux

Redux可以看做Flux的一种变体，处理数据流如下：

```javascript

                           --<-- dispatch Action --<---
                           |                          |
  dispatch Action ----> Reducer ------> Store ------> View

```
首先理解一下几个概念。state是指一个全局状态，可以理解为一个全局变量。store是state树，里面放置了很多个state，一个React App只能有一个store。Action是用来改变state的唯一方法，它虽然名为Action，但只是一个json对象，记录了改变state的相关信息。Reducer是连接Action和state的桥梁，Action只记录了信息，而Reducer则定义了改变state的具体实现。当dispacth 某个action时，reducer里面的所有实例都会执行，当switch匹配到这个action类型时，就执行case里的代码，从而改变state。state改变了就会触发React重新渲染组件。改变一个state并不是改变state的原值，而是返回一个新的state，即nextState。假如一个state是一个对象，那改变的state就是另一个对象，指向不同的内存空间，而不是在源对象的基础上修改。这种做法的原因是，React必须知道state改变前后的值，这样可以知道改变前后的虚拟DOM，通过比较虚拟DOM就可以找到重新渲染DOM的最优方法。

并没有一个专门的state文件来定义state。reducer定义了state的名称，默认值和改变state的具体实现。然后用reducer来实例化store。reducer改变state是用的switch语句，case是Action类型，case后的代码就是改变state的相应代码，通过匹配action类型执行相应的动作来改变action指定的state。

React好像没有提供全局注入变量的入口。state需要通过Provider容器来实现全局注入，然后通过connect函数把dispatch action和get state映射到组件里。用法参见<a href="http://https//github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options">provider</a>


相关参考资料
-

<a href="http://div.io/topic/1275">前端工程——基础篇</a>

<a href="https://github.com/fouber/blog/issues/6">大公司里怎样开发和部署前端代码</a>

<a href="http://www.aliued.com/?p=3240">react 项目的一个ie8兼容性问题</a>

<a href="http://react-ie8.xcatliu.com/">Make your React app work in IE8</a>

