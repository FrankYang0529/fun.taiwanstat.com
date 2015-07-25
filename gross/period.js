var url = require('url');
var fs = require('fs');
var async = require('async');

var request = require('request');
var cheerio = require('cheerio');
var stage = require('node-stage');
var beautify = require('js-beautify').js_beautify;
var boxf = 'http://pro.boxoffice.com/statistics/alltime_numbers/domestic/data/';
var field = ['#', 'movie', 'href', 'total gross', 'opening', 'opening daily avg', 'release date']

var req_url = function(boxf, count, cb) {
  var year = count + 2001;
  var boxf = boxf + year;
  console.log(boxf);

  if(fs.existsSync('./year/' + year + '_result.csv'))
    fs.unlinkSync('./year/' + year + '_result.csv');

  request(boxf, function(err, resp, body){
    if (!err && resp.statusCode == 200) {
      $ = cheerio.load(body);

      fs.appendFileSync('./year/' + year + '_result.csv', field.join(', ') + '\n')

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
        fs.appendFileSync('./year/' + year + '_result.csv', clip.join(', ') + '\n');
        cb();
      })
    }else {
      stage.error("URL Fetching Error: " + resp.statusCode + ', ' + boxf);
      cb(resp.statusCode);
    }
  });
}

var count = 0;

async.whilst(
  function () { return count < 15},
  function (cb) {
    req_url(boxf, count, cb);
    count++;
  },
  function (err) {
    if(err)
      console.log('Err: ' + err);
    else
      console.log('done')
  }
)