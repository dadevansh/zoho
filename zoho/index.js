const validator = require('./validator.js')
const controller = require('./controller.js')

app.post('/getdata', validator.vali, controller.getdata)
app.get('/login',controller.oauthLogin)
app.get('/', controller.oauthSuccess)
app.post('/createtask', controller.createtask)