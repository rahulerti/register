const express = require("express");
const mongoose = require("mongoose");
const path=require("path");

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "..")));

//Parses URL-encoded form data sent by clients (e.g., HTML forms).
app.use(express.urlencoded({extended:true}))

//connect mongodb
mongoose.connect('mongodb://localhost:27017/data')


//6. Handling the MongoDB Connection
const db=mongoose.connection
//The once('open') event listener confirms a successful connection.
db.once('open',()=>{ //db represents the MongoDB connection.
    console.log('mongodb connect successful')
});
//Defining the User Schema and Model
const userschema= new mongoose.Schema({
    registration_no:String,
    name:String,
    email:String,
    branch:String
})
//users: A Mongoose model tied to the data collection in MongoDB, based on userschema.
const users= mongoose.model('data',userschema);


//Handling GET Request to Root Path
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'..','pages','index.html'));
});
//Handling Form Submission via POST Request
app.post('/post',async (req,res)=>{
    const {registration_no,name,email,branch}=req.body;
    const user=new users({
        registration_no,
        name,
        email,
        branch
    });
    //save the document data to mngodb
    await user.save();
    console.log(user);
    //response after submission
    res.send('form submit successful');
})
//Starting the Server
app.listen(port,()=>{
    console.log("server started");
});