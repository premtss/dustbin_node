var payload = {
 google_payloaddataByPrem :function(deviceKey,req,callback){
    if(req.query!=undefined){
        if(req.query.datapercentage==undefined && req.query.mobile==undefined){
            callback("400",null);
        }
        else if(req.query.datapercentage==undefined ){
            callback("400",null);
        }
        else if(req.query.mobile==undefined ){
            callback("400",null);
        }
        else{      
            if(deviceKey.get('deviceKey')=="Prem_Maurya"){    
            if(req.query.mobile==""){
                callback("509",null);
            }
            else if(req.query.datapercentage=="" || req.query.datapercentage==null){
                callback("509",null);
            }
            else if(req.query.datapercentage=="" && req.query.mobile==""){
                callback("509",null);
            }   
            else{
                var obj={
                    mobile:req.query.mobile,
                    data:req.query.datapercentage,
                    deviceKey:deviceKey.get('deviceKey')
                }
                callback(obj,null);
            }
        }else{
            callback("You can't change settings",null); 
        }
    }
}
  
}
}
module.exports = payload;