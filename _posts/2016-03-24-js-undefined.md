---
layout: post
title: "js中undefined，null和typeof运算符, 解决Uncaught ReferenceError: xxx is not defined(转载)"
---

如果你对undefined和null这两种类型经常分辨不清，那么恭喜，因为你会找到很多的知音。其实要理解这两种类型， 首先要知道它们设计的初衷：

> undefined：表示一个对象没有被定义或者没有被初始化。  
  null：表示一个尚未存在的对象的占位符。


有意思的是undefined类型是从null派生来的。所以它们是相等的：

    alert(null == undefined); //输出  “true”

对于所有的JavaScript开发人员，最常碰到的就是对象不存在错误。正如在C#中的空引用错误一样。很多程序员习惯的以为JavaScript中的if会自动将undefined和null对象转化为false，比如：

    var oTemp = null;
    if(oTemp){}; //false
    if(undefined){}; //false

上面的语句都是正确的，if中的条件都是false。但是如果注释掉oTemp的声明部分，情况就不同了：

    //var oTemp = null; 注释掉变量声明语句
    if(oTemp){}; //error

会抛出错误。但是无论是否声明过oTemp对象，使用typeof运算符获取到的都是undefined并且不会报错：

    //var oTemp1; 注释掉变量声明语句
    alert(typeof oTemp1); //输出 “undefined”
    var oTemp2;
    alert(typeof oTemp2); //输出 “undefined”

所以**如果在程序中使用一个可能没有定义过的变量，并且没有使用typeof做判断，那么就会出现脚本错误**。而如果是此变量是null或者没有初始化的undefined对象，可以通过if或者“==”来判断。**切记，未声明的对象只能使用typeof运算符来判断！**

正因为如此，typeof经常和undefined变量一起使用。typeof运算符返回的都是一个字符串，而时常程序员会当作类型来使用。是否你也犯过如下的错误呢？

    //var oTemp; 注释掉变量声明语句
    if(typeof oTemp == undefined ){…}; //false

这里if将永远是false。要时刻铭记typeof返回的是字符串，应该使用字符串比较：

    //var oTemp; 注释掉变量声明语句
    if(typeof oTemp ==”undefined”){…};//true

下面是typeof运算符对各类型的返回结果：

    undefined：“undefined”
    null：“object”
    string：“string”
    number：“number”
    boolean：“Boolean”
    function：“function”
    object：“object”

结果只有null类型让人吃惊。null类型返回object，这其实是JavaScript最初实现的一个错误，然后被ECMAScript沿用了，也就成为了现在的标准。所以需要将null类型理解为“对象的占位符”，就可以解释这一矛盾，虽然这只是一中 “辩解”。对于代码编写者一定要时刻警惕这个“语言特性”，因为：

    alert(typeof null == “null”)；//输出 false

永远为false。

还要提醒，一个没有返回值的function（或者直接return返回）实际上返回的是undefined。

    function voidMethod()
    {
    return; 
    }
    alert(voidMethod()); //输出 "undefined"

原文：[js中undefined，null和typeof运算符](http://www.cnblogs.com/ttltry-air/archive/2011/03/24/1993433.html)
