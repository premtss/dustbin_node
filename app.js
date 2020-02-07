const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
var methodOverride = require('method-override');

require("dotenv").config();
// Init App
const app = express();
const http = require('http').Server(app); 
const io = require('socket.io')(http);

require("./DbConnection");
//Route Define
var admin = require('./routes/admin');
var driver = require('./routes/drivers');
var wherehouses = require('./routes/wherehouses');
var dustbins = require('./routes/dustbins')(io);

app.use(bodyParser.json({limit: '500000mb'}));
app.use(bodyParser.urlencoded({limit: '500000mb', extended: true, parameterLimit: 10000000000}));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next)=>{
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','Origin, X-Requested-with, Accept, Authorization, authorization');
  res.header('Access-Control-Allow-Methods','OPTIONS,GET, POST, PUT, DELETE');
   next();
});
 app.use(cors({
    exposedHeaders: ['Authorization', 'authorization'],
  }));
  app.use(methodOverride());

  app.get("/",(req,res)=>{
     res.sendFile("index.html")
  });

app.use('/api', admin);
app.use('/api', driver);
app.use('/api', wherehouses);
app.use('/api', dustbins);
//app.set('socketio', io)

app.get('/', function(req, res) {
  res.sendfile('index.html');
});


 



http.listen(3002,(err)=>{
    if(err) throw err;
      console.log('Listing To port http://localhost:3002');
})
  