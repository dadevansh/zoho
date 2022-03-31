const validator = require('./validator.js')
const controller = require('./controller.js')

app.post('/getdata', validator.vali, controller.getdata)
app.get('/getcode',controller.getcode)
app.get('/', controller.code)
app.post('/gettoken',controller.gettoken);