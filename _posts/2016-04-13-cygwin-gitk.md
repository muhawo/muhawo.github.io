---
layout: post
title: "cygwin无法运行gitk"
keywords: "cygWin, gitk, tk85"
---

> Application initialization failed: no display name and no $DISPLAY environment v
> ariable
> Error in startup script: no display name and no $DISPLAY environment variable
>     while executing
> "load /usr/lib/tk8.5/../../bin/libtk8.5.dll Tk"
>     ("package ifneeded Tk 8.5.9" script)
>     invoked from within
> "package require Tk"
>     (file "C:\cygwin\bin\gitk" line 11)
> 


1. Run the Cygwin installer again (download the relevant setup-*.exe again if you need to).
2. At the package list, select to install "xinit" under the X11 category. Click next, accept all the dependencies, and install.
3. In the Windows Start menu, you should have a new group: Cygwin-X. From there, run XWin Server.
4. In your Cygwin shell, run export DISPLAY=:0.0.

