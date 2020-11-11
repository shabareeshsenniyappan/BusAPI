const { url, conn } = require('../models/databaseConfig');

exports.bookTicket = async (req,res) => {

    const{name,gender,age,seatno}=req.body;

    if(seatno < 1 || seatno > 40) res.send(" !! SORRY !! \nSeatnumbers available between 1 - 40");

    else{
        let db=await conn;
        var dbo = db.db("mydb");
        var check =await dbo.collection("customers").findOne({seatno : seatno});
        var count=await dbo.collection("customers").count();
    
        if(check !=null) res.send("Sorry Seat NO : "+seatno+" already booked");

        else{
                const myobj = { name: name, gender: gender ,age: age,bookingid : count+1,seatno : seatno};
                const myquery = { seatno : seatno };
                const newvalues = { $set: {status:"close" } };
                dbo.collection("seats").updateOne(myquery, newvalues);
                dbo.collection("customers").insertOne(myobj, (err, res) => {
                if (err) throw err;
                db.close();
                });
                res.send("Ticket booked succesfully !! \n seatno : "+seatno+"\nbookingid : "+(count+1));
    }
    }
}

exports.ticketStatus = async (req, res) => {
    const{ seatno }=req.body;

    let db = await conn;
        var dbo = db.db("mydb");
        var check =await dbo.collection("customers").findOne({seatno : seatno});
        if(check !=null){
            res.send("Booking Confirm on SeatNo : "+seatno);
        }
        else{
            res.send("No Booking available")
        }
}

exports.open = async (req,res)=>
{
    let db = await conn;
    var dbo=db.db("mydb");
        var check = await  dbo.collection("seats").find({ status:'open'}).toArray();  
        res.send(check);
}

exports.close = async (req,res) => {
    let db = await conn;
    var dbo=db.db("mydb");
        var check = await  dbo.collection("seats").find({ status:'close'}).toArray();
        res.send(check);
}

exports.details = async(req, res) => {
        const { seatno }=req.body;
        const db = await conn;
        const dbo = db.db("mydb");
        const check= await dbo.collection("customers").findOne({seatno : seatno});
        
        if(check != null) res.send(check);
        else res.send(" Seat yet to book !!");
}

exports.reset = async (req,res) => {
    let db=await conn;
    var dbo=db.db("mydb");
    await dbo.collection("customers").deleteMany({});
    var query = {status : "close"};
    var newvalues ={$set: {status: "open"}};
    await dbo.collection("seats").updateMany(query,newvalues);
    db.close();
    res.send("!! Seats are ready for next trip !!");
}
