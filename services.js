const mysql = require('mysql');

exports.putKeys = putKeys;
exports.getKeys = getKeys;

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