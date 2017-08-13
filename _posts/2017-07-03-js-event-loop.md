<h1 align="center"> Javascript 单线程和异步</h1>

　　作为浏览器脚本语言，JavaScript的主要用途是与用户互动，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定JavaScript同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

　　为了利用多核CPU的计算能力，HTML5提出WebWorker标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。

　　js选择了成为单线程的语言，所以它本身不可能是异步的，但js的宿主环境（比如浏览器，Node）是多线程的，宿主环境通过某种方式（事件驱动）使得js具备了异步的属性。

任务（回调）队列
-

　　An event loop is "an entity that handles and processes external events and converts them into callback invocations".

　　js是单线程语言，浏览器只分配给js一个主线程，同时分配堆（heap）和栈（stack），用来执行任务（函数）。js线程运行时，一次把同步任务（synchronous）压入执行栈中，依次执行，比如&lt;script&gt;标签内的同步语句和函数。

　　执行栈中的代码在执行时，会调用webAPIs来发出异步任务请求，这些任务主要包括网络请求，定时器和事件监听等，浏览器会为其分配对应的线程来处理这些任务，比如http请求线程，浏览器定时触发器线程，浏览器事件触发线程。当这些线程执行完任务时，就会往回调队列中添加一个事件。

　　当执行栈中的代码执行完毕时，主线程就会去读取"回调队列"里的事件，依次把那些事件所对应的回调函数压入栈中执行。然后再回到上一步。

<p align="center"><img src="/images/posts/2017-07-03/eventloop.png" /></p>

　　为了提高渲染效率，浏览器规定，界面渲染线程和主线程是互斥的，主线程执行任务时，浏览器渲染线程处于挂起状态。

定时器
-

　　除了放置异步任务的事件，"回调队列"还可以放置定时事件，即指定某些代码在多少时间之后执行，即定时器。主要由setTimeout()和setInterval()这两个函数来完成。

　　setTimeout()接受两个参数，第一个是回调函数，第二个是推迟执行的毫秒数。HTML5标准规定了setTimeout()的第二个参数的最小值（最短间隔），不得低于4毫秒，如果低于这个值，就会自动增加。在此之前，老版本的浏览器都将最短间隔设为10毫秒。另外，对于那些DOM的变动（尤其是涉及页面重新渲染的部分），通常不会立即执行，而是每16毫秒执行一次。这时使用requestAnimationFrame()的效果要好于setTimeout()。

```html
		<script>
			console.log(1);
			setTimeout(function(){console.log(2);},100);
			setTimeout(function(){console.log(3);},0);
			console.log(4);
			//1 4 3 2
		</script>
```

Node.js的Event Loop
-

　　关于Node.js的第一个基本概念是I/O操作开销是巨大的：

<p align="center"><img src="/images/posts/2017-07-03/iocost.jpg" /></p>

有几种方法来改善性能：

- 同步方式  
按次序一个一个的处理请求。利：简单；弊：任何一个请求都可以阻塞其他所有请求。
- 开启新进程  
每个请求都开启一个新进程。利：简单；弊：大量的链接意味着大量的进程。
- 开启新线程  
每个请求都开启一个新线程。利：简单，而且跟进程比，对系统内核更加友好，因为线程比进程轻的多;弊:不是所有的机器都支持线程，而且对于要处理共享资源的情况，多线程编程会很快变得太过于复杂。

　　第二个基本概念是为每个连接都创建一个新线程是很消耗内存的（例如：对比Nginx，Apache要吃掉很多内存）。


#### Node.js让你的代码运行在一个单线程之中， 然而，除了你的代码，其它的一切都是并行执行的

　　你不能并行执行任何代码，一个sleep函数也会阻塞服务1s。当这段代码运行时，Node.js不会响应客户端任何请求，因为只有一个线程来运行你的代码，另外，如果你执行cpu密集的任务，比如重设图像的大小，它也会阻塞所有请求。

```javascript
var now = new Date().getTime();
while(new Date().getTime() < now + 1000) {
    // do nothing
}
```

　　Node.js也是单线程的Event Loop，但是它的运行机制不同于浏览器环境。

<p align="center"><img src="/images/posts/2017-07-03/nodejseventlop.png" /></p>

- V8引擎解析JavaScript脚本。
- 解析后的代码，调用Node API，并进入LIBUV的第一个事件的回调函数。
- libuv库负责Node API的执行。它将不同的任务分配给不同的线程，形成一个Event Loop（事件循环），以异步的方式将任务的执行结果返回给V8引擎。
- V8引擎再将结果返回给用户。

process.nextTick和setImmediate
-

```javascript
setImmediate(() => {
  console.log('immediate');
});
setTimeout(() => {
  console.log('timeout');
}, 0);
// 顺序不确定
```

```javascript
const fs = require('fs');
fs.readFile('./data.json', () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
//immediate timeout
```

```javascript
setImmediate(() => {
  console.log('immediate');
});
setTimeout(() => {
  console.log('timeout');
}, 0);
console.log('end');
// end timeout immediate
```

```javascript
fs.readFile('./data.json', () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
  console.log('end');
});
//end immediate timeout
```

process.nextTick方法在当前"执行栈"的尾部----下一次Event Loop（主线程读取"任务队列"）之前----添加回调函数。setImmediate方法则是在当前"任务队列"的尾部添加事件，与setTimeout(fn, 0)很像。

```javascript
process.nextTick(function A() {
  console.log(1);
  process.nextTick(function B(){console.log(2);});
});
setTimeout(function timeout() {
  console.log('TIMEOUT');
}, 0);
console.log(3);
// 3 1 2 TIMEOUT
```

```javascript
setImmediate(function A() {
  console.log(1);
  setImmediate(function B(){console.log(2);});
});
setTimeout(function timeout() {
  console.log('TIMEOUT');
}, 0);
console.log(3);
//3 1 TIMEOUT 2 (理论值，实际上可能为 3 TIMEOUT 1 2)
```

### Reference

<a href="http://www.ruanyifeng.com/blog/2014/10/event-loop.html">JavaScript 运行机制详解：再谈Event Loop</a>

<a href="http://blog.mixu.net/2011/02/01/understanding-the-node-js-event-loop/">Understanding the node.js event loop</a>

http://www.journaldev.com/7462/node-js-architecture-single-threaded-event-loop

https://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js

https://stackoverflow.com/questions/10680601/nodejs-event-loop

https://stackoverflow.com/questions/16378094/run-nodejs-event-loop-wait-for-child-process-to-finish

