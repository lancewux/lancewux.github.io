<h1 align="center"> debounce throttle </h1>

去抖
-

去抖就是连续触发的回调只执行一次。原理是每次触发时都设置时间戳，如果没有定时器久设置定时器。定时器回调执行时会检测时间戳，如果时间间隔满足久执行原函数，否则重置定时器。

```
var debounce = function (func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function () {
        // 定时器设置的回调 later 方法的触发时间，和连续事件触发的最后一次时间戳的间隔
        // 如果间隔为 wait（或者刚好大于 wait），则触发事件
        var last = new Date().getTime() - timestamp;

        // 时间间隔 last 在 [0, wait) 中
        // 还没到触发的点，则继续设置定时器
        // last 值应该不会小于 0 吧？
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            // 到了可以触发的时间点
            timeout = null;
            // 可以触发了
            // 并且不是设置为立即触发的
            // 因为如果是立即触发（callNow），也会进入这个回调中
            // 主要是为了将 timeout 值置为空，使之不影响下次连续事件的触发
            // 如果不是立即执行，随即执行 func 方法
            if (!immediate) {
                // 执行 func 函数
                result = func.apply(context, args);
                // 这里的 timeout 一定是 null 了吧
                // 感觉这个判断多余了
                if (!timeout)
                    context = args = null;
            }
        }
    };
    // 嗯，闭包返回的函数，是可以传入参数的
    return function () {
        // 可以指定 this 指向
        context = this;
        args = arguments;

        // 每次触发函数，更新时间戳
        // later 方法中取 last 值时用到该变量
        // 判断距离上次触发事件是否已经过了 wait seconds 了
        // 即我们需要距离最后一次触发事件 wait seconds 后触发这个回调方法
        timestamp = new Date().getTime();

        // 立即触发需要满足两个条件
        // immediate 参数为 true，并且 timeout 还没设置
        // immediate 参数为 true 是显而易见的
        // 如果去掉 !timeout 的条件，就会一直触发，而不是触发一次
        // 因为第一次触发后已经设置了 timeout，所以根据 timeout 是否为空可以判断是否是首次触发
        var callNow = immediate && !timeout;

        // 设置 wait seconds 后触发 later 方法
        // 无论是否 callNow（如果是 callNow，也进入 later 方法，去 later 方法中判断是否执行相应回调函数）
        // 在某一段的连续触发中，只会在第一次触发时进入这个 if 分支中
        if (!timeout)
            // 设置了 timeout，所以以后不会进入这个 if 分支了
            timeout = setTimeout(later, wait);

        // 如果是立即触发
        if (callNow) {
            // func 可能是有返回值的
            result = func.apply(context, args);
            // 解除引用
            context = args = null;
        }

        return result;
    };
};

function print() {
    console.log('hello world');
}

window.onscroll = debounce(print, 1000);
window.onscroll = debounce(print, 1000, true);
```

throttle 节流
-

节流主要有两种方式

1.时间戳判断

记录上次执行的时间戳，然后每次触发 scroll 事件执行回调，回调中判断当前时间戳距离上次执行时间戳的间隔是否已经到达 1000ms，如果是，则执行，并更新上次执行的时间戳，否则不执行。

2.定时器

比如当 scroll 事件刚触发时，打印一个 hello world，然后设置个 1000ms 的定时器，此后每次触发 scroll 事件触发回调，如果已经存在定时器，则回调不执行方法，直到定时器触发，handler 被清除，然后重新设置定时器。

如果是一般的使用场景，则上面的两个方式大同小异，都可以应用，但是 underscore 考虑了高级配置，即可以选择是否需要响应事件刚开始的那次回调（配置 leading 参数），以及事件结束后的那次回调（配置 trailing 参数）。 还是以 scroll 举例，设置 1000ms 触发一次，并且不配置 leading 和 trailing 参数，那么 scroll 开始的时候会响应回调，scroll 停止后还会触发一次回调。如果配置 {leading: false}，那么 scroll 开始的那次回调会被忽略，如果配置 {trailing: false}，那么 scroll 结束的后的那次回调会被忽略。需要特别注意的是，两者不能同时配置！

要实现这种高级场景，两种方法同时使用。时间戳判断和定时器触发时互相重置状态，保证只有一个触发。

有头有尾时，两者都起作用。由于定时器是异步的，所以连续滚动时，会连续触发时间戳判断的回调，最后一次才会触发定时器的回调。

有头无尾时，只有时间戳判断有效，无头有尾时，只有定时器有效

```
var throttle = function (func, wait, options) {
    var context, args, result;

    // setTimeout 的 handler
    var timeout = null;

    // 标记时间戳
    // 上一次执行回调的时间戳
    var previous = 0;

    // 如果没有传入 options 参数
    // 则将 options 参数置为空对象
    if (!options)
        options = {};

    var later = function () {
        // 如果 options.leading === false
        // 则每次触发回调后将 previous 置为 0
        // 否则置为当前时间戳
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        console.log('B')
        result = func.apply(context, args);

        // 这里的 timeout 变量一定是 null 了吧
        // 是否没有必要进行判断？
        if (!timeout)
            context = args = null;
    };

    // 以滚轮事件为例（scroll）
    // 每次触发滚轮事件即执行这个返回的方法
    // _.throttle 方法返回的函数
    return function () {
        // 记录当前时间戳
        var now = new Date().getTime();

        // 第一次执行回调（此时 previous 为 0，之后 previous 值为上一次时间戳）
        // 并且如果程序设定第一个回调不是立即执行的（options.leading === false）
        // 则将 previous 值（表示上次执行的时间戳）设为 now 的时间戳（第一次触发时）
        // 表示刚执行过，这次就不用执行了
        if (!previous && options.leading === false)
            previous = now;

        // 距离下次触发 func 还需要等待的时间
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;

        // 要么是到了间隔时间了，随即触发方法（remaining <= 0）
        // 要么是没有传入 {leading: false}，且第一次触发回调，即立即触发
        // 此时 previous 为 0，wait - (now - previous) 也满足 <= 0
        // 之后便会把 previous 值迅速置为 now
        // ========= //
        // remaining > wait，表示客户端系统时间被调整过
        // 则马上执行 func 函数
        // @see https://blog.coding.net/blog/the-difference-between-throttle-and-debounce-in-underscorejs
        // ========= //

        // console.log(remaining) 可以打印出来看看
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                // 解除引用，防止内存泄露
                timeout = null;
            }

            // 重置前一次触发的时间戳
            previous = now;

            // 触发方法
            // result 为该方法返回值
            console.log('A')
            result = func.apply(context, args);

            // 引用置为空，防止内存泄露
            // 感觉这里的 timeout 肯定是 null 啊？这个 if 判断没必要吧？
            if (!timeout)
                context = args = null;
        } else if (!timeout && options.trailing !== false) { // 最后一次需要触发的情况
            // 如果已经存在一个定时器，则不会进入该 if 分支
            // 如果 {trailing: false}，即最后一次不需要触发了，也不会进入这个分支
            // 间隔 remaining milliseconds 后触发 later 方法
            timeout = setTimeout(later, remaining);
        }

        // 回调返回值
        return result;
    };
};

function log() {
    console.log('hello world');
}

window.onscroll = throttle(log, 100); // A B B B B
window.onscroll = throttle(log, 1000, { leading: false }); // B B B B B
window.onscroll = throttle(log, 1000, { trailing: false }); // A A A A A 

```

参考资料
-

<a href="https://github.com/hanzichi/underscore-analysis/issues/21" target="_blank">underscore 函数去抖的实现</a>

<a href="https://github.com/hanzichi/underscore-analysis/issues/22" target="_blank">underscore 函数节流的实现</a>