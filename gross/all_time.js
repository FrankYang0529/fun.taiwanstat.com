var url = require('url');
var fs = require('fs');
var async = require('async');

var request = require('request');
var cheerio = require('cheerio');
var stage = require('node-stage');
var beautify = require('js-beautify').js_beautify;
var boxf = 'http://pro.boxoffice.com/statistics/alltime_numbers';
var field = ['#', 'movie', 'href', 'release date', 'gross']

var req_url = function(boxf) {
  if(fs.existsSync('./year_gross/alltime_result.csv'))
    fs.unlinkSync('./year_gross/alltime_result.csv');

  request(boxf, function(err, resp, body){
    if (!err && resp.statusCode == 200) {
      $ = cheerio.load(body);

      fs.appendFileSync('./year_gross/alltime_result.csv', field.join(', ') + '\n')

      movies = $('.sdt tbody tr'); //jquery get all tr

      movies.each(function(i, mov){
        console.log('----')
        var clip = [];
        mov.children.forEach(function(el, i) {
          if(el.children[0].data) {
            // console.log(el.children[0].data)
            clip.push('"' + el.children[0].data + '"');
          } else{
            var href = el.children[0].attribs.href;
            var name = el.children[0].children[0].data;
            
            clip.push('"' + name + '"');
            clip.push('"' + href + '"');

          }
        })
        fs.appendFileSync('./year_gross/alltime_result.csv', clip.join(', ') + '\n');
      })
    }else {
      stage.error("URL Fetching Error: " + resp.statusCode + ', ' + boxf);
      cb(resp.statusCode);
    }
  });
}

req_url(boxf);
