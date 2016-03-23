---
layout: post
title: 一个换行符（crlf、lf）引起的问题
---

在用grunt进行打包的时候，一个js文件(`lf.js`)莫名其妙地变大了一些(这个文件不能发生变化，因为最后要对它做sha验证)，diff后没有发现任何差异，最终发现是文件中的换行符由`lf`变为了`crlf`。


原因：

    grunt.template.process calls grunt.utils.normalizelf which is dependent on the OS

解决方案：

    module.exports = function(grunt) {
      grunt.util.linefeed = "\n";
      grunt.initConfig({});
    }


参照：[\n (LF) in banner text is converted to CRLF in Windows](https://github.com/gruntjs/grunt-contrib-uglify/issues/81)

下面将解决此问题的过程及中间学的知识梳理一下：

假设出现状况的文件是`lf.js`，grunt打包时执行的任务包括`uglify`，`strip_code`, `template`等，于是通过`!lf.js`放到各个任务的`files`中逐个排除，最终定位到是`template`出了问题（此时还不知道是换行的问题）。
第一版解决方案就先将`!lf.js`放到了template的配置中。

问题是解决了，可是diff没有差异，变化的这一部分是什么呢？这是突然想起来在做git提交时经常会出现`lf`、`replace`什么的信息，大概就是做了换行符替换什么的，于是搜索`git lf`，于是有了以下发现，尽管与本问题的最终解决无关：

> git在做提交和检出时会有一个`crlf`和`lf`的转换问题，如git在做提交时会将文件中的`crlf`替换成`lf`，而检出时会将`lf`替换成`crlf`。具体转换规则与`git config core.eol`,`git config core.autocrlf`有关。

将`!lf.js`从`template`配置中去除后，对git进行一番调试配置并没有什么效果。那先看一下`lf.js`中增加了什么东西吧，这里用了vim的十六进制查看工具，发现在换行出多了`0D`，遂查了一下`crlf`相关的资料：

不同操作系统使用的换行符不同：

* CRLF->Windows-style
* LF->Unix Style
* CR->Mac Style

> CRLF -- Carriage-Return Line-Feed 回车换行  
> CRLF是两个字符：CR(回车,ASCII 13,十六进制 0D, \r) LF(换行, ASCII 10, 十六进制0A, \n)  
> CR和LF是在计算机终端还是电传打印机的时候遗留下来的东西。电传打字机就像普通打字机一样工作。在每一行的末端，CR命令让打印头回到左边。LF命令让纸前进一行。  

果然是`crlf`的问题了！

接下来开始google `grunt template crlf`，然后找到了上面的解决方法。

在问题解决之前还发现一点奇怪的地方，就是为什么只有`lf.js`出现了这种问题，猜想肯定是template导致了这种问题的出现，而后续grunt任务又碰巧解决了这个问题，碰巧`lf.js`又没有执行后面的任务。而`uglify`任务中确实存在这种将`crlf`转换为`lf`的代码，
`lf.js`也正好没有执行`uglify`。

[https://github.com/gruntjs/grunt-contrib-uglify/blob/master/tasks/uglify.js#L41](https://github.com/gruntjs/grunt-contrib-uglify/blob/master/tasks/uglify.js#L41)

    // Converts \r\n to \n
    function normalizeLf(string) {
        return string.replace(/\r\n/g, '\n');
    }

到这里问题似乎完全搞明白了，但是突然想到git中的换行问题也会文件有影响的，比如我们git库中的`lf.js`是`lf`换行的，拉到本地却变成了`crlf`，而我们打包的就是本地文件。
看来是中间的某些操作掩盖了这个问题。回头去想，应该是我从服务端直接下载的`lf.js`覆盖本地代码后掩盖了这个问题。关于git中的换行符问题，我会另开一章进行分析。


