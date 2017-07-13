<h1 align="center"> CSS Position</h1>

CSS position 属性
-

通过使用 position 属性，我们可以选择 4 种不同类型的定位，这会影响元素框生成的方式。

网页是有z轴的，所有元素默认在z-index：0这一层，也就是文档流。设置position为relative、absolute或fixed都可以让元素激活left、top、right、bottom和z-index属性。

#### static

元素框正常生成。块级元素生成一个矩形框，作为文档流的一部分，行内元素则会创建一个或多个行框，置于其父元素中。

#### relative

保留其在文档流占有的空间。元素框从文档流层浮起，即z-index > 0，并相对其在文档流中保留的空间的位置进行定位。

#### absolute

删除其在文档流占有的空间。元素框从文档流层浮起，即z-index > 0，并相对于最近的一个浮起的祖先元素定位。

#### fixed

删除其在文档流占有的空间。元素框从文档流层浮起，即z-index > 0，并相对于视窗定位。

CSS float 属性
-

设置元素的float属性，将使其脱离文档流，保留其在文档流占有的空间，其该空间和浮起的元素框具有相同的定位。display属性都将变成block，其行为表现有点像inline-block，即不会占据整行的块级元素。

浮动的框可以向左或向右移动，直到它的外边缘碰到包含框或另一个浮动框的边框为止。

由于float元素的行框被缩短了，腾出来的空间就会相邻的元素占据，形成其他元素围绕float框的效果。可以给其他元素框设置clear属性，clear 属性的值可以是 left、right、both 或 none，它表示框的哪些边不应该挨着浮动框。

居中
-

### 水平居中：
 
#### style="text-align: center;"

设置该元素内的文本元素水平居中，不影响该元素及其内部非文本元素的对齐方式。

#### align="center"

设置该元素内的所有元素水平居中，不影响该元素的对齐方式。

#### style="margin: 0 auto;"

设置该元素水平居中，不影响该元素的内部元素的对齐方式。

### 垂直居中：

#### style="line-height: 100px;"

要求其父元素的height也是100px，实现单行文本的垂直居中。

#### style="display: table-cell; vertical-align: middle;"

设置其子元素垂直居中，不影响该元素的对齐方式。

#### style="position: absolute; width: 100px; height: 80px; left: 50%; top: 50%; margin-left: -50px; margin-top: -40px;"

父元素设置style="position: relative; "; 能实现任何元素的垂直居中。
