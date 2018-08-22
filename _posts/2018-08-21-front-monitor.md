<h1 align="center">前端监控</h1>

badjs
-

BJ_Report 是重写了 window.onerror 进行上报的，无需编写任何捕获错误的代码.等于是在最外层监听，一个子组件的异常会导致整个页面崩溃。主要用于上报，而不是阻止错误上抛

给react加try-catch
-

### componentDidCatch

```
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }
        
    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
        // You can also log error messages to an error reporting service here
    }
        
    render() {
         //
    }
}
```

### monkeypatch react的render函数

es5

```
var unsafeCreateClass = React.createClass;
React.createClass = function(spec) {
    var unsafeRender = spec['render'];
    spec['render'] = function() {
        try {
            return unsafeRender.apply(this, arguments);
        } catch(e) {
            console.log(e);
        }
    }

    return unsafeCreateClass.apply(this, arguments);
}
```

es6

```
class MyComponent extends React.Component {
    render() {
        return <div>render something here</div>;
    }
}
function wrapTryCatch(Component) {
    let oldRender = Component.prototype.render;
    Component.render = function() {
        try {
            oldRender.apply(this, arguments);
        } catch(e) {
            console.log(e);
        }
    }

    return Component;
}

exports default wrapTryCatch(MyComponent);
```

decorator(引入babel-plugin-transform-decorators)

```
@wrapTryCatch
class MyComponent extends React.Component {
    render() {
        return <div>render something here</div>;
    }
}
```

### 采用babel 转码解决遗留问题

```
"plugins": [
    ["react-transform", {
        "transforms": [{
            "transform": "react-transform-catch-errors",
            "imports": ["react", "redbox-react"]
        }]
    }]
]
```


参考资料
-

<a href="https://github.com/BetterJS" target="_blank">BetterJS</a>

<a href="https://segmentfault.com/a/1190000011379425" target="_blank">React V16 错误处理(componentDidCatch 示例)</a>

<a href="http://www.imweb.io/topic/58e4664b8f0bc35854f676c1" target="_blank">给react加try-catch</a>