const axios = require("axios");
var bodyParser = require('body-parser');
const request = require('request');
const servies = require('../services.js')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

exports.gettoken = gettoken;
exports.getcode = getcode;
exports.code = code;
exports.getdata = getdata;
exports.createtask = createtask;

async function getdata(req, res){
    try{
        console.log(req.body);

        let posts = {client_id: req.body.client_id, client_secret: req.body.client_secret, api_key: req.body.api_key, org_id: req.body.org_id, refresh_token: req.body.refresh_token};
        let result = await servies.putKeys('zoho', posts);
        res.send(result)
    }
    catch(err){
        console.log(err);
    }
}

async function getcode(req, res){
    try{
        let result = await servies.getKeys('zoho', '1');
        url = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${result[0].client_id}&scope=ZohoCommerce.salesorders.all,ZohoCommerce.webhooks.CREATE,ZohoCommerce.shipmentorders.all&redirect_uri=https://6ddf-103-158-91-7.ngrok.io`;
        return res.redirect(url)
    }
    catch(err){
        console.log(err);
    }
}

async function code(req, res){
    try{
        const access_code = req.query.code;
        let result = await servies.getKeys('zoho', '1');
        url = `https://accounts.zoho.in/oauth/v2/token?grant_type=authorization_code&client_id=${result[0].client_id}&client_secret=${result[0].client_secret}&redirect_uri=https://6ddf-103-158-91-7.ngrok.io&code=${access_code}`;
            console.log(url);
            const options = {
                url: url,
                method: 'POST',
            }
            request(options, function(err, res, body){
                body = JSON.parse(body);
                const access_token = body.access_token;    
                console.log("lsjlsd---------->>>" + access_token);
                const options2 = {
                    url: "https://commerce.zoho.in/store/api/v1/settings/webhooks",
                    method: 'POST',
                    headers: { 
                        'Content-Type'  : 'application/json',
                        "Authorization" : `Zoho-oauthtoken ${access_token}`,
                        // 'X-com-zoho-store-organizationid' : result[0].org_id
                    },
                    body : {
                        "url":"https://6ddf-103-158-91-7.ngrok.io/createtask",
                        "events": [
                            "salesorder.created"
                        ]
                    },
                    json: true
                }
                console.log(options2);
                request(options2, function(err, res, body){
                    console.log("hererererer---------");
                    // body = JSON.parse(body)
                    console.log(err);
                    console.log(body);
                })
            })
    }
    catch(err){
        console.log(err);
    }
}

async function gettoken(req, res){
    try{
        let result = await servies.getKeys('zoho', '1');
        url = `https://accounts.zoho.in/oauth/v2/token?refresh_token=${result[0].refrest_token}&client_id=${result[0].client_id}&client_secret=${result[0].client_secret}&grant_type=refresh_token`;
            res = await axios.post(url)
            const access_token = res.data.access_token;

            let rere;
            rere = await axios.post("https://webhook.site/b5ac3564-0240-461d-b4ad-87f4e33e55b1", access_token)
    } 
    catch (err){
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
            "tracking_link": '1'
        }
        const options = {
            url: 'https://api.tookanapp.com/v2/create_task',
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