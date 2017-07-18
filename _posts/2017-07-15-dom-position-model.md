<h1 align="center"> DOM 事件</h1>

宽度
-

clientHeight：

可视区域的高度，不包括边框。clientHeight = height + padding。

offsetHeight：

整型，单位像素。IE、Opera 认为 offsetHeight = clientHeight + 滚动条 + 边框。  
NS、FF 认为 offsetHeight 是网页内容实际高度，可以小于 clientHeight。

style.height：

字符串，包括单位px，高度值等于offsetHeight，可读写。

scrollHeight：

IE、Opera 认为 scrollHeight 是网页内容实际高度，可以小于 clientHeight。  
NS、FF 认为 scrollHeight 是网页内容高度，不过最小值是 clientHeight。

offsetTop

距离上方或上层控件的位置，整型，单位像素。

style.top

字符串，包括单位px，值等于offsetTop，可读写。

scrollTop

被卷起的高度，整型，单位像素，可读写。


<p align="center"><img src="/images/posts/2017-07-15/position.gif" /></p>

示例：检测鼠标所在的块及滚动到了那一个块。

```html
		<div id="js-div-outer" style="width: 400px; height: 200px; border: 1px solid black; overflow-y: scroll; position: relative; margin: 0 auto;">
			<div id="js-div-inner1" style="background-color: gray; height: 300px; border: 1px solid black;"></div>
			<div id="js-div-inner2" style="background-color: blue; height: 200px; border: 1px solid black;"></div>
			<div id="js-div-inner3" style="background-color: gray; height: 300px; border: 1px solid black;"></div>
		</div>
		<p id="js-p" style="margin: 0 auto; width: 200px;">top is inner 1</p>
		<script>
			var elP = document.getElementById('js-p'),
				elDiv = document.getElementById('js-div-outer'),
				elDiv1 = document.getElementById('js-div-inner1'),
				elDiv2 = document.getElementById('js-div-inner2'),
				elDiv3 = document.getElementById('js-div-inner3')
				dh1 = elDiv1.offsetHeight,
				dh2 = elDiv2.offsetHeight,
				dh3 = elDiv3.offsetHeight
				cur = 1
				lockmove = 0
				lockscroll = 0;
			if(elDiv.addEventListener) {
				elDiv.addEventListener('mousemove', moveHandler);
				elDiv.addEventListener('scroll', scrollHandler);
			} else {
				elDiv.attachEvent('onmousemove', moveHandler);
				elDiv.attachEvent('onscroll', scrollHandler);
			}
			function moveHandler(event) {
				if(lockmove === 0) { //判断是否锁住，没锁住就添加延时处理函数
					lockmove = 1;
					var e = event || window.event;
					var target = e.target || e.srcElement;
					setTimeout(function() {
						lockmove = 0;
						console.log(target.getAttribute('id'));
					}, 100);
				}
			}
			function scrollHandler(event) {
				if(lockscroll === 0) { //判断是否锁住，没锁住就添加延时处理函数
					lockscroll = 1;
					setTimeout(function() {
						var scrollTop = elDiv.scrollTop;
						var tmp;
						if(scrollTop <= dh1) {
							tmp = 1;
						} else if(scrollTop <= dh1 + dh2) {
							tmp = 2;
						} else {
							tmp = 3;
						}
						if(tmp !== cur) {
							cur = tmp;
							elP.innerText = 'top is inner ' + cur;
						}
						lockscroll = 0;
					}, 200);
				}
			}
		</script>
```

示例：拖拽li元素。

```html
		<ul id="js-ul" style="width: 400px;margin: 0 auto; border: 1px solid black;">
			<li style="background-color: gray; border: 1px dashed black; width: 200px;">item 1</li>
			<li style="background-color: gray; border: 1px dashed black; width: 200px;">item 2</li>
			<li style="background-color: gray; border: 1px dashed black; width: 200px;">item 3</li>
			<li style="background-color: gray; border: 1px dashed black; width: 200px;">item 4</li>
		</ul>
		<script>
			var elUl = document.getElementById('js-ul');
			var ismousedown = 0;
			var elDrag = null;
			if(elUl.addEventListener) {
				elUl.addEventListener('mousedown', mousedownHandler);
				elUl.addEventListener('mousemove', mousemoveHandler);
				elUl.addEventListener('mouseup', mouseupHandler);
			} else {
				elUl.attachEvent('onmousedown', mousedownHandler);
				elUl.attachEvent('onmousemove', mousemoveHandler);
				elUl.attachEvent('onmouseup', mouseupHandler);
			}
			function mousedownHandler(event) { //鼠标按下事件
				var e = event || window.event;
				var target = e.target || e.srcElement;
				if(target.tagName.toLowerCase() === 'li') {
					// 生成拷贝元素并插入到页面中
					var elCopy = target.cloneNode(true); //深拷贝元素
					elCopy.setAttribute('id', 'js-li-copy'); //设置id，便于索引
					elCopy.style.position = 'absolute'; //使元素浮，以便动态设置坐标
					elCopy.style.opacity = 0.7; //设置fierfox等透明度
					elCopy.style.filter = 'alpha(opacity:30)'; //设置IE的透明度
					ismousedown = 1; //设置状态位
					elUl.appendChild(elCopy); //li元素只能追加的ul元素下面
					setPosition(e, document.getElementById('js-li-copy')); 
					// 隐藏被拖拽元素
					target.style.display = 'none';
					// 保存被拖拽元素的索引
					elDrag = target;
				}
			}
			function mousemoveHandler(event) {
				if(ismousedown === 1) {
					var elCopy = document.getElementById('js-li-copy');
					if(elCopy) {
						var e = event || window.event;
						setPosition(e, elCopy); // 动态设置被拖拽元素的位置
					}
				}
			}
			function setPosition(e, elCopy) {
				var x = e.x, y = e.y;
				var liH = elCopy.offsetHeight, liW = elCopy.offsetWidth;
				elCopy.style.top = (y - liH / 2) + 'px';
				elCopy.style.left = (x - liW / 2) + 'px';
			}
			function mouseupHandler(event) {
				if(ismousedown === 1) {
					ismousedown = 0;
					var elCopy = document.getElementById('js-li-copy');
					if(elCopy) {
						var e = event || window.event;
						var target = e.target || e.srcElement;
						elUl.removeChild(elCopy); // 删除副本元素
						// 获取li元素
						var childs = elUl.childNodes;
						var childLis = [];
						for(var i = 0; i < childs.length; i++) {
							if(childs[i].tagName && childs[i].tagName.toLowerCase() === 'li') {
								childLis.push(childs[i]);
							}
						}
						// 判断被拖拽的元素插到哪个元素前面
						var y = e.y;
						var afterLi = null;
						for (var j = 0; j < childLis.length; j++) {
							var top = childLis[j].offsetTop;
							var mid = top + childLis[j].offsetHeight / 2;
							if(y >= top && y < mid) {
								afterLi = childLis[j];
								break;
							}
						}
						if(!afterLi) {
							if(y < childLis[0].offsetTop) {
								afterLi = childLis[0];
							}
						}
						// 插入元素
						elUl.insertBefore(elDrag, afterLi);
						elDrag.style.display = 'block';
					}
				}
			}
		</script>
```

示例：拖拽方块，方块间用svg斜线连接。

注意的问题是：
- svg里的元素是相对svg定位的，要把svg的left和top设置为0px，svg里面的坐标才会和窗口的坐标重合。
- 很难保证鼠标move和up事件的target一定会是拖拽的对象，所以用全局对象elDrag判断更合适。
- style.top和style.left都是带单位的，分别对应y轴和x轴。

```html
		<div id="js-div1" style="width:50px; height:50px;background-color:gray;position:absolute;z-index: 1;" align="center">
			<p>A</p>
		</div>
		<div id="js-div2" style="width:50px; height:50px;background-color:gray;position:absolute;z-index: 1;" align="center">
			<p>B</p>
		</div>
		<svg id="js-svg" width="100%" height="100%" style="position: absolute;">
			<line id="js-line" x1="100" y1="100" x2="300" y2="300" style="stroke:rgb(99,0,99);stroke-width:2"/>
		</svg>
		<script>
			var elDiv1 = document.getElementById('js-div1');
			var elDiv2 = document.getElementById('js-div2');
			var elSvg = document.getElementById('js-svg');
			var elLine = document.getElementById('js-line');
			var isDragging = false;
			var elDrag = null;
			//设置svg的起始位置，以便定位
			elSvg.style.top = '0px';
			elSvg.style.left = '0px';
			setPosition(elDiv1, 100, 100);
			setPosition(elDiv2, 300, 300);
			if(document.addEventListener) {
				document.addEventListener('mousedown', mousedownHandler);
				document.addEventListener('mousemove', mousemoveHandler);
				document.addEventListener('mouseup', mouseupHandler);
			} else {
				document.attachEvent('onmousedown', mousedownHandler);
				document.attachEvent('onmousemove', mousemoveHandler);
				document.attachEvent('onmouseup', mouseupHandler);
			}
			function mousedownHandler(event) {
				var e = event || window.event;
				var target = e.target || e.srcElement;
				if(!isDragging) {
					var id = target.getAttribute('id');
					if(id && (id == 'js-div1' || id == 'js-div2')) {
						isDragging = true;
						elDrag = target;
						setPosition(elDrag, e.x, e.y);
					}
				}
				
			}
			function mousemoveHandler(event) {
				var e = event || window.event;
				if(isDragging) { 
					setPosition(elDrag, e.x, e.y);
					//这里用elDrag来判断，因为e.target不一定会是elDrag
					if(elDrag.getAttribute('id') == 'js-div1') {
						setLineStart(e.x, e.y);
					} else {
						setLineEnd(e.x, e.y);
					}
				}
			}
			function mouseupHandler(event) {
				var e = event || window.event;
				var target = e.target || e.srcElement;
				if(isDragging) {
					//这里用elDrag来判断，因为e.target不一定会是elDrag
					var id = elDrag.getAttribute('id');
					isDragging = false;
					elDrag = null;
					if(id == 'js-div1') {
						setLineStart(e.x, e.y);
					} else {
						setLineEnd(e.x, e.y);
					}
				}
			}
			function setPosition(el, x, y) {
				if(el) {
					el.style.top = (y - 25) + 'px'; //注意top对应y
					el.style.left = (x - 25) + 'px';
				}
			}
			function setLineStart(x1, y1) {
				elLine.setAttribute('x1', x1);
				elLine.setAttribute('y1', y1);
			}
			function setLineEnd(x2, y2) {
				elLine.setAttribute('x2', x2);
				elLine.setAttribute('y2', y2);
			}
		</script>
```

### Reference

<a href="http://www.jb51.net/article/25935.htm">js中top、clientTop、scrollTop、offsetTop的区别</a>

<a href=""></a>

