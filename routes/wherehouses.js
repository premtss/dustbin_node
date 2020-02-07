const express = require('express');
const router = express.Router();
const wherehouseCtrl = require('../controller/wherehouse');
const verify=require('./common');
const jwt=require('jsonwebtoken');


router.post('/v1/wherehouseList',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
         
        }else{
            wherehouseCtrl.getAllwarehousesItems(req.body.page,req.body.perpage,result => {
            res.status(200).send({ success:true,message: 'Successfully!', result});
        });
    }
    });
 });

 router.post('/v1/wherehousemappedList',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
         
        }else{
            wherehouseCtrl.getAllwarehousesmapped(req.body.page,req.body.perpage,result => {
            res.status(200).send({ success:true,message: 'Successfully!', result});
        });
    }
    });
 });



 router.get('/v1/dropdownlistwarehouse',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
         
        }else{
            wherehouseCtrl.warehousesDropDownList(result => {
            res.status(200).send({ success:true,message: 'Successfully!', result});
        });
    }
    });
 });


router.post('/v1/addnewwherehouse',verify.token,verify.blacklisttoken, (req,res,next)=>{

    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});          
        }else{
            //console.log(req.body.name1);
            //console.log(req.body.email); //return false;
            //console.log(req.body);
            if(req.body.name1==undefined || req.body.name1==""){
                res.status(422).send({success:false,message:"Name is required!"});
            }
            else if(req.body.email==undefined || req.body.email==""){
                res.status(422).send({success:false,message:"Email  is required!"}); 
            }
            else if(req.body.mobile==undefined || req.body.mobile==""){
                res.status(422).send({success:false,message:"Mobile Number is required!"});
            }
            else if(req.body.latt==undefined || req.body.latt==""){
                res.status(422).send({success:false,message:"lattitute is missing!"});
            }
            else if(req.body.longt==undefined || req.body.longt==""){
                res.status(422).send({success:false,message:"logitute is missing!"});
            }
            else if(req.body.fulladdress==undefined || req.body.fulladdress==""){
                res.status(422).send({success:false,message:"Address is required!"});
            }else{
                wherehouseCtrl.existMobileRecord(req.body.mobile,result=>{
                    if(result==1){
                        wherehouseCtrl.addNewDWherehouse(req.body.name1,req.body.email,req.body.mobile,req.body.latt,req.body.longt,req.body.fulladdress,results => {

                            res.status(200).send({ success:true,message: 'Successfully!', results});
            
                          });
                    }else{
                        res.status(200).send({ success:false, message:"Wherehouse Contact Mobile Number is already exist! Please enter correct your Mobile Number"}); 
                    }
                })
               
    
            }

    }
    });
 });

 router.put('/v1/updatewherehouse',verify.token,verify.blacklisttoken, (req,res,next)=>{

    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});          
        }else{
            if(req.body.name==undefined || req.body.name==""){
                res.status(422).send({success:false,message:"Name is required!"});
            }
            else if(req.body.email==undefined || req.body.email==""){
                res.status(422).send({success:false,message:"Email  is required!"}); 
            }
            else if(req.body.mobile==undefined || req.body.mobile==""){
                res.status(422).send({success:false,message:"Mobile Number is required!"});
            }
            else if(req.body.latt==undefined || req.body.latt==""){
                res.status(422).send({success:false,message:"lattitute is missing!"});
            }
            else if(req.body.longt==undefined || req.body.longt==""){
                res.status(422).send({success:false,message:"logitute is missing!"});
            }
            else if(req.body.fulladdress==undefined || req.body.fulladdress==""){
                res.status(422).send({success:false,message:"Address is required!"});
            }else{
               
                wherehouseCtrl.updateWherehouse(req.body.name,req.body.email,req.body.latt,req.body.longt,req.body.fulladdress,req.body.mobile,results => {
                    res.status(200).send({ success:true,message: results});            
                });
                   
        
            }

         }
    });
 });

 router.post('/v1/wherehouseDetails',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});         
        }     
        else{
            if(req.body.wid==undefined ||req.body.wid==""){
                res.status(422).send({ success:false,message: 'wherehouse ID  is required!' });
            }else{
                wherehouseCtrl.getwarehousesDetails(req.body.wid,result => {
                    res.status(200).send({ success:true,message: 'Successfully!', result});
                });
            }
       }
    });
 });

 // Delete Vehicle

 router.delete('/v1/wherehouseDelete',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});         
        }     
        else{
            if(req.body.wid==undefined ||req.body.wid==""){
                res.status(422).send({ success:false,message: 'Warehouses ID  is required!' });
            }else{
                wherehouseCtrl.deletewarehousesDetails(req.body.wid,result => {
                    res.status(200).send({ success:true,message: 'Successfully!', result});
                });
            }
       }
    });
 });


 router.post('/v1/mappedwherehousewithvehicle',verify.token,verify.blacklisttoken, (req,res,next)=>{

    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});          
        }else{

            if(req.body.dataSet==undefined || req.body.dataSet==""){
                res.status(422).send({success:false,message:"Name is required!"});
            }
           else{
                  
            wherehouseCtrl.mappedWherehousewithvehice(req.body.dataSet,results => {
                    res.status(200).send({ success:true,message: 'Successfully!', results});
            
             });
                  
            }

        }
    });
 });


module.exports = router;