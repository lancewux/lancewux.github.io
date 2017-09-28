<h1 align="center"> call,apply,bind,with,new详解</h1>

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

模拟call的源码：

```html
		<script>
			// 将函数作为对象的属性，执行，然后删除
			Function.prototype.call1 = function(context) {
				context.fn = this;
				context.fn();
				delete context.fn;
			}

			// 处理参数问题
			Function.prototype.call2 = function(context) {
				var args = [];
				for(var i = 1; i < arguments.length; i++) {
					args.push('arguments[' + i + ']');
				}
				var argsStr = args.join(',');
				context.fn = this;
				eval('context.fn(' + argsStr + ')');
				delete context.fn;
			}

			// 对象为null和返回值问题
			Function.prototype.call3 = function(context) {
				var context = context || window;
				var args = [];
				for(var i = 1; i < arguments.length; i++) {
					args.push('arguments[' + i + ']');
				}
				var argsStr = args.join(',');
				context.fn = this;
				var result = eval('context.fn(' + argsStr + ')');
				delete context.fn;
				return result;
			}
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

模拟bind的源码

```html
		<script>
			//实现了this的绑定和参数的柯里化处理
			Function.prototype.bind1 = function(context){
				var args = Array.prototype.slice.call(arguments, 1),
				self = this; //保存this，即调用bind方法的目标函数
				bound = function(){ //函数柯里化的情况
					var innerArgs = Array.prototype.slice.call(arguments);
					var finalArgs = args.concat(innerArgs);
					return self.apply(context, finalArgs);
				};
				return bound;
			};

			var foo = {
				value: 1
			};
			function bar(name, age) {
				this.habit = 'shopping';
				console.log(this.value, name, age);
			}
			bar.bind1(foo, 'kk')(28); //1 "kk" 28

			//bind生成的函数也能作为构造函数，用new生成对象。
			//由于new操作符的实现使用了this，所以bind的时候就不能篡改this，
			//要把this释放出来，bind只完成参数处理的功能，不绑定对象
			//用instanceof来完成这个分支判断，
			Function.prototype.bind2 = function(context){
				var args = Array.prototype.slice.call(arguments, 1);
				var self = this; //保存this，即调用bind方法的目标函数 
				var bound = function() {
					var innerArgs = Array.prototype.slice.call(arguments);
					var finalArgs = args.concat(innerArgs);
					self.apply((this instanceof self ? this : context), finalArgs);
				}
				bound.prototype = self.prototype; //bind后的函数和原函数有相同的原型
				return bound;
			};

			bar.prototype.friend = 'kevin';
			var bindBar = bar.bind2(foo, 'ff');
			var obj1 = {};
			// obj1的原型等于bindBar的原型，等于bar的原型
			// this instanceof self （obj1 instanceof bar）为true
			obj1.__proto__ = bindBar.prototype; 
			bindBar.call(obj1, 17); //undefined "ff" 17
			console.log(obj1.habit); //shopping
			console.log(obj1.friend); //kevin

			//bind2的缺点是，把原函数的prototype直接赋值给bind后的函数，修改后者的原型会直接影响原函数的原型
			//加个中转函数来避免这种副作用
			Function.prototype.bind3 = function(context){
				var args = Array.prototype.slice.call(arguments, 1),
				F = function(){}, //中转构造函数F，
				self = this, //保存this，即调用bind方法的目标函数
				bound = function(){ //函数柯里化的情况
					var innerArgs = Array.prototype.slice.call(arguments);
					var finalArgs = args.concat(innerArgs);
					return self.apply((this instanceof F ? this : context), finalArgs);
				};
				F.prototype = self.prototype;
				bound.prototype = new F(); 
				return bound;
			};

			var bindBarr = bar.bind3(foo, 'dd');
			var obj2 = new bindBarr(29); //undefined "dd" 29
			console.log(obj2.habit); //shopping
			console.log(obj2.friend); //kevin
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

new操作符到底干了什么
-

1. 创建一个新对象。
2. 将这个空对象的成员对象__proto__指向构造函数的属性prototype。
3. 把构造函数的this指针指向新对象，并运行构造函数。新对象就有了构造函数里的属性。
4. 返回新对象。

```html
		<script>
			function Person(name) {
				var age = 16;
				this.name = name;
				this.sayAge = function() {
					console.log(age);
				}
			}
			Person.prototype.sayName = function() {
				console.log(this.name);
			}
			var p1 = new Person('jim');			
			var p2 = {};
			p2.__proto__ = Person.prototype;
			Person.call(p2, 'jim');
			p1.sayAge(); //16
			p1.sayName(); //jim
			p2.sayAge();//16
			p2.sayName(); //jim
		</script>
```

instanceof
-

用例：

```
console.log(Object instanceof Object);//true 
console.log(Function instanceof Function);//true 
console.log(Number instanceof Number);//false 
console.log(String instanceof String);//false 
 
console.log(Function instanceof Object);//true 
 
console.log(Foo instanceof Function);//true 
console.log(Foo instanceof Foo);//false
```

源码模拟:

```
function instanceof(obj, fn) {
	var objpt = obj.__proto__;
	var fnpt = fn.prototype;
	while (true) {
		if (objpt === null) {
			return false;
		}
		if (objpt === fnpt) {
			return true;
		}
		objpt = objpt.__proto__;
	}
}
```
### Reference

<a href="https://segmentfault.com/a/1190000002662251">Javascript中bind()方法的使用与实现</a>

<a href="http://blog.jobbole.com/77956/">函数式JavaScript（4）：函数柯里化</a>

<a href="http://blog.csdn.net/daimomo000/article/details/72897035" target="blank">JavaScript深入之bind的模拟实现</a>

<a href="https://www.ibm.com/developerworks/cn/web/1306_jiangjj_jsinstanceof/" target="_blank">JavaScript instanceof 运算符深入剖析</a>


