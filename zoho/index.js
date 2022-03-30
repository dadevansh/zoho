const validator = require('./validator.js')
const controller = require('./controller.js')

app.get('/getcode', controller.getcode)
app.get('/', controller.code)
app.post('/gettoken', controller.gettoken);