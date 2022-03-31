const validator = require('../middleware')


const vali = (req, res, next) => {
    console.log(req.body);
    const validationRule = {
        "client_id": "required|string",
        "client_secret": "string",
        "user_id": "number",
        "api_key": "string",
        "refresh_token": "string",
        "org_id": "string"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    });
}

module.exports = { 
  vali
}