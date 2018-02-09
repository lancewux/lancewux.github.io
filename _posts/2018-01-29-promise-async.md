<h1 align="center"> Promise and Async</h1>

Promise
-

```
Promise.resolve(1).then(null, res => {
    console.log('reject', res);
}).then(res => {
    console.log('resolve', res);
})
// resolve 1

Promise.reject(1).then(res => {
    console.log('resolve', res);
}).then(null, res => {
    console.log('reject', res);
})
// reject 1

Promise.reject(1).then(res => {
    console.log('resolve', res);
}).catch(res => {
    console.log('catch', res);
})
// catch 1

```

```
Promise.resolve(1).then(res => {
    console.log('resolve1', res);
}).then(res => {
    console.log('resolve2', res);
})
// resolve1 1
// resolve2 undefined


Promise.resolve(1).then(res => {
    return 2;
}).then(res => {
    console.log('resolve2', res);
})
// resolve2 2

Promise.reject(1).then(null, res => {
    return 2;
}).then(res => {
    console.log('resolve2', res);
})
// resolve2 2

```
Reference
-

<a href="https://www.javaworld.com/article/3095406/android/android-studio-for-beginners-part-1-installation-and-setup.html" target="_blank">Android Studio for beginners</a>


