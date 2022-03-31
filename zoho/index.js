const validator = require('./validator.js')
const controller = require('./controller.js')

app.get('/getcode',validator.vali ,controller.getcode)
app.get('/', controller.code)
app.post('/gettoken', validator.vali , controller.gettoken);