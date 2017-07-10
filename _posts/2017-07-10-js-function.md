<h1 align="center"> Javascript 函数</h1>

特点
-

每个函数都是Function类型的实例，是对象。

没有重载。多个函数同名时，后面的函数会覆盖前面的函数。

函数声明和函数表达式的差别在于，函数声明会被预处理，在执行任何代码之前可用。函数表达式则要等到执行该代码行时才会被解析。


内部属性
-

- arguments
- this 
- caller

arguments是一个类数组对象，包含传入函数中的所有参数。arguments的callee属性指向拥有arguments的函数

```html
		<script>
			function fn() {
				console.log(arguments); //[2, 3]
				console.log(Object.prototype.toString.call(arguments)); //[object Arguments]
				console.log(arguments.callee); //function fn
			}
			fn(2, 3);
		</script>
```

this引用的是函数执行的环境对象。

caller表示调用当前函数的函数的引用。

```html
		<script>
			function outer() {
				inner();
			}
			function inner() {
				console.log(inner.caller);
			}
			outer(); // function outer
		</script>
```

属性和方法
-

- length
- prototype
- apply
- call

length表示函数希望接受的命名参数的个数。

prototype指向一个原型对象，这个对象的用途就是包含可以由特定类型的所有实例共享的属性和方法。

apply和call用来改变调用函数的对象，即设置函数体内this对象的值。

