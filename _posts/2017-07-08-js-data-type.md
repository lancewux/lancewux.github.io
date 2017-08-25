<h1 align="center"> Javascript 数据类型</h1>

ES5有7种数据类型：字符串、数字、布尔、数组、对象、Null、Undefined

5 种原始类型（primitive type），即 Undefined、Null、Boolean、Number 和 String。

```javascript
console.log(typeof undefined); //'undefined'
console.log(typeof null); //'object'
console.log(typeof true); //'boolean'
console.log(typeof 1); //'number'
console.log(typeof 's'); //'string'
console.log(typeof [1]); //'object'
console.log(typeof {a: 1}); //'object'

var a;
console.log(a === undefined); //true
function fn() {}
console.log(fn()); //'undefined'
console.log(typeof b); //'undefined'
console.log(b); //'Uncaught ReferenceError'

```

'==' vs '==='
-

"==="叫做严格运算符，"=="叫做相等运算符。

#### 严格运算符的运算规则如下:

如果两个值的类型不同，直接返回false。

同一类型的原始类型的值（数值、字符串、布尔值）比较时，值相同就返回true，值不同就返回false。undefined 和 null 与自身严格相等。

两个复合类型（对象、数组、函数）的数据比较时，不是比较它们的值是否相等，而是比较它们是否指向同一个对象。

#### 相等运算符的运算规则如下:

比较相同类型的数据时，与严格相等运算符完全一样。

比较不同类型的数据时，先将数据进行类型转换，然后再用严格相等运算符比较。

原始类型的数据会转换成数值类型再进行比较。

对象（这里指广义的对象，包括数值和函数）与原始类型的值比较时，对象转化成原始类型的值，再进行比较。

undefined和null与其他类型的值比较时，结果都为false，它们互相比较时结果为true。

```javascript
console.log('' == '0'); //false
console.log('' == 0); //true
console.log('a' == 0); //false
console.log('0' == 0); //true
console.log(false == 'false'); //false
console.log(false == 0); //true
console.log(' \t\r\n ' == 0); //true

console.log([1] == [1]); //false

var x = 1;
var obj = { valueOf: function() { x = 2; return 0; } };
console.log(obj == 0, x) // true, 2

console.log(null == undefined); //true
console.log(null == false || undefined == false); //false

var b = null || undefined ? 1 : 2; //强制类型转换成boolean
console.log(b); //2
```

https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/common.md#%E7%B1%BB%E5%9E%8B%E5%88%A4%E6%96%AD
