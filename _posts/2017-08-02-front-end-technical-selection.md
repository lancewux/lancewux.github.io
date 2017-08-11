<h1 align="center">兼容IE8的React+Router+Redux+Webpack+ES6+AJAX全套解决方案</h1>

Angular 1.x版本是个比较旧的东西了，比如依赖注入、自己独特的模块化，这些东西在ES6下已经很好地被解决了。AngularJS 1.3抛弃了对IE8的支持。Angular的2.0几乎是一个推翻重做的框架。

React 15.x.x版本已经不支持IE8的DOM了，最后的支持版本为0.14.8，发布时间是2016.3.30，不算太过时，所以决定采用React v0.14.8来做。文档为<a src="http://react-ie8.xcatliu.com/react/index.html">react-ie8</a>。建议先看15版本的文档<a src="https://facebook.github.io/react/">react</a>，因为写得更好。

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

create-react-app demo-react

进入项目

cd demo-react

卸载最新版本的react

npm uninstall --save react react-dom

安装旧版本的react

npm install --save react@0.14.8 react-dom@0.14.8

用脚手架脚本eject出配置文件，以便修改配置

npm run eject

#### 安装插件解决兼容性问题

兼容ES6语法：

npm install --save-dev babel-preset-es2015 babel-preset-es2016

兼容ES5的各种函数：

npm install --save es5-shim

处理ES5对象定义没有冒号的问题：

npm install --save es5to3-webpack-plugin

处理require加载模块会引入defineProperty函数的问题：

npm install --save-dev babel-plugin-add-module-exports 

安装插件支持jsx语法

npm install --save-dev babel-plugin-transform-react-jsx

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

在config/webpack.config.prod.js和config/webpack.config.dev.js的第93行加上，在项目中就可以使用绝对路径了

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

如果想使用路由，就需要安装react-router，考虑兼容性建议使用2.x.x版本，用法参见<a src="https://github.com/ReactTraining/react-router/tree/v2.8.1/docs">React Router v2.8.1</a>

npm install --save react-router@2.1.0

#### 全局状态管理

如果想使用全局状态管理，可以使用Redux，用法参见<a src="http://redux.js.org/docs/basics/UsageWithReact.html">UsageWithReact</a>。

npm install --save redux@3.3.0

npm install --save react-redux@4.4.0

#### 异步请求

官方推荐使用fetch函数，但是暂时解决不了在IE下的兼容性问题，所以用一个ajax插件<a src="https://github.com/ForbesLindesay/ajax">ForbesLindesay/ajax</a>

npm install --save ForbesLindesay/ajax

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

## 项目结构

```javscript
.
 |--.build
 |--.babelrc
```


相关参考资料
-

<a src="http://div.io/topic/1275">前端工程——基础篇</a>

<a src="https://github.com/fouber/blog/issues/6">大公司里怎样开发和部署前端代码</a>

<a src="http://www.aliued.com/?p=3240">react 项目的一个ie8兼容性问题</a>

<a src="http://react-ie8.xcatliu.com/">Make your React app work in IE8</a>






{
  "name": "demo-react2",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^0.14.8",
    "react-dom": "^0.14.8",
    "react-scripts": "^1.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}


    "babel-core": "6.25.0",
    "babel-eslint": "7.2.3",
    "babel-jest": "20.0.3",
    "babel-loader": "7.0.0",
    "babel-preset-react-app": "^3.0.1",
    "babel-runtime": "6.23.0",


    npm install --save-dev babel-plugin-transform-react-jsx

    npm install --save-dev babel-preset-es2015 babel-preset-es2016

    {
	"presets": ["es2015", "es2016"]	
}

<a src="http://react-ie8.xcatliu.com/">Make your React app work in IE8</a>