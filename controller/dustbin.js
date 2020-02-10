//include the model
const db = require('../DbConnection'); 
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCntPB-qN_-K60eVMgJkJEy8Dn2ZxvxC6Y',
    Promise: Promise
  });

 //create class
 var wherehouse = {
 
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
        var sqlquery ="SELECT dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id WHERE dustbins.id not in(select did from assign_group_vehicle)";
        db.query(sqlquery, function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
             
              callback(results,null);

        }
    });
    },




    assignVehicledustbins:function(groupid,wid,did,assigndate,callback){
    var selectQry="select If(vehicles.id IS NULL or vehicles.id ='' ,'empty',vehicles.id) as Vid  from vehicles LEFT JOIN warehouse_mapped_vehicles on vehicles.id=warehouse_mapped_vehicles.vehicleid INNER join mapping_vehicle_drivers on mapping_vehicle_drivers.vehicle_id=vehicles.id WHERE vehicles.status=1 and vehicles.available_status=0 and warehouse_mapped_vehicles.warehouse_Id='"+wid+"' limit 1";
    db.query(selectQry, function (error,results) { 
        console.log(results.length)
        if(results.length!=0){
           // console.log("Find");
            var sqlquery="INSERT INTO assign_group_vehicle(`groupid`,`wid`,	`vid`,`did`,`assigndate`,`status`) VALUES ('"+groupid+"','"+wid+"','"+results[0].Vid+"','"+did+"','"+assigndate+"','"+1+"')";
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
        var sqlquery ="SELECT drivers.name as drivername,drivers.mobile_no,drivers.driver_image, vehicles.id as vehicleID,vehicles.model_name as modelName,vehicles.vehicle_rc, assign_group_vehicle.groupid as GroupName,assign_group_vehicle.assigndate, dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.status=1";
        db.query(sqlquery, function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
             
              callback(results,null);
        }
    });
    },

    dustbinGroupSingleData:function(groupID,callback){
        //  WHERE dustbins.data_percentage > 61
        var sqlquery ="SELECT drivers.name as drivername,drivers.mobile_no,drivers.driver_image, vehicles.id as vehicleID,vehicles.model_name as modelName,vehicles.vehicle_rc, assign_group_vehicle.groupid as GroupName,assign_group_vehicle.assigndate, dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and assign_group_vehicle.groupid='"+groupID+"'";
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




}
module.exports = wherehouse;