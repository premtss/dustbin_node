//include the model
const db = require('../DbConnection'); 

  //create class
var vehicles = {

    getAllDriverItems:function(limit,offset,status,avablitystatus,callback){

                var current_page = limit || 1;
                var items_per_page = offset || 10;
                var start_index = (current_page - 1) * items_per_page;
                
                if(status!=="" && avablitystatus==""){

                    db.query('SELECT count(*) as total FROM drivers where status='+status,function(error,data) {
                        if (error) throw error;                
                        var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                        db.query('SELECT * FROM drivers where status='+status+' LIMIT '+start_index+', '+items_per_page, function (error, results) {
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
                
                else if(status=="" && avablitystatus!==""){
                    db.query('SELECT count(*) as total FROM drivers where driverAblible='+avablitystatus,function(error,data) {
                        if (error) throw error;                
                        var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                        db.query('SELECT * FROM drivers where driverAblible='+avablitystatus+' LIMIT '+start_index+', '+items_per_page, function (error, results) {
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
                    db.query('SELECT count(*) as total FROM drivers',function(error,data) {
                        if (error) throw error;                
                        var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                        db.query('SELECT * FROM drivers LIMIT '+start_index+', '+items_per_page+'', function (error, results) {
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

    DrivernotassignItems:function(limit,offset,callback){

        var current_page = limit || 1;
        var items_per_page = offset || 10;
        var start_index = (current_page - 1) * items_per_page;
        
                 db.query('SELECT count(*) as total FROM drivers WHERE id NOT IN (SELECT mapping_vehicle_drivers.driver_id FROM mapping_vehicle_drivers)',function(error,data) {
                if (error) throw error;                
                var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                db.query('SELECT drivers.id,drivers.name,drivers.mobile_no,drivers.driver_image FROM  drivers WHERE id NOT IN (SELECT mapping_vehicle_drivers.driver_id FROM mapping_vehicle_drivers) LIMIT '+start_index+', '+items_per_page+'', function (error, results) {
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




    addNewDriver:function(name,email,mobileno,nationality,caddress,ccity,cstate,ccountry,cpobox,crefname,crefno,paddress,pcity,pstate,pcountry,ppobox,prefname,prefno,passportissuedate,passportexpiredate,passportimage,nationalidissuedate,nationalidexpiredate,nationalidimage,drivinglicissuedate,drivinglicexpiredate,drivinglicimage,visaissuedate,visaexpiredate,visaimage,driverimage,callback){
           
            var sqlquery="INSERT INTO drivers(`name`,`email`,`mobile_no`,`app_user_id`,`password`,`nationality`,`c_address`,`c_city`,`c_state`,`c_country`,`c_po_box`,`c_ref_name`,`c_ref_no`,`p_address`,`p_city`,`p_state`,`p_country`,`p_po_box`,`p_ref_name`,`p_ref_no`,`passport_issue_date`,`passport_expire_date`,`passport_image`,`national_id_issue_date`,`national_id_expire_date`,`national_id_image`,`driving_lic_issue_date`,`driving_lic_expire_date`,`driving_lic_image`,`visa_issue_date`,`visa_expire_date`,`visa_image`,`driver_image`,`status`) VALUES ('"+name+"','"+email+"','"+mobileno+"','"+mobileno+"','"+mobileno+"','"+nationality+"','"+caddress+"','"+ccity+"','"+cstate+"','"+ccountry+"','"+cpobox+"','"+crefname+"','"+crefno+"','"+paddress+"','"+pcity+"','"+pstate+"','"+pcountry+"','"+ppobox+"','"+prefname+"','"+prefno+"','"+passportissuedate+"','"+passportexpiredate+"','"+passportimage+"','"+nationalidissuedate+"','"+nationalidexpiredate+"','"+nationalidimage+"','"+drivinglicissuedate+"','"+drivinglicexpiredate+"','"+drivinglicimage+"','"+visaissuedate+"','"+visaexpiredate+"','"+visaimage+"','"+driverimage+"','"+1+"')";
            db.query(sqlquery, function (error,result) {
                if (error) {
                callback(error,null);
                }
                else{    
                callback('1 record inserted',null);
            }
         });

    },
    existMobileRecord:function(mobile,callback){
        
        db.query('SELECT * FROM drivers where mobile_no='+mobile, function (error,result) {
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
 
    updateDriver:function(name,nationality,caddress,ccity,cstate,ccountry,cpobox,crefname,crefno,paddress,pcity,pstate,pcountry,ppobox,prefname,prefno,passportissuedate,passportexpiredate,passportimage,nationalidissuedate,nationalidexpiredate,nationalidimage,drivinglicissuedate,drivinglicexpiredate,drivinglicimage,visaissuedate,visaexpiredate,visaimage,driverimage,mobile_no,callback){
        var sqlquery = "UPDATE drivers set name=?,nationality=?,c_address=?,c_city=?,c_state=?,c_country=?,c_po_box=?,c_ref_name=?,c_ref_no=?,p_address=?,p_city=?,p_state=?,p_country=?,p_po_box=?,p_ref_name=?,p_ref_no=?,passport_issue_date=?,passport_expire_date=?,passport_image=?,national_id_issue_date=?,national_id_expire_date=?,national_id_image=?,driving_lic_issue_date=?,driving_lic_expire_date=?,driving_lic_image=?,visa_issue_date=?,visa_expire_date=?,visa_image=?,driver_image=?  WHERE mobile_no = ?";
        db.query(sqlquery,[name,nationality,caddress,ccity,cstate,ccountry,cpobox,crefname,crefno,paddress,pcity,pstate,pcountry,ppobox,prefname,prefno,passportissuedate,passportexpiredate,passportimage,nationalidissuedate,nationalidexpiredate,nationalidimage,drivinglicissuedate,drivinglicexpiredate,drivinglicimage,visaissuedate,visaexpiredate,visaimage,driverimage,mobile_no], function (error,result) {
            if (error) {
            callback(error,null);
            }
            else{    
            callback('Record Updated Successfully!',null);
        }
     });
    },
    getDriverDetails:function(did,callback){
                 var sqlquery ="SELECT * FROM drivers where id=?";
                db.query(sqlquery,[did], function (error, results) {
                    if (error) {
                    callback(error,null);
                    }
                    else{
                    callback(results[0],null);
                }
             });
    },

    getDriver:function(mobileno,callback){
        var sqlquery ="SELECT * FROM drivers where mobile_no=?";
       db.query(sqlquery,[mobileno], function (error, results) {
           if (error) {
           callback(error,null);
           }
           else{
//SELECT drivers.name as drivername,drivers.mobile_no,drivers.driver_image, vehicles.id as vehicleID,vehicles.model_name as modelName,vehicles.vehicle_rc, assign_group_vehicle.groupid as GroupName,assign_group_vehicle.assigndate, dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and drivers.mobile_no='996765756733'
            var sqlquery2 ="SELECT vehicles.id,vehicles.vehicle_rc,vehicles.model_name,vehicles.status,vehicles.available_status,drivers.name,drivers.mobile_no,drivers.driver_image, mapping_vehicle_drivers.status as oldstatus FROM `vehicles` INNER JOIN mapping_vehicle_drivers ON (vehicles.id = mapping_vehicle_drivers.vehicle_id) INNER JOIN drivers ON (mapping_vehicle_drivers.driver_id = drivers.id) WHERE drivers.mobile_no=?";
            db.query(sqlquery2,[mobileno], function (error, resultvehicle) {
                if (error) {
                callback(error,null);
                }
                else{
                    var sqlquery3 ="SELECT drivers.name as drivername,drivers.mobile_no,vehicles.vehicle_photo as vphoto, vehicles.id as vehicleID,vehicles.model_name as modelName,vehicles.vehicle_rc,assign_group_vehicle.status as Groupstatus, assign_group_vehicle.groupid as GroupName,assign_group_vehicle.assigndate as assigndate, dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and drivers.mobile_no=?";
                  
                    db.query(sqlquery3,[mobileno], function (error, resultHistory) {
                        if (error) {
                            callback(error,null);
                            }
                    else{
                        var obj={};

                    var obj={
                        singledata:results[0],
                        document:{passportimage:results[0].passport_image,nationalimage:results[0].national_id_image,drivinglicimage:results[0].driving_lic_image,visaimage:results[0].visa_image},
                        vehicleList:resultvehicle,
                        historyList:resultHistory
                    }
                 callback(obj,null);
                }
             });

            }
        
        });
       }
    });
},
    deleteVehiclesDetails:function(did,callback){
            db.query('DELETE FROM drivers WHERE id='+did, function (error, results) {
                if (error) {
                callback(error,null);
                }
                else{
                callback('delete record successfully',null);
            }
         });
    },


    driverAvabilityHistory:function(callback){
        db.query('SELECT drivers.name,drivers.mobile_no,drivers.driver_image,driver_histroys.avilable_time,driver_histroys.avilable_date, driver_histroys.status as avabilityststus FROM driver_histroys INNER JOIN drivers on drivers.id=driver_histroys.driver_id', function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
              callback(results,null);
             }
         });
    },

}




module.exports = vehicles;