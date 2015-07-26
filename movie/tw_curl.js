var url = require('url');
var fs = require('fs');
var Q = require('q');
var exec = Q.denodeify(require('child_process').exec)

var request = require('request');
var cheerio = require('cheerio');
var stage = require('node-stage');
var beautify = require('js-beautify').js_beautify;
var field = ['排名', '上週', '台北週末', '增率', '累積新台幣', '周次', '連結', '片名', '英文片名', 'Youtube', '時間', '海報', '上市', 'IMDB', 'IMDB_vote', 'imdb_ID'];

var myurl = 'http://tw.dorama.info/drama/d_box_office.php';
var request = Q.denodeify(request);

if(fs.existsSync('./tw_result.csv'))
  fs.unlinkSync('./tw_result.csv');


request(myurl)
.then(function(body) {
  var body = body[0].body;
  $ = cheerio.load(body);
  fs.appendFileSync('./tw_result.csv', field.join(',') + '\n')

  movies = $('.table_g tr'); //jquery get all tr

  $(movies).each(function(i, ent){
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
        var href = 'http://tw.dorama.info' + href;
      var name = average.next.next.next.next.next.next.next.next.children[1].children[1].children[0].children[1].children[0].data.trim();
    

      request(href)
      .then(function(mov_body) {
        $ = cheerio.load(mov_body[0].body);

        var mov = $('.table2_g .td2_g .sz2'); //jquery get all tr
        var env_name = mov[0].children[0].data.trim();

        return request('http://www.omdbapi.com/?r=json&plot=short&t=' + env_name.replace(" ", "+"))
          .then(function(imdb_body) {
            var imdb = JSON.parse(imdb_body[0].body);

            if(imdb.Poster && imdb.Poster !== 'N/A') {

              var ext = '.' + imdb.Poster.split('.').pop();
              return exec('wget -O ./posters/' + name + ext +' ' + imdb.Poster)
                .then(function(result) {
                  return request('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + name + '&key=AIzaSyCN7Fm5tDc3S1uIy1UPk9dURgYL3dreVmw')
                    .then(function(utube_body) {
                      var utube = utube_body[0].body;

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

                      ent_arr.push(rank);
                      ent_arr.push(last_w);
                      ent_arr.push(tai_w);
                      ent_arr.push(rate);
                      ent_arr.push(accumulate);
                      ent_arr.push(weeks);
                      ent_arr.push('"' + href + '"');
                      ent_arr.push(name);
                      ent_arr.push(env_name);
                      ent_arr.push(utube);
                      ent_arr.push(imdb.Runtime)
                      ent_arr.push('"./posters/' + name + ext + '"')
                      ent_arr.push(imdb.Released)
                      ent_arr.push(imdb.imdbRating)
                      ent_arr.push('"' + imdb.imdbVotes + '"')
                      ent_arr.push(imdb.imdbID)

                      var line = ent_arr.join(',');

                      fs.appendFileSync('./tw_result.csv', line + '\n');
                    })
                    .done();

                })
                .done();

            } else {
              return request('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + name + '&key=AIzaSyCN7Fm5tDc3S1uIy1UPk9dURgYL3dreVmw')
                .then(function(utube_body) {
                  var utube = utube_body[0].body;

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

                  ent_arr.push(rank);
                  ent_arr.push(last_w);
                  ent_arr.push(tai_w);
                  ent_arr.push(rate);
                  ent_arr.push(accumulate);
                  ent_arr.push(weeks);
                  ent_arr.push('"' + href + '"');
                  ent_arr.push(name);
                  ent_arr.push(env_name);
                  ent_arr.push(utube);
                  ent_arr.push(imdb.Runtime)
                  ent_arr.push('"undefined"')
                  ent_arr.push(imdb.Released)
                  ent_arr.push(imdb.imdbRating)
                  ent_arr.push('"' + imdb.imdbVotes + '"')
                  ent_arr.push(imdb.imdbID)

                  var line = ent_arr.join(',');

                  fs.appendFileSync('./tw_result.csv', line + '\n');
                })
                .done();
            }

            
          })
          .done();
      })
      .done();
    }
  })
})

.done();