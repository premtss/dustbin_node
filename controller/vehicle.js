//include the model
const db = require('../DbConnection'); 

  //create class
var vehicles = {

    getAllVehiclesItems:function(limit,offset,status,avablitystatus,callback){

                var current_page = limit || 1;
                var items_per_page = offset || 10;
                var start_index = (current_page - 1) * items_per_page;
                
                if(status!=="" && avablitystatus==""){

                    db.query('SELECT count(*) as total FROM vehicles where vehicles.status='+status,function(error,data) {
                        if (error) throw error;                
                        var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                        db.query('SELECT vehicles.id,vehicles.vehicle_rc,vehicles.model_name,vehicles.status,vehicles.available_status,IFNULL(drivers.name,"NA") as name,drivers.mobile_no,drivers.driver_image, IFNULL(mapping_vehicle_drivers.status,2) as Currentstatus FROM `vehicles` LEFT JOIN mapping_vehicle_drivers ON (vehicles.id = mapping_vehicle_drivers.vehicle_id) LEFT JOIN drivers ON (mapping_vehicle_drivers.driver_id = drivers.id) where vehicles.status='+status+' GROUP by vehicles.id LIMIT '+start_index+', '+items_per_page, function (error, results) {
                            if (error) {
                            callback(error,null);
                            }
                            else{
                                var obj={
                                    data:results,
                                    totalpage:total_pages,
                                    totalrecoard:parseInt(data[0].total)
                                }
                            callback(obj,null);
                        }
                     });
      
                    });
                }
                else if(status=="" && avablitystatus!==""){
                    db.query('SELECT count(*) as total FROM vehicles where vehicles.available_status='+avablitystatus,function(error,data) {
                        if (error) throw error;                
                        var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                        db.query('SELECT vehicles.id,vehicles.vehicle_rc,vehicles.model_name,vehicles.status,vehicles.available_status,IFNULL(drivers.name,"NA") as name,drivers.mobile_no,drivers.driver_image, IFNULL(mapping_vehicle_drivers.status,2) as Currentstatus FROM `vehicles` LEFT JOIN mapping_vehicle_drivers ON (vehicles.id = mapping_vehicle_drivers.vehicle_id) LEFT JOIN drivers ON (mapping_vehicle_drivers.driver_id = drivers.id) where vehicles.available_status='+avablitystatus+' GROUP by vehicles.id LIMIT '+start_index+', '+items_per_page, function (error, results) {
                            if (error) {
                            callback(error,null);
                            }
                            else{
                                var obj={
                                    data:results,
                                    totalpage:total_pages,
                                    totalrecoard:parseInt(data[0].total)
                                }
                            callback(obj,null);
                        }
                     });
      
                    });
                }
                else{
                    db.query('SELECT count(*) as total FROM vehicles',function(error,data) {
                        if (error) throw error;                
                        var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                        db.query('SELECT vehicles.id,vehicles.vehicle_rc,vehicles.model_name,vehicles.status,vehicles.available_status,IFNULL(drivers.name,"NA") as name,drivers.mobile_no,drivers.driver_image, IFNULL(mapping_vehicle_drivers.status,2) as Currentstatus FROM `vehicles` LEFT JOIN mapping_vehicle_drivers ON (vehicles.id = mapping_vehicle_drivers.vehicle_id) LEFT JOIN drivers ON (mapping_vehicle_drivers.driver_id = drivers.id) GROUP by vehicles.id LIMIT '+start_index+', '+items_per_page, function (error, results) {
                            if (error) {
                            callback(error,null);
                            }
                            else{
                                var obj={
                                    data:results,
                                    totalpage:total_pages,
                                    totalrecoard:parseInt(data[0].total)
                                }
                            callback(obj,null);
                        }
                     });
    
    
                    });
                }
            
    },

    VehiclesNotAssigned: function (limit, offset, callback) {
        var current_page = limit || 1;
        var items_per_page = offset || 10;
        var start_index = (current_page - 1) * items_per_page;
        db.query('SELECT COUNT(*) as total FROM vehicles LEFT JOIN warehouse_mapped_vehicles on warehouse_mapped_vehicles.vehicleid=vehicles.id LEFT JOIN mapping_vehicle_drivers on mapping_vehicle_drivers.vehicle_id=vehicles.id WHERE vehicles.id NOT IN (SELECT warehouse_mapped_vehicles.warehouse_Id FROM warehouse_mapped_vehicles) and vehicles.id NOT IN (SELECT mapping_vehicle_drivers.vehicle_id FROM mapping_vehicle_drivers)', function (error, data) {
            if (error)
                throw error;
            var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
            db.query('SELECT vehicles.*, IFNULL(warehouse_mapped_vehicles.warehouse_Id,0) as warehouseID,IFNULL(mapping_vehicle_drivers.vehicle_id,0) as VehicleID FROM vehicles LEFT JOIN warehouse_mapped_vehicles on warehouse_mapped_vehicles.vehicleid=vehicles.id LEFT JOIN mapping_vehicle_drivers on mapping_vehicle_drivers.vehicle_id=vehicles.id WHERE vehicles.id NOT IN (SELECT warehouse_mapped_vehicles.warehouse_Id FROM warehouse_mapped_vehicles) and vehicles.id NOT IN (SELECT mapping_vehicle_drivers.vehicle_id FROM mapping_vehicle_drivers) LIMIT ' + start_index + ', ' + items_per_page + '', function (error, results) {
                if (error) {
                    callback(error, null);
                }
                else {
                    var obj = {
                        data: results,
                        totalpage: total_pages,
                        totalrecoard: parseInt(data[0].total)
                    };
                    callback(obj, null);
                }
            });
        });
    },


    addNewVehicle:function (modelname,mgfyear,companyname,trucktype,capacity,vehiclerc,rcissue,rcexpire,issuecountry,insuranceno,insuranceissuedate,insuranceexpiredate,insurancecompany,insurancecover,coveragelimit,vehiclephoto,registrationcard,insurancephoto,callback){

            var sqlquery="INSERT INTO vehicles(`model_name`,`mgf_year`,`company_name`,`trucktype`,`capacity`,`vehicle_rc`,`rc_issue`,`rc_expire`,`issue_country`,`insurance_no`,`insurance_issue_date`,`insurance_expire_date`,`insurance_company`,`insurance_cover`,`coverage_limit`,`vehicle_photo`,`registration_card`,`insurance_photo`,`status`,`available_status`) VALUES ('"+modelname+"','"+mgfyear+"','"+companyname+"','"+trucktype+"','"+capacity+"','"+vehiclerc+"','"+rcissue+"','"+rcexpire+"','"+issuecountry+"','"+insuranceno+"','"+insuranceissuedate+"','"+insuranceexpiredate+"','"+insurancecompany+"','"+insurancecover+"','"+coveragelimit+"','"+vehiclephoto+"','"+registrationcard+"','"+insurancephoto+"','"+1+"','"+0+"')";
            db.query(sqlquery, function (error,result) {
                if (error) {
                callback(error,null);
                }
                else{    
                callback('1 record inserted',null);
            }
         });

    },
    existRecoard:function(vehiclerc,callback){
        var sqlquery ="SELECT * FROM vehicles where vehicle_rc=?";
        db.query(sqlquery,[vehiclerc], function (error,result) {
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
    updateVehicle:function(modelname,mgfyear,companyname,trucktype,capacity,rcissue,rcexpire,issuecountry,insuranceno,insuranceissuedate,insuranceexpiredate,insurancecompany,insurancecover,coveragelimit,vehiclephoto,registrationcard,insurancephoto,Vid,callback){
        var sqlquery = "UPDATE vehicles set model_name =? ,mgf_year =?,company_name =?,trucktype =?,capacity=?,rc_issue =?,rc_expire =?,issue_country =?,insurance_no =?,insurance_issue_date =?,insurance_expire_date =?,insurance_company =?,insurance_cover =?,coverage_limit =?,vehicle_photo =?,registration_card =?,insurance_photo =? WHERE id = ?";
        db.query(sqlquery,[modelname,mgfyear,companyname,trucktype,capacity,rcissue,rcexpire,issuecountry,insuranceno,insuranceissuedate,insuranceexpiredate,insurancecompany,insurancecover,coveragelimit,vehiclephoto,registrationcard,insurancephoto,Vid], function (error,result) {
            if (error) {
            callback(error,null);
            }
            else{    
            callback('Record Updated Successfully!',null);
        }
     });
    },
    getVehiclesDetails:function(vid,callback){
                db.query('SELECT * FROM vehicles where id='+vid, function (error, results) {
                    if (error) {
                    callback(error,null);
                    }
                    else{
                    callback(results[0],null);
                }
             });
    },

    getVehicles:function(vehiclerc,callback){
        var sqlquery ="SELECT * FROM vehicles where vehicle_rc=?";
        db.query(sqlquery,[vehiclerc], function (error,result) {
            if (error) {
            callback(error,null);
            }
            else{

                var sqlquery2 ="SELECT drivers.name,drivers.mobile_no,drivers.driver_image,vehicles.id,vehicles.vehicle_photo,vehicles.vehicle_rc,vehicles.model_name,vehicles.status,vehicles.available_status, mapping_vehicle_drivers.status FROM `drivers` INNER JOIN mapping_vehicle_drivers ON (drivers.id = mapping_vehicle_drivers.driver_id) INNER JOIN vehicles ON (mapping_vehicle_drivers.vehicle_id = vehicles.id) WHERE mapping_vehicle_drivers.vehicle_id=?";
                db.query(sqlquery2,[result[0].id], function (error, resultDriver) {
                    if (error) throw error;
                    var sqlquery3 ="SELECT drivers.name as drivername,drivers.mobile_no,drivers.driver_image, vehicles.id as vehicleID,vehicles.model_name as modelName,vehicles.vehicle_rc,assign_group_vehicle.status as assignstatus, assign_group_vehicle.groupid as GroupName,assign_group_vehicle.assigndate, dustbins.*,warehouses.name as wname,warehouses.latitude as warelatitude,warehouses.longitude as warelongitute,warehouses.address as warehouseaddress FROM `dustbins` INNER JOIN warehouses on warehouses.id=dustbins.warehouse_id INNER JOIN assign_group_vehicle on assign_group_vehicle.did=dustbins.id INNER join vehicles on vehicles.id=assign_group_vehicle.vid INNER JOIN mapping_vehicle_drivers on assign_group_vehicle.vid=mapping_vehicle_drivers.vehicle_id INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE dustbins.id in(select did from assign_group_vehicle) and vehicles.vehicle_rc=?";
                  
                    db.query(sqlquery3,[vehiclerc], function (error, resultHistory) {
                        if (error) {
                            callback(error,null);
                            }
                    else{
                        var obj={
                            singledata:result[0],
                            document:{vehiclephoto:result[0].vehicle_photo,registrationcard:result[0].registration_card,insurancephoto:result[0].insurance_photo},
                            driverList:resultDriver,
                            historyList:resultHistory
                        }
                     callback(obj,null);
                  
                }
             });
            });
        }
     });
     },


    deleteVehiclesDetails:function(vid,callback){
            db.query('DELETE FROM vehicles WHERE id ='+vid, function (error, results) {
                if (error) {
                callback(error,null);
                }
                else{
                callback('delete record successfully',null);
            }
         });
    },


    MappedVehiclewithdriver:function (vehicleId,DriverId,callback){

        var sqlquery="INSERT INTO mapping_vehicle_drivers(`vehicle_id`,`driver_id`) VALUES ('"+vehicleId+"','"+DriverId+"')";
        db.query(sqlquery, function (error,result) {
            if (error) {
            callback(error,null);
            }
            else{    
            callback('1 record mapped',null);
        }
     });
    },

    reMappedVehiclewithdriver:function (vehicleId,DriverId,callback){

    var sqlquery="SELECT mapping_vehicle_drivers.id, mapping_vehicle_drivers.vehicle_id, mapping_vehicle_drivers.driver_id,drivers.driverAblible from mapping_vehicle_drivers INNER JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id  WHERE mapping_vehicle_drivers.status=1 and drivers.id=?";
        db.query(sqlquery,[DriverId], function (error,result) {
            if (error) {
            callback(error,null);
            }
         // console.log(DriverId);
         // console.log(vehicleId);
            if(result.length==1 && result[0].driverAblible==0 || result.length==1 && result[0].driverAblible==1){
             //   console.log("jjjjjjjj");
                var sqlquery11="update mapping_vehicle_drivers set status=0 where id=?";
                db.query(sqlquery11,[result[0].id], function (error,result) {
                    if (error) {
                    callback(error,null);
                    }
                    else{  
                    var sqlquery1="INSERT INTO mapping_vehicle_drivers(`vehicle_id`,`driver_id`) VALUES ('"+vehicleId+"','"+DriverId+"')";
                        db.query(sqlquery1, function (error,result) {
                            if (error) {
                            callback(error,null);
                            }
                            else{    
                            callback('1 record mapped',null);
                        }
                    });       
                  
                }
              });

      
            }
            else if(result.length==1 && result[0].driverAblible==2){
                //console.log("jjjjjjjj111");
                callback('Not assign!Because Picup on going!!',null);
            }
      
            else{
                //console.log("jjjjjjjj766");
                var sqlquery1="INSERT INTO mapping_vehicle_drivers(`vehicle_id`,`driver_id`) VALUES ('"+vehicleId+"','"+DriverId+"')";
                    db.query(sqlquery1, function (error,result) {
                        if (error) {
                        callback(error,null);
                        }
                        else{    
                        callback('1 record mapped',null);
                    }
                });
              }
   
    })



},


getAllVehiclesforAssign:function(limit,offset,callback){

    var current_page = limit || 1;
    var items_per_page = offset || 10;
    var start_index = (current_page - 1) * items_per_page;
    
        db.query('SELECT vehicles.model_name,vehicles.mgf_year,drivers.name as Drivername,drivers.mobile_no, vehicles.capacity, vehicles.vehicle_rc,drivers.driver_image,IFNULL(drivers.id,0) as DriverID,vehicles.id as VehicleID, IFNULL(drivers.driverAblible,0) as driverAvablityStatus FROM vehicles LEFT JOIN mapping_vehicle_drivers on mapping_vehicle_drivers.vehicle_id=vehicles.id LEFT JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE vehicles.available_status=0 and vehicles.status=1 GROUP by VehicleID',function(error,data) {
            if (error) throw error;      
                     // console.log(data);
            var total_pages = Math.ceil(parseInt(data.length) / parseInt(offset));
            db.query("SELECT vehicles.model_name,vehicles.mgf_year,drivers.name as Drivername,drivers.mobile_no, vehicles.capacity, vehicles.vehicle_rc,drivers.driver_image,IFNULL(drivers.id,0) as DriverID,vehicles.id as VehicleID, IFNULL(drivers.driverAblible,0) as driverAvablityStatus FROM vehicles LEFT JOIN mapping_vehicle_drivers on mapping_vehicle_drivers.vehicle_id=vehicles.id LEFT JOIN drivers on drivers.id=mapping_vehicle_drivers.driver_id WHERE vehicles.available_status=0 and vehicles.status=1 group by VehicleID LIMIT "+start_index+','+items_per_page, function (error, results) {
                if (error) {
                callback(error,null);
                }
                else{
                    var obj={
                        data:results,
                        totalpage:total_pages,
                        totalrecoard:parseInt(data.length)
                    }
                callback(obj,null);
            }
         });

        });

},



VehiclesStatusChange:function(vid,status,callback){
         db.query("SELECT vehicles.available_status FROM `vehicles` WHERE vehicles.id=?",[vid], function (error, results) {
                if (error) {
                callback(error,null);
                }
                else{
                  if(results[0].available_status=0){

                    var sqlquery = "UPDATE vehicles set status=? WHERE id = ?";
                     db.query(sqlquery,[status,vid], function (error,result) {
                        if (error) {
                        callback(error,null);
                        }
                        else{    
                        callback('Record Updated Successfully!',null);
                    }
                 });

                  }else{
                    callback('Vehicle Active or Inactive! Because Vehicle is alredy assigned Picup!',null);
                  }
            }
         });
},




}
module.exports = vehicles;