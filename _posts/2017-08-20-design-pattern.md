<h1 align="center">设计模式</h1>

设计模式（Design Pattern）是一套被反复使用、多数人知晓的、经过分类的、代码设计经验的总结。

使用设计模式的目的：为了代码可重用性、让代码更容易被他人理解、保证代码可靠性。 设计模式使代码编写真正工程化；设计模式是软件工程的基石脉络，如同大厦的结构一样。

设计模式分为三种类型，共23种。

- 创建型模式：单例模式、抽象工厂模式、建造者模式、工厂模式、原型模式。
- 结构型模式：适配器模式、桥接模式、装饰模式、组合模式、外观模式、享元模式、代理模式。
- 行为型模式：模版方法模式、命令模式、迭代器模式、观察者模式、中介者模式、备忘录模式、解释器模式（Interpreter模式）、状态模式、策略模式、职责链模式(责任链模式)、访问者模式。


原则
-

### 依赖倒置原则

- 高层次的模块不应该依赖于低层次的模块，他们都应该依赖于抽象。
- 抽象不应该依赖于具体，具体应该依赖于抽象。


### 依赖注入（Dependency injection）

<a href="https://en.wikipedia.org/wiki/Dependency_injection" target="_blank">依赖注入</a>是一种这样的技术，一个对象提供另一个对象的依赖。一个依赖指一个可以被使用的对象（服务）。注入是指把依赖传递到使用依赖的对象（客户）中。这个模式的要点是把依赖（服务）传递给被依赖者（客户），而不是把依赖硬编写到被依赖者中。不应该在被依赖者（客户）的class中用new生成并引用依赖（服务），而应该把依赖以被依赖者的实参的方式传递给被依赖者。

依赖注入是控制反转的一种形式。不是由低级代码调用高级代码，而是由高级代码获得低级代码并调用它。客户把提供服务的职责委托给注入器，客户不允许直接调用服务。客户不需要知道怎么构造服务，具体使用的是哪个服务，只需要知道服务的接口定义。这样就分离了构造和使用的职责。

依赖注入符合单一职责原则和依赖倒置原则。

依赖注入有基于constructor、 setter和interface三种方式。

```java
// Constructor
Client(Service service) {
    // Save the reference to the passed-in service inside this client
    this.service = service;
}
```

```java
// Setter method
public void setService(Service service) {
    // Save the reference to the passed-in service inside this client
    this.service = service;
}
```

```java
// Service setter interface.
public interface ServiceSetter {
    public void setService(Service service);
}

// Client class
public class Client implements ServiceSetter {
    // Internal reference to the service used by this client.
    private Service service;

    // Set the service that this client is to use.
    @Override
    public void setService(Service service) {
        this.service = service;
    }
}
```

javascript 使用依赖注入模式前后的对比：

```

//without di

function Greeter(name) {
	this.msg = 'welcome ' + name;
}

function Home() {
	this.greeter = new Greeter('lance');
}

Home.prototype.say = function() {
	console.log(this.greeter.msg);
}

var home = new Home();
home.say();

//with di

function Greeter(name) {
	this.msg = 'welcome ' + name;
}

function Home(greeter) {
	this.greeter = greeter;
}

Home.prototype.say = function() {
	console.log(this.greeter.msg);
}

function injector() {
	var greeter = new Greeter('lance2');
	var home = new Home(greeter);
	home.say();
}

injector();

```



<a href="http://www.runoob.com/design-pattern/design-pattern-tutorial.html" target="_blank">设计模式,菜鸟驿站</a>

