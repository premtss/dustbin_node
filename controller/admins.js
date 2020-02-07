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
    getSingleItems: function (email,password,callback) {
       // var sql = 'SELECT * from admins WHERE email='+db.escape(email);
        db.query('SELECT * FROM admins WHERE email = ? AND password = ?', [email, password],function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
            callback(results[0],null);
        }
        });
        //db.end();
    },
    updateLoginStatus: function (email,callback) {
         var sql = "UPDATE admins SET updated_at = CURRENT_TIMESTAMP() WHERE email ="+db.escape(email);
         db.query(sql,function (error, results) {
             if (error) {
             callback(error,null);
             }
             else{
             callback(results[0],null);
         }
         });
         //db.end();
     },
     blacklistToken:function(token,callback){
        var sql = "INSERT INTO blacklists(`jwt_token`) Values ('"+token+"')";
        db.query(sql,function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
            callback(`1 row inserted!!`,null);
        }
        });

     },
     blacklistSelectToken:function(token,callback){
        var sql = 'SELECT * from blacklists WHERE jwt_token='+db.escape(token);
        db.query(sql,function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
            callback(results[0],null);
        }
        });

     }
}

module.exports = admins;