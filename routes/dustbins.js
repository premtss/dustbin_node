const express = require('express');
const router = express.Router();
const dustbinCtrl = require('../controller/dustbin');
const verify=require('./common');
const payload=require('./payload');
const jwt=require('jsonwebtoken');
var cron = require('node-cron');

var _ = require('underscore');
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCntPB-qN_-K60eVMgJkJEy8Dn2ZxvxC6Y',
    Promise: Promise
  });
  module.exports=function(deviceKey,io){
     // console.log(deviceKey.get("deviceKey"));
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

 router.post('/v1/dustbinpickup',verify.token,verify.blacklisttoken, (req,res,next)=>{
    jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
        if(err){

              res.status(401).send({success:false,message:"Unauthorized Token"});       
        }else{
            var wid=req.body.wid || "";
            var dataperfrom=req.body.dataperfrom || "";
            dustbinCtrl.dustbinfiltertypenew(req.body.page,req.body.perpage,wid,dataperfrom,result => {           
                var dataa=[];  
                for(var i=0; i<result.data.length; i++){                                   
                    googleMap(result.data[i].id,result.data[i].warehouse_id,result.data[i].name,result.data[i].wname,result.data[i].latiude,result.data[i].longitude,result.data[i].address,result.data[i].status,result.data[i].gsm_moblie_number,result.data[i].data_percentage,result.data[i].warelatitude,result.data[i].warelongitute,result.data[i].warehouseaddress,result.data[i].notavabileTotal,result.data[i].avabileTotal,call=>{                     
                      dataa.push(call);                      
                    });  
                }
         
                setTimeout(function () {                
                      const grouping = _.groupBy(dataa, function(element){
                        return element.warehouseaddress;
                     });
                     dustbinData = _.map(grouping,(items, warehouse)=>({
                            warehouseaddress: warehouse,
                            warehousename:items[0].wname,
                            NoofDustbin: items.length,
                            notavabileTotal:items[0].notavabileTotal,
                            avabileTotal:items[0].avabileTotal,
                            novehicle:Math.ceil(parseInt(items.length) / parseInt(2)),
                            WareHouseId:items[0].warehouse_id,
                            data: items
                    }));
                        
                    res.status(200).send({ success:true,message: 'Successfully!', dustbinData,totalpage:result.totalpage,totalrecoard:result.totalrecoard});
                },1000) ;
 


            });

        }
    });
 });


// cron.schedule('*/20 * * * * *', () => {
//    // console.log('running every minute to 1 from 5');
//     dustbinCtrl.dustbinfiltertypeSocket(result => { 

//         const grouping = _.groupBy(result, function(element){
//           return element.warehouseaddress;
//        });
//        const  dustbinData = _.map(grouping, (items, warehouse) => ({
//               warehouseaddress: warehouse,
//               warehousename:items[0].wname,
//               NoofDustbin: items.length,
//               novehicle:Math.ceil(parseInt(items.length) / parseInt(2)),
//               WareHouseId:items[0].warehouse_id,
//               data: items
//       }));
//       io.sockets.emit('dustbinpickup1', dustbinData);
//     });
//   });

//   cron.schedule('* * * * * *', () => {
//     // console.log('running every minute to 1 from 5');
//      dustbinCtrl.dustbinfiltertypeSocket2(result => { 
 
//          const grouping = _.groupBy(result, function(element){
//            return element.warehouseaddress;
//         });
//         const  dustbinData = _.map(grouping, (items, warehouse) => ({
//                warehouseaddress: warehouse,
//                warehousename:items[0].wname,
//                NoofDustbin: items.length,
//                novehicle:Math.ceil(parseInt(items.length) / parseInt(2)),
//                WareHouseId:items[0].warehouse_id,
//                data: items
//        }));
//        io.sockets.emit('dustbinpickup', dustbinData);
//      });
//    });

 
//    cron.schedule('* * * * * *', () => {
//     console.log("CronJob");

//    });



    function googleMap(id,warehouse_id,name,wname,latiude,longitude,address,status,gsm_moblie_number,data_percentage,warelatitude,warelongitute,warehouseaddress,notavabileTotal,avabileTotal,objData){
        
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
                    "duration":response.json.rows[0].elements[0].duration.text,
                    "notavabileTotal":notavabileTotal,
                    "avabileTotal":avabileTotal
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
           
            else if(req.body.dustbin==undefined || req.body.dustbin==""){
                res.status(422).send({ success:false,message: 'dustbin Data  is required!' });
            }
            else if(req.body.assigndate==undefined ||req.body.assigndate==""){
                res.status(422).send({ success:false,message: 'Assign date  is required!' });
            
            }
        else{

                for(var x=0;x<req.body.dustbin.length;x++){
                    if((parseInt(req.body.dustbin.length)-1)==x){
                        dustbinCtrl.assignVehicledustbins(req.body.groupname,req.body.wid,req.body.dustbin[x].did,req.body.dustbin[x].dataDustbin,req.body.assigndate, dataResults=>{
                           
                            dustbinCtrl.updateavlableVehicle(dataResults,1, dataRes=>{
                                res.status(200).send({ success:true,message:"SuccessFully", dataResults });
                                
                            });

                        });
                        

                    }else{
                        dustbinCtrl.assignVehicledustbins(req.body.groupname,req.body.wid,req.body.dustbin[x].did,req.body.dustbin[x].dataDustbin,req.body.assigndate, dataResult=>{
                          //console.log(dataResult);
                        });

                    }
                     
                }
               

            }
            

        }
    });
 });

 router.post('/v1/assigingroupPicup',verify.token,verify.blacklisttoken, (req,res,next)=>{
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
           
            else if(req.body.dustbin==undefined || req.body.dustbin==""){
                res.status(422).send({ success:false,message: 'dustbin Data  is required!' });
            }
            else if(req.body.assigndate==undefined ||req.body.assigndate==""){
                res.status(422).send({ success:false,message: 'Assign date  is required!' });
            
            }
        else{
          
                for(var x=0;x<req.body.dustbin.length;x++){

                    if(req.body.dustbin.length-1==x){
                        dustbinCtrl.assignPicupgroupdustbins(req.body.groupname,req.body.wid,req.body.dustbin[x].did,req.body.dustbin[x].dataDustbin,req.body.assigndate, dataResult=>{
                            res.status(200).send({ success:true,message:"SuccessFully", dataResult });
                        });
                    }else{
                        dustbinCtrl.assignPicupgroupdustbins(req.body.groupname,req.body.wid,req.body.dustbin[x].did,req.body.dustbin[x].dataDustbin,req.body.assigndate, dataResult=>{
                          //  res.status(200).send({ success:true,message:"SuccessFully", dataResult });
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
            var finalData=[];
            var WareHouseData=[];
            dustbinCtrl.dustbinGroupDataNew(result => {    
               const grouping = _.groupBy(result, function(element){
                                    return element.GroupName;
                      });
                    const dustbinData = _.map(grouping, (items, groupName) => ({
                                        Groupstatus:items[0].Groupstatus,
                                        groupName:groupName, 
                                        vehicleID:items[0].vehicleID,
                                        warehousename:items[0].wname,
                                        warehouseaddress: items[0].warehouseaddress,   
                                        datacount: items.length,
                                        dataassignDate:items[0].assigndate,
                                        Drivername:"NA",
                                        DriverPhoto:"NA",
                                        Drivermobile:"NA",
                                        VehicleName:"NA",
                                        VehicleRC:"NA",
                                        warehouseID:items[0].warehouse_id,
                                        driverAblible:0
                                        
                         }));
                         
                            for(var x=0;x<dustbinData.length;x++){         
                                if(dustbinData[x].vehicleID==0){
                                    finalData.push(dustbinData[x]);
                                    //console.log(dustbinData[x].datacount)
                                    WareHouseData.push({warehouseID:dustbinData[x].warehouseID,groupId:dustbinData[x].groupName,dustbincount:dustbinData[x].datacount})    
                                 }
                             }

                             dustbinCtrl.dustbinGroupData(results => { 
                                const grouping = _.groupBy(results, function(element){
                                    return element.GroupName;
                                });
                             const dustbinData2 = _.map(grouping, (items, groupName) => ({
                                        Groupstatus:items[0].Groupstatus,
                                        groupName:groupName, 
                                        vehicleID:items[0].vehicleID,
                                        warehousename:items[0].wname,
                                        warehouseaddress: items[0].warehouseaddress,   
                                        datacount: items.length,
                                        dataassignDate:items[0].assigndate,
                                        Drivername:items[0].drivername,
                                        DriverPhoto:items[0].driver_image,
                                        Drivermobile:items[0].mobile_no,
                                        VehicleName:items[0].modelName,
                                        VehicleRC:items[0].vehicle_rc,
                                        warehouseID:items[0].warehouse_id,
                                        driverAblible:items[0].driverAblible,
                                       
            
                              }));
                              for(var xx=0;xx<dustbinData2.length;xx++){         
                                if(dustbinData2[xx].vehicleID!==0){
                                    finalData.push(dustbinData2[xx]); 
                                }
                            }

                            });

                            setTimeout(()=>{
                                if(WareHouseData.length>0){
                                    for(var i=0;i<WareHouseData.length;i++){    
                                        
                                        dustbinCtrl.vehicleAutoAvaliblePerWarehouse(WareHouseData[i].warehouseID, results => { 
                                            for(var ii=0;ii<WareHouseData.length;ii++){  
                                          //  console.log(results[0].capacity,"<===>",WareHouseData[ii].dustbincount);
                                   // return false;
                                            if(results.length>0 && WareHouseData[ii].dustbincount <=results[0].capacity){  


                                                 dustbinCtrl.updateavlablevehiclegroupDustbin(results[0].vehicleID,results[0].groupid,Dataresult => {
                                                    dustbinCtrl.updateassignrdeVehicle(results[0].vehicleID,data=>{ 
                                                         dustbinCtrl.Driveravaviltyhistory(results[0].DriverID,0,datahistory=>{      
                                                         });

                                                    });
                                                 });


                                           
                                            }
                                        }

                                        });
    
    
                                    }
    
                                }
                                res.status(200).send({ success:true,message: 'Successfully!',finalData,WareHouseData});

                            },1500)
            });

        }
    });
 });


    //  cron.schedule('* * * * *', () => {
    //   //console.log("kkkkk");
    // var finalData=[];
    // var WareHouseData=[];
    // dustbinCtrl.dustbinGroupDataNew(result => {    
    //    const grouping = _.groupBy(result, function(element){
    //                         return element.GroupName;
    //           });
    //         const dustbinData = _.map(grouping, (items, groupName) => ({
    //                             Groupstatus:items[0].Groupstatus,
    //                             groupName:groupName, 
    //                             vehicleID:items[0].vehicleID,
    //                             warehousename:items[0].wname,
    //                             warehouseaddress: items[0].warehouseaddress,   
    //                             datacount: items.length,
    //                             dataassignDate:items[0].assigndate,
    //                             Drivername:"NA",
    //                             DriverPhoto:"NA",
    //                             Drivermobile:"NA",
    //                             VehicleName:"NA",
    //                             VehicleRC:"NA",
    //                             warehouseID:items[0].warehouse_id,
    //                             driverAblible:0
    //              }));
                 
    //                 for(var x=0;x<dustbinData.length;x++){         
    //                     if(dustbinData[x].vehicleID==0){
    //                         finalData.push(dustbinData[x]);
    //                        WareHouseData.push({warehouseID:dustbinData[x].warehouseID,groupId:dustbinData[x].groupName,dustbincount:dustbinData[x].datacount});    
    //                      }
    //                  }

    //                  dustbinCtrl.dustbinGroupData(results => { 
    //                     const grouping = _.groupBy(results, function(element){
    //                         return element.GroupName;
    //                     });
    //                  const dustbinData2 = _.map(grouping, (items, groupName) => ({
    //                             Groupstatus:items[0].Groupstatus,
    //                             groupName:groupName, 
    //                             vehicleID:items[0].vehicleID,
    //                             warehousename:items[0].wname,
    //                             warehouseaddress: items[0].warehouseaddress,   
    //                             datacount: items.length,
    //                             dataassignDate:items[0].assigndate,
    //                             Drivername:items[0].drivername,
    //                             DriverPhoto:items[0].driver_image,
    //                             Drivermobile:items[0].mobile_no,
    //                             VehicleName:items[0].modelName,
    //                             VehicleRC:items[0].vehicle_rc,
    //                             warehouseID:items[0].warehouse_id,
    //                             driverAblible:items[0].driverAblible
                          
    //                   }));
    //                   for(var xx=0;xx<dustbinData2.length;xx++){         
    //                     if(dustbinData2[xx].vehicleID!==0){
    //                         finalData.push(dustbinData2[xx]); 
    //                     }
    //                 }

    //                 });

    //                 setTimeout(()=>{
    //                     if(WareHouseData.length>0){
    //                         for(var i=0;i<WareHouseData.length;i++){    
    //                             dustbinCtrl.vehicleAutoAvaliblePerWarehouse(WareHouseData[i].warehouseID, results => {          
    //                                  for(var ii=0;ii<WareHouseData.length;ii++){  
                                   
    //                                       if(results.length>0 && WareHouseData[ii].dustbincount <=results[0].capacity){  
    //                                            dustbinCtrl.updateavlablevehiclegroupDustbin(results[0].vehicleID,results[0].groupid,Dataresult => {
    //                                               dustbinCtrl.updateassignrdeVehicle(results[0].vehicleID,data=>{ 
    //                                                    dustbinCtrl.Driveravaviltyhistory(results[0].DriverID,0,datahistory=>{      
    //                                                    });

    //                                               });
    //                                            });
    //                                       }
    //                                   }
    //                             });

    //                         }

    //                     }
    //                     io.sockets.emit('group_dataDustbin', finalData);
    //                 },1500)
    //           });
   
    //      });


    function googleMapgroup(Groupstatus,assigndate,GroupName,vehicleID,VehicleName,VehicleRC,driverName,drivermobile,driverphoto,id,warehouse_id,name,wname,latiude,longitude,address,status,gsm_moblie_number,data_percentage,warelatitude,warelongitute,warehouseaddress,dustbindatapercentage,objData){
        
        googleMapsClient.distanceMatrix({
            origins: {lat:warelatitude,lng:warelongitute},
            destinations: {lat:latiude,lng:longitude},
            mode: 'driving'
        }, function (err, response){    
        if (!err) {
    
            objData({
                    "Groupstatus":Groupstatus,
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
                    "latiude":latiude,
                    "longitude": longitude,
                    "address": address,
                    "status": status,
                    "gsm_moblie_number": gsm_moblie_number,
                    "data_percentage": data_percentage,  
                    "warelatitude": warelatitude,
                    "warelongitute": warelongitute,
                    "warehouseaddress": warehouseaddress,
                    "distance":response.json.rows[0].elements[0].distance.text,
                    "duration":response.json.rows[0].elements[0].duration.text,
                    "dustbindatapercentage":dustbindatapercentage
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
                        googleMapgroup(result[i].Groupstatus,result[i].assigndate,result[i].GroupName,result[i].vehicleID,result[i].modelName,result[i].vehicle_rc,result[i].drivername,result[i].mobile_no,result[i].driver_image,result[i].id,result[i].warehouse_id,result[i].name,result[i].wname,result[i].latiude,result[i].longitude,result[i].address,result[i].status,result[i].gsm_moblie_number,result[i].data_percentage,result[i].warelatitude,result[i].warelongitute,result[i].warehouseaddress,result[i].dustbindatapercentage,call=>{                     
                          dataa.push(call);
                        });        
                    }
                    setTimeout(function () { 

                        const grouping = _.groupBy(dataa, function(element){
                            return element.GroupName;
                         });
                        const dustbinData = _.map(grouping, (items, warehouse) => ({
                            
                                Groupstatus:items[0].Groupstatus,
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

    router.post('/v1/requests', function(req, res) {
        payload.google_payloaddataByPrem(deviceKey,req,(requestDevice)=>{
            if(requestDevice=="400"){
                res.send("Something is wrong");
            }
            else if(requestDevice=="509"){
                res.send("Something is missing value");
            }else{
                dustbinCtrl.updateDustbindata(requestDevice,result => { 
                    res.send(result);
                });
            }
        });
    });

    router.post('/v1/pickupHistory',verify.token,verify.blacklisttoken, function(req, res) {
        jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
            if(err){   
                  res.status(401).send({success:false,message:"Unauthorized Token"});                  
            }else{
             
                //console.log(req.body);
                 if(req.body.filterdate===null &&  req.body.filterdate2===null &&  req.body.wid===null){
                 
                    dustbinCtrl.dustbinGroupDataHistory(req.body.page,req.body.perpage,dresult => { 


                        if(dresult.data.length>0){

                            const grouping = _.groupBy(dresult.data, function(element){
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
                                    driverphoto:items[0].driver_image,
                                    datacount: items.length,
                                    dataassignDate:items[0].assigndate,
                                    vehicleID:items[0].vehicleID,
                                    WarehouseID:items[0].warehouse_id,
                            }));
        
                            res.status(200).send({ success:true,message: 'Successfully!', dustbinData,totalpage:dresult.totalpage,totalrecoard:dresult.totalrecoard});

                        }else{
                            res.status(200).send({ success:true,message: 'No records found',dustbinData:0,totalpage:0,totalrecoard:0});
                        }
                       
                        });
                    }


                    else if(req.body.filterdate!=null  && req.body.filterdate2!=null  && req.body.wid==null){
                       
                            dustbinCtrl.dustbinGroupDataHistory2(req.body.page,req.body.perpage,req.body.filterdate,req.body.filterdate2,dresult => { 
                                if(dresult.data.length>0){

                                    const grouping = _.groupBy(dresult.data, function(element){
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
                                        driverphoto:items[0].driver_image,
                                        datacount: items.length,
                                        dataassignDate:items[0].assigndate,
                                        vehicleID:items[0].vehicleID,
                                        WarehouseID:items[0].warehouse_id,
                                    }));
                

                                    res.status(200).send({ success:true,message: 'Successfully!',dustbinData,totalpage:dresult.totalpage,totalrecoard:dresult.totalrecoard});
                                }else{
                                    res.status(200).send({ success:true,message: 'No records found', dustbinData:0,totalpage:0,totalrecoard:0});
                                }
                            
                            });

                        }
               else if(req.body.wid!=null  && req.body.filterdate==null || req.body.filterdate==''  && req.body.filterdate2==null ||  req.body.filterdate2==''){
                     
                    dustbinCtrl.dustbinGroupDataHistory1(req.body.page,req.body.perpage,req.body.wid,dresult => { 
                                       if(dresult.data.length>0){

                                        const grouping = _.groupBy(dresult.data, function(element){
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
                                            driverphoto:items[0].driver_image,
                                            datacount: items.length,
                                            dataassignDate:items[0].assigndate,
                                            vehicleID:items[0].vehicleID,
                                            WarehouseID:items[0].warehouse_id,
                                            
                                        }));
                    

                                           res.status(200).send({ success:true,message: 'Successfully!', dustbinData,totalpage:dresult.totalpage,totalrecoard:dresult.totalrecoard});
                                       }else{
                                           res.status(200).send({ success:true,message: 'No records found',dustbinData:0,totalpage:0,totalrecoard:0});
                                       }
                                      
                        });
                }
               else {
                console.log("2222222666666666666");

             
               }
 
          }
       });
    });


    router.get('/v1/dustbinMarker',verify.token,verify.blacklisttoken, function(req, res) {
        jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
            if(err){   
                  res.status(401).send({success:false,message:"Unauthorized Token"});                  
            }else{
               dustbinCtrl.dustbinMarker(dresult => { 
                 if(dresult.length>0){
                     res.status(200).send({ success:true,message: 'Successfully!', dresult});
                 }else{
                     res.status(200).send({ success:true,message: 'No records found'});
                  }
               
                });
                    }
              });
     });

     router.get('/v1/dashboard',verify.token,verify.blacklisttoken, function(req, res) {
        jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
            if(err){   
                  res.status(401).send({success:false,message:"Unauthorized Token"});                  
            }else{
               dustbinCtrl.dashBoardData(dresult => { 
                
                if(dresult.todaypicuplist.length>0){
                    const grouping = _.groupBy(dresult.todaypicuplist, function(element){
                        return element.GroupName;
                     });
                    const dustbinData = _.map(grouping, (items, groupname) => ({
                            groupName:groupname, 
                            groupStatus:items[0].status, 
                            dustbincount: items.length,
                          
                    }));
                    res.status(200).send({ success:true,message: 'Successfully!', dresult,data:dustbinData});
                }
                else{
                    res.status(200).send({ success:true,message: 'Successfully!', dresult,data:0});
                }

                   
                
                });
                    }
              });
     });


     router.post('/v1/dustbinhistory',verify.token,verify.blacklisttoken, function(req, res) {
        jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
            if(err){   
                  res.status(401).send({success:false,message:"Unauthorized Token"});                  
            }else{

                var selectdate=req.body.selectdate || "";
                var wid=req.body.wid || "";
                var dataperfrom=req.body.dataperfrom || "";
             
               dustbinCtrl.getAlldustbinsHistory(req.body.page,req.body.perpage,selectdate,wid,dataperfrom, dresult => { 
                 
                    res.status(200).send({ success:true,message: 'Successfully!', data:dresult.data, totalpage:dresult.totalpage,totalrecoard:dresult.totalrecoard,recordfound:dresult.data.length});
               
                });
                    }
              });
     });


     router.post('/v1/avlibleVehicle',verify.token,verify.blacklisttoken, function(req, res) {
        jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
            if(err){   
                  res.status(401).send({success:false,message:"Unauthorized Token"});                  
            }else{
                if(req.body.wid==undefined ||req.body.wid==""){
                    res.status(422).send({ success:false,message: 'Warehouses ID  is required!' });
                }
                else{ 
             
               dustbinCtrl.vehicleAvaliblePerWarehouse(req.body.page,req.body.perpage,req.body.wid, dresult => { 
                  
                    res.status(200).send({ success:true,message: 'Successfully!', data:dresult.data, totalpage:dresult.totalpage,totalrecoard:dresult.totalrecoard});
               
                });
                    }
                }
            });
     });

     router.post('/v1/notavlibleVehicle',verify.token,verify.blacklisttoken, function(req, res) {
        jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
            if(err){   
                  res.status(401).send({success:false,message:"Unauthorized Token"});                  
            }else{
                if(req.body.wid==undefined ||req.body.wid==""){
                    res.status(422).send({ success:false,message: 'Warehouses ID  is required!' });
                }
                else{ 
             
               dustbinCtrl.vehicleNotAvaliblePerWarehouse(req.body.page,req.body.perpage,req.body.wid, dresult => { 
                 
                    res.status(200).send({ success:true,message: 'Successfully!', data:dresult.data, totalpage:dresult.totalpage,totalrecoard:dresult.totalrecoard,recordfound:dresult.data.length});
               
                });
                    }
                }
            });
     });


     router.post('/v1/manualReassignPickup',verify.token,verify.blacklisttoken, function(req, res) {
        jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
            if(err){   
                  res.status(401).send({success:false,message:"Unauthorized Token"});                  
            }else{
                if(req.body.groupid==undefined ||req.body.groupid==""){
                    res.status(422).send({ success:false,message: 'groupid ID  is required!' });
                }
                else if(req.body.vid==undefined ||req.body.vid==""){
                    res.status(422).send({ success:false,message: 'Vehicle ID  is required!' });
                }
                
                else{ 
             
                    dustbinCtrl.reAssignVehiclePicupID(req.body.groupid,req.body.vid, dresult => {                
                            res.status(200).send({ success:true,message: 'Successfully!', dresult});
                    
                        });
                    }
                }
            });
     });

     router.post('/v1/vehicleCountAvabile',verify.token,verify.blacklisttoken, function(req, res) {
        jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
            if(err){   
                  res.status(401).send({success:false,message:"Unauthorized Token"});                  
            }else{
                if(req.body.wid==undefined ||req.body.wid==""){
                    res.status(422).send({ success:false,message: 'wid ID  is required!' });
                }

                else{ 
             
                    dustbinCtrl.vehicleAvaliblePerWarehouseCount(req.body.wid, dresult => {                
                            res.status(200).send({ success:true,message: 'Successfully!', dresult});
                    
                        });
                    }
                }
            });
     });

      return router;
 
}

//module.exports = router;