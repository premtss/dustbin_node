//include the model
const db = require('../DbConnection'); 
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCntPB-qN_-K60eVMgJkJEy8Dn2ZxvxC6Y',
    Promise: Promise
  });

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



    dustbinGroupData:function(callback){
        //  WHERE dustbins.data_percentage > 61
        
        var sqlquery ="SELECT drivers.name as drivername,drivers.mobile_no,drivers.driver_image, vehicles.id as vehicleID,vehicles.model_name as modelName,vehicles.vehicle_rc, assign_group_vehicle.groupid as GroupName,assign_group_vehicle.status as Groupstatus,assign_group_vehicle.assigndate, dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=1";
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
                                        allpicup:allCount.length,
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



}
module.exports = dustbin;