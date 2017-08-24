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

console.log(null == undefined); //true
console.log(null == false); //false


```

