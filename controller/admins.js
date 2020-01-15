//include the model
const db = require('../DbConnection'); 

  //create class
var admins = {
    //function to query all items
    getAllItems: function (callback) {
        db.query('SELECT * from admins', function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
            callback(results,null);
        }
        });
        //db.end();
    },
    getSingleItems: function (email,callback) {
        var sql = 'SELECT * from admins WHERE email='+db.escape(email);
        db.query(sql,function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
            callback(results[0],null);
        }
        });
        //db.end();
    }
}

module.exports = admins;