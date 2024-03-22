const exp=require('express');
const commonApp=exp.Router();


commonApp.get("/common",(req,res)=>{
    res.send({message:"The is from common-api"})
})

// export
module.exports=commonApp;
