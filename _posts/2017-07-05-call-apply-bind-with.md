<h1 align="center"> call,apply,bind,with详解</h1>

call,apply,bind
-

Javascript里的this是自动绑定的，而call,apply,bind都是用来改变this指向的。

不同点：

call和apply是在函数调用时改变this指向，而bind是在函数执行前改变this执行，并返回新的函数。bind是ES5的方法。  
call的参数是一个个传入的，而apply的参数是一数组的方式传入的。

- func.call(this, arg1, arg2);
- func.apply(this, [arg1, arg2]);
- func.bind(this, arg1, arg2)();

```html
		<script>
			function Person() {
				this.nickname = 'petter';
				this.showInfo = function(age, sex) {
					console.log(this.nickname + ' : ' + age + ' , ' + sex);
				}
			}
			function Animal() {
				this.nickname = 'honey';
			}
			var p1 = new Person();
			var a1 = new Animal();
			var nickname = 'window';
			p1.showInfo.call(a1, 17, 'male'); //honey : 17 , male (this = a1)
			p1.showInfo.apply(a1, [18, 'female']); //honey : 18 , female (this = a1)
			p1.showInfo.call(null, 16, 'male'); //window : 16 , male (this = window)
			p1.showInfo.bind(a1)(15, 'female'); //honey : 15 , female (this = a1)
			p1.showInfo.bind(a1, 14)('male'); //honey : 14 , male (this = a1，偏函数，函数柯里化)
		</script>
```

###### call,apply应用

实现继承

```html
			<script>
			function Super(x) {
				this.x = x;
				this.show = function() {
					console.log(this.x);
				}
			}
			function Sub (x) {
				Super.call(this, x);
			}
			var p1 = new Sub(1);
			p1.show(); //1
		</script>

```

###### bind应用

与setTimeout一起使用

```html
		<script>
			function Fn() {
				this.x = 1;
			}
			function fn1() {
				console.log(this.x);
			}
			Fn.prototype.fn2 = function() {
				setTimeout(fn1, 100);
			}
			Fn.prototype.fn3 = function() {
				setTimeout(fn1.bind(this), 200);
			}
			var obj = new Fn();
			obj.fn2(); //undefined (this = window)
			obj.fn3(); //1 (window = obj)
		</script>
```

转化操作

```html
		<script>
			function fn(x ,y) {
				var arr1 = Array.prototype.slice.call(arguments);
				console.log(arr1); //将类数组arguments转为真正的数组
				var arr2 = Array.prototype.slice.bind(arguments)();
				console.log(arr2); //将类数组arguments转为真正的数组
			}
			fn(1, 2); //[1, 2] [1, 2]
		</script>
```

```html
		<script>
			Function.prototype.bind = function(context){
				var args = Array.prototype.slice(arguments, 1),
				F = function(){}, //中转构造函数F，使绑定后的函数与调用bind()的函数处于同一原型链上
				self = this, //保存this，即调用bind方法的目标函数
				bound = function(){ //函数柯里化的情况
					var innerArgs = Array.prototype.slice.call(arguments);
					var finalArgs = args.concat(innerArgs);
					return self.apply((this instanceof F ? this : context), finalArgs);
				};

				F.prototype = self.prototype;
				bound.prototype = new F();
				retrun bound;
			};
		</script>
```

with
-

with用于改变作用域，将指定的对象添加到作用域链前端。

with (expression) statement

```html
<script>
			var msg = 'hello';
			with(msg) {
				console.log(toUpperCase());
			}
		</script>
```

实现bind的源码

### Reference

<a href="https://segmentfault.com/a/1190000002662251">Javascript中bind()方法的使用与实现</a>

<a href="http://blog.jobbole.com/77956/">函数式JavaScript（4）：函数柯里化</a>
