<h1 align="center"> 面试题 </h1>


tecent
-

知道服务器端渲染和同构么（ssr）

知道服务器端离线缓存么（pwa service worker 可编程的网络代理）

在性能优化方面有哪些实践经验，有考虑过3g和4g的情况么

比较一下vue和react

谈一下内存泄露，在nodejs中怎么实时查看内存

熟悉es6么

为什么要使用微服务

单页面应用的路由是怎么实现的，怎么控制浏览器的url

在nodejs的多进程中，怎么知道一个进程是否僵死

alibaba
-

列举你熟悉的设计模式，设计模式中的控制反转是什么意思，怎么实现观察者模式

有两个实例a和b，在a中new了b的，这样a就强依赖于b，怎么实现a和b的解耦

淘宝页面是由多个项目组合作开发的，页面有哪些部分是不确定的，每部分的功能也是不确定的，怎么样提高合作开发效率

淘宝页面功能很复杂，一个功能会依赖多个模块，被依赖的模块又会依赖其他的模块，当页面出错的时候，怎么快速定位到是集群中的哪个服务器的哪个模块导致的错误

知道负载均衡么，设计一个负载均衡的方法，可以方便的扩容和缩容。

从app层面设计扩容和缩容，满足什么条件的app是可以扩容的。

nodejs怎么利用服务器的多核资源。

看过eggjs的源码么，在eggjs的controller中调用一个service，原理是怎么实现的，怎么绑定controller中的this指针，eggjs中的进程间通信是怎么实现的。

如果让你设计一个推荐算法，说一说你的设计思路。怎么判断一个推荐算法好不好。

nodejs内存泄露有哪些情况，怎么判断内存是否泄露。


杂项
-

### 浏览器输入url到整个页面显示出来经历的过程

1. 输入地址
2. 浏览器查找域名的 IP 地址
3. 这一步包括 DNS 具体的查找过程，包括：浏览器缓存->系统缓存->路由器缓存...
4. 浏览器向 web 服务器发送一个 HTTP 请求
5. 服务器的永久重定向响应（从 http://example.com 到 http://www.example.com）
6. 浏览器跟踪重定向地址
7. 服务器处理请求
8. 服务器返回一个 HTTP 响应
9. 浏览器显示 HTML
10. 浏览器发送请求获取嵌入在 HTML 中的资源（如图片、音频、视频、CSS、JS等等）
11. 浏览器发送异步请求

Reference
-

<a href="http://igoro.com/archive/what-really-happens-when-you-navigate-to-a-url/" target="_blank">What really happens when you navigate to a URL</a>


