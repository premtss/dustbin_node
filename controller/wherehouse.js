//include the model
const db = require('../DbConnection'); 
 //create class
 var wherehouse = {
 
    getAllwarehousesItems:function(limit,offset,callback){

        var current_page = limit || 1;
        var items_per_page = offset || 10;
        var start_index = (current_page - 1) * items_per_page;
        
       // if(status=="" || status==undefined){

            db.query('SELECT count(*) as total FROM warehouses',function(error,data) {
                if (error) throw error;                
                var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                db.query('SELECT * FROM warehouses LIMIT '+start_index+', '+items_per_page+'', function (error, results) {
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


        getAllwarehousesmapped:function(limit,offset,callback){

            var current_page = limit || 1;
            var items_per_page = offset || 10;
            var start_index = (current_page - 1) * items_per_page;
            
           // if(status=="" || status==undefined){
    
                db.query('SELECT count(*) as total FROM warehouses',function(error,data) {
                    if (error) throw error;                
                    var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(offset));
                    db.query('select *, (SELECT count(*) FROM `warehouse_mapped_vehicles` where warehouse_mapped_vehicles.warehouse_Id = warehouses.id) as total  from warehouses LIMIT '+start_index+', '+items_per_page+'', function (error, results) {
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
    

        warehousesDropDownList:function(callback){
                    db.query('SELECT * FROM warehouses', function (error, results) {
                    if (error) {
                        callback(error,null);
                    }
                     else{
                        callback(results,null);
                    }
                 });
    
            },
    
  

    addNewDWherehouse:function(name,email,mobileno,latitude,longitude,address,callback) {
   
    var sqlquery="INSERT INTO warehouses(`name`,`email`,`mobile_no`,`latitude`,`longitude`,`address`) VALUES ('"+name+"','"+email+"','"+mobileno+"','"+latitude+"','"+longitude+"','"+address+"')";
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

    db.query('SELECT * FROM warehouses where mobile_no='+mobile, function (error,result) {
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

    updateWherehouse:function(name,email,latitude,longitude,address,mobileno,callback){

        var sqlquery = "UPDATE warehouses set name=?,email=?,latitude=?,longitude=?,address=? WHERE mobile_no = ?";
        db.query(sqlquery,[name,email,latitude,longitude,address,mobileno], function (error,result) {
            if (error) {
            callback(error,null);
            }
            else{    
            callback('Record Updated Successfully!',null);
        }
        });

    },

    getwarehousesDetails:function(wid,callback){
            var sqlquery ="SELECT * FROM warehouses where id=?";
            db.query(sqlquery,[wid], function (error, results) {
                if (error) {
                callback(error,null);
                }
                else{
                callback(results[0],null);
            }
        });
    },
/*
getDriver:function(mobileno,callback){
var sqlquery ="SELECT * FROM drivers where mobile_no=?";
db.query(sqlquery,[mobileno], function (error, results) {
   if (error) {
   callback(error,null);
   }
   else{
   callback(results[0],null);
}
});
},*/
deletewarehousesDetails:function(wid,callback){
    db.query('DELETE FROM warehouses WHERE id='+wid, function (error, results) {
        if (error) {
        callback(error,null);
        }
        else{
        callback('delete record successfully',null);
    }
 });
},

    mappedWherehousewithvehice:function(datarecord,callback) {
   
    var sqlquery="INSERT INTO warehouse_mapped_vehicles(`warehouse_Id`,`vehicleid`) VALUES?";
    db.query(sqlquery, [datarecord], function (error,result) {
        if (error) {
        callback(error,null);
        }
        else{    
        callback('1 record inserted',null);
    }
    });

    },


}
module.exports = wherehouse;