---
layout: post
title: vim使用cygwin shell
keywords: "cygwin, vim, shell"
---

By default, Vim on Windows uses the "Command Prompt" as its shell. If you have Cygwin installed (http://www.cygwin.com) you may want to use one of its shells instead, such as bash. This also makes all of the programs installed under Cygwin available for text processing.

The following settings may be included in a startup script to use bash as your shell. I have these commands in my gvimrc file in the installation directory.

    set shell=C:/cygwin/bin/bash
    set shellcmdflag=--login\ -c
    set shellxquote=\"

I had problems with parts of the /etc/profile not being executed, but I didn't want to add -i (interactive) to the shellcmdflag because this caused the shell to always open in my home directory. I prefer that it opens in the directory containing the file being edited. However, without that part of /etc/profile running, the path wasn't set up properly. To get around this, I added the following line to /etc/profile:

    RANPROFILE="TRUE"

I added this to my .bashrc:

    if [ -z "$RANPROFILE" ]; then
      PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
    fi

Newer versions of the /etc/profile installed with Cygwin may behave differently.

原文：[Use cygwin shell](http://vim.wikia.com/wiki/Use_cygwin_shell)

