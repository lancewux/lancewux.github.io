https://segmentfault.com/a/1190000002662251

call,apply,bind
-

Javascript里的this是自动绑定的，而call,apply,bind都是用来改变this指向的。

不同点：

call和apply是在函数调用时改变this指向，而bind是在函数执行前改变this执行，并返回新的函数。  
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
			p1.showInfo.bind(a1, 14)('male'); //honey : 14 , male (this = a1)
		</script>
```

