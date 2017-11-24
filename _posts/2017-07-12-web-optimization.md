<h1 align="center"> 前端优化方法 </h1>

请求资源
-

#### 合并请求

减少浏览器对服务器发起的请求数，从而减少在发起请求过程中花费的时间。

#### 开启KeepAlive

开启KeepAlive能够减少浏览器与服务器建立连接的次数，从而节省建立连接时间。但是开启KeepAlive也会使服务器负载变大，也更加容易遭受攻击，实际项目中需要权衡利弊。

#### 域名拆分

增加浏览器下载的并行度，让浏览器能同时发起更多的请求

#### Minify

Minify指的是将JS和CSS等文本文件进行最小化处理，一般对于CSS来说就是去除空格去除换行去除注释等，对于JS，除了上述方法外，还可以进行变量名替换，将长变量名替换为短变量名。

#### 开启Gzip

Gzip是一种压缩技术，可以将资源在服务端进行压缩，然后发送给浏览器后再进行解压，这种方式会降低传输大小，提高网页加载性能。

#### 减少Cookie的大小

Cookie里面别塞那么多东西，因为每个请求都得带着他跑

#### 使用CDN

CDN通过部署在不同地区的服务器来提高客户的下载速度

#### 缓存ajax

比如添加Expires 或Cache-Control报文头，配置ETags。Etag简单来说是通过一个文件版本标识使得服务器可以轻松判断该请求的内容是否有所更新，如果没有就回复304 (not modified)，从而避免下载整个文件。

#### 缓存图片和脚本

使用html5的应用缓存可缓存图片和脚本

#### 避免重定向

重定向会发出多次http请求，浪费时间

#### 避免404

比如外链的css或者js文件出现问题返回404时，会破坏浏览器对文件的并行加载。并且浏览器会把试图在返回的404响应内容中找到可能有用的部分当作JavaScript代码来执行。

页面
-

#### 减少DOM元素数量

#### 减少DOM元素的修改（重绘和回流）

网页中元素过多对网页的加载和脚本的执行都是沉重的负担

#### 延迟加载

对不需要立即展示的内容实行懒加载。

#### 提前加载

对页面中可能要访问的资源进行预加载

Javascript
-

#### 将脚步置底

#### 使用外部脚步

#### 减少dom访问

#### 使用事件代理

CSS
-

#### 将样式表置顶

#### 避免CSS表达式

图片
-

#### 缩小favicon.ico并缓存

#### 不在html中缩放图片

我们常见的图片格式有JPEG、GIF、PNG。基本上，内容图片多为照片之类的，适用于JPEG。而修饰图片通常更适合用无损压缩的PNG。而GIF基本上除了GIF动画外不要使用。且动画的话，也更建议用video元素和视频格式，或用SVG动画取代。除了这些格式之外，Chrome、新版Opera、Android 4+支持WebP格式，IE 9+、IE mobile 10+支持JPEG XR。这两个新格式都支持无损和有损压缩，都具有更良好的压缩比。当然这需要为不同的浏览器返回不同的图片，增加了开发成本，也增加存储成本。不过你省了流量或者相同流量下改善了图片质量，提升了用户体验。你会如何取舍呢？对了，别忘了使用优秀的图片编码器及合适的参数。好的图片编码器，尤其是有损图片格式的编码器，能通过算法或手动调整，获得更高的压缩比。


gzip
-

Gzip是一种流行的文件压缩算法。当应用Gzip压缩到一个纯文本文件时，大约可以减少70％以上的文件大小。

服务器用Gzip压缩算法对发布的网页内容进行压缩，然后传输到客户端浏览器，浏览器解压缩后进行展示。降低了网络传输的字节数，加快了网页加载的速度。

辨别是否使用了gzip压缩的方法是看response headers里面有没有‘Content-Encoding:gzip’字段。

使用gzip的方法，首先是在http请求里面加入‘Accept-Encoding:gzip, deflate, br’字段，然后设置服务器配置（这里一nginx为例）

```
gzip on;
gzip_min_length 1k;
gzip_buffers 4 16k;
#gzip_http_version 1.0;
#gzip_comp_level 2;
gzip_types text/plain application/x-javascript application/javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
gzip_vary on;
gzip_disable "MSIE [1-6]\.(?!.*SV1)";
```

gzip压缩的原理是首先使用LZ77算法的一个变种进行压缩，然后再使用Huffman编码。

#### LZ77算法

如果文件中有两块相同的内容的话，就可以用前一块的位置和大小来替换后一块的内容。

源字符串‘qqww23456aqww2345w’用（距离，长度）替换后为‘qqww23456a(9,7)w‘，总长度变小了。

LZ77使用滑动窗口，一个字节一个字节地向后滑动寻找匹配串。

#### huffman

对文件进行重新编码，思路是出现频率高的字符用短编码，出现频率低的字符用长编码，这样总的编码长度就变小了。

首先根据字符的出线频率建立huffman树，出现频率最高的字符为根节点。然后依据huffman树对字符进行huffman编码，所有父节点到左子节点的路径标为0，所有父节点到右子节点的路径标为1，把从根节点到叶子节点的路径上的0和1的序列作为这个节点的huffman编码。

文件压缩：

读文件，统计每个字符出现的次数。根据次数建立huffman树，得到每个字符的huffman编码。把文件中的每个符号替换成对应的huffman编码，并把每个字符出现次数信息保存在压缩文件中。

解压缩：

获取压缩文件中每个字符出现次数信息，依据这些信息建立huffman树，得到每个字符的huffman编码，把压缩文件中的huffman编码换成对应的字符。

优化webapp的首页加载速度
-

使用codesplitting按路由划分模块来拆分代码。首页文件，提取css，提取vendor.js,manifest.js

使用uglify压缩 minify 混淆 js css文件

使用gzip压缩来压缩html css js等文件

使用压缩工具压缩图片，使用內联图片 <a href="http://www.tuhaokuai.com/" target="_blank">图好快</a>

禁用etag

使用缓存Cache-Control，If-Modified-Since

使用cdn

使用域名拆分 2到4个比较合适

把css文件放在顶部，js文件放在底部。

避免css表达式

减少DNS查询，比如增加TTL值

删除无用脚本和重复脚本

减少重定向和404

开启KeepAlive

使用预渲染 <a href="https://github.com/chrisvfritz/prerender-spa-plugin" target="_blank">prerender-spa-plugin</a>

使用同构 <a href="https://ssr.vuejs.org/en/" target="_blank">Vue.js Server-Side Rendering</a>

#### js优化相关

动态创建script元素来加载js脚步，并添加到head标签，这样js文件的下载和执行都不会阻塞页面的其它资源。

一个执行环境的作用域链的节点通常包括可变对象，活动对象，全局对象。尽量不要使用 with 和try catch，会改变作用域链。

多次查找成员变量时缓存成员变量。

插入元素时使用innerHTML代替createElement，或者使用cloneNode克隆元素。

用局部变量缓存html集合的属性，因为每次查询属性时，都会重新查询文档生成html集合。

使用children代替childNodes，因为children不包含空白文档元素。

使用querySelector代替getElementById，因为返回的不是html集合，不对应实时的文档结构。

浏览器生产DOM树和渲染数两种数据结构。要最小化重排reflow和重绘repaint。

大多数浏览器通过队列化修改并批量执行来优化重排reflow过程。避免不合理使用offsetTop，getComputeStyle等属性和方法频繁强制浏览器刷新队列。

用createDocumentFragment()来批量修改dom。

执行动画的元素用绝对定位使其脱离文档流，动画结束后再恢复定位，减少其他元素的重排。

使用事件委托。

优化正则表达式，减少查找时的回溯。

使用函数节流来处理resize、scroll等事件，使用分时函数来分割大任务。

使用位操作，使用原生方法，比如Math对象的成员函数。



### Reference

<a href="https://www.zhihu.com/question/40505685" target="_blank">前端性能优化手段都有哪些</a>

<a href="http://www.cnblogs.com/lei2007/archive/2013/08/16/3262897.html" target="_blank">前端性能优化----yahoo前端性能团队总结的35条黄金定律</a>

<a href="http://blog.csdn.net/grandpang/article/details/51329289" target="_blank">前端性能优化的总结</a>

<a href="http://www.360doc.com/content/11/0218/15/2150347_94086443.shtml" target="_blank">gzip原理与实现</a>

<a href="https://www.cnblogs.com/wizcabbit/p/web-image-optimization.html" target="_blank">Web性能优化：图片优化</a>

<a href="https://developers.google.com/web/fundamentals/performance/rendering/?hl=zh-cn" target="_blank">渲染性能 60fps</a>




