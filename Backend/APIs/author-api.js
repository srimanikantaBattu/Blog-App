// create author api app (mini application)
const exp=require('express');
const authorApp=exp.Router();
const expressAsyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken");
const bcryptjs=require("bcryptjs");
const verifyToken=require("../Middlewares/verifyToken");
require("dotenv").config()

let authorscollection;
let articlescollection;
// get author collection app
authorApp.use((req,res,next)=>{
    authorscollection=req.app.get('authorscollection')
    articlescollection=req.app.get('articlescollection')
    next();
})

// author registration route
authorApp.post(
    "/user",
    expressAsyncHandler(async (req, res) => {
      // get user resource from client
      const newUser = req.body;
      // check for duplicate user based on username
      const dbuser = await authorscollection.findOne({
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
        await authorscollection.insertOne(newUser);
        // send response
        res.send({ message: "User is created" });
      }
    })
  );

// author login route

authorApp.post("/login", expressAsyncHandler(
    async(req,res)=>{
        // get cred object from client
        const userCred=req.body;
        // check for username
        const dbuser=await authorscollection.findOne({username:userCred.username})
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
        const signedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:30});
        // send res
        res.send({message:"login success",token:signedToken,user:dbuser});
        }
        }
    }
));

// adding new article by author

authorApp.post("/article",verifyToken,expressAsyncHandler(async(req,res)=>{
  // get new article from the client
  const newarticle=req.body;
  // post data to article collection
  await articlescollection.insertOne(newarticle);
  res.send({message:"New Article Created"});

}))

// modify article by author

authorApp.put("/article",verifyToken,expressAsyncHandler(async(req,res)=>{
  // get modified article from the client
  const modifiedarticle=req.body;
  // update by article id
 let result= await articlescollection.updateOne({articleId:modifiedarticle.articleId},{$set:{...modifiedarticle}})
  res.send({message:"modified the article"});
}))

// delete an article by article id

authorApp.put("/article/:articleid",verifyToken,expressAsyncHandler(async(req,res)=>{
  // get article id from url
  const articleIdFromUrl=req.params.articleid;
  // get article
  const articleToDelete=req.body;
  // update status of article to false
  await articlescollection.updateOne({articleId:articleIdFromUrl},{$set:{...articleToDelete,status:false}});
  res.send({message:"article removed"})
}))

// read articles of the author

authorApp.get("/articles/:username",verifyToken,expressAsyncHandler(async(req,res)=>{
  // get authors name from the url
  const authorname=req.params.username;
  // get articles whoe status is true
  const articlesList=await articlescollection.find({status:true,username:authorname}).toArray()
  res.send({message:"List of articles",payload:articlesList});

}))

// export userApp
module.exports=authorApp;