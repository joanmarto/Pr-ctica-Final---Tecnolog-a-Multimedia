
let Twit = require('twit');

let T = new Twit({
  consumer_key: 'gq7W2TPrBYz7BeXBCnzE4KoOy',
  consumer_secret: 'S961Sp31xpKHGEEa4fBSY1gEjJTj7yT6KmWIKyjTXfAHD7NY01',
  access_token: '1212094481308123136-ZNZwiEvFlySAAMee6pI0gvIeMvy5fU',
  access_token_secret: 'OrNyjdw86ChmjN2pkukiPTt1YZCYX72cZJVrHKJ2BDhds',

})


var allTweets;
var infotweet;
function hola(){
  T.get('search/tweets', { q: 'hola since:2011-07-11', count: 10 }, function (err, data, response) {
    //console.log(data)
   allTweets= data.statuses.map(tweet => printData(tweet));
   infotweet=data;
 
  
  })
  document.getElementById("hola").innerHTML=allTweets[1].created_at;

}

function printData(tweet) {
  return {
    created_at: tweet.created_at,
    text: tweet.text,
    name: tweet.user.name,
    screen_name: tweet.user.screen_name,
    profile_image_url_https: tweet.user.profile_image_url_https,
  }

}

function gg(){
  document.getElementById("hola").innerHTML="dsda";

}




