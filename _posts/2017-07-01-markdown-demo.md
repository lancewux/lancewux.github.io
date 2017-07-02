
单个回车
视为空格。

连续回车

才能分段。

行尾加两个空格，这里->  
即可段内换行。

*这些文字显示为斜体*

**这些文字显示为粗体**

行的开头空4个空格，表示程序代码，例如： markdown preview

C#:

    //这里显示一些代码，在正文显示中会自动识别语言，进行代码染色，这是一段C#代码
    public class Blog
    {
         public int Id { get; set; }
         public string Subject { get; set; }
    }

Python:

    keywords = ["dsaa","Asd","sadc","Gdfd","gdfdd","gaf","gabdddddd","eg"]
    print dict([(i[0],list(i[1])) for i in groupby(sorted(keywords),lambda    x:x[0].lower())])

Javascript:
···javascript

    /**
     * nth element in the fibonacci series.
     * @param n >= 0
     * @return the nth element, >= 0.
     */
    function fib(n) {
        var a = 1, b = 1;
        var tmp;
        while (--n >= 0) {
            tmp = a;
            a += b;
           b = tmp;
        }
        return a;
    }

    document.write(fib(10));
```

    >表示引用文字内容。

#表示这是一级标题

##表示这是二级标题

###表示这是三级标题

……

###### 最小是六级标题


也可以这样表示大标题
=

这样表示小标题
-

---
上面是一条分隔线


- 这是无序列表项目
- 这是无序列表项目
- 这是无序列表项目

两个列表之间不能相邻，否则会解释为嵌套的列表

1. 这是有序列表项目
2. 这是有序列表项目
3. 这是有序列表项目

下面这个是嵌套的列表

- 外层列表项目
 + 内层列表项目
 + 内层无序列表项目
 + 内层列表项目
- 外层列表项目

直接把一个URL显示为超级连接：

也可以这样：[图灵社区](http://www.ituring.com.cn)

图像和链接非常类似，区别在开头加一个惊叹号： ![这是一个Logo图像](http://www.turingbook.com/Content/img/Turing.Gif)

此外，还可以以索引方式把url都列在文章的最后，例如这样：

[图灵社区][1]
![图灵社区Logo][2]

[1]:http://www.ituring.com.cn
[2]:http://www.ituring.com.cn/Content/img/Turing.Gif

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

|第一列|第二列|第三列|
|:-:|:-|-:|
|第一列是居中的|第二列是居左的|第三列是居右的|




