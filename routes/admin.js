const express = require('express');
const router = express.Router();
const adminCtrl = require('../controller/admins');
const vehicleCtrl = require('../controller/vehicle');
const verify=require('./common');
const jwt=require('jsonwebtoken');

const multer = require('multer');
const path = require('path');

// Set The Storage Engine
const storage = multer.diskStorage({
	destination: './public/uploads/',
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

// Admin Login

router.post('/v1/login', verify.verifyStaticToken,(req,res)=>{
    jwt.verify(req.statictoken,process.env.StaticTokenKey,(err,authData)=>{
        if(err){
            res.status(401).send({success:false,message:"Unauthorized Token"});     
        }else{
            if(req.body.email==''||req.body.email==undefined){
                res.status(422).send({success:false,message:"Email id is required!"})
            }else if(req.body.password==''||req.body.password==undefined){
                res.status(422).send({success:false,message:"Password is required!"})
            }
            else{
                adminCtrl.getSingleItems(req.body.email,req.body.password,result => {
                    if(result==null || result==undefined){
                        res.status(422).send({ success:false,message: 'Invalid credational!' });
                    }else{
                        
                        if(result.email==undefined || result.email=="" && result.name==undefined|| result.name=="" && result.mobile_no==undefined|| result.mobile_no==""){
                            res.status(509).send({ success:false,message: 'Something went wrong!' });
                        }else{
                            if(result.login_status==0){
                                res.status(509).send({ success:false,message: 'Not Approved for login!' });
                            }else{
                                jwt.sign({name:result.name,email:result.email,mobile:result.mobile_no}, process.env.JWTTokenKey,(err,token)=>{ 
                                    if(err) throw err;
                                    else{
                                        adminCtrl.updateLoginStatus(result.email,results=>{
                                            res.setHeader('Authorization','Bearer '+token,'Content-Type', 'application/json');
                                            res.status(200).send({ success:true,message: 'Successfully Login!', result});
                                          
                                        });                                       
                                    }                                   
                                });
                            }                         
                        } 
                    }                  
                });
            }
        }
    });
});

// Admin Logout

router.get('/v1/logout', verify.token,(req, res)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
      if(err){
          res.status(401).send({success:false,message:"Unauthorized Token"});
       
      }else{
      
            adminCtrl.blacklistSelectToken(req.token,result=>{
                if(result==undefined || result==null){
                    adminCtrl.blacklistToken(req.token,resData=>{
                        adminCtrl.updateLoginStatus(authData.email,results=>{
                        res.status(200).send({success:true,message:"Logged out Successfully"});
                        });
                    });
                }else{
                    res.status(401).send({success:false,message:"this token is already expired!!"});
                }
            });
          }
    });
  });
  

// Vehicle List with pagenation and filter data

router.post('/v1/vehiclelist',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
         
        }else{
        vehicleCtrl.getAllVehiclesItems(req.body.page,req.body.perpage,req.body.vehiclestatus,result => {
            res.status(200).send({ success:true,message: 'Successfully!', result});
        });
    }
    });
 });



 // Vehicle List with pagenation and filter data

router.post('/v1/vehiclenotassign',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
         
        }else{
        vehicleCtrl.VehiclesNotAssigned(req.body.page,req.body.perpage,result => {
            res.status(200).send({ success:true,message: 'Successfully!', result});
        });
    }
    });
 });


 // Add New Vehicle

 router.post('/v1/addNewVehicle',verify.token,verify.blacklisttoken,upload.fields([{'name':'vehiclephoto' }, {'name':'registrationcard' },{'name':'insurancephoto'}]), (req,res)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});             
        }else{
           
           //console.log(req); return false;
        if(req.body.modelname==undefined ||req.body.modelname==""){
            res.status(422).send({ success:false,message: 'Vehicle Model Name is required!' });
        }
        else if(req.body.mgfyear==undefined ||req.body.mgfyear==""){
            res.status(422).send({ success:false,message: 'Vehicle mgf year is required!' });
        }
        else if(req.body.companyname==undefined ||req.body.companyname==""){
            res.status(422).send({ success:false,message: 'Vehicle company name is required!' });
        }
        else if(req.body.trucktype==undefined ||req.body.trucktype==""){
            res.status(422).send({ success:false,message: 'Vehicle truck type is required!' });
        }
        else if(req.body.capacity==undefined ||req.body.capacity==""){
            res.status(422).send({ success:false,message: 'Vehicle capacity is required!' });
        }
       
        else if(req.body.vehiclerc==undefined ||req.body.vehiclerc==""){
            res.status(422).send({ success:false,message: 'Vehicle RC Number is required!' });
        }
        else if(req.body.rcissue==undefined ||req.body.rcissue==""){
            res.status(422).send({ success:false,message: 'Vehicle RC issue date is required!' });
        }
        else if(req.body.rcexpire==undefined ||req.body.rcexpire==""){
            res.status(422).send({ success:false,message: 'Vehicle RC expire date is required!' });
        }
        else if(req.body.issuecountry==undefined ||req.body.issuecountry==""){
            res.status(422).send({ success:false,message: 'Select country is required!' });
        }
        else if(req.body.insuranceno==undefined ||req.body.insuranceno==""){
            res.status(422).send({ success:false,message: ' InsuranceNo is required!' });
        }
        else if(req.body.insuranceissuedate==undefined ||req.body.insuranceissuedate==""){
            res.status(422).send({ success:false,message: 'Insurance issue date is required!' });
        }
        else if(req.body.insuranceexpiredate==undefined ||req.body.insuranceexpiredate==""){
            res.status(422).send({ success:false,message: 'Insurance expire date is required!' });
        }
        else if(req.body.insurancecompany==undefined ||req.body.insurancecompany==""){
            res.status(422).send({ success:false,message: 'Insurance Company Name is required!' });
        }
        else if(req.body.insurancecover==undefined ||req.body.insurancecover==""){
            res.status(422).send({ success:false,message: 'Insurance cover is required!' });
        }
        else if(req.body.coveragelimit==undefined ||req.body.coveragelimit==""){
            res.status(422).send({ success:false,message: 'Insurance cover limit is required!' });
        }
          else if(req.files['registrationcard']==undefined && req.files['vehiclephoto']==undefined && req.files['insurancephoto']==undefined){
             res.status(422).send({success:false,message:"Photo is required!"});
          }
          else if(req.files['vehiclephoto']==undefined){
            res.status(422).send({success:false,message:"vehicle photo is required!"});
         }
         else if(req.files['registrationcard']==undefined){
            res.status(422).send({success:false,message:"Registrationcard photo is required!"});
         }
         else if(req.files['insurancephoto']==undefined){
            res.status(422).send({success:false,message:"Insurance photo is required!"});
         }
        
        else{
          
            vehicleCtrl.existRecoard(req.body.vehiclerc,resultSet=>{
                
                if(resultSet==1){
                    vehicleCtrl.addNewVehicle(req.body.modelname,req.body.mgfyear,req.body.companyname,req.body.trucktype, req.body.capacity,req.body.vehiclerc,req.body.rcissue,req.body.rcexpire,req.body.issuecountry,req.body.insuranceno,req.body.insuranceissuedate,req.body.insuranceexpiredate,req.body.insurancecompany,req.body.insurancecover,req.body.coveragelimit,req.files['vehiclephoto'][0].filename,req.files['registrationcard'][0].filename,req.files['insurancephoto'][0].filename,result => {
                        res.status(201).send({success:true, message: result}); 
                    });
                }else{
                    res.status(200).send({ success:false, message:"Vehicle RC number is already exist! Please enter correct your RC Number"}); 
                }
            });

        }

      }
    });
 });

 // Update Vehicle
 
 router.put('/v1/updateVehicle',verify.token,verify.blacklisttoken,upload.fields([{'name':'vehiclephoto' }, {'name':'registrationcard' },{'name':'insurancephoto'}]), (req,res)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});             
        }else{
            console.log(req);
        if(req.body.Vid==undefined ||req.body.Vid==""){
            res.status(422).send({ success:false,message: 'ID is required!' });
        }
        if(req.body.modelname==undefined ||req.body.modelname==""){
            res.status(422).send({ success:false,message: 'Vehicle Model Name is required!' });
        }
        else if(req.body.mgfyear==undefined ||req.body.mgfyear==""){
            res.status(422).send({ success:false,message: 'Vehicle mgf year is required!' });
        }
        else if(req.body.companyname==undefined ||req.body.companyname==""){
            res.status(422).send({ success:false,message: 'Vehicle company name is required!' });
        }
        else if(req.body.trucktype==undefined ||req.body.trucktype==""){
            res.status(422).send({ success:false,message: 'Vehicle truck type is required!' });
        }
        else if(req.body.capacity==undefined ||req.body.capacity==""){
            res.status(422).send({ success:false,message: 'Vehicle capacity is required!' });
        }
        else if(req.body.rcissue==undefined ||req.body.rcissue==""){
            res.status(422).send({ success:false,message: 'Vehicle RC issue date is required!' });
        }
        else if(req.body.rcexpire==undefined ||req.body.rcexpire==""){
            res.status(422).send({ success:false,message: 'Vehicle RC expire date is required!' });
        }
        else if(req.body.issuecountry==undefined ||req.body.issuecountry==""){
            res.status(422).send({ success:false,message: 'Select country is required!' });
        }
        else if(req.body.insuranceno==undefined ||req.body.insuranceno==""){
            res.status(422).send({ success:false,message: ' InsuranceNo is required!' });
        }
        else if(req.body.insuranceissuedate==undefined ||req.body.insuranceissuedate==""){
            res.status(422).send({ success:false,message: 'Insurance issue date is required!' });
        }
        else if(req.body.insuranceexpiredate==undefined ||req.body.insuranceexpiredate==""){
            res.status(422).send({ success:false,message: 'Insurance expire date is required!' });
        }
        else if(req.body.insurancecompany==undefined ||req.body.insurancecompany==""){
            res.status(422).send({ success:false,message: 'Insurance Company Name is required!' });
        }
        else if(req.body.insurancecover==undefined ||req.body.insurancecover==""){
            res.status(422).send({ success:false,message: 'Insurance cover is required!' });
        }
        else if(req.body.coveragelimit==undefined ||req.body.coveragelimit==""){
            res.status(422).send({ success:false,message: 'Insurance cover limit is required!' });
        }
         else if(req.body.vehiclerc==undefined || req.body.vehiclerc==""){
            res.status(422).send({success:false,message:"Vehiclerc is required!"});
         }

        else{

            if(req.files['registrationcard']==undefined && req.files['vehiclephoto']==undefined && req.files['insurancephoto']==undefined){
                vehicleCtrl.getVehicles(req.body.vehiclerc, result=>{
                    vehicleCtrl.updateVehicle(req.body.modelname,req.body.mgfyear,req.body.companyname,req.body.trucktype, req.body.capacity,req.body.rcissue,req.body.rcexpire,req.body.issuecountry,req.body.insuranceno,req.body.insuranceissuedate,req.body.insuranceexpiredate,req.body.insurancecompany,req.body.insurancecover,req.body.coveragelimit,result.vehicle_photo,result.registration_card,result.insurance_photo,req.body.Vid,results => {
                         res.status(201).send({ success:true,message: results}); 
                     });

                });
             }
            else if(req.files['registrationcard']!==undefined && req.files['vehiclephoto']==undefined && req.files['insurancephoto']==undefined){
                vehicleCtrl.getVehicles(req.body.vehiclerc, result=>{
                    vehicleCtrl.updateVehicle(req.body.modelname,req.body.mgfyear,req.body.companyname,req.body.trucktype, req.body.capacity,req.body.rcissue,req.body.rcexpire,req.body.issuecountry,req.body.insuranceno,req.body.insuranceissuedate,req.body.insuranceexpiredate,req.body.insurancecompany,req.body.insurancecover,req.body.coveragelimit,result.vehicle_photo,req.files['registrationcard'][0].filename,result.insurance_photo,req.body.Vid,results => {
                         res.status(201).send({ success:true,message: results}); 
                     });

                });
             }
             else if(req.files['registrationcard']==undefined && req.files['vehiclephoto']!==undefined && req.files['insurancephoto']==undefined){

                vehicleCtrl.getVehicles(req.body.vehiclerc, result=>{
                    vehicleCtrl.updateVehicle(req.body.modelname,req.body.mgfyear,req.body.companyname,req.body.trucktype, req.body.capacity,req.body.rcissue,req.body.rcexpire,req.body.issuecountry,req.body.insuranceno,req.body.insuranceissuedate,req.body.insuranceexpiredate,req.body.insurancecompany,req.body.insurancecover,req.body.coveragelimit,req.files['vehiclephoto'][0].filename,result.registration_card,result.insurance_photo,req.body.Vid,results => {
                         res.status(201).send({ success:true,message: results}); 
                     });

                });
             }
             else  if(req.files['registrationcard']==undefined && req.files['vehiclephoto']==undefined && req.files['insurancephoto']!==undefined){

                vehicleCtrl.getVehicles(req.body.vehiclerc, result=>{
                    vehicleCtrl.updateVehicle(req.body.modelname,req.body.mgfyear,req.body.companyname,req.body.trucktype, req.body.capacity,req.body.rcissue,req.body.rcexpire,req.body.issuecountry,req.body.insuranceno,req.body.insuranceissuedate,req.body.insuranceexpiredate,req.body.insurancecompany,req.body.insurancecover,req.body.coveragelimit,result.vehicle_photo,result.registration_card,req.files['insurancephoto'][0].filename,req.body.Vid,results => {
                         res.status(201).send({ success:true,message: results}); 
                     });

                });
             }
             else  if(req.files['registrationcard']!==undefined && req.files['vehiclephoto']!==undefined && req.files['insurancephoto']===undefined){

                vehicleCtrl.getVehicles(req.body.vehiclerc, result=>{
                    vehicleCtrl.updateVehicle(req.body.modelname,req.body.mgfyear,req.body.companyname,req.body.trucktype, req.body.capacity,req.body.rcissue,req.body.rcexpire,req.body.issuecountry,req.body.insuranceno,req.body.insuranceissuedate,req.body.insuranceexpiredate,req.body.insurancecompany,req.body.insurancecover,req.body.coveragelimit,req.files['vehiclephoto'][0].filename,req.files['registrationcard'][0].filename,result.insurance_photo,req.body.Vid,results => {
                         res.status(201).send({ success:true,message: results}); 
                     });

                });
             }

             else  if(req.files['registrationcard']==undefined && req.files['vehiclephoto']!==undefined && req.files['insurancephoto']!==undefined){

                vehicleCtrl.getVehicles(req.body.vehiclerc, result=>{
                    vehicleCtrl.updateVehicle(req.body.modelname,req.body.mgfyear,req.body.companyname,req.body.trucktype, req.body.capacity,req.body.rcissue,req.body.rcexpire,req.body.issuecountry,req.body.insuranceno,req.body.insuranceissuedate,req.body.insuranceexpiredate,req.body.insurancecompany,req.body.insurancecover,req.body.coveragelimit,req.files['vehiclephoto'][0].filename,result.registration_card,req.files['insurancephoto'][0].filename,req.body.Vid,results => {
                         res.status(201).send({ success:true,message: results}); 
                     });

                });
             }
             else  if(req.files['registrationcard']!==undefined && req.files['vehiclephoto']==undefined && req.files['insurancephoto']!==undefined){

                vehicleCtrl.getVehicles(req.body.vehiclerc, result=>{
                    vehicleCtrl.updateVehicle(req.body.modelname,req.body.mgfyear,req.body.companyname,req.body.trucktype, req.body.capacity,req.body.rcissue,req.body.rcexpire,req.body.issuecountry,req.body.insuranceno,req.body.insuranceissuedate,req.body.insuranceexpiredate,req.body.insurancecompany,req.body.insurancecover,req.body.coveragelimit,result.vehicle_photo,req.files['registrationcard'][0].filename,req.files['insurancephoto'][0].filename,req.body.Vid,results => {
                         res.status(201).send({ success:true,message: results}); 
                     });

                });
             }

            
             else{

                vehicleCtrl.updateVehicle(req.body.modelname,req.body.mgfyear,req.body.companyname,req.body.trucktype, req.body.capacity,req.body.rcissue,req.body.rcexpire,req.body.issuecountry,req.body.insuranceno,req.body.insuranceissuedate,req.body.insuranceexpiredate,req.body.insurancecompany,req.body.insurancecover,req.body.coveragelimit,req.files['vehiclephoto'][0].filename,req.files['registrationcard'][0].filename,req.files['insurancephoto'][0].filename,req.body.Vid,result => {
                    res.status(201).send({ message: result}); 
                });
             }

            

       
        }

      }
    });
 });

 // Single Details Vehicle

 router.post('/v1/vehicleDetails',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});         
        }     
        else{
            if(req.body.vid==undefined ||req.body.vid==""){
                res.status(422).send({ success:false,message: 'Vehicle ID  is required!' });
            }else{
                vehicleCtrl.getVehiclesDetails(req.body.vid,result => {
                    res.status(200).send({ success:true,message: 'Successfully!', result});
                });
            }
       }
    });
 });


  // Single Details Vehicle and Driver

  router.post('/v1/vehicleDetailsalldriver',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});         
        }     
        else{
            if(req.body.vehiclerc==undefined ||req.body.vehiclerc==""){
                res.status(422).send({ success:false,message: 'Vehicle RC  is required!' });
            }else{
                vehicleCtrl.getVehicles(req.body.vehiclerc,result => {
                    res.status(200).send({ success:true,message: 'Successfully!', result});
                });
            }
       }
    });
 });

 // Delete Vehicle

 router.delete('/v1/vehicleDelete',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});         
        }     
        else{
           // console.log(req);
            //console.log(req.body.vid); return false;
            if(req.body.vid==undefined ||req.body.vid==""){
                res.status(422).send({ success:false,message: 'Vehicle ID  is required!' });
            }else{
                vehicleCtrl.deleteVehiclesDetails(req.body.vid,result => {
                    res.status(200).send({ success:true,message: 'Successfully!', result});
                });
            }
       }
    });
 });




 // Mapped Vehicle

 router.post('/v1/mappedVehicledriver',verify.token,verify.blacklisttoken, (req,res)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});             
        }else{
           
           //console.log(req); return false;
        if(req.body.vehicleId==undefined ||req.body.vehicleId==""){
            res.status(422).send({ success:false,message: 'Vehicle  is required!' });
        }
        else if(req.body.DriverId==undefined ||req.body.DriverId==""){
            res.status(422).send({ success:false, message: 'DriverId  is required!' });
        }
         else{

             vehicleCtrl.MappedVehiclewithdriver(req.body.vehicleId,req.body.DriverId,result => {
                res.status(201).send({success:true, message: result}); 
            });
              
        }

      }
    });
  });


module.exports = router;