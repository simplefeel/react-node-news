var express = require('express')
const path = require('path')
var app = express()
var superagent = require('superagent')
var cheerio = require('cheerio')
const port = process.env.PORT || 8080

app.get('/news', function (req, res, next) {
    superagent
        .get('http://www.tmtpost.com/nictation')
        .end(function (err, sres) {
            if (err) {
                return next(err);
            }
            var $ = cheerio.load(sres.text);
            var items = [];
            $('.day_part .w_tit a').each(function (idx, element) {
                items.push({
                    title:$(this).text(),
                    href: $(this).attr('href')
                })
            });

            res.send(items);
        });
})

// 设置浏览器可以直接访问的静态文件目录，例如localhost:9000/index.html
app.use(express.static('public'))

// 通配路由，返回生产环境index.html，然后由前端代码处理交互以及路由跳转等
app.get('*', function (request, response) {
    response.sendFile(path.resolve('public/index.html'))
})

// 监听服务
app.listen(port, function () {
    console.log('Example app listening on port 9000!')
})