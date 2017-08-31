<h1 align="center"> 操作系统 </h1>

TTY
-

"tty" 原意是指 "teletype" 即打字机, "pty" 则是 "pseudo-teletype" 即伪打字机. 在 Unix 中, /dev/tty* 是指任何表现的像打字机的设备, 例如终端 (terminal).

使用 ps -x 命令查看进程信息中也有 tty 的信息。其中为 ? 的是没有依赖 TTY 的进程, 即守护进程.

EOL
-

换行符 (EOL) 通常由 line feed (LF, \\n) 和 carriage return (CR, \\r) 组成. 常见的情况:

|符号|系统|
|:--|:----|
|LF|在 Unix 或 Unix 相容系统 (GNU/Linux, AIX, Xenix, Mac OS X, ...)、BeOS、Amiga、RISC OS|
|CR+LF|MS-DOS、微软视窗操作系统 (Microsoft Windows)、大部分非 Unix 的系统|
|CR|Apple II 家族, Mac OS 至版本9|