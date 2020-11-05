const express=require('express');
const bodyParser =require('body-parser');
const { asyncIterator } = require('mongodb/lib/async/async_iterator');


const app=express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

MongoClient = require('mongodb').MongoClient;
const url="mongodb+srv://demo:0000@cluster0.46um3.mongodb.net/<dbname>?retryWrites=true&w=majority";
let conn = MongoClient.connect(url);

app.post('/bookticket',async (req,res) =>
{
    const{name,gender,age,seatno}=req.body;
    // console.log(name,gender,age,seatno);
    if(seatno < 1 || seatno > 40)
    {
        res.send(" !! SORRY !! \nSeatnumbers available between 1 - 40");
    }
    else{
        let db=await conn;
        var dbo = db.db("mydb");
        var check =await dbo.collection("customers").findOne({seatno : seatno});
        var count=await dbo.collection("customers").count();
    
        if(check !=null)
        {
            res.send("Sorry Seat NO : "+seatno+" already booked");
        }
        else{
        // console.log(JSON.stringify(check));
        
        var myobj = { name: name, gender: gender ,age: age,bookingid : count+1,seatno : seatno};
        // console.log(count);
    
        var myquery = { seatno : seatno };
        var newvalues = { $set: {status:"close" } };
        dbo.collection("seats").updateOne(myquery, newvalues);
        dbo.collection("customers").insertOne(myobj, function(err, res) {
          if (err) throw err;
          db.close();
        });
        res.send("Ticket booked succesfully !! \n seatno : "+seatno+"\nbookingid : "+(count+1));
    }
        
    }
    
});



app.post("/ticketstatus" , async (req,res)=>
{
    const{seatno}=req.body;
    let db = await conn;
        var dbo = db.db("mydb");
        var check =await dbo.collection("customers").findOne({seatno : seatno});
        if(check !=null){
            res.send("Booking Confirm on SeatNo : "+seatno);
        }
        else{
            res.send("No Booking available")
        }
    
});



app.post("/details",async (req,res) =>
{
    const {seatno}=req.body;
    let db = await conn;
        var dbo = db.db("mydb");
        var check= await dbo.collection("customers").findOne({seatno : seatno});
        if(check != null)
        {
            res.send(check);
        }
        else{
            res.send(" Seat yet to book !!");
        }
});


app.get("/open", async (req,res)=>
{
    let db = await conn;
    var dbo=db.db("mydb");
        var check = await  dbo.collection("seats").find({ status:'open'}).toArray();  
        res.send(check);

});



app.get("/close", async (req,res)=>
{
    let db = await conn;
    var dbo=db.db("mydb");
        var check = await  dbo.collection("seats").find({ status:'close'}).toArray();
        
        res.send(check);
    

});


app.get('/reset', async (req,res) =>{
    let db=await conn;
    var dbo=db.db("mydb");
    await dbo.collection("customers").deleteMany({});
    var query = {status : "close"};
    var newvalues ={$set: {status: "open"}};
    await dbo.collection("seats").updateMany(query,newvalues);
    db.close();
    res.send("!! Seats are ready for next trip !!");
});



const port=process.env.PORT || 8080;

app.listen(port);


