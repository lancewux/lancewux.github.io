<h1 align="center"> Browser 对象</h1>

Window 对象
-

Window对象表示浏览器中打开的窗口。一个窗口对应一个window对象。如果文档包含框架（frame 或 iframe 标签），浏览器会为每个框架创建一个对应的 window 对象。

window对象的主要属性包括：

- document 对 Document 对象的只读引用。
- history 对 History 对象的只读引用。
- screen 对 Screen 对象的只读引用
- navigator 对 Navigator 对象的只读引用。
- location 用于窗口或框架的 Location 对象。
- name 设置或返回窗口的名称。

Document 对象
-

每个载入浏览器的 HTML 文档都会成为 Document 对象。Document 对象使我们可以从脚本中对 HTML 页面中的所有元素进行访问。

主要属性包括：

- body 提供对 <body> 元素的直接访问。
- cookie 设置或返回与当前文档有关的所有 cookie。
- domain 返回当前文档的域名。
- title 返回当前文档的标题。
- URL 返回当前文档的 URL。

主要对象方法：

- getElementById() 返回对拥有指定 id 的第一个对象的引用。
- getElementsByName() 返回带有指定名称的对象集合。
- getElementsByTagName() 返回带有指定标签名的对象集合。
- createElement() 创建元素节点
- createTextNode() 创建文本节点
- write() 向文档写 HTML 表达式 或 JavaScript 代码。

Element 对象
-

从HTML DOM Document 对象可以获得HTML DOM Element 对象。Element 对象表示 HTML 元素。 Element 对象可以拥有类型为元素节点、文本节点、注释节点的子节点。

在 HTML DOM （文档对象模型）中，每个部分都是节点。文档本身是文档节点。所有 HTML 元素是元素节点。所有 HTML 属性是属性节点。HTML 元素内的文本是文本节点。注释是注释节点。推测所有节点对象都继承了同一个节点超类。

主要属性：

- parentNode 父节点
- childNodes 返回元素子节点的 NodeList。不是后代节点。元素中的换行符和文本也会被当作文本子节点。
- firstChild 首个子节点，一般是回车符文本节点
- lastChild 最后一个子节点，一般是回车符文本节点
- nextSibling 位于相同节点树层级的下一个节点，一般是回车符文本节点
- previousSibling 位于相同节点树层级的前一个元素，一般是回车符文本节点
- nodeType 节点类型，有12种值，1为元素节点，2为属性节点，3为文本节点
- tagName
- innerHTML
- innerText


主要对象方法：

- appendChild(node) 向元素添加新的子节点，作为最后一个子节点。添加到页面中的节点仍然可以用node变量访问，因为node是引用类型。
- insertBefore(newItem,existingItem) 在指定的已有子节点之前插入新的子节点。
- removeChild(node) 从元素中移除子节点
- replaceChild(newnode,oldnode) 替换元素中的子节点。
- cloneNode(deep) 克隆元素。克隆节点及其后代，deep为true时还克隆属性。
- isEqualNode(node) 检查两个元素是否相等。包括类型，属性，后代元素等
- isSameNode(node) 检查两个元素是否是相同的节点。 效果类似于‘===’操作符。
- compareDocumentPosition(node) & 16 判断node是否为元素的后代元素（firefox支持）
- contains(node) 判断node是否为元素的后代元素（大部分浏览器支持）
- hasChildNodes() 是否拥有子节点
- getAttribute(attributename) 获取属性值
- setAttribute(attributename,attributevalue) 设置属性值
- getAttributeNode(attributename) 返回指定的属性节点
- querySelector("css selector") 返回匹配指定 CSS 选择器元素的第一个子元素
- querySelectorAll("css selector") 返回匹配指定 CSS 选择器元素的第一个所有子元素

```html
		<div id="div" class="red cool" style="position:relative">
			<p id="p1" style="position:absolute;top:80px;">para 1</p>
			<p id="p2">para 2</p>
			<div id="div1" >
				<p id="p3" >para 3</p>
			</div>
		</div>
		<script>
			var elDiv = document.getElementById('div');
			var elP1 = document.getElementById('p1');
			var elP1c = elDiv.childNodes[1];
			var elP1n = elP1.cloneNode(true); //深拷贝，拷贝后代元素
			console.log(elP1.isSameNode(elP1c)); //true 说明element也属于node类型
			console.log(elP1.isEqualNode(elP1n)); //true 深复制的元素是相等的
			console.log(elP1.isSameNode(elP1n)); //false 深复制的元素是一个副本，并不是原来的元素
			console.log(elDiv.contains(elP1)); //true 是后代元素，与渲染位置无关
			console.log(elDiv.compareDocumentPosition(elP1) & 16);  //16 是后代元素
			console.log(elP1.firstChild.nodeType);  //3 是后代元素
			console.log(elDiv.querySelectorAll('p').length); //3
			console.log(document.querySelector('#div>p#p1').style.position); //'absolute'
			var elA = document.createElement('a');
			elDiv.appendChild(elA);  //添加时没有新建副本，把elA节点添加进去了，elA就是页面上新添加元素的索引
			elA.innerText = 'ddf'; //设置的文本会更新到页面上
		</script>
```

Cookies
-

cookie 是存储于客户端的变量。每当同一台计算机通过浏览器请求某个页面时，就会发送这个 cookie给服务器。

```html
		<input type="text" name="username" id="js-ipt-username" />
		<input type="button" id="js-btn-setname" value="set username in cookie" />
		<p id="js-p-showname"></p>
		<script>
			var elP = document.getElementById('js-p-showname');
			var elName = document.getElementById('js-ipt-username');
			var elBtnCookie = document.getElementById('js-btn-setname');
			elP.innerText = 'username: ' + getusername();
			if(elBtnCookie.addEventListener) {
				elBtnCookie.addEventListener('click', clickHandler);
			} else {
				elBtnCookie.attachEvent('onclick', clickHandler);
			}
			function clickHandler(event) {
				var name = elName.value;
				var exdate = new Date();
				exdate.setDate(exdate.getDate() + 1);
				document.cookie = 'username=' + name + ';expires=' + exdate.toGMTString();
				console.log(exdate.toGMTString());
				elP.innerText = 'username: ' + getusername();
			}
			function getusername() {
				var name = ''
				if(document.cookie.length > 0) {
					console.log(document.cookie);
					var start = document.cookie.indexOf('username=');
					if(start != -1) {
						start = start + 'username='.length;
						var end = document.cookie.indexOf(';', start);
						if(end == -1) {
							end = document.cookie.length;
						}
						name = document.cookie.substring(start, end);
					}
				}
				return name;
			}	
		</script>
```

<input type="text" name="username" id="js-ipt-username" />
<input type="button" id="js-btn-setname" value="set username in cookie" />
<p id="js-p-showname"></p>
<script>
	var elP = document.getElementById('js-p-showname');
	var elName = document.getElementById('js-ipt-username');
	var elBtnCookie = document.getElementById('js-btn-setname');
	elP.innerText = 'username: ' + getusername();
	if(elBtnCookie.addEventListener) {
		elBtnCookie.addEventListener('click', clickHandler);
	} else {
		elBtnCookie.attachEvent('onclick', clickHandler);
	}
	function clickHandler(event) {
		var name = elName.value;
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + 1);
		document.cookie = 'username=' + name + ';expires=' + exdate.toGMTString();
		console.log(exdate.toGMTString());
		elP.innerText = 'username: ' + getusername();
	}
	function getusername() {
		var name = ''
		if(document.cookie.length > 0) {
			console.log(document.cookie);
			var start = document.cookie.indexOf('username=');
			if(start != -1) {
				start = start + 'username='.length;
				var end = document.cookie.indexOf(';', start);
				if(end == -1) {
					end = document.cookie.length;
				}
				name = document.cookie.substring(start, end);
			}
		}
		return name;
	}	
</script>

