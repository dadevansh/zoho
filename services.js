const mysql = require('mysql');
const request = require('request');

exports.putKeys = putKeys;
exports.getKeys = getKeys;
exports.sendReq = sendReq;

function putKeys(table, posts){
    return new Promise((resolve, reject) =>{
        let sql = `insert into ${table} set ?`;
        db.query(sql, posts, (err, result) => {
            if(err) reject(err);
            resolve(result);
        })
    })
}

function getKeys(table, id){
    return new Promise((resolve, reject)=>{
        let sql = `select * from ${table} where user_id = ${id}`
        db.query(sql, (err, result)=>{
            if(err) reject(err);
            resolve(result);
        })
    })
}

function sendReq(options){
    return new Promise((resolve, reject)=>{
        request(options, function(err, res, body){
            if(err){
                console.log(err);
                reject(err);
            } 
            resolve(body);
        })
    })
}