<h1 align="center">Technical selection</h1>

http://div.io/topic/1275

https://github.com/fouber/blog/issues/6

AngularJS是一套完整的框架

AngularJS 1.3抛弃了对IE8的支持，但angularjs 1.2将继续支持IE8，但核心团队已经不打算在解决IE8及之前版本的问题上花时间。

Angular 1.x版本其实是个比较旧的东西了，现在看来有些理念过时了，比如依赖注入、自己独特的模块化，这些东西其实在ES6下已经很好地被解决了。

Angular的2.0几乎是一个推翻重做的框架

React + Flux = ♥

现在react@15.x.x版本已经放弃ie8。

http://www.aliued.com/?p=3240

http://react-ie8.xcatliu.com/


"console-polyfill": "^0.2.2",
    "core-js": "^2.0.2",
    "es5-shim": "^4.4.1",
    "es6-promise": "^3.0.2",
    "fetch-ie8": "^1.4.0",
    "react": "^0.14.8",
    "react-dom": "^0.14.8"

    "es3ify-loader": "^0.1.0",

安装脚手架命令行工具

sudo npm install -g create-react-app

用脚手架生成项目（会同时生成脚手架脚本）

create-react-app demo-react

进入项目

cd demo-react

卸载最新版本的react和脚手架脚本

npm uninstall --save react react-dom react-scripts

安装旧版本的react和脚手架脚本

npm install --save react@0.14.8 react-dom@0.14.8 react-scripts@1.0.1

用脚手架脚本eject出配置文件，以便修改配置

npm run eject

安装es5-shim以解决es5兼容性问题

npm install --save es5-shim

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
			"plugins": ["transform-react-jsx"]
		}
```

在package.json里加homepage属性，因为默认是根目录，修改成生成文件路径（用于build命令）

"homepage": "http://www.wuliang-hwtrip.com/~wuliang/demo-react/build"

在config/webpackDevServer.config.js文件的首行加上一行配置，以便非本机的网络也能访问devserver

process.env.HOST = '0.0.0.0';

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

运行npm run start命令使用devserver进行调试，用http://192.168.204.49:3000/访问

运行npm run build命令build文件，用http://192.168.204.49/~wuliang/demo-react/build/访问

<a src="http://react-ie8.xcatliu.com/">Make your React app work in IE8</a>

使用webpack-dev-server

.eslintrc



webpackDevServer.config.js
加上




run build之前要在package.json中加上默认路径





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

    npm install --save-dev babel-preset-es2015

    {
	"presets": ["es2015", "es2016"]	
}