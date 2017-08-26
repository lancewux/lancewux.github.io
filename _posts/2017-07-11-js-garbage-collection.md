<h1 align="center"> Javascript 垃圾回收</h1>

Javascript具有自动垃圾收集机制。原理就是找出不再继续使用的变量然后释放其占用的内存。垃圾收集器会周期性地执行这一操作。浏览器通常有两种垃圾回收策略：标记清除和引用计数

标记清除(mark-and-sweep)
-

当变量进入环境（例如，在函数中声明一个变量）时，就将这个变量标记为‘进入环境’。当变量离开环境时，就将其标记为‘离开环境’。标记为‘离开环境’的变量将会被垃圾回收器回收。

至2008为止，IE、Firefox、Opera、Chrome和Safari的Javascript采用的都是标记清除策略，不过回收的时间间隔不同。

引用计数(reference counting)
-

根据记录每个值被引用的次数，当引用次数变成0时，将会被垃圾收集器回收。当一个引用类型的值赋给一个变量时，其引用次数加一。当这个变量被赋予另外一个值时，引用次数减一。

#### 内存泄露

当引用类型的值出现循环引用时，引用次数永远不会等于零，也就是永远不会被回收，会导致内存泄露。

IE9之前的版本的BOM和DOM对象不是原生Javascript对象，采用的是引用计数的垃圾回收机制，存在循环引用问题。如下DOM元素对象el和Javascript原生对象obj直接存在循环引用，即使DOM元素从页面移除，el也不会被回收。可以用重新赋值的方法来清除连接。

```html
		<script>
			var el = document.getElementById('certain_id');
			var obj = new Object();
			obj.el = el;
			el.obj = obj;
			// 手动清除连接
			el = null
			obj = null;
		</script>
```

闭包也会导致内存泄露。如下匿名函数保存了一个对assignHandler()活动对象的引用，只要匿名函数存在，el的引用数就不会小于1，因此占用的内存永远不会被回收。可以通过间接引用和手动清除链接来减少引用数。

```html
		<script>
			function assignHandler() {
				var el = document.getElementById('certain_id');
				el.onclick = function() {
					console.log(el.id);
				}
			}
			// 改进版
			function assignHandler() {
				var el = document.getElementById('certain_id');
				var id = el.id;
				el.onclick = function() {
					console.log(id);
				}
				el = null;
			}
		</script>
```

https://segmentfault.com/a/1190000004896090

性能问题
-

垃圾回收器是周期性运行的，当为变量分配的内存数量很可观时，回收工作量很大。内存分配的量达到某个阙值，IE就会触发垃圾回收器运行。而脚本可能会在周期中一直保持那么多变量，导致垃圾回收器频繁运行，引起严重的性能问题。IE7把触发垃圾回收器的阙值调整为动态修正。

管理内存
-

虽然Javascript会自己管理内存。但是开发人员也要注意优化内存占用。出于安全考虑，操作系统分配给Web浏览器的内存是偏少的，有限制的。内存限制问题会影响给变量分配内存，调用栈，和一个线程中同时执行的语句数量。

优化内存占用的最佳方式，就是只为执行中的代码保存必要的数据。把不再使用的变量设置为null，从而解除引用(dereferencing)。这一方法适用于大多数全局变量和全局对象的属性。

V8 GC
-

Garbage collection就是回收不再使用的内存的进程。分配内存容易，回收内存难。

垃圾回收简化了编程，减少了错误和内存泄漏，甚至提高了少数应用的性能。垃圾回收器剥夺了内存控制权，程序员几乎无法操控内存。

自带垃圾回收的语言和没有管理内存的语言之间的性能没有绝对的优劣之分。

Reference counting被吹捧为垃圾回收的替代品，但是它也有不少问题。

垃圾回收器要解决的问题<a href="http://jayconrod.com/posts/55/a-tour-of-v8-garbage-collection">a-tour-of-v8-garbage-collection</a>：

- 区分指针和数据
- 识别内存死区，即可以被回收的内存空间

当一个对象不能在被根节点使用到的时候，就会成为gc的候选者。即不被根对象（root object）或活动对象（active object）引用。根对象可以是全局对象，DOM元素，或局部变量。

当一个对象能被一个定义的活的对象通过指针链获取的时候，它就是活的，否则就是垃圾。

v8使用了一种stop-the-world回收机制，即当回收器工作时，所有程序停止运行。

堆区（heap）主要分为两段：New Space和Old Space。New Space是分配新内存发生的地方，大小为1-8MBs，回收内存比较快，比较频繁，使用Scavenge collection回收算法。Old Space是对象没有被gc回收后提升到的地方，这里分配内存快，但是回收慢，只有在耗尽时才会开始内存回收工作，使用Mark-Sweep collection回收算法。


https://blog.risingstack.com/finding-a-memory-leak-in-node-js/

https://blog.risingstack.com/node-js-at-scale-node-js-garbage-collection/?utm_source=nodeweekly&utm_medium=email



