var request = require('request');
exports.sendMessage = sendMessage;

function sendMessage(){
    var options = {
        'method': 'POST',
        'url': 'https://api.releans.com/v2/message',
        'headers': {
          'Authorization': 'Bearer 8ac6646678a04124790854d2346546a4'
        },
        form: {
          'sender': 'dev',
          'mobile': '+919416019633',
          'content': 'Hello from Releans API'
        }
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
      });
}