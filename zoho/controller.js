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
            
            url = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${result[0].client_id}&scope=ZohoCommerce.salesorders.all,ZohoCommerce.webhooks.CREATE,ZohoCommerce.shipmentorders.all&redirect_uri=https://9211-103-216-143-207.ngrok.io&access_type=offline`;
            console.log(result[0].client_id);
            return res.redirect(url)
        })
        
    }
    catch(err){
        console.log(err);
    }
}

async function code(req, res){
    const code = req.query.code;

    let sql = 'select * from zoho where user_id = 1';
        db.query(sql, async (err, result) =>{
            if(err) console.log(err);

            url = `https://accounts.zoho.in/oauth/v2/token?grant_type=authorization_code&client_id=${result[0].client_id}&client_secret=${result[0].client_secret}&redirect_uri=https://9211-103-216-143-207.ngrok.io&code=${code}`;
            res = await axios.post(url)
            const access_token = res.data.access_token;

            let rere;
            rere = await axios.post("https://webhook.site/b5ac3564-0240-461d-b4ad-87f4e33e55b1", access_token)
        })

    console.log(code);
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
            console.log(res);

            let rere;
            rere = await axios.post("https://webhook.site/b5ac3564-0240-461d-b4ad-87f4e33e55b1", access_token)
        })
    } 
    catch (err){
        console.log(err);
    }
}
