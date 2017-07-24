<h1 align="center">REQUIRE JS</h1>

RequireJS takes a different approach to script loading than traditional script tags. While it can also run fast and optimize well, the primary goal is to encourage modular code. 

RequireJS loads scripts asynchronously and out of order for speed.

data-main is only intended for use when the page just has one main entry point, the data-main script. For pages that want to do inline require() calls, it is best to nest those inside a require() call for the configuration

```html
		<script src="scripts/require.js"></script>
		<script>
			require(['scripts/config'], function() {
    			// Configuration loaded now, safe to do other require calls
    			// that depend on that config.
    			require(['foo'], function(foo) {
    				console.log('g');
    			});
			});
		</script>
```


The function is not called until the my/cart and my/inventory modules have been loaded, and the function receives the modules as the "cart" and "inventory" arguments.


If you define a circular dependency ("a" needs "b" and "b" needs "a"). "b" can fetch "a" later after modules have been defined by using the require() method.

RequireJS waits for all dependencies to load, figures out the right order in which to call the functions that define the modules, then calls the module definition functions once the dependencies for those functions have been called. Note that the dependencies for a given module definition function could be called in any order, due to their sub-dependency relationships and network load order.


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

创建src为脚本的script标签，并appendchild到head。

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

##### RequireJS的基本思路就是用function wrappers来获知模块依赖，然后用HEAD.APPENDCHILD(SCRIPT)来异步加载模块。


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


### Reference

<a href="https://github.com/amdjs/amdjs-api/blob/master/AMD.md">amdjs/amdjs-api</a>

<a href="https://github.com/cmdjs/specification/blob/master/draft/module.md">Common Module Definition / draft</a>

<a href="https://github.com/seajs/seajs/issues/242">CMD 模块定义规范</a>
