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

### 组合模式（Composite pattern）

组合模式将对象组合成树形结构，以表示‘部分-整体’的层级结构，使得用户对单个对象和组合对象的使用具有一致性。

通过树形结构，只要运行组合对象的一个方法，组合对象下所有对象相应的方法都会被调用。

用户可以同等地使用单个对象和组合对象，而不必关心它究竟是单个对象还是组合对象。

linux的文件处理就是使用的组合模式，文件和文件夹得到了同等对待。

```java
/** "Component" */
interface Graphic {

    //Prints the graphic.
    public void print();
}

/** "Composite" */
class CompositeGraphic implements Graphic {

    //Collection of child graphics.
    private List<Graphic> childGraphics = new ArrayList<Graphic>();

    //Prints the graphic.
    public void print() {
        for (Graphic graphic : childGraphics) {
            graphic.print();
        }
    }

    //Adds the graphic to the composition.
    public void add(Graphic graphic) {
        childGraphics.add(graphic);
    }

    //Removes the graphic from the composition.
    public void remove(Graphic graphic) {
        childGraphics.remove(graphic);
    }
}

/** "Leaf" */
class Ellipse implements Graphic {

    //Prints the graphic.
    public void print() {
        System.out.println("Ellipse");
    }
}

/** Client */
public class Program {

    public static void main(String[] args) {
        //Initialize four ellipses
        Ellipse ellipse1 = new Ellipse();
        Ellipse ellipse2 = new Ellipse();
        Ellipse ellipse3 = new Ellipse();
        Ellipse ellipse4 = new Ellipse();

        //Initialize three composite graphics
        CompositeGraphic graphic = new CompositeGraphic();
        CompositeGraphic graphic1 = new CompositeGraphic();
        CompositeGraphic graphic2 = new CompositeGraphic();

        //Composes the graphics
        graphic1.add(ellipse1);
        graphic1.add(ellipse2);
        graphic1.add(ellipse3);

        graphic2.add(ellipse4);

        graphic.add(graphic1);
        graphic.add(graphic2);

        //Prints the complete graphic (four times the string "Ellipse").
        graphic.print();
    }
}
```

### 装饰者模式（Decorator pattern）

装饰者模式允许静态或动态地把行为加到一个对象，而不影响其它的从同一个类实例化得到的对象。装饰者模式很好地遵守了单一职责原则（Single Responsibility Principle）。

通过新建一个包装原类的装饰类来实现。装饰的特性一般由接口、mixin或类继承来定义。

装饰类在构造函数中获得被装饰的对象，然后覆盖被装饰对象的方法，覆盖的方法是先调用被装饰对象的原方法，再添加装饰的方法。

```java
// The interface Coffee defines the functionality of Coffee implemented by decorator
public interface Coffee {
    public double getCost(); // Returns the cost of the coffee
    public String getIngredients(); // Returns the ingredients of the coffee
}

// Extension of a simple coffee without any extra ingredients
public class SimpleCoffee implements Coffee {
    @Override
    public double getCost() {
        return 1;
    }

    @Override
    public String getIngredients() {
        return "Coffee";
    }
}

// Abstract decorator class - note that it implements Coffee interface
public abstract class CoffeeDecorator implements Coffee {
    protected final Coffee decoratedCoffee;

    public CoffeeDecorator(Coffee c) {
        this.decoratedCoffee = c;
    }

    public double getCost() { // Implementing methods of the interface
        return decoratedCoffee.getCost();
    }

    public String getIngredients() {
        return decoratedCoffee.getIngredients();
    }
}

// Decorator WithMilk mixes milk into coffee.
// Note it extends CoffeeDecorator.
class WithMilk extends CoffeeDecorator {
    public WithMilk(Coffee c) {
        super(c);
    }

    public double getCost() { // Overriding methods defined in the abstract superclass
        return super.getCost() + 0.5;
    }

    public String getIngredients() {
        return super.getIngredients() + ", Milk";
    }
}

// Decorator WithSprinkles mixes sprinkles onto coffee.
// Note it extends CoffeeDecorator.
class WithSprinkles extends CoffeeDecorator {
    public WithSprinkles(Coffee c) {
        super(c);
    }

    public double getCost() {
        return super.getCost() + 0.2;
    }

    public String getIngredients() {
        return super.getIngredients() + ", Sprinkles";
    }
}

public class Main {
    public static void printInfo(Coffee c) {
        System.out.println("Cost: " + c.getCost() + "; Ingredients: " + c.getIngredients());
    }

    public static void main(String[] args) {
        Coffee c = new SimpleCoffee();
        printInfo(c);

        c = new WithMilk(c);
        printInfo(c);

        c = new WithSprinkles(c);
        printInfo(c);
    }
}

// The output of this program is given below
// Cost: 1.0; Ingredients: Coffee
// Cost: 1.5; Ingredients: Coffee, Milk
// Cost: 1.7; Ingredients: Coffee, Milk, Sprinkles
```

```
var Plane = function() {}
Plane.prototype.fire = function() {
    console.log('Fire ordinary bullet');
}

var MissileDecorator = function(plane) {
    this.plane = plane;
}
MissileDecorator.prototype.fire = function() {
    this.plane.fire();
    console.log('Launch a missile');
}

var AtomDecorator = function(plane) {
    this.plane = plane;
}
AtomDecorator.prototype.fire = function() {
    this.plane.fire();
    console.log('Nuclear launch');
}

var plane = new Plane();
plane = new MissileDecorator(plane);
plane = new AtomDecorator(plane);
// Fire ordinary bullet, Launch a missile, Nuclear launch
```

这种动态增加职责的方法并没有改动原对象，而是把一个对象放入另一个对象中，这些对象以一条链的方式进行引用，形成一个聚合对象。这些对象拥有相同的接口，所以装饰过程对用户来说是透明的。

### mixin

mixin是一个包含被其它类使用的方法的类，但却不是其它类的父类。其它类怎样获得mixin类的方法取决于编程语言。mixin有时被描述成被包含，而不是被继承。

mixin提供了一种多重继承的方式，规避了多重继承的复杂性和问题。

javascript可以通过extend和委托的方式实现mixin

```
// This example may be contrived.
// It's an attempt to clean up the previous, broken example.
var Halfling = function (fName, lName) {
    this.firstName = fName;
    this.lastName = lName;
}

var NameMixin = {
    fullName: function () {
        return this.firstName + ' ' + this.lastName;
    },
    rename: function(first, last) {
        this.firstName = first;
        this.lastName = last;
        return this;
    }
};

var sam = new Halfling('Sam', 'Lowry');
var frodo = new Halfling('Freeda', 'Baggs');

// Mixin the other methods
_.extend(Halfling.prototype, NameMixin);

// Now the Halfling objects have access to the NameMixin methods
sam.rename('Samwise', 'Gamgee');
frodo.rename('Frodo', 'Baggins');
```

```
// Implementation
var EnumerableFirstLast = (function () { // function based module pattern.
    var first = function () {
        return this[0];
    },
    last = function () {
        return this[this.length - 1];
    };
    return function () {      // function based Flight-Mixin mechanics ...
        this.first  = first;  // ... referring to ...
        this.last   = last;   // ... shared code.
    };
}());

// Application - explicit delegation:
// applying [first] and [last] enumerable behavior onto [Array]'s [prototype].
EnumerableFirstLast.call(Array.prototype);

// Now you can do:
a = [1, 2, 3];
a.first(); // 1
a.last();  // 3
```
<a href="http://www.runoob.com/design-pattern/design-pattern-tutorial.html" target="_blank">设计模式,菜鸟驿站</a>

