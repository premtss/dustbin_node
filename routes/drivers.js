const express = require('express');
const router = express.Router();
const driverCtrl = require('../controller/driver');
const verify=require('./common');
const jwt=require('jsonwebtoken');
var _ = require('underscore');
const multer = require('multer');
const path = require('path');

// Set The Storage Engine
const storage = multer.diskStorage({
	destination: './public/drivers/',
	filename: function(req, file, cb){
	  cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
  });
  


// Init Upload
const upload = multer({
	storage: storage,
	fileFilter: function(req, file, cb){
	  checkFileType(file, cb);
	}
  });
  
  // Check File Type
  function checkFileType(file, cb){
	// Allowed ext
	const filetypes = /jpeg|jpg|png|gif/;
	// Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
    const mimetype = filetypes.test(file.mimetype);
    // Check mime
	//const filesize = filetypes.test(file.size);
 
	if(mimetype && extname){
	  return cb(null,true);
    }
  
    else {
	  cb('Error: Images Only!');
	}
  }


  // Vehicle List with pagenation and filter data

router.post('/v1/driverlist',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
         
        }else{
            var driverstatus=req.body.driverstatus || "";
                var avablitystatus=req.body.avablitystatus || "";
              //console.log(req.body);
            driverCtrl.getAllDriverItems(req.body.page,req.body.perpage,driverstatus,avablitystatus,result => {
              //  console.log(result);
            res.status(200).send({ success:true,message: 'Successfully!', result});
        });
    }
    });
 });



   // Vehicle List with pagenation and filter data

router.post('/v1/drivernotassignlist',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
         
        }else{
            driverCtrl.DrivernotassignItems(req.body.page,req.body.perpage,result => {
            res.status(200).send({ success:true,message: 'Successfully!', result});
        });
    }
    });
 });


 // Add New Driver

 router.post('/v1/addNewDriver',verify.token,verify.blacklisttoken,upload.fields([{'name':'passportimage' }, {'name':'nationalidimage' },{'name':'drivinglicimage'},{'name':'visaimage'},{'name':'driverimage'}]), (req,res)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});             
        }else{
          
        if(req.body.drivername==undefined ||req.body.drivername==""){
            res.status(422).send({ success:false,message: 'Driver Name is required!' });
        }
        else if(req.body.email==undefined ||req.body.email==""){
            res.status(422).send({ success:false,message: 'Driver Email is required!' });
        }
        else if(req.body.mobileno==undefined ||req.body.mobileno==""){
            res.status(422).send({ success:false,message: 'Driver Mobile number is required!' });
        }
        // else if(req.body.password==undefined ||req.body.password==""){
        //     res.status(422).send({ success:false,message: 'Password is required!' });
        // }
        else if(req.body.nationality==undefined ||req.body.nationality==""){
            res.status(422).send({ success:false,message: 'Nationality is required!' });
        }
       
        else if(req.body.caddress==undefined ||req.body.caddress==""){
            res.status(422).send({ success:false,message: 'Current address is required!' });
        }
        else if(req.body.ccity==undefined ||req.body.ccity==""){
            res.status(422).send({ success:false,message: 'Current City is required!' });
        }
        else if(req.body.cstate==undefined ||req.body.cstate==""){
            res.status(422).send({ success:false,message: 'Current State is required!' });
        }
        else if(req.body.ccountry==undefined ||req.body.ccountry==""){
            res.status(422).send({ success:false,message: 'Select Current country is required!' });
        }
        else if(req.body.cpobox==undefined ||req.body.cpobox==""){
            res.status(422).send({ success:false,message: 'Current po-box is required!' });
        }
        else if(req.body.crefname==undefined ||req.body.crefname==""){
            res.status(422).send({ success:false,message: 'Current ref name is required!' });
        }
        else if(req.body.crefno==undefined ||req.body.crefno==""){
            res.status(422).send({ success:false,message: 'Current ref number is required!' });
        }
        else if(req.body.paddress==undefined ||req.body.paddress==""){
            res.status(422).send({ success:false,message: 'Parmanent address is required!' });
        }
        else if(req.body.pcity==undefined ||req.body.pcity==""){
            res.status(422).send({ success:false,message: 'Parmanent city is required!' });
        }
        else if(req.body.pstate==undefined ||req.body.pstate==""){
            res.status(422).send({ success:false,message: 'Parmanent state is required!' });
        }
        else if(req.body.pcountry==undefined ||req.body.pcountry==""){
            res.status(422).send({ success:false,message: 'Parmanent country is required!' });
        }
        else if(req.body.ppobox==undefined ||req.body.ppobox==""){
            res.status(422).send({ success:false,message: 'Parmanent pobox is required!' });
        }
        else if(req.body.prefname==undefined ||req.body.prefname==""){
            res.status(422).send({ success:false,message: 'Parmanent ref name is required!' });
        }
        else if(req.body.prefno==undefined ||req.body.prefno==""){
            res.status(422).send({ success:false,message: 'Parmanent ref no is required!' });
        }
        else if(req.body.passportissuedate==undefined ||req.body.passportissuedate==""){
            res.status(422).send({ success:false,message: 'Passport issue date is required!' });
        }
        else if(req.body.passportexpiredate==undefined ||req.body.passportexpiredate==""){
            res.status(422).send({ success:false,message: 'Passport expire date is required!' });
        }
        else if(req.files['passportimage']==undefined){
            res.status(422).send({success:false,message:"Passport photo is required!"});
        }
        else if(req.body.nationalidissuedate==undefined ||req.body.nationalidissuedate==""){
            res.status(422).send({ success:false,message: 'National id issue date is required!' });
        }
        else if(req.body.nationalidexpiredate==undefined ||req.body.nationalidexpiredate==""){
            res.status(422).send({ success:false,message: 'National id expire date is required!' });
        }
        else if(req.files['nationalidimage']==undefined){
            res.status(422).send({success:false,message:"Nationalid photo is required!"});
         }
        else if(req.body.drivinglicissuedate==undefined ||req.body.drivinglicissuedate==""){
            res.status(422).send({ success:false,message: 'Driving lic issue date is required!' });
        }
        else if(req.body.drivinglicexpiredate==undefined ||req.body.drivinglicexpiredate==""){
            res.status(422).send({ success:false,message: 'Driving lic Expiry date is required!' });
        }
        else if(req.files['drivinglicimage']==undefined){
            res.status(422).send({success:false,message:"Driving lic photo is required!"});
         }
        else if(req.body.visaissuedate==undefined ||req.body.visaissuedate==""){
            res.status(422).send({ success:false,message: 'Visa issue date is required!' });
        }
        else if(req.body.visaexpiredate==undefined ||req.body.visaexpiredate==""){
            res.status(422).send({ success:false,message: 'Visa expire date is required!' });
        }
        else if(req.files['visaimage']==undefined){
            res.status(422).send({success:false,message:"Visa photo is required!"});
         }
         else if(req.files['driverimage']==undefined){
            res.status(422).send({success:false,message:"Driver photo is required!"});
         }
        
        
        else{
           // console.log(req); return false;
          
            driverCtrl.existMobileRecord(req.body.mobileno,resultSet=>{
                
                if(resultSet==1){
                    driverCtrl.addNewDriver(req.body.drivername,req.body.email,req.body.mobileno,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,req.files['passportimage'][0].filename,req.body.nationalidissuedate,req.body.nationalidexpiredate,req.files['nationalidimage'][0].filename,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,req.files['drivinglicimage'][0].filename,req.body.visaissuedate,req.body.visaexpiredate,req.files['visaimage'][0].filename,req.files['driverimage'][0].filename,result => {
                        res.status(201).send({ success:true,message: result}); 
                    });
                }else{
                    res.status(200).send({ success:false, message:"Driver Mobile Number is already exist! Please enter correct your Mobile Number"}); 
                }
            });

        }

      }
    });
 });

 // Update Vehicle
 
router.put('/v1/updateDriver',verify.token,verify.blacklisttoken,upload.fields([{'name':'passportimage' }, {'name':'nationalidimage' },{'name':'drivinglicimage'},{'name':'visaimage'},{'name':'driverimage'}]), (req,res)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});             
        }else{
          
        if(req.body.drivername==undefined ||req.body.drivername==""){
            res.status(422).send({ success:false,message: 'Driver Name is required!' });
        }
        // else if(req.body.email==undefined ||req.body.email==""){
        //     res.status(422).send({ success:false,message: 'Driver Email is required!' });
        // }
        else if(req.body.mobileno==undefined ||req.body.mobileno==""){
            res.status(422).send({ success:false,message: 'Driver Mobile number is required!' });
        }
        
        // else if(req.body.password==undefined ||req.body.password==""){
        //     res.status(422).send({ success:false,message: 'Password is required!' });
        // }
        else if(req.body.nationality==undefined ||req.body.nationality==""){
            res.status(422).send({ success:false,message: 'Nationality is required!' });
        }
       
        else if(req.body.caddress==undefined ||req.body.caddress==""){
            res.status(422).send({ success:false,message: 'Current address is required!' });
        }
        else if(req.body.ccity==undefined ||req.body.ccity==""){
            res.status(422).send({ success:false,message: 'Current City is required!' });
        }
        else if(req.body.cstate==undefined ||req.body.cstate==""){
            res.status(422).send({ success:false,message: 'Current State is required!' });
        }
        else if(req.body.ccountry==undefined ||req.body.ccountry==""){
            res.status(422).send({ success:false,message: 'Select Current country is required!' });
        }
        else if(req.body.cpobox==undefined ||req.body.cpobox==""){
            res.status(422).send({ success:false,message: 'Current po-box is required!' });
        }
        else if(req.body.crefname==undefined ||req.body.crefname==""){
            res.status(422).send({ success:false,message: 'Current ref name is required!' });
        }
        else if(req.body.crefno==undefined ||req.body.crefno==""){
            res.status(422).send({ success:false,message: 'Current ref number is required!' });
        }
        else if(req.body.paddress==undefined ||req.body.paddress==""){
            res.status(422).send({ success:false,message: 'Parmanent address is required!' });
        }
        else if(req.body.pcity==undefined ||req.body.pcity==""){
            res.status(422).send({ success:false,message: 'Parmanent city is required!' });
        }
        else if(req.body.pstate==undefined ||req.body.pstate==""){
            res.status(422).send({ success:false,message: 'Parmanent state is required!' });
        }
        else if(req.body.pcountry==undefined ||req.body.pcountry==""){
            res.status(422).send({ success:false,message: 'Parmanent country is required!' });
        }
        else if(req.body.ppobox==undefined ||req.body.ppobox==""){
            res.status(422).send({ success:false,message: 'Parmanent pobox is required!' });
        }
        else if(req.body.prefname==undefined ||req.body.prefname==""){
            res.status(422).send({ success:false,message: 'Parmanent ref name is required!' });
        }
        else if(req.body.prefno==undefined ||req.body.prefno==""){
            res.status(422).send({ success:false,message: 'Parmanent ref no is required!' });
        }
        else if(req.body.passportissuedate==undefined ||req.body.passportissuedate==""){
            res.status(422).send({ success:false,message: 'Passport issue date is required!' });
        }
        else if(req.body.passportexpiredate==undefined ||req.body.passportexpiredate==""){
            res.status(422).send({ success:false,message: 'Passport expire date is required!' });
        }
        // else if(req.files['passportimage']==undefined){
        //     res.status(422).send({success:false,message:"Passport photo is required!"});
        // }
        else if(req.body.nationalidissuedate==undefined ||req.body.nationalidissuedate==""){
            res.status(422).send({ success:false,message: 'National id issue date is required!' });
        }
        else if(req.body.nationalidexpiredate==undefined ||req.body.nationalidexpiredate==""){
            res.status(422).send({ success:false,message: 'National id expire date is required!' });
        }
        // else if(req.files['nationalidimage']==undefined){
        //     res.status(422).send({success:false,message:"Nationalid photo is required!"});
        //  }
        else if(req.body.drivinglicissuedate==undefined ||req.body.drivinglicissuedate==""){
            res.status(422).send({ success:false,message: 'Driving lic issue date is required!' });
        }
        else if(req.body.drivinglicexpiredate==undefined ||req.body.drivinglicexpiredate==""){
            res.status(422).send({ success:false,message: 'Driving lic Expiry date is required!' });
        }
        // else if(req.files['drivinglicimage']==undefined){
        //     res.status(422).send({success:false,message:"Driving lic photo is required!"});
        //  }
        else if(req.body.visaissuedate==undefined ||req.body.visaissuedate==""){
            res.status(422).send({ success:false,message: 'Visa issue date is required!' });
        }
        else if(req.body.visaexpiredate==undefined ||req.body.visaexpiredate==""){
            res.status(422).send({ success:false,message: 'Visa expire date is required!' });
        }
        // else if(req.files['visaimage']==undefined){
        //     res.status(422).send({success:false,message:"Visa photo is required!"});
        //  }
        //  else if(req.files['driverimage']==undefined){
        //     res.status(422).send({success:false,message:"Driver photo is required!"});
        //  }
         else{

            
            if(req.files['passportimage']==undefined && req.files['nationalidimage']==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']==undefined && req.files['driverimage']==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,results.national_id_image,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,results.driver_image,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']!==undefined && req.files['nationalidimage']==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']==undefined && req.files['driverimage']==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,req.files['passportimage'][0].filename,req.body.nationalidissuedate,req.body.nationalidexpiredate,results.national_id_image,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,results.driver_image,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']==undefined && req.files['nationalidimage']!==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']==undefined && req.files['driverimage']==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,req.files['nationalidimage'][0].filename,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,results.driver_image,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']==undefined && req.files['nationalidimage']==undefined && req.files['drivinglicimage']!==undefined && req.files['visaimage']==undefined && req.files['driverimage']==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,results.national_id_image,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,req.files['drivinglicimage'][0].filename,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,results.driver_image,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']==undefined && req.files['nationalidimage']==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']!==undefined && req.files['driverimage']==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,results.national_id_image,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,req.files['visaimage'][0].filename,results.driver_image,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']==undefined && req.files['nationalidimage']==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']==undefined && req.files['driverimage']!==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,results.national_id_image,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,req.files['driverimage'][0].filename,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']==undefined && req.files['nationalidimage']==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']!==undefined && req.files['driverimage']!==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,results.national_id_image,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,req.files['visaimage'][0].filename,req.files['driverimage'][0].filename,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']==undefined && req.files['nationalidimage']==undefined && req.files['drivinglicimage']!==undefined && req.files['visaimage']==undefined && req.files['driverimage']!==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,results.national_id_image,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,req.files['drivinglicimage'][0].filename,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,req.files['driverimage'][0].filename,req.body.mobileno,result => {
                        res.status(200).send({ success:true,message: result}); 
                    });

                });
             }

             else if(req.files['passportimage']==undefined && req.files['nationalidimage']!==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']==undefined && req.files['driverimage']!==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,req.files['nationalidimage'][0].filename,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,req.files['driverimage'][0].filename,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']!==undefined && req.files['nationalidimage']==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']==undefined && req.files['driverimage']!==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,req.files['passportimage'][0].filename,req.body.nationalidissuedate,req.body.nationalidexpiredate,results.national_id_image,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,req.files['driverimage'][0].filename,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']!==undefined && req.files['nationalidimage']!==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']==undefined && req.files['driverimage']==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,req.files['passportimage'][0].filename,req.body.nationalidissuedate,req.body.nationalidexpiredate,req.files['nationalidimage'][0].filename,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,results.driver_image,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']!==undefined && req.files['nationalidimage']==undefined && req.files['drivinglicimage']!==undefined && req.files['visaimage']==undefined && req.files['driverimage']==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,req.files['passportimage'][0].filename,req.body.nationalidissuedate,req.body.nationalidexpiredate,results.national_id_image,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,req.files['drivinglicimage'][0].filename,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,results.driver_image,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']!==undefined && req.files['nationalidimage']==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']!==undefined && req.files['driverimage']==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,req.files['passportimage'][0].filename,req.body.nationalidissuedate,req.body.nationalidexpiredate,results.national_id_image,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,req.files['visaimage'][0].filename,results.driver_image,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']==undefined && req.files['nationalidimage']!==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']==undefined && req.files['driverimage']!==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,req.files['nationalidimage'][0].filename,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,req.files['driverimage'][0].filename,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']==undefined && req.files['nationalidimage']!==undefined && req.files['drivinglicimage']!==undefined && req.files['visaimage']==undefined && req.files['driverimage']==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,req.files['nationalidimage'][0].filename,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,req.files['drivinglicimage'][0].filename,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,results.driver_image,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']==undefined && req.files['nationalidimage']!==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']==undefined && req.files['driverimage']!==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,req.files['nationalidimage'][0].filename,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,req.files['driverimage'][0].filename,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']==undefined && req.files['nationalidimage']==undefined && req.files['drivinglicimage']!==undefined && req.files['visaimage']!==undefined && req.files['driverimage']==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,results.national_id_image,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,req.files['drivinglicimage'][0].filename,req.body.visaissuedate,req.body.visaexpiredate,req.files['visaimage'][0].filename,results.driver_image,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']==undefined && req.files['nationalidimage']==undefined && req.files['drivinglicimage']!==undefined && req.files['visaimage']==undefined && req.files['driverimage']!==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,results.national_id_image,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,req.files['drivinglicimage'][0].filename,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,req.files['driverimage'][0].filename,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']==undefined && req.files['nationalidimage']==undefined && req.files['drivinglicimage']!==undefined && req.files['visaimage']!==undefined && req.files['driverimage']!==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,results.national_id_image,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,req.files['drivinglicimage'][0].filename,req.body.visaissuedate,req.body.visaexpiredate,req.files['visaimage'],req.files['driverimage'][0].filename,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }

             else if(req.files['passportimage']==undefined && req.files['nationalidimage']!==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']!==undefined && req.files['driverimage']!==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,results.passport_image,req.body.nationalidissuedate,req.body.nationalidexpiredate,req.files['nationalidimage'][0].filename,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,req.files['visaimage'],req.files['driverimage'][0].filename,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']!==undefined && req.files['nationalidimage']==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']!==undefined && req.files['driverimage']!==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,req.files['passportimage'][0].filename,req.body.nationalidissuedate,req.body.nationalidexpiredate,results.national_id_image,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,req.files['visaimage'][0].filename,req.files['driverimage'][0].filename,req.body.mobileno,result => {
                        res.status(200).send({ success:true,message: result}); 
                    });

                });
             }

             else if(req.files['passportimage']!==undefined && req.files['nationalidimage']!==undefined && req.files['drivinglicimage']!==undefined && req.files['visaimage']==undefined && req.files['driverimage']==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,req.files['passportimage'][0].filename,req.body.nationalidissuedate,req.body.nationalidexpiredate,req.files['nationalidimage'][0].filename,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,req.files['drivinglicimage'][0].filename,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,results.driver_image,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']!==undefined && req.files['nationalidimage']!==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']!==undefined && req.files['driverimage']==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,req.files['passportimage'][0].filename,req.body.nationalidissuedate,req.body.nationalidexpiredate,req.files['nationalidimage'][0].filename,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,req.files['visaimage'][0].filename,results.driver_image,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
             else if(req.files['passportimage']!==undefined && req.files['nationalidimage']!==undefined && req.files['drivinglicimage']==undefined && req.files['visaimage']==undefined && req.files['driverimage']!==undefined){
                driverCtrl.getDriver(req.body.mobileno, results=>{
                    driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,req.files['passportimage'][0].filename,req.body.nationalidissuedate,req.body.nationalidexpiredate,req.files['nationalidimage'][0].filename,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,results.driving_lic_image,req.body.visaissuedate,req.body.visaexpiredate,results.visa_image,req.files['driverimage'][0].filename,req.body.mobileno,result => {
                        res.status(200).send({success:true, message: result}); 
                    });

                });
             }
            else{
                driverCtrl.updateDriver(req.body.drivername,req.body.nationality,req.body.caddress,req.body.ccity,req.body.cstate,req.body.ccountry,req.body.cpobox,req.body.crefname,req.body.crefno,req.body.paddress,req.body.pcity,req.body.pstate,req.body.pcountry,req.body.ppobox,req.body.prefname,req.body.prefno,req.body.passportissuedate,req.body.passportexpiredate,req.files['passportimage'][0].filename,req.body.nationalidissuedate,req.body.nationalidexpiredate,req.files['nationalidimage'][0].filename,req.body.drivinglicissuedate,req.body.drivinglicexpiredate,req.files['drivinglicimage'][0].filename,req.body.visaissuedate,req.body.visaexpiredate,req.files['visaimage'][0].filename,req.files['driverimage'][0].filename,req.body.mobileno,result => {
                    res.status(200).send({success:true, message: result}); 
                }); 
            }
            
 
        }

      }
    });
 });

 // Single Details Vehicle

 router.post('/v1/driverDetails',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});         
        }     
        else{
            if(req.body.did==undefined ||req.body.did==""){
                res.status(422).send({ success:false,message: 'Driver ID  is required!' });
            }else{
                driverCtrl.getDriverDetails(req.body.did,result => {
                    res.status(200).send({ success:true,message: 'Successfully!', result});
                });
            }
       }
    });
 });



 // Single Details Vehicle

 router.post('/v1/driverDetailswithall',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});         
        }     
        else{
            if(req.body.mobileno==undefined ||req.body.mobileno==""){
                res.status(422).send({ success:false,message: 'Driver ID  is required!' });
            }else{
                driverCtrl.getDriver(req.body.mobileno,result => {

                   

                    const grouping = _.groupBy(result.historyList, function(element){
                        return element.GroupName;
                     });
                    const dustbinData = _.map(grouping, (items, warehouse) => ({
                            Groupstatus:items[0].Groupstatus,
                            groupName:warehouse, 
                            warehousename:items[0].wname,
                            warehouseaddress: items[0].warehouseaddress,
                            VehicleName: items[0].modelName,
                            VehicleRC: items[0].vehicle_rc,
                            driverName:items[0].drivername,
                            drivermobile:items[0].mobile_no,
                            vephoto:items[0].vphoto,
                            dustbincount: items.length,
                            dataassignDate:items[0].assigndate,                             
                            vehicleID:items[0].vehicleID,
                           // assignstatus:items[0].assignstatus
                           
                    }));
                  //  console.log(dustbinData)
                    res.status(200).send({ success:true,message: 'Successfully!', dustbinData,result});
                });
            }
       }
    });
 });
 // Delete Vehicle

 router.delete('/v1/driverDelete',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});         
        }     
        else{
            if(req.body.did==undefined ||req.body.did==""){
                res.status(422).send({ success:false,message: 'Vehicle ID  is required!' });
            }else{
                driverCtrl.deleteVehiclesDetails(req.body.did,result => {
                    res.status(200).send({ success:true,message: 'Successfully!', result});
                });
            }
       }
    });
 });


 router.post('/v1/driverlivehistory',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
         
        }else{
            var selectdate=req.body.selectdate || "";
          
            driverCtrl.driverAvabilityHistory(req.body.page,req.body.perpage,selectdate,result => {
            res.status(200).send({ success:true,message: 'Successfully!', result});
        });
    }
    });
 });

module.exports = router;