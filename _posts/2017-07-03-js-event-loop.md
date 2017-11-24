<h1 align="center"> Javascript 单线程和异步</h1>

　　作为浏览器脚本语言，JavaScript的主要用途是与用户互动，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定JavaScript同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

　　为了利用多核CPU的计算能力，HTML5提出WebWorker标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。

　　js选择了成为单线程的语言，所以它本身不可能是异步的，但js的宿主环境（比如浏览器，Node）是多线程的，宿主环境通过某种方式（事件驱动）使得js具备了异步的属性。

浏览器的Event Loop
-

　　An event loop is "an entity that handles and processes external events and converts them into callback invocations".

　　js是单线程语言，浏览器只分配给js一个主线程，同时分配堆（heap）和栈（stack），用来执行任务（函数）。js线程运行时，一次把同步任务（synchronous）压入执行栈中，依次执行，比如&lt;script&gt;标签内的同步语句和函数。

　　执行栈中的代码在执行时，会调用webAPIs来发出异步任务请求，这些任务主要包括网络请求，定时器和事件监听等，浏览器会为其分配对应的线程来处理这些任务，比如http请求线程，浏览器定时触发器线程，浏览器事件触发线程。当这些线程执行完任务时，就会往回调队列中添加一个事件。

　　当执行栈中的代码执行完毕时，主线程就会去读取"回调队列"里的事件，依次把那些事件所对应的回调函数压入栈中执行。然后再回到上一步。

<p align="center"><img src="/images/posts/2017-07-03/eventloop.png" /></p>

　　为了提高渲染效率，浏览器规定，界面渲染线程和主线程是互斥的，主线程执行任务时，浏览器渲染线程处于挂起状态。

### 定时器

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

Node.js也是单线程的Event Loop，但是它的运行机制不同于浏览器环境。

Node.js让你的代码运行在一个单线程之中， 然而，除了你的代码，其它的一切都是并行执行的

你不能并行执行任何代码，一个sleep函数也会阻塞服务1s。当这段代码运行时，Node.js不会响应客户端任何请求，因为只有一个线程来运行你的代码，另外，如果你执行cpu密集的任务，比如重设图像的大小，它也会阻塞所有请求。

```javascript
var now = new Date().getTime();
while(new Date().getTime() < now + 1000) {
    // do nothing
}
```
### libuv

libuv是一个跨平台的的事件驱动异步I/O模型库

<p align="center"><img src="/images/posts/2017-07-03/libuvdiagram.jpg" /></p>

上层主要包括 Network I/O， File I/O， DNS Ops.，User code。Network I/O是在非阻塞的Socket上运行的，都是在一个单线程里运行的，即event loop线程。file I/O是在thread pool上运行的，也就是说是通过多线程处理的。

不同平台用不同poll策略，epoll on Linux, kqueue on OSX and other BSDs, event ports on SunOS and IOCP on Windows。

libuv的event loop是意图用单线程运行的。也可以同时在不同的线程上运行多个event loop，但是event loop是非线程安全（not thread-safe）的。

<p align="center"><img src="/images/posts/2017-07-03/libuveventloop.jpg" /></p>

当Node.js时，先初始化event loop，运行提供的入口脚本，然后开始event loop。

注意，在poll for I/O的时候，整个loop会blocking一段时间，时间可能为零，可能为最近的定时器时间，或者无穷。

setImmediate(cb1())的cb1()是在Run check handles阶段执行的。

对于example 1，event loop 从update loop time进入，然后Run due timers，这个时候定时间有可能到时，也有可能没到时，取决于计算机的性能，所以console.log('timeout')不一定会运行。然后一直往下运行到Run check handles，运行console.log('immediate')。所以先后顺序不确定。

对于example 2，由于在setTimeOut()后多执行了一条语句，所以进入Run due timers阶段时，定时器一定会到时，会运行console.log('timeout')。

对于example 3，由于代码是在File I/O的callback里，可能在Call pending callbacks或Poll for I/O阶段执行，然后会进入Run check handles，执行console.log('immediate')，再进入Run due timers执行console.log('timeout')


example 1：

```javascript
setImmediate(() => {
  console.log('immediate');
});
setTimeout(() => {
  console.log('timeout');
}, 0);
// 顺序不确定
```
example 2：

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
example 3：

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

process.nextTick(cb3())与event loop所在的执行阶段无关，只要当前操作执行完成，就会执行cb3()。所以process.nextTick()的回调函数比setImmediate()和setTimeout()的回调函数都要先执行。

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

### Reference

<a href="http://www.ruanyifeng.com/blog/2014/10/event-loop.html" target="_blank">JavaScript 运行机制详解：再谈Event Loop</a>

<a href="http://blog.mixu.net/2011/02/01/understanding-the-node-js-event-loop/" target="_blank">Understanding the node.js event loop</a>

<a href="https://www.journaldev.com/7462/node-js-architecture-single-threaded-event-loop" target="_blank">Node JS Architecture – Single Threaded Event Loop</a>

<a href="https://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js" target="_blank">How do I get started with Node.js</a>

<a href="https://stackoverflow.com/questions/10680601/nodejs-event-loop" target="_blank">Nodejs Event Loop</a>

<a href="https://stackoverflow.com/questions/16378094/run-nodejs-event-loop-wait-for-child-process-to-finish" target="_blank">Run NodeJS event loop / wait for child process to finish</a>

<a href="https://www.quora.com/What-provides-the-event-loop-in-node-js-v8-or-libuv" target="_blank">What provides the event loop in node.js - v8 or libuv?</a>

<a href="http://docs.libuv.org/en/v1.x/design.html" target="_blank"> libuv Design overview</a>


