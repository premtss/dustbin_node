const express = require('express');
const db = require('../DbConnection'); 

//Format of token

module.exports.blacklisttoken=function(req,res,next){
   
        var sql = 'SELECT * from blacklists WHERE jwt_token='+db.escape(req.token);
        db.query(sql,function (error, results) {
            if(error)throw err;
            if(results[0]==undefined){
                next(); 
            }else{ 
             res.status(401).send({success:false, message:"Invalid token",logoutstatus:true });
            }
        });
      
    }


//Format of token

module.exports.token=function(req,res,next){
    //Get auth header value
    const bearerHeader=req.headers['authorization'];
    //check if bearer is undefined
    if(typeof bearerHeader!=='undefined'){
       //split at the space
       const bearer=bearerHeader.split(' ');
       //Get Token from array
       const bearerToken=bearer[1];
       //Set the token
       req.token=bearerToken;
       //Next middleware
       next();
    }else{
        res.sendStatus(403);
    }
}

//Format of token

module.exports.verifyStaticToken=function(req,res,next){
    //Get auth header value

    const bearerHeader=req.headers['authorization'];
    //check if bearer is undefined
    if(typeof bearerHeader!=='undefined'){
       //split at the space
       const bearer=bearerHeader.split(' ');
       //Get Token from array
       const bearerToken=bearer[1];
       //Set the token
       req.statictoken=bearerToken;
     
       //Next middleware
       next();
    }else{
        res.sendStatus(403);
    }
}

