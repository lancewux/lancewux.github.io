<h1 align="center"> 系统架构 </h1>

PV、UV、IP
-

PV（page view）即页面浏览量或点击量，是衡量一个网站或网页用户访问量。具体的说，PV值就是所有访问者在24小时（0点到24点）内看了某个网站多少个页面或某个网页多少次。

UV（unique visitor）即独立访客数，指访问某个站点或点击某个网页的不同IP地址的人数。在同一天内，UV只记录第一次进入网站的具有独立IP的访问者，在同一天内再次访问该网站则不计数。

IP可以理解为独立IP的访问用户，指1天内使用不同IP地址的用户访问网站的数量，同一IP无论访问了几个页面，独立IP数均为1。通常UV量和比IP量高出一点，每个UV相对于每个IP更准确地对应一个实际的浏览者。

QPS、并发数
-

QPS（Query Per Second）是对一个特定的查询服务器在规定时间内所处理流量多少的衡量标准。QPS指每秒钟请求的数量， 并发数指系统同时处理的请求数，

LVS
-

LVS（Linux Virtual Server）集群采用IP负载均衡技术和基于内容请求分发技术。调度器具有很好的吞吐率，将请求均衡地转移到不同的服务器上执行，且调度器自动屏蔽掉服 务器的故障，从而将一组服务器构成一个高性能的、高可用的虚拟服务器。整个服务器集群的结构对客户是透明的，而且无需修改客户端和服务器端的程序。

### 层次结构

一般来说，LVS集群采用三层结构，三层主要组成部分为：

- 负载调度器（load balancer），它是整个集群对外面的前端机，负责将客户的请求发送到一组服务器上执行，而客户认为服务是来自一个IP地址（我们可称之为虚拟IP地址）上的。
- 服务器池（server pool），是一组真正执行客户请求的服务器，执行的服务有WEB、MAIL、FTP和DNS等。
- 共享存储（shared storage），它为服务器池提供一个共享的存储区，这样很容易使得服务器池拥有相同的内容，提供相同的服务。

调度器是服务器集群系统的唯一入口点（Single Entry Point），它可以采用IP负载均衡技术、基于内容请求分发技术或者两者相结合。在IP负载均衡技术中，需要服务器池拥有相同的内容提供相同的服务。当 客户请求到达时，调度器只根据服务器负载情况和设定的调度算法从服务器池中选出一个服务器，将该请求转发到选出的服务器，并记录这个调度；当这个请求的其 他报文到达，也会被转发到前面选出的服务器。在基于内容请求分发技术中，服务器可以提供不同的服务，当客户请求到达时，调度器可根据请求的内容选择服务器 执行请求。因为所有的操作都是在Linux操作系统核心空间中将完成的，它的调度开销很小，所以它具有很高的吞吐率。

服务器池的结点数目是可变的。当整个系统收到的负载超过目前所有结点的处理能力时，可以在服务器池中增加服务器来满足不断增长的请求负载。对大多数 网络服务来说，请求间不存在很强的相关性，请求可以在不同的结点上并行执行，所以整个系统的性能基本上可以随着服务器池的结点数目增加而线性增长。

共享存储通常是数据库、网络文件系统或者分布式文件系统。服务器结点需要动态更新的数据一般存储在数据库系统中，同时数据库会保证并发 访问时数据的一致性。静态的数据可以存储在网络文件系统（如NFS/CIFS）中，但网络文件系统的伸缩能力有限，一般来说，NFS/CIFS服务器只能 支持3~6个繁忙的服务器结点。对于规模较大的集群系统，可以考虑用分布式文件系统，如AFS、GFS、Coda和 Intermezzo等。分布式文件系统可为各服务器提供共享的存储区，它们访问分布式文件系统就像访问本地文件系统一样，同时分布式文件系统可提 供良好的伸缩性和可用性。此外，当不同服务器上的应用程序同时读写访问分布式文件系统上同一资源时，应用程序的访问冲突需要消解才能使得资源处于一致状 态。这需要一个分布式锁管理器（Distributed Lock Manager），它可能是分布式文件系统内部提供的，也可能是外部的。开发者在写应用程序时，可以使用分布式锁管理器来保证应用程序在不同结点上并发访问的一致性。

负载调度器、服务器池和共享存储系统通过高速网络相连接，如100Mbps交换网络、Myrinet和Gigabit网络等。使用高速的网络，主要为避免当系统规模扩大时互联网络成为整个系统的瓶颈。

Graphic Monitor是为系统管理员提供整个集群系统的监视器，它可以监视系统的状态。

### 性能和健壮性

集群系统的特点是它在软硬件上都有冗余。系统的高可用性可以通过检测节点或服务进程故障并正确地重置系统来实现，使得系统收到的请求能被存活的结点处理。

通常，我们在调度器上有资源监测进程来时刻监视各个服务器结点的健康状况。当服务器对ICMP ping不可达时或者探测她的网络服务在指定的时间没有响应时，资源监测进程通知操作系统内核将该服务器从调度列表中删除或者失效。这样，新的服务请求就不会被调度到坏的结点。

现在前端的调度器有可能成为系统的单一失效点（Single Point of Failure）。一般来说，调度器的可靠性较高，因为调度器上运行的程序较少而且大部分程序早已经遍历过，但我们不能排除硬件老化、网络线路或者人为误 操作等主要故障。为了避免调度器失效而导致整个系统不能工作，我们需要设立一个从调度器作为主调度器的备份。

两个心跳（Heartbeat）进程分 别在主、从调度器上运行，它们通过串口线和UDP等心跳线来相互定时地汇报各自的健康状况。当从调度器不能听得主调度器的心跳时，从调度器通过ARP欺骗 （Gratuitous ARP）来接管集群对外的Virtual IP Address，同时接管主调度器的工作来提供负载调度服务。当主调度器恢复时，这里有两种方法，一是主调度器自动变成从调度器，二是从调度器释放 Virtual IP Address，主调度器收回Virtual IP Address并提供负载调度服务。这里，多条心跳线可以使得因心跳线故障导致误判（即从调度器认为主调度器已经失效，其实主调度器还在正常工作）的概论降到最低。

共享存储是媒体集群系统中最关键的问题，因为媒体文件往往非常大（一部片子需要几百兆到几千兆的存储空间），这对存储的容量和读的速度 有较高的要求。对于规模较小的媒体集群系统，例如有3至6个媒体服务器结点，存储系统可以考虑用带千兆网卡的Linux服务器，使用软件RAID和日志型 文件系统，再运行内核的NFS服务，会有不错的效果。对于规模较大的媒体集群系统，最好选择对文件分段（File Stripping）存储和文件缓存有较好支持的分布式文件系统；媒体文件分段存储在分布式文件系统的多个存储结点上，可以提高文件系统的性能和存储结点 间的负载均衡；媒体文件在媒体服务器上自动地被缓存，可提高文件的访问速度。

HAProxy
-

HAProxy是一个使用C语言编写的自由及开放源代码软件，其提供高可用性、负载均衡，以及基于TCP和HTTP的应用程序代理。

HAProxy特别适用于那些负载特大的web站点，这些站点通常又需要会话保持或七层处理。HAProxy运行在当前的硬件上，完全可以支持数以万计的并发连接。并且它的运行模式使得它可以很简单安全的整合进您当前的架构中， 同时可以保护你的web服务器不被暴露到网络上。

HAProxy实现了一种事件驱动, 单一进程模型，此模型支持非常大的并发连接数。多进程或多线程模型受内存限制 、系统调度器限制以及无处不在的锁限制，很少能处理数千并发连接。事件驱动模型因为在有更好的资源和时间管理的用户空间(User-Space) 实现所有这些任务，所以没有这些问题。此模型的弊端是，在多核系统上，这些程序通常扩展性较差。这就是为什么他们必须进行优化以 使每个CPU时间片(Cycle)做更多的工作。

参考资料
-

<a href="http://www.dataguru.cn/article-12346-1.html" target="_blank">如何打造应对超大流量的高性能负载均衡</a>

<a href="http://www.linuxvirtualserver.org/zh/lvs2.html" target="_blank">LVS集群的体系结构</a>

