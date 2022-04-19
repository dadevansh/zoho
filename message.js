var request = require('request');
const config = require('config');
exports.sendMessage = sendMessage;

function sendMessage(){
    var options = {
        'method': 'POST',
        'url': 'https://api.releans.com/v2/message',
        'headers': {
          'Authorization': `Bearer ${config.get("releansKey")}`
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