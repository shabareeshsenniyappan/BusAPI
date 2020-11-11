const express=require('express');
const bodyParser =require('body-parser');

const app=express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//routes config
require('./routes/routes')(app);

//server config
const port=process.env.PORT || 8080;
app.listen(port);


