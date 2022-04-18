const axios = require("axios");
var bodyParser = require('body-parser');
const config = require("config");
const request = require('request');
const servies = require('../services.js')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

exports.oauthLogin = oauthLogin;
exports.oauthSuccess = oauthSuccess;
exports.getdata = getdata;
exports.createtask = createtask;

async function getdata(req, res){
    try{
        let data = {
            client_id: req.body.client_id, 
            client_secret: req.body.client_secret, 
            api_key: req.body.api_key, org_id: req.body.org_id, refresh_token: req.body.refresh_token};
        let result = await servies.putKeys('zoho', data);
        res.send(result)
    }
    catch(err){
        console.log(err);
    }
}

async function oauthLogin(req, res){
    try{
        const client_id = result[0].client_id;
        let result = await servies.getKeys('zoho', '1');
        url = `${config.get(grantCodeUrl)}&client_id=${client_id}&scope=${config.get("scope")}&redirect_uri=${config.get("redirectURL")}`;
        return res.redirect(url)
    }
    catch(err){
        console.log(err);
    }
}

async function oauthSuccess(req, res){
    try{
        const access_code = req.query.code;
        let result = await servies.getKeys('zoho', '1');
        const client_id = result[0].client_id;
        const client_secret = result[0].client_secret;
        const location = decodeURI(req.query.location);
        url = `https://accounts.zoho.${location}/oauth/v2/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${config.get("redirectURL")}&code=${access_code}`;
            console.log(url);
            const options = {
                url: url,
                method: 'POST',
            }
            request(options, function(err, res, body){
                body = JSON.parse(body);
                const access_token = body.access_token;
                const options2 = {
                    url: `https://commerce.zoho.${location}${webhook}`,
                    method: 'POST',
                    headers: { 
                        'Content-Type'  : 'application/json',
                        "Authorization" : `Zoho-oauthtoken ${access_token}`,
                    },
                    body : {
                        "url":`${config.get("redirectURL")}/createtask`,
                        "events": [
                            "salesorder.created"
                        ]
                    },
                    json: true
                }
                console.log(options2);
                request(options2, function(err, res, body){
                    console.log(err);
                    console.log(body);
                })
            })
    }
    catch(err){
        console.log(err);
    }
}

async function createtask(req, res) {
    try{
        let result = await servies.getKeys('zoho', '1')
        body = JSON.parse(req.body.JSONString);
        let data = body.salesorder;
        let customer_address = data.shipping_address.address + ", " + data.shipping_address.street2 + ", " + data.shipping_address.city + ", " + data.shipping_address.state + ", " + data.shipping_address.zip + ", " + data.shipping_address.country;
        let customer_name = data.contact_person_details[0].first_name + data.contact_person_details[0].last_name;
        body = {
            "api_key": result[0].api_key,
            "order_id": data.salesorder_number,
            "customer_username": customer_name,
            "customer_phone": data.contact_person_details[0].phone,
            "customer_address": customer_address,
            "job_pickup_address": result[0].pickup_add,
            "job_delivery_datetime": data.date,
            "has_pickup": '0',
            "has_delivery": '1',
            "layout_type": '0',
            "timezone":"-330",
            "tracking_link": '1',
            "pickup_custom_field_template" : "random1",
            "pickup_meta_data" : [{
                "test" : data.balance
            }]
        }
        const options = {
            url: `${config.get("createTask")}`,
            method: 'POST',
            body: body,
            json: true
        }
        console.log(options);
        let output;
        output = await servies.sendReq(options);
        console.log(output);
        res.send(output);
    }
    catch(err){
        console.log(err);
    }
}