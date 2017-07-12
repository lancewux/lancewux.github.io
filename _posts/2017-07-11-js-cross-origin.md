<h1 align="center"> Javascript 跨域问题</h1>

JavaScript出于安全方面的考虑，不允许跨域调用其他页面的对象。只要协议、域名、端口有任何一个不同，都被当作是不同的域。

JSONP跨域
-

在JS中，不能用XMLHttpRequest跨域请求数据，但是可以在页面上跨域请求JS脚本文件，JSONP就是利用这个特性来实现的。

http://www.wuliang-hwtrip.com/要向http://192.168.204.49/请求数据，可以在页面上插入一个script标签，src设置为请求数据的url，同时传递一个callback参数，即处理请求数据的回调函数。由于请求的是JS文件，后台返回的必须是可执行的JS代码。最终成功跨域请求数据。

```html
		<script>
			function handle(data) {
				console.log(data); //["a", "b", "c"]
			}
		</script>
		<script src="http://192.168.204.49/~wuliang/Webtest/data.php?callback=handle"></script>
```

data.php:

```php
		<?php
			$callback = $_GET['callback'];
			$data = array('a', 'b', 'c');
			echo $callback.'('.json_encode($data).')';
		?>
```

Jquery的JSONP使用的就是上面的原理，但是它会动态的创建script标签，自动生成全局callback函数，获取数据后自动销毁函数和标签。

document.domain + iframe (主域相同时才能使用)
-

浏览器都有一个同源策略，浏览器中不同域的框架之间是不能进行js的交互操作的。可以把需要通信的页面的document.domain改成相同的域名，比如把"http://example.com/get.html"和"http://www.example.com/data.html"的document.domain都改成"example.com"。这样就可以跨域通信了。注意，只能把document.domain设置成自身或更高一级的父域，且主域必须相同。所以这种方法只适用于主域相同，而子域不同的跨域。


http://www.example.com/get.html：

```html
		<iframe id="iframe" src="http://example.com/data.html" onload="test()"></iframe>
		<script>
			function test() {
				var iframe = document.getElementById('iframe');
				var win = iframe.contentWindow; //能获取window对象，但其方法和属性基本不可用
				console.log(win); //window
				console.log(win.document); //跨域错误
			}
		</script>
```

在get.html和data.html都设置domain为‘example.com’，就能解决跨域问题了。

```html
		<iframe id="iframe" src="http://example.com/data.html" onload="test()"></iframe>
		<script>
			document.domain = "example.com"; // 设置domain
			function test() {
				var iframe = document.getElementById('iframe');
				var win = iframe.contentWindow; //能获取window对象
				console.log(win); //window
				console.log(win.document); //document
			}
		</script>
```

window.name + iframe 
-

window对象有个name属性，在一个窗口(window)的生命周期内,窗口载入的所有的页面都共享同一个window.name。可以在a.com/get.html中创建一个隐藏的iframe来载入b.com/data.html页面，data.html把数据写入window.name，onload事件后马上使iframe的跳到本地a.com/proxy.html, get.html读出proxy.html的window.name，从而实现跨域访问data.html的数据。

```html
		<iframe id="proxy" src="http://b.com/data.html" style="display:none" onload="getData()"></iframe>
		<script>
			function getData() {
				var iframe = document.getElementById('proxy');
				iframe.src = 'proxy.html';
				iframe.onload = function() {
					console.log(iframe.contentWindow.name);
				}
			}
		</script>
```

window.postMessage（HTML5）
-

window.postMessage(message,targetOrigin)方法是html5新引进的特性，可以使用它来向其它不同源的window对象发送消息。message表示要发送的字符串消息，targetOrigin表示用来限定接收消息的window对象所在的域，如果不想限定域，可以使用通配符 * 。接收消息的window对象，通过监听自身的message事件来获取消息，消息内容储存在该事件对象的data属性中。

```html
		<iframe id="iframe" src="http://192.168.204.49/~wuliang/Webtest/search.html" onload="test()"></iframe>
		<script>
			function test() {
				var iframe = document.getElementById('iframe');
				var win = iframe.contentWindow;
				win.postMessage('message by post', '*');
			}
		</script>
		</script>
```

search.html:

```html
		<script>
            window.onmessage = function(e) {
                e = e || event;
                console.log(e.data); //'message by post'
            }
        </script>
```

WebSockets（HTML5）
-

web sockets是一种浏览器的API，它的目标是在一个单独的持久连接上提供全双工、双向通信。由于同源策略对web sockets不适用，所以可以用它进行跨域访问。

```html
		<script>
            var socket = new WebSocket('ws://a.com') //协议为ws/wss对应http/https
			socket.send('message from client');
			socket.onmessage = function(e) {
				console.log(e.data);
			}
        </script>
```


CORS（后台设置Access-Control-Allow-Origin）
-

CORS是Cross-Origin Resource Sharing的简称，也就是跨域资源共享。如果a.com/get.html要访问b.com/data.php的数据，在data.php里设置http头Access-Control-Allow-Origin即可。

```php
		<?php
			response.setHeader('Access-Control-Allow-Origin', 'a.com');
		?>
```

### Reference

<a href="http://blog.csdn.net/joyhen/article/details/21631833">WebSockets</a>

