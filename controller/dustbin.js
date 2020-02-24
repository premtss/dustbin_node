//include the model
const db = require('../DbConnection'); 
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCntPB-qN_-K60eVMgJkJEy8Dn2ZxvxC6Y',
    Promise: Promise
  });
  var momentzone = require('moment-timezone');
  var date = require('date-and-time');
  var now = new Date();
//   date.setLocales('en', {
//       A: ['AM', 'PM']
//   });
  momentzone.tz.setDefault("Asia/Dubai");
 //create class
 var dustbin = {
 
    getAlldustbinsItems:function(limit,offset,callback){
        var current_page = limit || 1;
        var items_per_page = offset || 10;
        var start_index = (current_page - 1) * items_per_page;
            db.query('SELECT count(*) as total FROM dustbins',function(error,data) {
                if (error) throw error;                
                var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                db.query('SELECT * FROM dustbins LIMIT '+start_index+', '+items_per_page+'', function (error, results) {
                    if (error) {
                    callback(error,null);
                    }
                    else{
                        var obj={
                            data:results,
                            totalpage:parseInt(total_pages),
                            totalrecoard:parseInt(data[0].total)
                        }
                        callback(obj,null);
                }
             });


            });
       
    },
    addNewDdustbins:function(wid,name,latiude,longitude,address,gsm_moblie_number,callback){
    
        var sqlquery="INSERT INTO dustbins(`warehouse_id`,`name`,`latiude`,`longitude`,`address`,`status`,`gsm_moblie_number`) VALUES ('"+wid+"','"+name+"','"+latiude+"','"+longitude+"','"+address+"','"+1+"','"+gsm_moblie_number+"')";
        db.query(sqlquery, function (error,result) {
            if (error) {
            callback(error,null);
            }
            else{    
            callback('1 record inserted',null);
        }
    });

    },
    existMobileRecord:function(gsmmoblienumber,callback){

        db.query('SELECT * FROM dustbins where gsm_moblie_number='+gsmmoblienumber, function (error,result) {
            if (error) {
        throw error;
            }
            else{         
                if(result[0]==null || result[0]==undefined){
                    callback(1,null);
                }else{
                    callback(0,null); 
                }     
        }
        });
    },

    updatedustbins:function(wid,name,latiude,longitude,address,gsm_moblie_number,callback){

        var sqlquery = "UPDATE dustbins set warehouse_id=?,name=?,latiude=?,longitude=?,address=? WHERE gsm_moblie_number = ?";
        db.query(sqlquery,[wid,name,latiude,longitude,address,gsm_moblie_number], function (error,result) {
            if (error) {
            callback(error,null);
            }
            else{    
            callback('Record Updated Successfully!',null);
        }
        });

    },

    getdustbinsDetails:function(did,callback){
            var sqlquery ="SELECT * FROM dustbins where id=?";
            db.query(sqlquery,[did], function (error, results) {
                if (error) {
                callback(error,null);
                }
                else{
                callback(results[0],null);
            }
        });
    },

    deletedustbinsDetails:function(did,callback){
        db.query('DELETE FROM dustbins WHERE id='+did, function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
            callback('delete record successfully',null);
        }
    });
    },

    dustbinfilter:function(callback){
        //  WHERE dustbins.data_percentage > 61
        var sqlquery ="SELECT dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id and dustbins.data_percentage>60";
        db.query(sqlquery, function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
             
              callback(results,null);
        }
    });
    },

    dustbinfiltertype:function(callback){
        //  WHERE dustbins.data_percentage > 61
        var sqlquery ="SELECT dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id WHERE dustbins.id not in(select did from assign_group_vehicle) and dustbins.data_percentage>60";
        db.query(sqlquery, function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
             
              callback(results,null);

        }
    });
    },

    dustbinfiltertypenew:function(limit,offset,wid,dataper,callback){
         // and dustbins.data_percentage>60
        
         var current_page = limit || 1;
         var items_per_page = offset || 10;
         var start_index = (current_page - 1) * items_per_page;

        if(wid!=="" && dataper==""){
         db.query('SELECT count(*) as total FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id WHERE dustbins.id not in(select did from assign_group_vehicle) and dustbins.warehouse_id=?',[wid],function(error,data) {
        if (error) throw error;                
        var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));


        var sqlquery1 ="SELECT dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress,warehouses.id as warehouseID FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id WHERE dustbins.id not in(select did from assign_group_vehicle) and dustbins.warehouse_id=? LIMIT "+start_index+", "+items_per_page+"";
        //  var sqlquery ="SELECT drivers.name as drivername,drivers.mobile_no,drivers.driver_image, vehicles.id as vehicleID,vehicles.model_name as modelName,vehicles.vehicle_rc,assign_group_vehicle.status as Groupstatus, assign_group_vehicle.groupid as GroupName,assign_group_vehicle.assigndate, dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=0 LIMIT ?,?";
          db.query(sqlquery1,[wid],function (error, results) {
              if (error) throw error;  
              else{                             
                  var obj={
                      data:results,
                      totalpage:parseInt(total_pages),
                      totalrecoard:parseInt(data[0].total)
                  }
                      callback(obj,null);
              }
      });



    });
}
else if(dataper!=="" && wid==""){
    db.query('SELECT count(*) as total FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id WHERE dustbins.id not in(select did from assign_group_vehicle) and dustbins.data_percentage BETWEEN 0 and ?',[dataper],function(error,data) {
        if (error) throw error;                
        var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));


        var sqlquery2 ="SELECT dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress,warehouses.id as warehouseID FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id WHERE dustbins.id not in(select did from assign_group_vehicle) and dustbins.data_percentage BETWEEN 0 and ? LIMIT "+start_index+", "+items_per_page+"";
        //  var sqlquery ="SELECT drivers.name as drivername,drivers.mobile_no,drivers.driver_image, vehicles.id as vehicleID,vehicles.model_name as modelName,vehicles.vehicle_rc,assign_group_vehicle.status as Groupstatus, assign_group_vehicle.groupid as GroupName,assign_group_vehicle.assigndate, dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=0 LIMIT ?,?";
          db.query(sqlquery2,[dataper], function (error, results) {
              if (error) throw error;  
              else{                             
                  var obj={
                      data:results,
                      totalpage:parseInt(total_pages),
                      totalrecoard:parseInt(data[0].total)
                  }
                      callback(obj,null);
              }
      });



    });
}else{
    db.query('SELECT count(*) as total FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id WHERE dustbins.id not in(select did from assign_group_vehicle)',function(error,data) {
        if (error) throw error;                
        var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));


        var sqlquery3 ="SELECT dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id WHERE dustbins.id not in(select did from assign_group_vehicle) LIMIT "+start_index+", "+items_per_page+"";
        //  var sqlquery ="SELECT drivers.name as drivername,drivers.mobile_no,drivers.driver_image, vehicles.id as vehicleID,vehicles.model_name as modelName,vehicles.vehicle_rc,assign_group_vehicle.status as Groupstatus, assign_group_vehicle.groupid as GroupName,assign_group_vehicle.assigndate, dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=0 LIMIT ?,?";
          db.query(sqlquery3, function (error, results) {
              if (error) throw error;  
              else{                             
                  var obj={
                      data:results,
                      totalpage:parseInt(total_pages),
                      totalrecoard:parseInt(data[0].total)
                  }
                      callback(obj,null);
              }
      });

    });
}
      
        
    },

    dustbinfiltertypeSocket:function(callback){
        //  WHERE dustbins.data_percentage > 61
        var sqlquery ="SELECT dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id";
        db.query(sqlquery, function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
             
              callback(results,null);

        }
    });
    },
  
    dustbinfiltertypeSocket2:function(callback){
        //  WHERE dustbins.data_percentage > 61
        var sqlquery ="SELECT dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id";
        db.query(sqlquery, function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
             
              callback(results,null);

        }
    });
    },

    assignVehicledustbins:function(groupid,wid,did,dataper,assigndate,callback){
    var selectQry="select If(vehicles.id IS NULL or vehicles.id ='' ,'empty',vehicles.id) as Vid  from vehicles LEFT JOIN warehouse_mapped_vehicles on vehicles.id=warehouse_mapped_vehicles.vehicleid INNER join mapping_vehicle_drivers on mapping_vehicle_drivers.vehicle_id=vehicles.id WHERE vehicles.status=1 and vehicles.available_status=0 and warehouse_mapped_vehicles.warehouse_Id='"+wid+"' limit 1";
    db.query(selectQry, function (error,results) { 
        console.log(results.length)
        if(results.length!=0){
           // console.log("Find");
            var sqlquery="INSERT INTO assign_group_vehicle(`groupid`,`wid`,	`vid`,`did`,`dustbindatapercentage`,`assigndate`,`status`) VALUES ('"+groupid+"','"+wid+"','"+results[0].Vid+"','"+did+"', '"+dataper+"','"+assigndate+"','"+1+"')";
                    db.query(sqlquery, function (error,result) {
                        if (error) {
                        callback(error,null);
                        }
                        else{    
                        callback(results[0].Vid,null);
                    }
            });
        }
        else{
           // console.log("Not Find");
            callback(0,null);

        }
  
        });

    },

    assignPicupgroupdustbins:function(groupid,wid,did,dataper,assigndate,callback){
               var sqlquery="INSERT INTO assign_group_vehicle(`groupid`,`wid`,`vid`,`did`,`dustbindatapercentage`,`assigndate`,`status`) VALUES ('"+groupid+"','"+wid+"','"+0+"','"+did+"', '"+dataper+"','"+assigndate+"','"+1+"')";
                        db.query(sqlquery, function (error,result) {
                            if (error) {
                            callback(error,null);
                            }
                            else{    
                            callback("success",null);
                        }
                });
     
     },

    updateavlableVehicle:function(vid,status,callback){

        var sqlquery = "UPDATE vehicles set available_status=? WHERE id = ?";
        db.query(sqlquery,[status,vid], function (error,result) {
            if (error) {
            callback(error,null);
            }
            else{    
            callback('Vehicle Assignd!',null);
        }
        });
     },
     updateassignrdeVehicle:function(vid,callback){

        var sqlquery = "UPDATE vehicles set available_status=1 WHERE id = ?";

        db.query(sqlquery,[vid], function (error,result) {
            if (error) {
            callback(error,null);
            }
            else{ 
                var sqlquery1 = "SELECT drivers.id as DriverId FROM vehicles INNER JOIN mapping_vehicle_drivers on vehicles.id=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id where mapping_vehicle_drivers.vehicle_id=?";  
                db.query(sqlquery1,[vid], function (error,resultID) {
                    if (error) {
                    callback(error,null);
                    }
                    else{ 
                       
                        //if(resultID){
                            var sqlquery2 = "UPDATE drivers set driverAblible=1 WHERE id=?";
                            db.query(sqlquery2,[resultID[0].DriverId], function (error,resultdata) {
                                if (error) {
                                callback(error,null);
                                }else{
                                   // console.log("kkkkk")
                                    callback(resultID[0].DriverId,null);
                                }
                            });

                        //}
 
                    }
                });

            }
        });


     },

     updateavlablegroupDustbin:function(vid,callback){

        var sqlquery = "UPDATE assign_group_vehicle set status=0 WHERE vid = ?";
        db.query(sqlquery,[vid], function (error,result) {
            if (error) {
            callback(error,null);
            }
            else{    
            callback('Completed!',null);
        }
        });
     },

     updateavlablevehiclegroupDustbin:function(vid,groupid,callback){

        var sqlquery = "UPDATE assign_group_vehicle set vid=? WHERE groupid=?";
        db.query(sqlquery,[vid,groupid], function (error,result) {
            if (error) {
            callback(error,null);
            }
            else{    
            callback('Completed!',null);
        }
        });
     },

    dustbinGroupData:function(callback){
        //  WHERE dustbins.data_percentage > 61
        
        var sqlquery ="SELECT drivers.driverAblible, drivers.name as drivername,drivers.mobile_no,drivers.driver_image, vehicles.id as vehicleID,vehicles.model_name as modelName,vehicles.vehicle_rc, assign_group_vehicle.groupid as GroupName,assign_group_vehicle.status as Groupstatus,assign_group_vehicle.assigndate, dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=1";
        db.query(sqlquery, function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
             
              callback(results,null);
        }
    });
    },

    dustbinGroupDataNew:function(callback){
        //  WHERE dustbins.data_percentage > 61
        
        var sqlquery ="SELECT assign_group_vehicle.vid as vehicleID, assign_group_vehicle.groupid as GroupName,assign_group_vehicle.status as Groupstatus,assign_group_vehicle.assigndate, dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=1";
        db.query(sqlquery, function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
             
              callback(results,null);
        }
    });
    },

    dustbinMarker:function(callback){

        var sqlquery ="SELECT dustbins.*,warehouses.name as wname FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id";
        db.query(sqlquery, function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
             
              callback(results,null);
        }
    });
    },

    dustbinGroupDataHistory:function(limit,offset,callback){
        //  WHERE dustbins.data_percentage > 61
        var current_page = limit || 1;
        var items_per_page = offset || 10;
        var start_index = (current_page - 1) * items_per_page;
 
           
            db.query('SELECT count(*) as total FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=0',function(error,data) {
                if (error) throw error;                
                var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));

                var sqlquery ="SELECT drivers.name as drivername,drivers.mobile_no,drivers.driver_image, vehicles.id as vehicleID,vehicles.model_name as modelName,vehicles.vehicle_rc,assign_group_vehicle.status as Groupstatus, assign_group_vehicle.groupid as GroupName,assign_group_vehicle.assigndate, dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=0 LIMIT "+start_index+", "+items_per_page+"";
                db.query(sqlquery, function (error, results) {
                    if (error) {
                    callback(error,null);
                    }
                    else{                            
                        var obj={
                            data:results,
                            totalpage:parseInt(total_pages),
                            totalrecoard:parseInt(data[0].total)
                        }
                         callback(obj,null);
                    }
            });
            
            });
          
       

    },
    dustbinGroupDataHistory1:function(limit,offset,wid,callback){

        var current_page = limit || 1;
        var items_per_page = offset || 10;
        var start_index = (current_page - 1) * items_per_page;

        if(wid!="" || wid!=undefined){
            db.query('SELECT count(*) as total FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=0 and dustbins.warehouse_id=?',[wid],function(error,data) {
                if (error) throw error;                
                var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
    
                var sqlquery ="SELECT drivers.name as drivername,drivers.mobile_no,drivers.driver_image, vehicles.id as vehicleID,vehicles.model_name as modelName,vehicles.vehicle_rc, assign_group_vehicle.groupid as GroupName, assign_group_vehicle.status as Groupstatus,assign_group_vehicle.assigndate, dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=0 and dustbins.warehouse_id=? LIMIT "+start_index+", "+items_per_page+"";
                db.query(sqlquery,[wid], function (error, results) {
                    if (error) {
                    callback(error,null);
                    }
                    else{            
                        var obj={
                            data:results,
                            totalpage:parseInt(total_pages),
                            totalrecoard:parseInt(data[0].total)
                        }
                        callback(obj,null);
                    }
            });
            
            });
    
            }else{
                callback("Missing parameter",null);
            }
    },

    dustbinGroupDataHistory2:function(limit,offset,filterdate,filterdate2,callback){
       
        var current_page = limit || 1;
        var items_per_page = offset || 10;
        var start_index = (current_page - 1) * items_per_page;
  
         if(filterdate!="" || filterdate!=undefined && filterdate2!="" || filterdate2!=undefined){ 
         
         db.query('SELECT count(*) as total FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=0 and DATE(assign_group_vehicle.assigndate) BETWEEN ? and ?',[filterdate,filterdate2],function(error,data) {
                if (error) {
                    callback(error,null);
                    }    
                   var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                    console.log(total_pages);   
                    var sqlquery ="SELECT drivers.name as drivername,drivers.mobile_no,drivers.driver_image, vehicles.id as vehicleID,vehicles.model_name as modelName,vehicles.vehicle_rc,assign_group_vehicle.status as Groupstatus, assign_group_vehicle.groupid as GroupName,assign_group_vehicle.assigndate, dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=0 and DATE(assign_group_vehicle.assigndate) BETWEEN ? AND ?  LIMIT "+start_index+", "+items_per_page+"";
                    db.query(sqlquery,[filterdate,filterdate2], function (error, results) {
                        if (error) {
                        callback(error,null);
                        }
                        else{            
                            var obj={
                                data:results,
                                totalpage:parseInt(total_pages),
                                totalrecoard:parseInt(data[0].total)
                            }
                            callback(obj,null);
                        }
                });
                
                });


         }
        else{
            callback("Missing parameter",null);
        }
   
    },

    dustbinGroupSingleData:function(groupID,callback){
        //  WHERE dustbins.data_percentage > 61
        var sqlquery ="SELECT drivers.name as drivername,drivers.mobile_no,drivers.driver_image, vehicles.id as vehicleID,vehicles.model_name as modelName,vehicles.vehicle_rc, assign_group_vehicle.groupid as GroupName, assign_group_vehicle.status as Groupstatus, assign_group_vehicle.assigndate,assign_group_vehicle.dustbindatapercentage,dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.groupid='"+groupID+"'";
        db.query(sqlquery, function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
             
              callback(results,null);
         }
        });
    },

    updateDustbindata:function(per,number,callback){

        var sqlquery = "UPDATE dustbins set data_percentage=? WHERE gsm_moblie_number = ?";
        db.query(sqlquery,[per,number], function (error,result) {
            if (error) {
            callback(error,null);
            }
            else{ 
                if(result){
                    callback('update record!',null);
                }   else{
                    callback('Mobile Number is not registered!',null);
                }
            
        }
        });
     },

     dashBoardData:function(callback){

        db.query('SELECT count(*) as Dtotal FROM `dustbins`',function(error,dustbinCount) {
            if (error) throw error; 

            db.query('SELECT count(*) as Wtotal FROM `warehouses`',function(error,warehouseCount) {
                if (error) throw error; 

                db.query('SELECT count(*) as Vtotal FROM `vehicles`',function(error,vehiclesCount) {
                    if (error) throw error; 
                    db.query('SELECT count(*) as Drtotal FROM `drivers`',function(error,driversCount) {
                        if (error) throw error; 
                        var sqlquery ="SELECT assign_group_vehicle.id FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=1 and DATE(assign_group_vehicle.assigndate)=CURDATE()";
                        db.query(sqlquery, function (error, todaypicupCount) {

                            if (error) throw error;
                            var sqlquery ="SELECT count(*) as allpicup FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=0";
                            db.query(sqlquery, function (error, allCount) {
                                if (error) throw error;


                                var sqlquery ="SELECT dustbins.*,warehouses.name as wname FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id";
                                db.query(sqlquery, function (error, results) {

                                    if (error) throw error;

                                var sqlquery ="SELECT warehouses.name as wname,warehouses.name,warehouses.latitude, warehouses.longitude FROM `warehouses`";
                                db.query(sqlquery, function (error, warehouseresults) {
                                            
                                 if (error) throw error;
//========
                                 var sqlquery ="SELECT assign_group_vehicle.groupid as GroupName, assign_group_vehicle.status,assign_group_vehicle.assigndate FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and DATE(assign_group_vehicle.assigndate)=CURDATE()";
                                    db.query(sqlquery, function (error, groupresults) {
                                             
                                  if (error) throw error;
                            
                                    var obj={
                                        dustbinTotal:dustbinCount[0].Dtotal,
                                        warehouseTotal:warehouseCount[0].Wtotal,
                                        vehiclesTotal:vehiclesCount[0].Vtotal,
                                        driversTotal:driversCount[0].Drtotal,
                                        todaypicup:todaypicupCount.length,
                                        allpicup:allCount[0].allpicup,
                                        googleDustbinMapMarker:results,
                                        googleWarehouseMapMarker:warehouseresults,
                                        todaypicuplist:groupresults
                                    }
                                 callback(obj,null);
                                    
                                 });

                            });

                        });

                       });

                     });
                    });
             });

        });

        });
     },

     getAlldustbinsHistory:function(limit,offset,selectdate,wid,dataperfrom,callback){
        var current_page = limit || 1;
        var items_per_page = offset || 10;
        var start_index = (current_page - 1) * items_per_page;
        
        if(wid!=="" && selectdate=="" && dataperfrom==""){
            console.log(1);
            db.query('SELECT count(*) as total FROM `assign_group_vehicle` INNER JOIN dustbins on dustbins.id=assign_group_vehicle.did INNER JOIN warehouses on warehouses.id=assign_group_vehicle.wid WHERE assign_group_vehicle.wid=?',[wid],function(error,data) {
                if (error) throw error;                
                var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                db.query('SELECT warehouses.name as wname,dustbins.name, dustbins.gsm_moblie_number, dustbins.address, assign_group_vehicle.*  FROM `assign_group_vehicle` INNER JOIN dustbins on dustbins.id=assign_group_vehicle.did INNER JOIN warehouses on warehouses.id=assign_group_vehicle.wid WHERE assign_group_vehicle.wid=? LIMIT '+start_index+', '+items_per_page+'',[wid], function (error, results) {
                    if (error) {
                    callback(error,null);
                    }
                    else{
                        var obj={
                            data:results,
                            totalpage:parseInt(total_pages),
                            totalrecoard:parseInt(data[0].total)
                        }
                        callback(obj,null);
                }
             });


            });
        }
        else if(selectdate!=="" && wid=="" && dataperfrom==""){
           
            db.query('SELECT count(*) as total FROM `assign_group_vehicle` INNER JOIN dustbins on dustbins.id=assign_group_vehicle.did INNER JOIN warehouses on warehouses.id=assign_group_vehicle.wid WHERE Date(assign_group_vehicle.assigndate)=?',[selectdate],function(error,data) {
                if (error) throw error;                
                var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                db.query('SELECT warehouses.name as wname,dustbins.name, dustbins.gsm_moblie_number, dustbins.address, assign_group_vehicle.*  FROM `assign_group_vehicle` INNER JOIN dustbins on dustbins.id=assign_group_vehicle.did INNER JOIN warehouses on warehouses.id=assign_group_vehicle.wid WHERE Date(assign_group_vehicle.assigndate)=? LIMIT '+start_index+', '+items_per_page+'',[selectdate], function (error, results) {
                    if (error) {
                    callback(error,null);
                    }
                    else{
                        var obj={
                            data:results,
                            totalpage:parseInt(total_pages),
                            totalrecoard:parseInt(data[0].total)
                        }
                        callback(obj,null);
                }
             });


            });
        }

    
        


        else if(dataperfrom!=="" && selectdate=="" && wid==""){
            
            db.query('SELECT count(*) as total FROM `assign_group_vehicle` INNER JOIN dustbins on dustbins.id=assign_group_vehicle.did INNER JOIN warehouses on warehouses.id=assign_group_vehicle.wid WHERE  assign_group_vehicle.dustbindatapercentage BETWEEN 0 and ?',[dataperfrom],function(error,data) {
                if (error) throw error;                
                var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                db.query('SELECT warehouses.name as wname,dustbins.name, dustbins.gsm_moblie_number, dustbins.address, assign_group_vehicle.*  FROM `assign_group_vehicle` INNER JOIN dustbins on dustbins.id=assign_group_vehicle.did INNER JOIN warehouses on warehouses.id=assign_group_vehicle.wid WHERE assign_group_vehicle.dustbindatapercentage BETWEEN 0  and ? LIMIT '+start_index+', '+items_per_page+'',[dataperfrom], function (error, results) {
                    if (error) {
                    callback(error,null);
                    }
                    else{
                        var obj={
                            data:results,
                            totalpage:parseInt(total_pages),
                            totalrecoard:parseInt(data[0].total)
                        }
                        callback(obj,null);
                }
             });


            });
        }
      
        else{
            
            db.query('SELECT count(*) as total FROM `assign_group_vehicle`  INNER JOIN dustbins on dustbins.id=assign_group_vehicle.did INNER JOIN warehouses on warehouses.id=assign_group_vehicle.wid',function(error,data) {
                if (error) throw error;                
                var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                db.query('SELECT warehouses.name as wname,dustbins.name, dustbins.gsm_moblie_number, dustbins.address, assign_group_vehicle.* FROM `assign_group_vehicle`  INNER JOIN dustbins on dustbins.id=assign_group_vehicle.did INNER JOIN warehouses on warehouses.id=assign_group_vehicle.wid LIMIT '+start_index+', '+items_per_page+'', function (error, results) {
                    if (error) {
                    callback(error,null);
                    }
                    else{
                        var obj={
                            data:results,
                            totalpage:parseInt(total_pages),
                            totalrecoard:parseInt(data[0].total)
                        }
                        callback(obj,null);
                }
             });


            });
        }
           
       
    },

    vehicleAvaliblePerWarehouse:function(limit,offset,wid,callback){
        var current_page = limit || 1;
        var items_per_page = offset || 10;
        var start_index = (current_page - 1) * items_per_page;  
        db.query('SELECT count(*) as total FROM vehicles LEFT JOIN mapping_vehicle_drivers on mapping_vehicle_drivers.vehicle_id=vehicles.id LEFT JOIN warehouse_mapped_vehicles on warehouse_mapped_vehicles.vehicleid=vehicles.id LEFT JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE warehouse_mapped_vehicles.warehouse_Id=? and vehicles.available_status=0 and vehicles.status=1 and drivers.status=1 and drivers.driverAblible=0',[wid],function(error,data) {
            if (error) throw error;                
            var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
            db.query('SELECT vehicles.model_name,vehicles.mgf_year,drivers.name as Drivername,drivers.mobile_no, vehicles.capacity, vehicles.vehicle_rc,drivers.driver_image,drivers.id as DriverID,vehicles.id as VehicleID FROM vehicles LEFT JOIN mapping_vehicle_drivers on mapping_vehicle_drivers.vehicle_id=vehicles.id LEFT JOIN warehouse_mapped_vehicles on warehouse_mapped_vehicles.vehicleid=vehicles.id LEFT JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE warehouse_mapped_vehicles.warehouse_Id=? and vehicles.available_status=0 and vehicles.status=1 and drivers.status=1 and drivers.driverAblible=0 LIMIT '+start_index+', '+items_per_page+'',[wid], function (error, results) {
                if (error) {
                callback(error,null);
                }
                else{
                    var obj={
                        data:results,
                        totalpage:parseInt(total_pages),
                        totalrecoard:parseInt(data[0].total)
                    }
                    callback(obj,null);
            }
         });


        });
        

    },

    vehicleAvaliblePerWarehouseCount:function(wid,callback){ 
              
        db.query('SELECT count(*) as total FROM vehicles LEFT JOIN mapping_vehicle_drivers on mapping_vehicle_drivers.vehicle_id=vehicles.id LEFT JOIN warehouse_mapped_vehicles on warehouse_mapped_vehicles.vehicleid=vehicles.id LEFT JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE warehouse_mapped_vehicles.warehouse_Id=? and vehicles.available_status=0 and vehicles.status=1 and drivers.status=1 and drivers.driverAblible=0',[wid],function(error,data1) {
            if (error) throw error;                
            db.query('SELECT count(*) as total FROM vehicles LEFT JOIN mapping_vehicle_drivers on mapping_vehicle_drivers.vehicle_id=vehicles.id LEFT JOIN warehouse_mapped_vehicles on warehouse_mapped_vehicles.vehicleid=vehicles.id LEFT JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE warehouse_mapped_vehicles.warehouse_Id=? and vehicles.available_status=1 and vehicles.status=1 and drivers.status=1 and drivers.driverAblible=1',[wid],function(error,data) {
                if (error) throw error;                
             
                var obj={
                    avabileVehicle:data1[0].total,
                    notavabileVehicle:data[0].total,
                    warehouse_Id:wid
                    
                }
                callback(obj,null);
            });
           
        });
      
    },

    vehicleAutoAvaliblePerWarehouse:function(wid,callback){
              db.query('SELECT assign_group_vehicle.groupid, warehouse_mapped_vehicles.warehouse_Id,vehicles.id as vehicleID, vehicles.capacity, vehicles.model_name,vehicles.mgf_year,drivers.name as Drivername,drivers.mobile_no,vehicles.vehicle_rc,drivers.driver_image,drivers.id as DriverID,vehicles.id as VehicleID FROM vehicles LEFT JOIN mapping_vehicle_drivers on mapping_vehicle_drivers.vehicle_id=vehicles.id LEFT JOIN warehouse_mapped_vehicles on warehouse_mapped_vehicles.vehicleid=vehicles.id LEFT JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id LEFT JOIN assign_group_vehicle on assign_group_vehicle.wid=warehouse_mapped_vehicles.warehouse_Id WHERE warehouse_mapped_vehicles.warehouse_Id=? and vehicles.available_status=0 and vehicles.status=1 and drivers.status=1 and drivers.driverAblible=0',[wid], function (error, results) {
                if (error) {
                callback(error,null);
                }
                else{
                   callback(results,null);
            }
         });


    },
  
    vehicleNotAvaliblePerWarehouse:function(limit,offset,wid,callback){
        var current_page = limit || 1;
        var items_per_page = offset || 10;
        var start_index = (current_page - 1) * items_per_page;  
        db.query('SELECT count(*) as total FROM vehicles LEFT JOIN mapping_vehicle_drivers on mapping_vehicle_drivers.vehicle_id=vehicles.id LEFT JOIN warehouse_mapped_vehicles on warehouse_mapped_vehicles.vehicleid=vehicles.id LEFT JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE warehouse_mapped_vehicles.warehouse_Id=? and  vehicles.available_status=1 and vehicles.status=1 and drivers.status=1 and drivers.driverAblible=1',[wid],function(error,data) {
            if (error) throw error;                
            var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
            db.query('SELECT  vehicles.model_name,vehicles.mgf_year,drivers.name as Drivername,drivers.mobile_no, vehicles.capacity, vehicles.vehicle_rc,drivers.driver_image,drivers.id as DriverID,vehicles.id as VehicleID FROM vehicles LEFT JOIN mapping_vehicle_drivers on mapping_vehicle_drivers.vehicle_id=vehicles.id LEFT JOIN warehouse_mapped_vehicles on warehouse_mapped_vehicles.vehicleid=vehicles.id LEFT JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE warehouse_mapped_vehicles.warehouse_Id=? and vehicles.available_status=1 and vehicles.status=1 and drivers.status=1 and drivers.driverAblible=1 LIMIT '+start_index+', '+items_per_page+'',[wid], function (error, results) {
                if (error) {
                callback(error,null);
                }
                else{
                    var obj={
                        data:results,
                        totalpage:parseInt(total_pages),
                        totalrecoard:parseInt(data[0].total)
                    }
                    callback(obj,null);
            }
         });


        });
        

    },

    Driveravaviltyhistory:function(driverid,status,callback){
        //insert into driver_histroys(driver_histroys.driver_id,driver_histroys.avilable_time,driver_histroys.avilable_date) VALUES(1,CURRENT_TIME(),CURRENT_DATE())
        var sqlquery="INSERT INTO driver_histroys(`driver_id`,`avilable_time`,`avilable_date`,status) VALUES ('"+driverid+"','"+momentzone().format('hh:mm:ss A').toLocaleString('en-IN',{timeZone: "Asia/Dubai"})+"','"+date.format(now, 'DD MMM YYYY')+"','"+status+"')";
                 db.query(sqlquery, function (error,result) {
                     if (error) {
                     callback(error,null);
                     }
                     else{    
                     callback("success",null);
                 }
         });

   },

    reAssignVehiclePicupID:function(groupID,vid,callback){

        var sqlquery ="SELECT vid FROM `assign_group_vehicle` WHERE groupid=? group BY groupid";
        db.query(sqlquery,[groupID], function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{   
       
             if(results.length>0){

                 if(results[0].vid>0){

                    var sqlquery1 = "SELECT drivers.id as DriverId FROM vehicles INNER JOIN mapping_vehicle_drivers on vehicles.id=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id where mapping_vehicle_drivers.vehicle_id=?";  
                    db.query(sqlquery1,[results[0].vid], function (error, results1) {
                        if (error) {
                        callback(error,null);
                        }
                        else{
                         console.log(results[0].capacity);
                         //console.log(results[0].capacity);
     
                         var sqlquery2 = "UPDATE vehicles set available_status=0 WHERE id = ?"; 
                         db.query(sqlquery2,[results[0].vid], function (error, results2) {
                             if (error) {
                             callback(error,null);
                             }
     
                             var sqlquery3 = "UPDATE drivers set driverAblible=0 WHERE id=?";
                                 db.query(sqlquery3,[results1[0].DriverId], function (error, results3) {
                                     if (error) {
                                     callback(error,null);
                                     }
                                     dustbin.Driveravaviltyhistory(results1[0].DriverId,1,driverData1=>{
                                         //callback(driverData1,null);
                                     });
     
                                     dustbin.updateavlablevehiclegroupDustbin(vid,groupID,data=>{
     
                                         dustbin.updateassignrdeVehicle(vid,returnDriverID=>{
     
                                             dustbin.Driveravaviltyhistory(returnDriverID,0,driverData=>{
                                                 callback(data,null);
                                             });
                                                 
                                         });
                                     })
                                    
         
                                 });
                             
                             });
     
     
                        }
                     });
                 }else{
                    dustbin.updateavlablevehiclegroupDustbin(vid,groupID,data=>{
                        dustbin.updateassignrdeVehicle(vid,returnDriverID=>{
    
                            dustbin.Driveravaviltyhistory(returnDriverID,0,driverData=>{
                                callback(data,null);
                            });
                                
                        });            
                    }); 
                 }
              

             }else{

                dustbin.updateavlablevehiclegroupDustbin(vid,groupID,data=>{
                    dustbin.updateassignrdeVehicle(vid,returnDriverID=>{

                        dustbin.Driveravaviltyhistory(returnDriverID,0,driverData=>{
                            callback(data,null);
                        });
                            
                    });            
                });

               
             }



              
        }
    });
    }


}
module.exports = dustbin;