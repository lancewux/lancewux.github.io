<h1 align="center"> var/let/const 的异同</h1>

### var

Js用var声明变量，作用域有全局作用域和函数局部作用域。Var声明的变量会有提升效果。未用var声明的局部变量会变成全局变量。var允许重复声明。

```html
		<script>
			console.log(a);	 //undefined	
			var a = 1;
			var a = 2;
			fn();
			console.log(b); //2
			console.log(c); //Uncaught ReferenceError: c is not defined
			function fn() {
				b = 2;
				var c = 1;
			}
		</script>
```

### let

ES6 新增了let命令，用来声明变量。它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效。

```html
		<script>
			{ let a = 1}
			console.log(a); //Uncaught ReferenceError: a is not defined
		</script>
```

let不存在变量提升。

```html
		<script>
			console.log(b); //Uncaught ReferenceError: b is not defined(…)
			let b = 2;
		</script>
```

let不允许重复声明。

```html
		<script>
			{
				let a;
				let a = 1; //Uncaught SyntaxError: Identifier 'a' has already been declared
			}
		</script>
```

块级作用域内let声明的变量会绑定这个区域，形成“暂时性死区”

```html
		<script>
			var tmp = 1;
			if (true) {
				tmp = 2; //Uncaught ReferenceError: tmp is not defined
				let tmp;
			}
		</script>
```

### const

const声明一个只读的常量。声明时必须立即初始化。声明后,变量指向的那个内存地址不得改动。只在声明所在的块级作用域内有效,声明的常量不能提升，不可重复声明。

```html
		<script>
			const b; //SyntaxError: Missing initializer in const declaration
			const a = 1;
			const foo = {};
			foo.prop = 1;
			a = 2; //Uncaught TypeError: Assignment to constant variable
		</script>
```

### 块级作用域

块级作用域的出现，使得获得广泛应用的立即执行函数表达式（IIFE）不再必要了。

```html
		<script>
			// IIFE 写法
			(function() {
				var tmp = 1;
			}());
			// 块级作用域写法
			{
				let tmp = 1;
			}
		</script>
```

ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明。ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用。ES6在附录B里面规定，浏览器的实现可以不遵守上面的规定，有自己的行为方式。

-允许在块级作用域内声明函数。
-函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
-同时，函数声明还会提升到所在的块级作用域的头部。

```html
		<script>
			function f() { console.log('I am outside!'); }
			(function () {
				if (false) {
    				// 重复声明一次函数f
    				function f() { console.log('I am inside!'); }
				}
  				f(); //Uncaught TypeError: f is not a function
			}());
		</script>
```

for循环有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。

```html
		<script>
			for (let i = 0; i < 3; i++) {
  				let i = 's';
  				console.log(i);
			}
			// s s s
		</script>
```

把函数赋值给a[i]时，函数只编译没运行，绑定了相应的作用域（活动对象）。第一个函数绑定的i是var声明的，是全局i，运行时值变为10。第二个函数绑定的i是let声明的，是局部i，是循环时赋值的，运行时就是对应的6.

```html
		<script>
			var a = [];
			for (var i = 0; i < 10; i++) {
				a[i] = function () {
					console.log(i);
				};
			}
			a[6](); // 10
			var a = [];
			for (let i = 0; i < 10; i++) {
				a[i] = function () {
					console.log(i);
				};
			}
			a[6](); // 6
		</script>
```