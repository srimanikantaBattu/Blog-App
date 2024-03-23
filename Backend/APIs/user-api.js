// create user api app (mini application)
const exp = require("express");
const userApp = exp.Router();
const commonApp = require("./common-api");
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt=require('jsonwebtoken');
const verifyToken=require("../Middlewares/verifyToken");
require('dotenv').config();

let userscollection;
let articlescollection;
// get userCollection App
userApp.use((req, res, next) => {
  userscollection = req.app.get("userscollection");
  articlescollection=req.app.get("articlescollection")
  next();
});

// user registration route
userApp.post(
  "/user",
  expressAsyncHandler(async (req, res) => {
    // get user resource from client
    const newUser = req.body;
    // check for duplicate user based on username
    const dbuser = await userscollection.findOne({
      username: newUser.username,
    });
    // if user found in db
    if (dbuser !== null) {
      res.send({ message: "User existed" });
    } else {
      // hash the password
      const hashedpassword = await bcryptjs.hash(newUser.password, 8);
      //replace plain password with hashed password
      newUser.password = hashedpassword;
      // create user
      await userscollection.insertOne(newUser);
      // send response
      res.send({ message: "User is created" });
    }
  })
);

// user login route
userApp.post("/login", expressAsyncHandler(
    async(req,res)=>{
        // get cred object from client
        const userCred=req.body;
        // check for username
        const dbuser=await userscollection.findOne({username:userCred.username})
        if(dbuser===null){
            res.send({message:"Invalid Username"});
        }
        else{
        // check for password
        const status=await bcryptjs.compare(userCred.password,dbuser.password);
        if(status===false){
            res.send({message:"Invalid Password"});
        }
        else{
        // create jwt token and encode it
        const signedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'1d'});
        // send res
        res.send({message:"login success",token:signedToken,user:dbuser});
        }
        }
    }
));


// get all articles (of all authors)
userApp.get("/articles",expressAsyncHandler(async(req,res)=>{
    // get articles collection from express app
    const articlescollection=req.app.get('articlescollection');
    // get all articles
    let articlesList=await articlescollection.find({status:true}).toArray();
    res.send({message:"All Articles",payload:articlesList});
}))

// post comments for an article by article id

userApp.post("/comment/:articleId",expressAsyncHandler(async(req,res)=>{
  // get usercomment object
  const usercomment=req.body;
  const articleIdFromUrl=req.params.articleId;
  // insert usercomment object to comments array of article by article id
 let result =  await articlescollection.updateOne({articleId:articleIdFromUrl},{$addToSet:{comments:usercomment}});
 console.log(result);
 res.send({message:"Comment Posted"});
}))

// export userApp
module.exports = userApp;
