---
layout: post
title: git下的各种乱码问题
keywords: "git, 乱码"
---

1. 在cygwin中，使用git add添加要提交的文件的时候，如果文件名是中文，会显示形如274\232\350\256\256\346\200\273\347\273\223.png的乱码

        解决方案：
        在bash提示符下输入：
        `git config --global core.quotepath false`
        core.quotepath设为false的话，就不会对0×80以上的字符进行quote。中文显示正常。

2. 在MsysGit中，使用git log显示提交的中文log乱码。

        解决方案：
        设置git gui的界面编码
        `git config --global gui.encoding utf-8`

        设置 commit log 提交时使用 utf-8 编码，可避免服务器上乱码，同时与linux上的提交保持一致！
        `git config --global i18n.commitencoding utf-8`

        使得在 $ git log 时将 utf-8 编码转换成 gbk 编码，解决Msys bash中git log 乱码。
        `git config --global i18n.logoutputencoding gbk`

        使得 git log 可以正常显示中文（配合i18n.logoutputencoding = gbk)，在 /etc/profile 中添加：
        `export LESSCHARSET=utf-8`
