<h1 align="center"> cookie、 sessionStorage 、localStorage之间的区别和使用</h1>

详解
-

#### cookie

存储在用户本地终端上的数据。可以设置其过期时间，会被同源的http请求携带。一般用来进行session跟踪
，比如判断用户是否已登陆。

#### Web Storage

HTML5 提供了两种在客户端存储数据的新方法：sessionStorage和localStorage。两者都是仅在客户端（即浏览器）中保存，不参与和服务器的通信。localStorage是没有时间限制的存储，创建后一直存在。sessionStorage是针对一个session的数据存储，对应的窗口关闭后，就会被销毁。

#### 带来的好处有：

- 减少网络流量：把数据保存在本地，就不用向服务器请求数据了。
- 快速显示数据：从本地读数据比通过网络从服务器获得数据快得多。

异同
-

#### 共同点

都保存在浏览器端，都是同源的。

#### 不同点

cookie会被同源的http请求携带，参与服务器通信。而sessionStorage和localStorage不会自动把数据发给服务器。

存储大小限制也不同。cookie数据不能超过4k，因为每次http请求都会携带cookie，所以cookie只适合保存很小的数据，如会话标识。sessionStorage和localStorage 虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大。

数据有效期不同。cookie在设置的过期时间之前一直有效，即使窗口或浏览器关闭。sessionStorage仅在当前浏览器窗口关闭前有效。alStorage始终有效，即使窗口或浏览器关闭。

作用域不同。cookie和localStorage可以在同源窗口中共享，sessionStorage只对当前的浏览器窗口有效。


### Reference

<a href="http://blog.csdn.net/you23hai45/article/details/49052251">请描述一下 cookies，sessionStorage 和 localStorage 的区别</a>
