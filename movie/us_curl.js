var url = require('url');
var fs = require('fs');

var request = require('request');
var cheerio = require('cheerio');
var stage = require('node-stage');
var beautify = require('js-beautify').js_beautify;
var field = ['排名', '上週', '北美週末', '增率', '累積新台幣', '周次', '連結', '片名', '英文片名', 'Youtube', '時間', '海報', '上市', 'IMDB', 'IMDB_vote', 'imdb_ID'];

var myurl = 'http://us.dorama.info/drama/d_box_office.php';

if(fs.existsSync('./us_result.csv'))
  fs.unlinkSync('./us_result.csv');

var req_url = function(myurl) {
  request(myurl, function(err, resp, body){
    if (!err && resp.statusCode == 200) {
      $ = cheerio.load(body);

      fs.appendFileSync('./us_result.csv', field.join(', ') + '\n')

      movies = $('.table_g tr'); //jquery get all tr

      movies.each(function(i, ent){
        // if(ent.children[0].next && ent.children[0].next.attribs.class === 'th2_g') {
        //   // thead
        //   var rank = ent.children[0].next.children[0].data;
        //   var last_w = ent.children[0].next.next.next.children[0].data;
        //   var tai_w = ent.children[0].next.next.next.next.next.children[0].data;
        //   var rate = ent.children[0].next.next.next.next.next.next.next.children[0].data;
        //   var average = ent.children[0].next.next.next.next.next.next.next.next.next.next.next;
        //   var accumulate = average.next.next.children[0].data;
        //   var weeks = average.next.next.next.next.children[0].data;
        //   var cover = '海報';
        //   var name = average.next.next.next.next.next.next.next.next.children[0].data;
        // }else 

        if(i < 60) {
          if(ent.children[0].next && ent.children[0].next.attribs.class === 'td_dt_g') {
            // content
            var rank = ent.children[0].next.children[1].children[0].data;
            if(ent.children[0].next.next.next.children[0].children)
              var last_w = ent.children[0].next.next.next.children[0].children[0].data;
            else
              var last_w = ent.children[0].next.next.next.children[0].data;
            
            var tai_w = ent.children[0].next.next.next.next.next.children[0].data;
            var rate = ent.children[0].next.next.next.next.next.next.next.children[1].children[0].data;
            var average = ent.children[0].next.next.next.next.next.next.next.next.next.next.next;
            var accumulate = average.next.next.children[0].data;
            var weeks = average.next.next.next.next.children[0].data;
            var href = average.next.next.next.next.next.next.children[0].attribs.href;
            
            if(!url.parse(href).protocol)
              var href = 'http://us.dorama.info' + href;
            var name = average.next.next.next.next.next.next.next.next.children[1].children[1].children[0].children[1].children[0].data.trim();

            request(href, function(err, resp, body){
              if (!err && resp.statusCode == 200) {
                $ = cheerio.load(body);

                var mov = $('.table2_g .td2_g .sz2'); //jquery get all tr
                var env_name = mov[0].children[0].data.trim();

                request('http://www.omdbapi.com/?r=json&plot=short&t=' + env_name.replace(" ", "+"), function(err, resp, imdb){
                  if (!err && resp.statusCode == 200) {
                    var imdb = JSON.parse(imdb)
                    request('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + name + '&key=AIzaSyCN7Fm5tDc3S1uIy1UPk9dURgYL3dreVmw', function(err, resp, utube){
                      if (!err && resp.statusCode == 200) {
                        var utube = JSON.parse(utube).items[0].id.videoId;

                        console.log('####')
                        var ent_arr = [];

                        console.log(rank)
                        console.log(last_w)
                        console.log(tai_w)
                        console.log(rate)
                        console.log(accumulate)
                        console.log(weeks)
                        console.log(href)
                        console.log(name)
                        console.log(env_name)

                        console.log('------')

                        ent_arr.push('"' + rank + '"');
                        ent_arr.push('"' + last_w + '"');
                        ent_arr.push('"' + tai_w + '"');
                        ent_arr.push('"' + rate + '"');
                        ent_arr.push('"' + accumulate + '"');
                        ent_arr.push('"' + weeks + '"');
                        ent_arr.push('"' + href + '"');
                        ent_arr.push('"' + name + '"');
                        ent_arr.push('"' + env_name + '"');
                        ent_arr.push('"' + utube + '"');
                        ent_arr.push('"' + imdb.Runtime + '"')
                        ent_arr.push('"' + imdb.Poster + '"')
                        ent_arr.push('"' + imdb.Released + '"')
                        // ent_arr.push('"' + imdb.Plot + '"')
                        ent_arr.push('"' + imdb.imdbRating + '"')
                        ent_arr.push('"' + imdb.imdbVotes + '"')
                        ent_arr.push('"' + imdb.imdbID + '"')

                        var line = ent_arr.join(', ');

                        fs.appendFileSync('./us_result.csv', line + '\n');
                      }
                    })
                  }
                })
              }
            })
          }
        }
      });
       
    }else {
      stage.error("URL Fetching Error: " + resp.statusCode + ', ' + myurl)
    }
  });
}

req_url(myurl);