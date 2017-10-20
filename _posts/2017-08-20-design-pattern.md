<h1 align="center">设计模式</h1>

设计模式（Design Pattern）是一套被反复使用、多数人知晓的、经过分类的、代码设计经验的总结。

使用设计模式的目的：为了代码可重用性、让代码更容易被他人理解、保证代码可靠性。 设计模式使代码编写真正工程化；设计模式是软件工程的基石脉络，如同大厦的结构一样。

设计模式分为三种类型，共23种。

- 创建型模式：单例模式、抽象工厂模式、建造者模式、工厂模式、原型模式。
- 结构型模式：适配器模式、桥接模式、装饰模式、组合模式、外观模式、享元模式、代理模式。
- 行为型模式：模版方法模式、命令模式、迭代器模式、观察者模式、中介者模式、备忘录模式、解释器模式（Interpreter模式）、状态模式、策略模式、职责链模式(责任链模式)、访问者模式。


原则
-

### 控制反转原则（Inversion of control）

<a href="https://en.wikipedia.org/wiki/Dependency_injection" target="_blank">控制反转</a>是这样一种设计原则，自定义代码会受到框架的流程控制。在传统的编码中，自定义的代码会调用一些可复用的库来完成其功能。但是，使用控制反转技术，可以实现由框架来调用自定义的代码。

控制反转原则可以用来提高程序的模块性，使其更容易扩展。在面向对象编程中也有一些应用。一个典型的应用是事件驱动编程。在事件驱动编程中，自定义代码只需要关心怎么处理事件，而事件的轮询和调度都由框架或运行时完成。

相关的设计模式有工厂模式、服务定位模式、依赖注入模式、模版方法模式、策略模式、观察者模式

### 依赖反转原则（Dependency inversion principle）

<a href="https://en.wikipedia.org/wiki/Dependency_inversion_principle" target="_blank">依赖反转</a>是一种解耦模块的具体形式。其陈述为：

- 高层次的模块不应该依赖于低层次的模块，他们都应该依赖于抽象。
- 抽象不应该依赖于具体，具体应该依赖于抽象。

<p align="center"><img src="/images/posts/2017-08-20/DIPLayersPattern.png" /></p>

在传统的设计中，低层次组件被设计为可以被高层次组件使用，这样就可以慢慢构建出一个复杂的系统。在这样的设计中，高层次组件直接依赖低层次组件来完成某些功能，这种依赖降低了高层次组件的复用机会。

依赖反转通过引入抽象层作为中介来完成解耦，从而提升高层次组件的复用性，高层次组件可以使用其它的低层次组件的实现。依赖反转减少了高层次组件对低层次组件的依赖，但是反转并不意味着低层次组件要依赖高层次组件，它们都应该依赖抽象。

相关的设计模式有适配器模式、依赖注入模式、插件模式、服务定位模式、

模式
-

### 依赖注入（Dependency injection）

<a href="https://en.wikipedia.org/wiki/Dependency_injection" target="_blank">依赖注入</a>是一种这样的技术，一个对象提供另一个对象的依赖。一个依赖指一个可以被使用的对象（服务）。注入是指把依赖传递到使用依赖的对象（客户）中。这个模式的要点是把依赖（服务）传递给被依赖者（客户），而不是把依赖硬编写到被依赖者中。不应该在被依赖者（客户）的class中用new生成并引用依赖（服务），而应该把依赖以被依赖者的实参的方式传递给被依赖者。

依赖注入是控制反转的一种形式。不是由低级代码调用高级代码，而是由高级代码获得低级代码并调用它。客户把提供服务的职责委托给注入器，客户不允许直接调用服务。客户不需要知道怎么构造服务，具体使用的是哪个服务，只需要知道服务的接口定义。这样就分离了构造和使用的职责。

依赖注入符合单一职责原则和依赖倒置原则。

<p align="center"><img src="/images/posts/2017-08-20/Dependency_Injection_Design_Pattern_UML.jpg" /></p>

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

### 观察者模式（The observer pattern）

在<a href="https://en.wikipedia.org/wiki/Dependency_inversion_principle" target="_blank">观察者模式</a>中，一个被称为主题的对象，维护着被称为观察者的依赖的列表，一旦状态有变化就告知这些观察者，一般通过调用观察者的函数的方式来告知。

主要用来实现分布式的事件处理系统。观察者模式解决的问题包括：实现了一对多依赖的解耦；一旦状态变化，无限数量的依赖对象会自动更新。

<p align="center"><img src="/images/posts/2017-08-20/Observer_Design_Pattern_UML.jpg" /></p>

主题的唯一职责是维护观察者列表，并通过调用它们的update函数来通知状态变化。

观察者的职责是在主题中注册自己，并在告知状态变化的时候更新自己的变化。

观察者模式典型的实现是，把主题作为被观察者对象的一部分（通过继承），然后与观察者进行通信。在一些发布-订阅模式的实现（非轮询）中，通过加一层消息队列作为主题和观察者的中间层来实现观察者和主题的解耦。所以，在有些领域，发布-订阅模式就成了观察者模式的同义词。

发布-订阅模式是一种消息模式，消息的发送者（发布者）不直接把消息发给具体的接收者（订阅者），而是把消息进行分类。订阅者对一个或多个类表示兴趣，然后只会收到感兴趣的类别的消息。

不同点有，subject维护了observer的实例列表，依赖于observer；而在发布-订阅模式中，发布者和订阅者是完全解耦的，它们完全可以不知道对方的存在。观察者模式一般是用于程序设计，而发布订阅者模式一般用于系统设计。观察者模式解决一对多依赖问题，而发布-订阅模式解决多对多依赖问题。



<a href="http://www.runoob.com/design-pattern/design-pattern-tutorial.html" target="_blank">设计模式,菜鸟驿站</a>

