<h1 align="center">RequireJS VS SeaJS</h1>

下面的例子展示了在浏览器中使用JS模块加载的问题：

```html
		var Employee = require("types/Employee");
		function Manager () {
			this.reports = [];
		}
		//Error if require call is async
		Manager.prototype = new Employee();
```

对象Manager要继承对象Employee，但是Employee对象是在另一个JS文件中定义的，通过require函数引入。如果require是同步的，会阻塞浏览器渲染而造成性能和体验问题，如果require是异步的，无法保证其会先加载，所以会出错。

可能的解决方案（SCRIPT LOADING）：
-

#### SCRIPT LOADING: XHR

使用XMLHttpRequest (XHR) 来请求脚本，找出其中的require函数，保证require请求的脚步已经加载，再把脚本通过eval函数或者script标签（内容为请求的脚步）来加载脚本。Dojo就是基于这种方法的。

##### 问题：

使用eval函数执行脚本是糟糕的做法，因为存在跨浏览器兼容问题。

把脚本放入script标签中不利于测试，因为和源代码的行号不一致。

#### SCRIPT LOADING: WEB WORKERS

Web Workers的importScripts函数也可以用来请求脚本文件。

##### 问题：

没有很好的跨浏览器支持。

它是消息传递型api，当脚本需要操作dom元素时，消息传递就会变得很麻烦。

#### SCRIPT LOADING: DOCUMENT.WRITE()

document.write() 可以用来加载脚本，可以跨域加载，也便于调试。

##### 问题：

它会立即执行脚本，在其依赖没有加载之前。在执行之前无法或者依赖。

它会阻塞浏览器渲染。

在page load后无效。

#### SCRIPT LOADING: HEAD.APPENDCHILD(SCRIPT)

创建src为脚本的script标签，并appendchild到head。脚本会在把script元素插入到页面中的时候开始加载。加载是异步的，不会阻塞页面其他线程（比如渲染和其他脚本加载）。同时动态创建的多个script元素可以同步下载脚本。

##### 问题：

在执行脚本前无法获知依赖。

#### FUNCTION WRAPPING

使用function wrappers来构造模块可以保证在执行代码前就获知其依赖。在依赖模块被加载并运行之后，才会运行工厂函数。

```javascript
        define(
            //Thise name of this module
            "types/Manager",
            //The array of dependencies
            ["types/Employee"],
            //The function to execute when all dependencies have loaded. The
            //arguments to this function are the array of dependencies mentioned
            //above.
            function (Employee) {
                function Manager () {
                    this.reports = [];
                }
                //This will now work
                Manager.prototype = new Employee();
                //return the Manager constructor function so it can be used by
                //other modules.
                return Manager;
            }
        );
```

RequireJS
-

使用function wrapper可以在执行代码前获取其依赖模块列表，使用HEAD.APPENDCHILD(SCRIPT)来异步加载依赖模块并运行依赖模块的代码，然后再执行本模块的代码，如果依赖模块还依赖其他模块，就递归执行前面的逻辑。


AMD
-

The Asynchronous Module Definition (AMD) API specifies a mechanism for defining modules such that the module and its dependencies can be asynchronously loaded. 

define() function：

define(id?, dependencies?, factory);

The second argument, dependencies, is an array literal of the module ids that are dependencies required by the module that is being defined. The dependencies must be resolved prior to the execution of the module factory function, and the resolved values should be passed as arguments to the factory function with argument positions corresponding to indexes in the dependencies array.

```javascript
        define("alpha", ["require", "exports", "beta"], function (require, exports, beta) {
        exports.verb = function() {
            return beta.verb();
            //Or:
            return require("beta").verb();
        }
    });
```

SeaJS
-

使用define函数来定义模块，在执行代码前可以获取其依赖模块列表，使用webworker或者HEAD.APPENDCHILD(SCRIPT)来异步加载依赖模块，并缓存起来，继续异步加载并缓存依赖模块的依赖模块，直至所有的依赖模块都加载并缓存完成，在按照依赖顺序执行各个模块的代码。

Sea.js 在运行 define 时，接受 factory 参数，可以通过 factory.toString() 拿到源码，再通过正则匹配 require 的方式来得到依赖信息。由于 Sea.js 的这个实现原理，使得书写 CMD 模块代码时，必须遵守 require 书写约定，否则获取不到依赖数组，Sea.js 也就无法正确运行。


CMD
-

The Common Module Definition (CMD) API addresses how modules should be written in order to be interoperable in browser-based environment. 

```javascript
        define(function(require, exports, module) {

  			// The module code goes here

		});
```

RequireJS VS SeaJS
-

### 相同点：

都是模块加载器

### 不同点：

- 定位有差异。RequireJS 想成为浏览器端的模块加载器，同时也想成为 Rhino / Node 等环境的模块加载器。Sea.js 则专注于 Web 浏览器端，同时通过 Node 扩展的方式可以很方便跑在 Node 环境中。

- 插件机制不同。RequireJS 采取的是在源码中预留接口的形式，插件类型比较单一。Sea.js 采取的是通用事件机制，插件类型更丰富。

- 执行模块代码的时机不一样。RequireJS加载完模块后就执行代码，所有依赖模块参数中的模块都会执行，且执行的顺序不确定。SeaJS加载完模块后会先缓存起来，等所有模块都加载完成后根据依赖关系依次执行缓存的代码，只有真正有需要使用时才执行代码，执行的顺序和依赖的顺序是一致的。

- 寻找模块依赖的方式不一样。RequireJS主要靠define的第二个参数来获取依赖模块，而Sea.js主要通过正则匹配工厂函数的require调用来获取依赖模块。

node require vs import
-

ES6标准发布后，module成为标准，标准的使用是以export指令导出接口，以import引入模块，但是在我们一贯的node模块中，我们采用的是CommonJS规范，使用require引入模块，使用module.exports导出接口。

ES6发布的module并没有直接采用CommonJS，甚至连require都没有采用，也就是说require仍然只是node的一个私有的全局方法，module.exports也只是node私有的一个全局变量属性，跟标准半毛钱关系都没有。

import的语法跟require不同，而且import必须放在文件的最开始，且前面不允许有其他逻辑代码，这和其他所有编程语言风格一致。

从理解上，require是赋值过程，import是解构过程

你在使用时，完全可以忽略模块化这个概念来使用require，仅仅把它当做一个node内置的全局函数，它的参数甚至可以是表达式



### Reference

<a href="https://github.com/amdjs/amdjs-api/blob/master/AMD.md">amdjs/amdjs-api</a>

<a href="https://github.com/cmdjs/specification/blob/master/draft/module.md">Common Module Definition / draft</a>

<a href="https://github.com/seajs/seajs/issues/242">CMD 模块定义规范</a>

<a href="http://www.cnblogs.com/guanghe/p/6560698.html">NodeJS中的require和import</a>

