// create admin api app (mini application)
const exp=require('express');
const adminApp=exp.Router();


adminApp.get("/test-admin",(req,res)=>{
    res.send({message:"This from adminAPI"})
})



// export adminApp
module.exports=adminApp;