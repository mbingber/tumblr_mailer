var tumblr = require('tumblr.js');
var ejs = require('ejs');
var fs = require('fs');

var client = tumblr.createClient({
  consumer_key: 'UOjdkZjr1acVxnAE2SdOkbCYKWUjyFcgCSGEIl26yh6tI8Mlej',
  consumer_secret: 'LL7R3jfWsypykjQuNMNAnYOK47ETljNr2eDmzYCWbJGryIzmqg',
  token: '0nYlHFeP1aK0wiEPvMS17fY38rIl8wAUqdgxnazHpxgUhxGTfJ',
  token_secret: 'eFKjhTohBKzchTqSyMIrPtJWdQigFCTPzMmdFbIaqzp2jwAxz8'
});

client.posts('hexandthecity015.tumblr.com', function(err, blog){
  		var output = [];
  		for (var i = 0; i < blog.posts.length; i++) {
  			output.push(blog.posts[i]);
  		}
  		console.log(output);
	});