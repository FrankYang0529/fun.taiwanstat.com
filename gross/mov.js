var url = require('url');
var fs = require('fs');
var async = require('async');

var request = require('request');
var cheerio = require('cheerio');
var stage = require('node-stage');
var beautify = require('js-beautify').js_beautify;
var boxf = 'http://pro.boxoffice.com/statistics/movies/domestic_load/avatar-2009?authenticity_token=v4kZ%2B9g6S1yU7Z99N7BK%2F%2BHAGs5jMs6xWa%2BoNYWES0s%3D&page=1&authenticity_token=v4kZ%2B9g6S1yU7Z99N7BK%2F%2BHAGs5jMs6xWa%2BoNYWES0s%3D';

if(fs.existsSync('./daily.csv'))
  fs.unlinkSync('./daily.csv');

var req_url = function(boxf) {
  var j = request.jar()
  var cookie = request.cookie('_boxoffice_session=d74d5d8435d00da9c936716526d2a458');
  j.setCookie(cookie, boxf);

  var options = {
    url: boxf,
    jar: j,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36',
      "Accept-Encoding": 'gzip, deflate, sdch',
      'Accept-Language': 'en-US,en;q=0.8,ja;q=0.6,th;q=0.4,zh-CN;q=0.2,zh-TW;q=0.2',
      'Referer': 'http://pro.boxoffice.com/statistics/movies/avatar-2009',
      'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
      'Connection': 'keep-alive',
      'X-Prototype-Version': '1.6.0.3',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  request(options, function(err, resp, body){
    console.log(body)
    if (!err && resp.statusCode == 200) {
      console.log(body)
       
    }else {
      stage.error("URL Fetching Error: " + resp.statusCode + ', ' + boxf)
    }
  });
}

req_url(boxf);