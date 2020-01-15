const express = require('express');
const router = express.Router();
const adminCtrl = require('../controller/admins');

router.get('/v1/test', (req,res)=>{

    adminCtrl.getAllItems(result => {
        res.json(result);
    });
   
   
});
router.post('/v1/testsingle', (req,res)=>{

    adminCtrl.getSingleItems(req.body.email,result => {
        res.json(result);
    });
   
   
});

module.exports = router;