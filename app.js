const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');


require("dotenv").config();
// Init App
const app = express();
const http = require('http').Server(app); 


require("./DbConnection");
//Route Define
//var Driver = require('./routes/driver');

app.use(bodyParser.json({limit: '5000mb'}));
app.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 1000000}));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

 app.get("/",(req,res)=>{
     res.sendFile("index.html")
 })

//app.use('/api', Driver);



http.listen(3002,(err)=>{
    if(err) throw err;
      console.log('Listing To port http://localhost:3002');
})
  