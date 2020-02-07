const express = require('express');
const router = express.Router();
const dustbinCtrl = require('../controller/dustbin');
const verify=require('./common');
const jwt=require('jsonwebtoken');

var _ = require('underscore');
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCntPB-qN_-K60eVMgJkJEy8Dn2ZxvxC6Y',
    Promise: Promise
  });
  module.exports=function(io){
router.post('/v1/dustbinList',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
         
        }else{
            dustbinCtrl.getAlldustbinsItems(req.body.page,req.body.perpage,result => {

            res.status(200).send({ success:true,message: 'Successfully!', result});



        });
    }
    });
 });


router.post('/v1/addnewdustbin',verify.token,verify.blacklisttoken, (req,res,next)=>{

    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});          
        }else{
            if(req.body.wid==undefined || req.body.wid==""){
                res.status(422).send({success:false,message:"wherehouse id is required!"});
            }
            if(req.body.name==undefined || req.body.name==""){
                res.status(422).send({success:false,message:"Name is required!"});
            }
            else if(req.body.latiude==undefined || req.body.latiude==""){
                res.status(422).send({success:false,message:"latiude  is required!"}); 
            }
            else if(req.body.longitude==undefined || req.body.longitude==""){
                res.status(422).send({success:false,message:"longitude is required!"});
            }
            else if(req.body.address==undefined || req.body.address==""){
                res.status(422).send({success:false,message:"address is missing!"});
            }
            else if(req.body.gsm_moblie_number==undefined || req.body.gsm_moblie_number==""){
                res.status(422).send({success:false,message:"gsm_moblie_number is missing!"});
            }else{
                dustbinCtrl.existMobileRecord(req.body.gsm_moblie_number,result=>{
                    if(result==1){
                        dustbinCtrl.addNewDdustbins(req.body.wid,req.body.name,req.body.latiude,req.body.longitude,req.body.address,req.body.gsm_moblie_number,results => {

                            res.status(200).send({ success:true,message: 'Successfully!', results});
            
                          });
                    }else{
                        res.status(200).send({ success:false, message:"GSM Number is already exist! Please enter correct your Mobile Number"}); 
                    }
                })
               
    
            }

    }
    });
 });

 router.put('/v1/updatedustbin',verify.token,verify.blacklisttoken, (req,res,next)=>{

    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});          
        }else{
            
            if(req.body.wid==undefined || req.body.wid==""){
                res.status(422).send({success:false,message:"wherehouse id is required!"});
            }
            if(req.body.name==undefined || req.body.name==""){
                res.status(422).send({success:false,message:"Name is required!"});
            }
            else if(req.body.latiude==undefined || req.body.latiude==""){
                res.status(422).send({success:false,message:"latiude  is required!"}); 
            }
            else if(req.body.longitude==undefined || req.body.longitude==""){
                res.status(422).send({success:false,message:"longitude is required!"});
            }
            else if(req.body.address==undefined || req.body.address==""){
                res.status(422).send({success:false,message:"address is missing!"});
            }
            else if(req.body.gsm_moblie_number==undefined || req.body.gsm_moblie_number==""){
                res.status(422).send({success:false,message:"gsm_moblie_number is missing!"});
            }
            else{
               
                dustbinCtrl.updatedustbins(req.body.wid,req.body.name,req.body.latiude,req.body.longitude,req.body.address,req.body.gsm_moblie_number,results => {
                    res.status(200).send({ success:true,message: results});            
                });
                   
        
            }

         }
    });
 });

 router.post('/v1/dustbinDetails',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});         
        }     
        else{
            if(req.body.did==undefined ||req.body.did==""){
                res.status(422).send({ success:false,message: 'wherehouse ID  is required!' });
            }else{
                dustbinCtrl.getdustbinsDetails(req.body.did,result => {
                    res.status(200).send({ success:true,message: 'Successfully!', result});
                });
            }
       }
    });
 });

 // Delete Vehicle

 router.delete('/v1/dustbinDelete',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){
              res.status(401).send({success:false,message:"Unauthorized Token"});         
        }     
        else{
            if(req.body.did==undefined ||req.body.did==""){
                res.status(422).send({ success:false,message: 'Warehouses ID  is required!' });
            }else{
                dustbinCtrl.deletedustbinsDetails(req.body.did,result => {
                    res.status(200).send({ success:true,message: 'Successfully!', result});
                });
            }
       }
    });
 });


 router.get('/v1/dustbinpickup',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
        }else{
                // get the io object ref
              //  const io = req.app.get('socketio');
            dustbinCtrl.dustbinfiltertype(result => { 
                var dataa=[];
                for(var i=0; i<result.length; i++){ 
                    googleMap(result[i].id,result[i].warehouse_id,result[i].name,result[i].wname,result[i].latiude,result[i].longitude,result[i].address,result[i].status,result[i].gsm_moblie_number,result[i].data_percentage,result[i].warelatitude,result[i].warelongitute,result[i].warehouseaddress,call=>{                     
                      dataa.push(call);
                    });        
                }
                 setTimeout(function () { 
                      const grouping = _.groupBy(dataa, function(element){
                        return element.warehouseaddress;
                     });
                    const dustbinData = _.map(grouping, (items, warehouse) => ({
                            warehouseaddress: warehouse,
                            warehousename:items[0].wname,
                            NoofDustbin: items.length,
                            novehicle:Math.ceil(parseInt(items.length) / parseInt(2)),
                            WareHouseId:items[0].warehouse_id,
                            data: items
                    }));


                    //  io.on('connect', socket => {
                    //    console.log("AABBA") // send each client their socket id
                    // });
                      
                    
                   res.status(200).send({ success:true,message: 'Successfully!', dustbinData});
                  },1000) ;


            });

        }
    });
 });
 //Whenever someone connects this gets executed
io.on('connection', function(socket) {
    console.log('A user connected');
  
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
       console.log('A user disconnected');
    });

  setInterval(function () { 

    dustbinCtrl.dustbinfiltertype(result => { 

              const grouping = _.groupBy(result, function(element){
                return element.warehouseaddress;
             });
             const  dustbinData = _.map(grouping, (items, warehouse) => ({
                    warehouseaddress: warehouse,
                    warehousename:items[0].wname,
                    NoofDustbin: items.length,
                    novehicle:Math.ceil(parseInt(items.length) / parseInt(2)),
                    WareHouseId:items[0].warehouse_id,
                    data: items
            }));
            io.sockets.emit('dustbinpickup1', dustbinData);
        },10000);

    });
  
  });

function googleMap(id,warehouse_id,name,wname,latiude,longitude,address,status,gsm_moblie_number,data_percentage,warelatitude,warelongitute,warehouseaddress,objData){
    
    googleMapsClient.distanceMatrix({
        origins: {lat:warelatitude,lng:warelongitute},
        destinations: {lat:latiude,lng:longitude},
        mode: 'driving'
      }, function (err, response){    
       if (!err) {
        //var objData={};
          objData({
                 "id":id,
                "warehouse_id": warehouse_id,
                "name": name,
                "wname":wname,
                "latiude":longitude,
                "longitude": longitude,
                "address": address,
                "status": status,
                "gsm_moblie_number": gsm_moblie_number,
                "data_percentage": data_percentage,  
                "warelatitude": warelatitude,
                "warelongitute": warelongitute,
                "warehouseaddress": warehouseaddress,
                "distance":response.json.rows[0].elements[0].distance.text,
                "duration":response.json.rows[0].elements[0].duration.text
             });
             return;
            // return objData;
             //res.status(200).send({ success:true,message: 'Successfully!', objData});    
        }  
    });
    
   
}

//Assign Vehicle Data in Group

router.post('/v1/assignVehicle',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
        }else{
            if(req.body.groupname==undefined || req.body.groupname==""){
                res.status(422).send({ success:false,message: 'groupname  is required!' });
            }
           else if(req.body.wid==undefined ||req.body.wid==""){
                res.status(422).send({ success:false,message: 'Warehouses ID  is required!' });
            }
           
            else if(req.body.did==undefined || req.body.did==""){
                res.status(422).send({ success:false,message: 'Dustbin ID  is required!' });
            }
            else if(req.body.assigndate==undefined ||req.body.assigndate==""){
                res.status(422).send({ success:false,message: 'Assign date  is required!' });
            
            }
        else{
            console.log(req.body.did);
                for(var x=0;x<req.body.did.length;x++){
                    if((parseInt(req.body.did.length)-1)==x){
                        dustbinCtrl.assignVehicledustbins(req.body.groupname,req.body.wid,req.body.did[x],req.body.assigndate, dataResults=>{
                           
                            dustbinCtrl.updateavlableVehicle(dataResults,1, dataRes=>{
                                res.status(200).send({ success:true,message:"SuccessFully", dataResults });
                                
                            });

                        });
                        

                    }else{
                        dustbinCtrl.assignVehicledustbins(req.body.groupname,req.body.wid,req.body.did[x],req.body.assigndate, dataResult=>{
                          console.log(dataResult);
                        });

                    }
                     
                }
               

            }
            

        }
    });
 });


 router.get('/v1/group_dataDustbin',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
        }else{
                // get the io object ref
               
            dustbinCtrl.dustbinGroupData(result => { 
                var dataa=[];
                for(var i=0; i<result.length; i++){ 
                    googleMapgroup(result[i].assigndate,result[i].GroupName,result[i].vehicleID,result[i].modelName,result[i].vehicle_rc,result[i].drivername,result[i].mobile_no,result[i].driver_image,result[i].id,result[i].warehouse_id,result[i].name,result[i].wname,result[i].latiude,result[i].longitude,result[i].address,result[i].status,result[i].gsm_moblie_number,result[i].data_percentage,result[i].warelatitude,result[i].warelongitute,result[i].warehouseaddress,call=>{                     
                      dataa.push(call);
                    });        
                }
                 setTimeout(function () { 
                      const grouping = _.groupBy(dataa, function(element){
                        return element.GroupName;
                     });
                    const dustbinData = _.map(grouping, (items, warehouse) => ({
                            groupName:warehouse, 
                            warehousename:items[0].wname,
                            warehouseaddress: items[0].warehouseaddress,
                            VehicleName: items[0].VehicleName,
                            VehicleRC: items[0].VehicleRC,
                            driverName:items[0].driverName,
                            drivermobile:items[0].drivermobile,
                            driverphoto:items[0].driverphoto,
                            datacount: items.length,
                            dataassignDate:items[0].assigndate,
                            vehicleID:items[0].vehicleID,
                            data: items
                    }));

                   
                   io.sockets.emit('dustbinpickup', dustbinData); 
                   res.status(200).send({ success:true,message: 'Successfully!', dustbinData});
                  },1000) ;


            });

        }
    });
 });

 function googleMapgroup(assigndate,GroupName,vehicleID,VehicleName,VehicleRC,driverName,drivermobile,driverphoto,id,warehouse_id,name,wname,latiude,longitude,address,status,gsm_moblie_number,data_percentage,warelatitude,warelongitute,warehouseaddress,objData){
    
    googleMapsClient.distanceMatrix({
        origins: {lat:warelatitude,lng:warelongitute},
        destinations: {lat:latiude,lng:longitude},
        mode: 'driving'
      }, function (err, response){    
       if (!err) {
   
          objData({
                "GroupName":GroupName,
                "assigndate":assigndate,
                "VehicleName":VehicleName,
                "VehicleRC":VehicleRC,
                "driverName":driverName,
                "drivermobile":drivermobile,
                "driverphoto":driverphoto,
                "vehicleID":vehicleID,
                 "id":id,
                "warehouse_id": warehouse_id,
                "name": name,
                "wname":wname,
                "latiude":longitude,
                "longitude": longitude,
                "address": address,
                "status": status,
                "gsm_moblie_number": gsm_moblie_number,
                "data_percentage": data_percentage,  
                "warelatitude": warelatitude,
                "warelongitute": warelongitute,
                "warehouseaddress": warehouseaddress,
                "distance":response.json.rows[0].elements[0].distance.text,
                "duration":response.json.rows[0].elements[0].duration.text
             });
             return;
           
        }  
    });
    
   
}


  //Complete Vehicle Data 

    router.post('/v1/completedVehicle',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
        } 
        else{
             if(req.body.vid==undefined ||req.body.vid==""){
                res.status(422).send({ success:false,message: 'Warehouses ID  is required!' });
            }
            else{
         
                 dustbinCtrl.updateavlableVehicle(req.body.vid,0, result=>{

                    dustbinCtrl.updateavlablegroupDustbin(req.body.vid, dataRes=>{
                           res.status(200).send({ success:true,message:"Picup Data is completed SuccessFully", dataRes });
                    });
                                               
                  });

                                
                }
            }
     });
    });

 //Complete Vehicle Data 

    router.post('/v1/singleDatafetch',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
        }  
        else{
             if(req.body.groupid==undefined ||req.body.groupid==""){
                res.status(422).send({ success:false,message: 'Warehouses ID  is required!' });
            }
            else{ 
                 dustbinCtrl.dustbinGroupSingleData(req.body.groupid, result=>{
                    var dataa=[];
                    for(var i=0; i<result.length; i++){ 
                        googleMapgroup(result[i].assigndate,result[i].GroupName,result[i].vehicleID,result[i].modelName,result[i].vehicle_rc,result[i].drivername,result[i].mobile_no,result[i].driver_image,result[i].id,result[i].warehouse_id,result[i].name,result[i].wname,result[i].latiude,result[i].longitude,result[i].address,result[i].status,result[i].gsm_moblie_number,result[i].data_percentage,result[i].warelatitude,result[i].warelongitute,result[i].warehouseaddress,call=>{                     
                          dataa.push(call);
                        });        
                    }
                    setTimeout(function () { 

                        const grouping = _.groupBy(dataa, function(element){
                            return element.GroupName;
                         });
                        const dustbinData = _.map(grouping, (items, warehouse) => ({
                                groupName:warehouse, 
                                warehousename:items[0].wname,
                                warehouseaddress: items[0].warehouseaddress,
                                VehicleName: items[0].VehicleName,
                                VehicleRC: items[0].VehicleRC,
                                driverName:items[0].driverName,
                                drivermobile:items[0].drivermobile,
                                driverphoto:items[0].driverphoto,
                                datacount: items.length,
                                dataassignDate:items[0].assigndate,
                                vehicleID:items[0].vehicleID,
                                data: items
                        }));
                           res.status(200).send({ success:true,message:"SuccessFully", dustbinData });


                    },1000);
                                
                  });

                                
                }
            }
     });
    });
      



      

    //Not Use
    router.get('/v1/dustbinpickupsocket',verify.token,verify.blacklisttoken, (req,res,next)=>{
        jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
            if(err){

                res.status(401).send({success:false,message:"Unauthorized Token"});       
            }else{
                    // get the io object ref
                
                dustbinCtrl.dustbinfiltertype(result => { 
                    var dataa=[];
                    for(var i=0; i<result.length; i++){ 
                        googleMap(result[i].id,result[i].warehouse_id,result[i].name,result[i].wname,result[i].latiude,result[i].longitude,result[i].address,result[i].status,result[i].gsm_moblie_number,result[i].data_percentage,result[i].warelatitude,result[i].warelongitute,result[i].warehouseaddress,call=>{                     
                        dataa.push(call);
                        });        
                    }
                    setTimeout(function () { 
                        const grouping = _.groupBy(dataa, function(element){
                            return element.warehouseaddress;
                        });
                        const dustbinData = _.map(grouping, (items, warehouse) => ({
                                warehouseaddress: warehouse,
                                warehousename:items[0].wname,
                                NoofDustbin: items.length,
                                novehicle:Math.ceil(parseInt(items.length) / parseInt(2)),
                                WareHouseId:items[0].warehouse_id,
                                data: items
                        }));

                    
                    // console.log(Math.ceil(parseInt(3) / parseInt(2)));
                    res.status(200).send({ success:true,message: 'Successfully!', dustbinData});
                    },1000) ;


                });

            }
        });
    });



    router.post('/v1/requestArdunio', function(req, res) {
        // var myData={
        //   sensorData:req.query.datapercentage,
        //   gsmNumber:req.query.mobile
        // }
        if(req.query.mobile==undefined || req.query.mobile==""){
            res.send("Mobile number is not register");
        }
        else{
            dustbinCtrl.updateDustbindata(req.query.datapercentage,req.query.mobile,result => { 
                res.send(result);
            });
        }

       
    });
      return router;
 
}

//module.exports = router;