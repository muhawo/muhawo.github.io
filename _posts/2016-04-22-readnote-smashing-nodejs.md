---
layout: post
title: 读书笔记之了不起的nodejs
---

## v8中javascript的新特性

* OBJECT#KEYS 获取对象的键值

        Object.keys(a); //['a', 'c']
* ARRAY#ISARRAY 检查是否是数组

        Array.isArray(new Array); //true
        Array.isArray([]); //true
        Array.isArray(null); //false
        Array.isArray(arguments); //false

* FUNCTION#BIND

        function a(){
            console.log(this.name);
        };

        var b = a.bind({name: 'John'});
        b(); //John

        var c = a.bind({name: 'Tom'});
        c(); //Tom

* \_\_proto\_\_(继承) 使得定义继承链变得更容易

        function Animal(){}
        function Ferret(){}
        Ferret.prototype.\_\_proto\_\_ = Animal.prototype;

## 实用的全局对象

* process.nextTick函数可以将一个函数的执行时间规划到下一个时间循环中

        console.log(1);
        process.nextTick(function(){
            console.log(3);
        })
        console.log(2);

    输出：1 2 3 

    把它想象成`setTimeout(fn,1)`或者“通过异步在最近的将来调用该函数”

##命令行工具（CLI）以及FS API

* Node允许通过`process.env`变量来轻松访问`shell`环境下的变量
* 要在文本终端下控制格式、颜色以及其他输出选项，可以使用ANSI转义吗

        console.log('\033[90m' + 'Hello Node' + '\033[39m')

    * \033表示转义序列的开始。
    * [表示开始颜色设置。
    * 90表示前景色为亮灰色。
    * m表示颜色设置结束。

    最后用的39表示将颜色再设置回去

* 监视文件的变化

    `fs.watchFile`监视单个文件, `fs.watch`可以监视整个目录

## TCP

* Node.js中有两个和连接终止相关的事件： end和close。

    end是客户端显式关闭TCP连接是触发，比如，当你关闭telnet是，它会发送一个名为“FIN”的包给服务器，意味着连接要结束。

    当连接发生错误时（触发error事件）， end事件不会触发，因为服务器端并未接受到“FIN”包消息。不过这两种情况下close事件都会触发。

## HTTP

* 一个用于读取`image.png`文件的例子

        require('http').createServer(function(req, res){
            res.writeHead(200, {'Content-Type': 'image/png'});
            var stream = require('fs').createReadStream('image.png');
            stream.on('data', function(data){
                res.write(data);
            });
            stream.on('end', function(){
                res.end();
            });
        }).listen(3000);

    实际上我们做的就是把一个流（stream）（文件系统）接（piping）到另一个流上（一个http.serverResponse对象）。流的对接很常见，为此，Node.js提供了一个更方便的做法

        require('http').createServer(function(req, res){
            res.writeHead(200, {'Content-Type': 'image/png'});
            require('fs').createreadstream('image.png').pipe(res);
        }).listen(3000);

* querystring模块可以方便的对url中的参数进行解析

        console.log(require('querystring').parse('name=Guillermo'));

    输出： {name: 'Guillermo'}

    querystring模块会将字符串解析成一个对象

* superagent 方便请求的发送和响应的解析

    * 自动解析响应中的json数据，放在res.body中
    * 查询字符串无须手动编码

    记着，做get，post请求时使用superagent，方便对请求的处理

* 使用up重启HTTP服务器

    为了避免每次修改代码后手动重启服务器，可以使用up模块，监测到文件改动时安全的进行服务器重启，即不立即杀死请求中的进程。

        module.exports = require('http').createServer(function(req, res){
            res.writeHead(200, {'Content-Type':　'text/html'});
            res.end('hello <b>world</b>>');
        });

        $ npm install -g up
        $ up -watch -port 80 server.js

## Connect

Connect是一个基于HTTP服务器的工具集，他提供了一种新的组织代码的方式来与请求、响应对象进行交互，成为中间件（middleware）。
* 创建服务器

        var connect = require('connect');
        var server = connect.createServer();

* static中间件 进行静态文件托管
        server.use(connect.static(\_\_dirname+'website'));

    Connect允许中间件挂载到URL。比如，static允许将任意一个URL匹配到文件系统的任意一个目录
    
    要让/my-images URL和名为/images的目录对应起来，可以通过以下方式进行挂载：

        server.use('/my-image', connect.static('path/to/iamges'));

    static中间件选项maxAge 代表一个资源在客户端缓存的时间
        
        server.use(connect.static('/path/to/bundles', {maxAge: 10000000000000}));

* query中间件 将url /blog-posts?page=5 中的查询字符串存储到req.query

        server.use(connect.query);
        server.use(function(req, res){
            //req.query.page == "5";
        });

* logger中间件

    logger中间件提供了四种日志格式：

        * default
        * dev
        * short
        * tiny

    使用dev日志格式，如下进行初始化logger中间件

        server.use(connect.logger('dev'));

    logger允许自动日志输出格式，比如指向记录请求方法和IP地址：

        server.use(connect.logger(':method :remote-addr'));

    通过动态的req和res来记录头信息，比如记录响应的content-length和content-type：
        
        server.use(connect.logger('type is :res[content-type], length is :res[content-length]'));

    完整的可用token：

    * :req[header] （如：req[Accept]）
    * :res[header] （如：res[Content-Length])
    * :http-version
    * :response-time
    * :remote-addr
    * :date
    * :method
    * :url
    * :referrer
    * :user-agent
    * :status

* bodyParser中间件

    bodyParser可以在req.body中获取POST请求的数据。

    用户通过表单提交name的时候， 直接使用http时对res的处理:

        var qs = require('querystring');
        var server = require('http').createServer(function(req, res){
            if('/url' == req.url && 'POST' == req.method){
                var body = '';
                res.on('data', function(chunk){
                    body+=chunk;
                });
                res.on('end', function(){
                    res.writeHead(200, {'Content-type': 'text/html'});
                    res.end('<p>Your name is <b>'+ qs.parse(body).name +'</b></p>')
                });
            }
        });

    使用connect bodyParser：

        var connect = require('connect');
        var server = connect.createServer();
        server.use(connect.bodyparser());
        server.use(function(req, res){
            res.writeHead(200, {'Content-type': 'text/html'});
            res.end('<p>Your name is <b>'+ req.body.name +'</b></p>')
        });

