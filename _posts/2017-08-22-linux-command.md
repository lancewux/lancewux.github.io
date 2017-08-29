<h1 align="center"> linux 常用命令 </h1>

#### top

查看系统的CPU、内存、运行时间、交换分区、执行的线程等信息。

#### df -h

以human的方式查看linux系统磁盘容量信息

#### du -bk a.js

以KB为单位显示a.js文件的大小

#### lscpu

查看的是cpu的统计信息

#### lsb_release -a

#### free -m

以兆为单位显示cpu内存使用情况

#### ifconfig

#### tcpdump

#### dig

dig的全称是 (domain information groper)。它是一个用来灵活探测DNS的工具。它会打印出DNS name server的回应。

#### netstat -anp | grep 808

#### ps -aux | grep tomcat 

#### ln source dest

#### pwd

#### tar zxvf FileName.tar.gz

#### ./config; make; make install

#### rz lrz

#### tee


建立硬链接。

不论一个文件有多少硬链接，在磁盘上只有一个描述它的inode，只要该文件的链接数不为0，该文件就保持存在。硬链接不能对目录建立硬链接，不能够跨文件系统。

#### ln -s source dest

建立软链接。

把符号链接称为软链接，它是指向另一个文件的特殊文件，这种文件的数据部分仅包含它所要链接文件的路径名。软件有自己的inode，并在磁盘上有一小片空间存放路径名。因此，软链接能够跨文件系统，也可以和目录链接！

#### ssh -T -v git@github.com



<a href="http://roclinux.cn/?p=2449" target="blank">dig挖出DNS的秘密</a>

<a href="http://charlee.li/linux-sysinfo-cmds.html" target="blank">Linux系统信息查看命令大全</a>