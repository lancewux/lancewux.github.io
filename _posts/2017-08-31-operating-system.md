<h1 align="center"> 操作系统 </h1>

TTY
-

"tty" 原意是指 "teletype" 即打字机, "pty" 则是 "pseudo-teletype" 即伪打字机. 在 Unix 中, /dev/tty* 是指任何表现的像打字机的设备, 例如终端 (terminal).

使用 ps -x 命令查看进程信息中也有 tty 的信息。其中为 ? 的是没有依赖 TTY 的进程, 即守护进程.

EOL
-

换行符 (EOL) 通常由 line feed (LF, \\n, 回到最左边) 和 carriage return (CR, \\r, 换行) 组成. 常见的情况:

|符号|系统|
|:--|:----|
|LF|在 Unix 或 Unix 相容系统 (GNU/Linux, AIX, Xenix, Mac OS X, ...)、BeOS、Amiga、RISC OS|
|CR+LF|MS-DOS、微软视窗操作系统 (Microsoft Windows)、大部分非 Unix 的系统|
|CR|Apple II 家族, Mac OS 至版本9|


孤儿进程
-

孤儿进程是指这样一类进程：在进程还未退出之前，它的父进程就已经退出了，一个没有了父进程的子进程就是一个孤儿进程（orphan）。

既然所有进程都必须在退出之后被wait()或waitpid()以释放其遗留在系统中的一些资源，那么应该由谁来处理孤儿进程的善后事宜呢？这个重任就落到了init进程身上，init进程就好像是一个民政局，专门负责处理孤儿进程的善后工作。每当出现一个孤儿进程的时候，内核就把孤儿进程的父进程设置为init，而init进程会循环地wait()它的已经退出的子进程。这样，当一个孤儿进程“凄凉地”结束了其生命周期的时候，init进程就会代表党和政府出面处理它的一切善后工作。

僵尸进程
-

Unix进程模型中，进程是按照父进程产生子进程，子进程产生子子进程这样的方式创建出完成各项相互协作功能的进程的。

当一个进程完成它的工作终止之后，它的父进程需要调用wait()或者waitpid()系统调用取得子进程的终止状态。如果父进程没有这么做的话，会产生什么后果呢？此时，子进程虽然已经退出了，但是在系统进程表中还为它保留了一些退出状态的信息(包括进程号the process ID,退出状态the termination status of the process,运行时间the amount of CPU time taken by the process等)，如果父进程一直不取得这些退出信息的话，这些进程表项就将一直被占用，此时，这些占着茅坑不拉屎的子进程就成为“僵尸进程”（zombie）。系统进程表是一项有限资源，如果系统进程表被僵尸进程耗尽的话，系统就可能无法创建新的进程。

任何一个子进程(init除外)在exit()之后，并非马上就消失掉，而是留下一个称为僵尸进程(Zombie)的数据结构，等待父进程处理。这是每个 子进程在结束时都要经过的阶段。如果子进程在exit()之后，父进程没有来得及处理，这时用ps命令就能看到子进程的状态是“Z”。如果父进程能及时 处理，可能用ps命令就来不及看到子进程的僵尸状态，但这并不等于子进程不经过僵尸状态。  如果父进程在子进程结束之前退出，则子进程将由init接管。init将会以父进程的身份对僵尸状态的子进程进行处理。

严格地来说，僵尸进程并不是问题的根源，罪魁祸首是产生出大量僵尸进程的那个父进程。

处理僵尸进程的方法有两种：

一是通过信号机制。子进程退出时向父进程发送SIGCHILD信号，父进程处理SIGCHILD信号。在信号处理函数中调用wait进行处理僵尸进程。

二是fork两次。fork一次，然后wait，再让fork出来的子进程fork一个孙子进程出来，然后子进程自杀，然后父进程通过wait回收子进程，此时孙子进程直接被init进程收养，死了自动回收。

进程崩溃的原因
-

#### 堆栈溢出异常

分配给线程堆栈的内存耗尽时就会发生内存溢出异常。

#### 内存溢出异常

大多数情况下内存溢出是由设计问题导致的，要么是cache或者session使用了过多的内存.

#### 本地堆冲突

写入了错误内存地址就会发生本地堆冲突.随之而来的问题在于:写入错误的内存地址不会发生任何错误，而当其他程序用正确方式访问这个地址的时候才会出错.



进程间通信（ inter-process communication，IPC）
-

在计算机科学中，<a href="https://en.wikipedia.org/wiki/Inter-process_communication" target="_blank">进程间通信</a>特指操作系统提供的允许进程管理共享数据的机制。

实现IPC的方法如下：

|方法|描述|
|:-:|:-|
|file|存储在硬盘上或被文件系统合成的记录|
|signal|指一个进程发给另一个进程的系统消息，并不用于传输数据，而用于远程命令同伴进程|
|Socket|使用网络接口发送的数据流|
|Unix domain socket|类似于网络套接字，但是所有的通信都发生在内核中。使用文件系统作为地址空间，进程引用域套接字作为inode|
|Message queue|一种异步数据流，多个进程不用连接就可以读写消息队列|
|Pipe|单向数据通道，写进管道的写端的数据会被操纵系统缓存，直到被从管道的读端读取，一般用标准输入输出流实现。|
|Named pipe|用文件实现的管道|
|Shared memory|多个进程有权访问同一个内存块，那里创建了一个共享缓存|
|Message passing|使用消息队列或管道进行通信，一般用于并发模型中|
|Memory-mapped file|映射到RAM的文件|


信号（Signal）
-

在POSIX系统中，<a href="https://en.wikipedia.org/wiki/Inter-process_communication" target="_blank">信号</a>是指发送给进程或同进程中的线程的一个异步通知，来告知其一个发生的事件。

信号和中断有点像，区别是，中断由处理器进行中介，并由内核处理，不属于IPC；而信号由内核(可能通过系统调用)进行中介，并由进程处理。

可以用signal() 或 sigaction()系统函数来注册信号处理函数。

信号处理会遇到竞态条件问题。

信号会中断进程中的程序调用。信号处理可以把信号放到队列中（比如eventloop）并及时返回，主线程可以保持继续运行。

标准流（Standard streams）
-

在计算机编程中，<a href="https://en.wikipedia.org/wiki/Inter-process_communication" target="_blank">标准流</a>是程序执行前就在程序和运行环境之间连通的输入和输出的通信通道。

在unix之前的操作系统中，程序需要明确地连接到合适的输入和输出设备，操纵系统的错综复杂是这变成了一项冗长乏味的工作。

POSIX
-

<a href="https://en.wikipedia.org/wiki/Inter-process_communication" target="_blank">Portable Operating System Interface (POSIX)</a>是维护操作系统兼容性的一套标准规范的集合。POSIX定义了application programming interface (API)，command line shells和utility interfaces。


网络套接字（Network socket）
-

套接字一般指网络套接字，<a href="https://en.wikipedia.org/wiki/Network_socket" target="_blank">网络套接字</a>代表在计算机网络的一个结点上发送和接收数据的内部端点。

“套接字”这个术语类似于物理插座，两个结点通过通道进行通信，可以比作为，把插头插进一根电缆连接的两个插座中。类似的，术语端口号（port），即上面的插头，是结点的外部端点，在IPC中，也可以用作内部端点。

进程可以使用套接字描述符、一种句柄（抽象引用，在内部用一个整数代表）来引用套接字。进程首先请求协议栈创建一个套接字并返回一个描述符，当进程要发送或接收数据时就把描述符传回给协议栈来使用相应的套接字。

套接字是一个结点的内部资源，不能被其它结点直接引用。在网络通信中，套接字一般有相应的地址和网络连接。

在 TCP 和 UDP中，套接字地址指的是一个网络结点的ip地址和端口号，可以把套接字与套接字地址进行绑定。如果套接字只用来发送数据，就可以不需要套接字地址。

虽然在一个本地进程与一个外部进程的通信过程中，可以往或从一个外部套接字地址发送或接收数据，但是它并没有使用外部套接字的权限，也不能使用外部套接字描述符，因为它们都是外部结点的内部资源。

协议栈通常指操作系统提供的允许进程使用相关协议进行网络通信的一组程序。程序用来和协议栈进行通信的API叫socket API。使用socket API进行程序开发叫做网络编程（network programming）。

网络套接字API一般基于 Berkeley sockets standard，套接字是文件描述符的一种形式，因为unix的哲学是，一切都是文件。

Unix domain socket
-

<a href="https://en.wikipedia.org/wiki/Unix_domain_socket" target="_blank">Unix domain socket</a>是同一台主机上的不同进程间进行通信的端点。


Unix domain socket的api和Network socket的api是相似的，但并不使用网络协议，所有的通信都发生在操作系统的内核中。Unix domain socket使用文件系统作为地址命名空间，进程把Unix domain socket当作文件系统的inode，所以两个进程可以使用相同的socket进行通信。除了传输数据，还可以传输文件描述符，这样就可以把这个文件的相关权限授权给接收进程。

端口（Port）
-

<a href="https://en.wikipedia.org/wiki/Port_(computer_networking)" target="_blank">端口号</a>是16bit的无符号整数，范围是0～65535。1024个端口号被系统保留，用作特殊服务。一般由传输层协议，比如TCP、UDP，在它们的头部指定源和目的端口号。


文件描述符（File descriptor）
-

在Unix及相关的操作系统中，<a href="https://en.wikipedia.org/wiki/File_descriptor" target="_blank">文件描述符</a>是用来获取文件或其它输入输出资源（比如管道、网络套接字）的抽象指针。

所有进程都有三个标准文件描述符，对应三种标准流：

|Integer value|Name|file stream|
|:-:|:-|:-|
|0|Standard input|stdin|
|1|Standard output|stdout|
|2|Standard error|stderr|

文件描述符指向每个进程的文件描述符表，然后索引到系统级的文件表，再索引到inode表。处理输入和输出时，进程把文件描述符传递给内核，然后内核代表该进程来处理该文件，进程没有直接获取文件表和inode表的权限。

<p align="center"><img src="/images/posts/2017-08-20/File_table_and_inode_table.svg.png" /></p>

inode
-

<a href="https://en.wikipedia.org/wiki/Inode" target="_blank">inode</a>时描述文件对象（比如文件和文件夹）的数据结构。每个inode都存储了文件对象的属性及硬盘块地址。属性一般包括元数据（改变时间，修改），拥有者和权限等。

可以用 'ls -i' 命令查看inode

一个文件可以有多个名字，当多个名字硬连接到同一个inode，这些文件名字都是等价的。如果是软连接，依赖的是第一个名字，而不是inode。

inode可能没有连接，对应的文件将从硬盘中移除。

当文件移动到同一个设备的其它文件夹时，inode不会改变。

消息队列（Message queue）
-

<a href="https://en.wikipedia.org/wiki/Message_queue" target="_blank">消息队列</a>提供了一种异步通信协议，消息的发送者和接收者不需要在同一时间和消息队列打交道。消息会一直存在消息队列中，直到接收者取走它们。在计算机科学中，消息队列是用于IPC（inter-process communication）或ITC（inter-thread communication ）的软件工程组件。

管道（pipeline）
-

在Unix-like操作系统中，<a href="https://en.wikipedia.org/wiki/Pipeline_(Unix)" target="_blank">管道</a>就是一系列用标准流串连在一起的进程，这样一来，一个进程的输出直接变成下一个进程的输入。







