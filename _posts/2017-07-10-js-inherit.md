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

方法是在子类的构造函数的内部调用父类的构造函数。解决了父类属性不能单独使用和不能向父类构造函数传递参数的问题。其缺点是方法不能共享。

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

