<h1 align="center"> Javascript 继承</h1>

许多OO语言都支持两种继承方式：接口继承和实现继承。Javascript只支持实现继承，而且主要靠原型链来实现。

原型链
-

子类的构造函数的原型指向父类的实例，实现对父类的继承。原型链主要通过实例的[[prototype]]来维护的。

```html
		<script>
			function SuperType() {
				this.property = true;
			}
			SuperType.prototype.getSuperValue = function() {
				return this.property;
			}
			function SubType() {
				this.subproperty = false;
			}
			// inherit from SuperType
			SubType.prototype = new SuperType();
			// 方法定义必须放在替换原型之后
			SubType.prototype.getSubValue = function() {
				return this.subproperty;
			}
			var instance = new SubType();
			console.log(instance.getSuperValue()); //true
			console.log(instance instanceof SuperType); //true
			console.log(SuperType.prototype.isPrototypeOf(instance)); //true
		</script>
```

所有的引用类型默认都继承了Object，也是通过原型链实现的。完整的原型链图如下：

<p align="center"><img src="/images/posts/2017-07-10/prototype-chain.png" /></p>

原型链的主要问题有两个

- 父类的属性会变成子类的共享属性，特别是引用类型的属性
- 在创建子类实例时，不能像父类的构造函数传递参数


经典继承（借用构造函数）
-

思路是在子类的构造函数的内部调用父类的构造函数。解决了父类属性不能单独使用和不能向父类构造函数传递参数的问题。其缺点是方法都在构造函数中定义，无法复用。

```html
		<script>
			function SuperType(name) {
				this.name = name;
				this.colors = ['red'];
			}
			function SubType(name) {
				// inherit from SuperType
				SuperType.call(this, name);
			}
			var instance1 = new SubType('Jack');
			var instance2 = new SubType('Lance');
			console.log(instance1.name); //Jack
			instance1.colors.push('blue');
			console.log(instance1.colors); //[red, blue]
			console.log(instance2.colors); //[red]
		</script>
```

组合继承（伪经典继承）
-

指的是将原型链和借用构造函数的技术组合到一起，融合了二者的优点，成为最常用的继承模式。背后的思想是使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。访问时，实例属性会覆盖原型属性。所以，通过原型方法实现了方法的复用，然后通过实例属性实现了属性的独立性。

```html
		<script>
			function SuperType(name) {
				this.name = name;
				this.colors = ['red'];
			}
			SuperType.prototype.sayName = function () {
				console.log(this.name);
			}
			function SubType(name, age) {
				//继承属性
				SuperType.call(this, name); //第二次调用SuperType()
				this.age = age;
			}
			//继承方法
			SubType.prototype = new SuperType(); //第一次调用SuperType()
			SubType.prototype.sayAge = function() {
				console.log(this.age);
			}
			var instance1 = new SubType('Nicholas', 29);
			instance1.colors.push('green');
			console.log(instance1.colors); //["red", "green"]
			instance1.sayName(); //'Nicholas'
			instance1.sayAge(); //29
			var instance2 = new SubType('Tom', 18);
			instance2.colors.push('blue');
			console.log(instance2.colors); //["red", "blue"]
			instance2.sayName(); //'Tom'
			instance2.sayAge(); //18
		</script>
```

组合继承的问题是会调用两次父类构造函数，父类的实例属性会有两个副本，造成效率问题。

<p align="center"><img src="/images/posts/2017-07-10/combine-inherit.png" /></p>

寄生组合式继承
-

通过借用构造函数来继承属性，通过原型链的混合形式来继承方法。继承父类的原型链时，不调用父类的构造函数，而是直接获得父类构造函数的原型。所以父类的实例属性就不会有两个副本了。

```html
		<script>
			function inheritPrototype(subType, superType) { //寄生模式
				var prototype = Object(superType.prototype); //创建对象
				prototype.constructor = subType; //增强对象
				subType.prototype = prototype; //指定对象
			}
			function SuperType(name) {
				this.name = name;
				this.colors = ['red'];
			}
			SuperType.prototype.sayName = function () {
				console.log(this.name);
			}
			function SubType(name, age) {
				//继承属性
				SuperType.call(this, name);
				this.age = age;
			}
			//只继承原型方法
			inheritPrototype(SubType, SuperType);
			SubType.prototype.sayAge = function() {
				console.log(this.age);
			}
			var instance1 = new SubType('Jack', 16);
			instance1.colors.push('green');
			console.log(instance1.colors); //["red", "green"]
			instance1.sayName(); //'Jack'
			instance1.sayAge(); //16
			var instance2 = new SubType('Tom', 18);
			instance2.colors.push('blue');
			console.log(instance2.colors); //["red", "blue"]
			instance2.sayName(); //'Tom'
			instance2.sayAge(); //18
			console.log(instance2 instanceof SuperType); //true
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

所有 JavaScript 对象都有 __proto__ 属性，但只有 Object.prototype.__proto__ 为 null

<p align="center"><img src="/images/posts/2017-07-10/object-inherit.jpg" /></p>

Reference
-

<a href="https://www.ibm.com/developerworks/cn/web/1306_jiangjj_jsinstanceof/" target="_blank">JavaScript instanceof 运算符深入剖析</a>


