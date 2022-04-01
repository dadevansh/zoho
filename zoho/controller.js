const axios = require("axios");
const { redirect } = require("express/lib/response");
const mysql = require('mysql');
var bodyParser = require('body-parser')

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
        let sql = 'INSERT INTO zoho SET ?';
        db.query(sql, posts, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send(result);
        })
    }
    catch(err){
        console.log(err);
    }
}

async function getcode(req, res){
    try{
        let a = '1';
        let url;
        let sql = `select * from zoho where user_id = ${a}`;
        db.query(sql, (err, result) =>{
            if(err) console.log(err);
            
            url = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${result[0].client_id}&scope=ZohoCommerce.salesorders.all,ZohoCommerce.webhooks.CREATE,ZohoCommerce.shipmentorders.all&redirect_uri=https://90ad-103-16-30-142.ngrok.io&access_type=offline`;
            return res.redirect(url)
        })
        
    }
    catch(err){
        console.log(err);
    }
}

async function code(req, res){
    try{
        const access_code = req.query.code;
        let sql = 'select * from zoho where user_id = 1';
            db.query(sql, (err, result) => {
                callback(result, access_code)
            })
    }
    catch(err){
        console.log(err);
    }
}

async function callback(req, access_code){
    try{
        url = `https://accounts.zoho.in/oauth/v2/token?grant_type=authorization_code&client_id=${req[0].client_id}&client_secret=${req[0].client_secret}&redirect_uri=https://90ad-103-16-30-142.ngrok.io&code=${access_code}`;
                res = await axios.post(url)
                const access_token = res.data.access_token;
                console.log("lsjlsd---------->>>" + access_token);

                let rere;
                body = {
                    "url":"https://90ad-103-16-30-142.ngrok.io/createtask",
                    "events": ["salesorder.created"]
                }
                rere = await axios.post("https://commerce.zoho.in/store/api/v1/settings/webhooks", body, {
                    header: { 
                        'Content-Type'  : 'application/json',
                        'Authorization' : `Zoho-oauthtoken ${access_token}`,
                        'X-com-zoho-store-organizationid' : req[0].org_id
                    }
                })
    }
    catch(err){
        console.log(err);
    }
}

async function gettoken(req, res){
    try{
        let url=``;
        let sql = 'select * from zoho where user_id = 1';
        db.query(sql, async (err, result) =>{
            if(result.length != 6) {
                console.log("database error")
                return;
            }
            if(err) console.log(err);

            url = `https://accounts.zoho.in/oauth/v2/token?refresh_token=${result[0].refrest_token}&client_id=${result[0].client_id}&client_secret=${result[0].client_secret}&grant_type=refresh_token`;
            res = await axios.post(url)
            const access_token = res.data.access_token;

            let rere;
            rere = await axios.post("https://webhook.site/b5ac3564-0240-461d-b4ad-87f4e33e55b1", access_token)
        })
    } 
    catch (err){
        console.log(err);
    }
}

async function createtask(req, res) {
    try{
        // body = {
        //     "api_key": req.body.api_key,
        //     "order_id": req.body.order_id,
        //     "team_id": req.body.team_id,
        //     "auto_assignment": req.body.auto_assignment,
        //     "job_description": req.body.job_description,
        //     "job_pickup_phone": req.body.job_pickup_phone,
        //     "job_pickup_name": req.body.job_pickup_name,
        //     "job_pickup_address": req.body.job_pickup_address,
        //     "job_pickup_latitude": req.body.job_pickup_latitude,
        //     "job_pickup_longitude": req.body.job_pickup_longitude,
        //     "job_pickup_datetime": req.body.job_pickup_datetime,
        //     "customer_username": req.body.customer_username,
        //     "customer_phone": req.body.phone,
        //     "customer_address": req.body.customer_address,
        //     "latitude": req.body.latitude,
        //     "longitude": req.body.longitude,
        //     "job_delivery_datetime": req.body.job_delivery_datetime,
        //     "has_pickup": req.body.has_pickup,
        //     "has_delivery": req.body.has_delivery,
        //     "layout_type": req.body.layout_type,
        //     "tracking_link": req.body.tracking_link,
        //     "timezone": req.body.timezone,
        //     "geofence": req.body.geofence,
        //     "ride_type": req.body.ride_type
        // }

        // res = await axios.post("https://private-anon-ca7028cd66-tookanapi.apiary-mock.com/v2/create_task", body)  
        // console.log(res) 
    }
    catch(err){
        console.log(err);
    }
}