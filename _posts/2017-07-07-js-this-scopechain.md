<h1 align="center"> Javascript的this和作用域链</h1>

执行环境及作用域
-

执行环境定义了变量或函数有权访问的其他数据，有一个与之关联的变量对象，环境中定义的所有变量和函数都保存在这个对象中。一个变量对象对应一个执行环境。  
每个函数都有自己的执行环境，执行函数时，函数的执行环境被推入环境栈中，执行完之后弹出。  
代码执行时，会创建变量对象的一个作用域链，即节点为变量对象的链表，其作用是保证对有权访问的变量和函数的有序访问。作用域链的前端是当前执行代码的环境的变量对象，作用域链末端是全局环境的变量对象。搜索变量从作用域的前端往后端搜索，直到搜到为止。

### 延长作用域链

- try-catch语句的catch块
- with语句

这两个语句都会在作用域链的前端添加一个变量对象，代码执行后移除该变量对象。对with语句来说，会将指定的对象添加到作用域链前端。对于catch语句来说，会创建一个新的变量对象添加到作用域链的前端，该变量对象包含的是被抛出的错误对象的声明。

```html
		<script>
			var a = { name : 'jay'};
			function fn () {
				var name = 'joy';
				var age = 16;
				with(a) {
					console.log(name + ' is ' + age);
				}
			}
			fn(); // jay is 16
		</script>
```

```html
		<script>
			var e = 'g';
			try {
				throw new Error('s');
			} catch(e) {
				console.dir(e); // Error: s at ...
			}
		</script>
```

this对象
-

每个函数在被调用时都会自动获取两个特殊变量：this和arguments。this对象是在运行时基于函数的执行环境绑定的。全局函数的this指向window对象。当函数被作为某个对象的方法调用时，this执行该对象。匿名函数里的this通常指向window对象。

```html
		<script>
			var x = 1;
			function fn() {
				var x = 2;
				console.log(this.x);
				this.fn1 = function() {
					console.log(x);
				}
				this.fn2 = function() {
					console.log(this.x);
				}
				this.fn3 = function() {
					return this.fn1;
				}
				this.fn4 = function() {
					return this.fn2;
				}
			}
			fn(); //1 (this = window)
			fn1(); //2 (闭包)
			fn2(); //1 (this = window)
			var obj = new fn(); //undefined (this = obj)
			obj.fn1(); //2 (闭包)
			obj.fn2(); //undefiend (this = obj)
			obj.fn3()();//2 (闭包)
			obj.fn4()();//1 (this = window)
		</script>
```

```html
		<script>
			var x = 1;
			function fn() {
				var x = 2;
				this.x =3;
				this.fn1 = function() {
					console.log(x);
				}
				this.fn2 = function() {
					console.log(this.x);
				}
				this.fn3 = function() {
					return this.fn1;
				}
				this.fn4 = function() {
					return this.fn2;
				}
			}
			var o = {
				x: 4,
				fn1: function() {
					console.log(x);
				},
				fn2: function() {
					console.log(this.x);
				}
			}
			var obj = new fn(); 
			obj.fn1(); //2 (闭包)
			obj.fn2(); //3 (this = obj)
			obj.fn3()(); //2 (闭包)
			obj.fn4()(); //1 (this = window)
			o.fn1(); //1 (搜索至window作用域，类似于闭包)
			o.fn2(); //4 (this = o)
		</script>
```

```html
		<script>
			function fn() {
				this.x = 1;
				y = 16;
			}
			console.log(fn.name); //fn (function 关键字会新建一个function对象，名字为fn)
			console.log(fn.x); //undefined
			console.log(fn.y); //undefined
		</script>
```

```html
		<script>
			var x = 1;
			var fn1 = function() {
				console.log(this.x);
			};
			var obj = {
				x: 2
			};
			obj.fn1 = function() {
				console.log(this.x);
			}
			fn1(); //1 (this = window)
			obj.fn1(); //2 (this = obj)
		</script>
```
