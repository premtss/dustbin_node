//include the model
const db = require('../DbConnection'); 

  //create class
var vehicles = {

    getAllVehiclesItems:function(limit,offset,status,callback){

                var current_page = limit || 1;
                var items_per_page = offset || 10;
                var start_index = (current_page - 1) * items_per_page;
                
                if(status=="" || status==undefined){

                    db.query('SELECT count(*) as total FROM vehicles',function(error,data) {
                        if (error) throw error;                
                        var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                        db.query('SELECT vehicles.id,vehicles.vehicle_rc,vehicles.model_name,vehicles.status,vehicles.available_status,drivers.name,drivers.mobile_no,drivers.driver_image FROM `vehicles`  LEFT JOIN mapping_vehicle_drivers  ON (vehicles.id = mapping_vehicle_drivers.vehicle_id) LEFT JOIN drivers ON (mapping_vehicle_drivers.driver_id = drivers.id) LIMIT '+start_index+', '+items_per_page+'', function (error, results) {
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
                }else{
                    db.query('SELECT count(*) as total FROM vehicles where vehicles.status='+status,function(error,data) {
                        if (error) throw error;                
                        var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                        db.query('SELECT vehicles.id,vehicles.vehicle_rc,vehicles.model_name,vehicles.status,vehicles.available_status,drivers.name,drivers.mobile_no,drivers.driver_image FROM `vehicles` LEFT JOIN mapping_vehicle_drivers ON (vehicles.id = mapping_vehicle_drivers.vehicle_id) LEFT JOIN drivers ON (mapping_vehicle_drivers.driver_id = drivers.id) where vehicles.status='+status+' LIMIT '+start_index+', '+items_per_page, function (error, results) {
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
        db.query('SELECT count(*) as total FROM vehicles WHERE id NOT IN (SELECT mapping_vehicle_drivers.vehicle_id FROM mapping_vehicle_drivers)', function (error, data) {
            if (error)
                throw error;
            var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
            db.query('SELECT * FROM vehicles WHERE id NOT IN (SELECT mapping_vehicle_drivers.vehicle_id FROM mapping_vehicle_drivers) LIMIT ' + start_index + ', ' + items_per_page + '', function (error, results) {
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

                var sqlquery2 ="SELECT drivers.name,drivers.mobile_no,drivers.driver_image,vehicles.id,vehicles.vehicle_photo,vehicles.vehicle_rc,vehicles.model_name,vehicles.status,vehicles.available_status, mapping_vehicle_drivers.status FROM `drivers` INNER JOIN mapping_vehicle_drivers ON (drivers.id = mapping_vehicle_drivers.driver_id) INNER JOIN vehicles ON (mapping_vehicle_drivers.vehicle_id = vehicles.id) WHERE vehicles.vehicle_rc=?";
                db.query(sqlquery2,[vehiclerc], function (error, resultDriver) {
                    if (error) {
                    callback(error,null);
                    }
                    else{
                        var obj={
                            singledata:result[0],
                            document:{vehiclephoto:result[0].vehicle_photo,registrationcard:result[0].registration_card,insurancephoto:result[0].insurance_photo},
                            driverList:resultDriver,
                        }
                     callback(obj,null);
                }
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


}
module.exports = vehicles;