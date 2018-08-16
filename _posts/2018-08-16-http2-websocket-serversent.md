
<h1 align="center"> Server Push </h1>

Server Push
-

HTTP/2 服务器推送（Server Push）允许服务器在浏览器请求之前将资源发送到浏览器。

Node.js v8.4+版本发布带来了体验版的HTTP/2，你可以自己通过设置参数--expose-http2启动。

Server-Sent Events
-

严格地说，HTTP 协议无法做到服务器主动推送信息。但是，有一种变通方法，就是服务器向客户端声明，接下来要发送的是流信息（streaming）。

也就是说，发送的不是一次性的数据包，而是一个数据流，会连续不断地发送过来。这时，客户端不会关闭连接，会一直等着服务器发过来的新的数据流，视频播放就是这样的例子。本质上，这种通信就是以流信息的方式，完成一次用时很长的下载。

SSE 就是利用这种机制，使用流信息向浏览器推送信息。它基于 HTTP 协议，目前除了 IE/Edge，其他浏览器都支持。

SSE 与 WebSocket 作用相似，都是建立浏览器与服务器之间的通信渠道，然后服务器向浏览器推送信息。

总体来说，WebSocket 更强大和灵活。因为它是全双工通道，可以双向通信；SSE 是单向通道，只能服务器向浏览器发送，因为流信息本质上就是下载。如果浏览器向服务器发送信息，就变成了另一次 HTTP 请求。

```
var source = new EventSource(url);
```

WebSocket
-

```
var ws = new WebSocket("wss://echo.websocket.org");

ws.onopen = function(evt) { 
  console.log("Connection open ..."); 
  ws.send("Hello WebSockets!");
};

ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
  ws.close();
};

ws.onclose = function(evt) {
  console.log("Connection closed.");
};
```


socket.io
-

webpack-dev-server将通过socket.io通知客户端更新


参考资料
-

<a href="https://github.com/molnarg/node-http2" target="_blank">nodejs http2 client</a>

<a href="https://socket.io/docs" target="_blank">Socket.IO</a>

<a href="http://www.ruanyifeng.com/blog/2017/05/server-sent_events.html" target="_blank">Server-Sent Events 教程</a>

<a href="http://www.ruanyifeng.com/blog/2017/05/websocket.html" target="_blank">WebSocket 教程</a>
