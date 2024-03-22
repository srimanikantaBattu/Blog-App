// create express app
const exp=require('express');
const app=exp();
const cors = require("cors")

app.use(cors())

require("dotenv").config(); // process.env.PORT
const mongoClient=require("mongodb").MongoClient;
const path=require("path");


// to parse the body of request
app.use(exp.json())

app.use(exp.static(path.join(__dirname,'../client/build')));
// connect to the database
mongoClient.connect(process.env.DB_URL)
.then(client=>{
    // get database object
    const blogdb=client.db('blogdb');
    // get collection objects
    const userscollection=blogdb.collection('userscollection');
    const articlescollection=blogdb.collection('articlescollection');
    const authorscollection=blogdb.collection('authorscollection');
    // share collection object with express app
    app.set('userscollection',userscollection);
    app.set('articlescollection',articlescollection);
    app.set('authorscollection',authorscollection);
    // confirm db connection
    console.log("Connection successfull");
})
.catch(err=>console.log("Error ocurred in db connection ",err))


// import API Routes
const userApp=require("./APIs/user-api");
const adminApp=require("./APIs/admin-api");
const authorApp=require("./APIs/author-api");

// if path starts with user-api, send request to userApp
app.use('/user-api',userApp);   // application level middleware
// if path starts with admin-api, send request to adminApp
app.use('/admin-api',adminApp);  // application level middleware
// if path starts with author-api, send request to authorApp
app.use('/author-api',authorApp);   // application level middleware

app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'../client/build/index.html'))
})

// express error handler
app.use((err,req,res,next)=>{
    res.send({message:"Error : ",payload:err.message})
})

// assign port number
const port=process.env.PORT || 5000;
app.listen(port,()=>console.log(`Webserver on port ${port}`));