const express=require('express');
const bcrypt=require('bcrypt');
const app=express()
const nodemailer = require('nodemailer');
const Log=require('./Model/LoginModel')
const Admin=require('./Model/AdminModel')
const Coun=require('./Model/CouncellorModel')
const Regs=require('./Model/RegistrationModel')
const router=new express.Router();
router.get('/',(req,res)=>{
    res.render('Welcome');
})
router.get('/Login',(req,res)=>{
    const msg=req.query.msg
        res.render('Login',{msg:msg||""});
})
router.post("/Login",async(req,res)=>{
    try{
        const res1=await Admin.findOne({email:req.body.email})
        const res2=await Coun.findOne({email:req.body.email})
        const res3=await Log.findOne({email:req.body.email})
        if(res1)
            {var res4=res1;
            var route="Admin";}
        else if(res2)
           { var res4=res2;
            var route="Councellor";}
        else if(res3)
        {var res4=res3;
            var route="Home";}
    if(res4)
    {
        console.log(res4[0])
        bcrypt.compare(req.body.password,res4.password, function(err,result){
            if(result)
            {
        res.redirect(route);
    }else{
        res.render("Login",{msg:"Invalid Credentials"});
    }
   })
}
}
catch(e){
console.log(e);
}
})
router.get('/Home',(req,res)=>{
   msg=req.query.msg;
    res.render("Home",{msg:msg||""})
})
router.get('/Signup',(req,res)=>{
    {
    res.render('Signup');}
})
router.post("/Signup",async(req,res)=>{
    console.log("hello");
    try{
    if(req.body)
    {   
        console.log(req.body);
    const ob=new Log(req.body);
    await ob.save();
    res.redirect('Login')
    }
}
    catch(e){
        console.log(e);
    }
})
router.get('/password',(req,res)=>{
    res.render('password',{msg:""});
})
router.post('/password',async(req,res)=>{
    try{
        if(req.body)
        console.log(req.body)
        {
  let res1=await Log.findOne({email:req.body.email})
  if(res1)
  {
    console.log(res1)
    bcrypt.compare(req.body.oldpswd,res1.password,function(err,result){
        if(result)
        {
            res1.password=req.body.newpswd;
            res1.save();
            res.redirect("/Login?msg=Password%20Changed");
        }
        else{
            res.render("password",{msg:"Invalid Credentials"});
        }
    })
   
  }
  else{
    res.render("Invalid Credentials");
  }
        }
    }
   catch(e)
   {
    console.log(e);
   }
})
router.get("/Registration",(req,res)=>{
    res.render("Registration")
})
router.post("/Registration",async(req,res)=>{
    console.log(req.body)
    try{
     if(req.body)
     {
        let ob=new Regs(req.body);
        await ob.save();
        res.redirect('/Home?msg=Registration%20Successful');
     }
    }
    catch(e)
    {
        console.log(e);
    }
})
router.get("/Contact",(req,res)=>{
    res.render("Contact")
})
router.get("/About",(req,res)=>{
    res.render("About")
})
router.get("/Admin",async(req,res)=>{
    try{
    let res1=await Regs.find();
    res.render("Admin",{data:res1})}
    catch(e){
        console.log(e);
    }
})
router.get("/Logout",(req,res)=>{
    res.render("Welcome")
})

router.get("/Review",async(req,res)=>{
    let _id=req.query.id;
   const res1=await Regs.findById(_id);
   console.log(res1);
    res.render("Review",{data:[res1]});
})

router.get("/Edit",async(req,res)=>{
    let _id=req.query.id;
   const res1=await Regs.findById(_id);
    res.render("Edit",{data:[res1]});
})
router.get("/Councellor",async(req,res)=>{
    const res1=await Regs.find();
    console.log(res1);
    res.render("Councellor",{data:res1})
})
router.post("/Councellor",async(req,res)=>{
    try{let Cname=req.body.Cname.trim();
    console.log(Cname);
    let res1=await Regs.find({Cname:Cname});
    console.log(res1);
    res.render("Councellor",{data:res1})}
    catch(e){
        console.log(e);
    }
})
router.get("/eligible",(req,res)=>{
    let m=req.query.m;
    let email=req.query.email;
    console.log(m);
    console.log(email);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        }
      });
      const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: `Graphic Era Enquiry regarding Addmission`,
        text:(m=="e")?`You are eligible`:`You are not eligible`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (!error) {
            res.redirect("councellor");
        }
      });
   
})
router.post('/Edit',async(req,res)=>{
    let _id=req.query._id;
    console.log(req.body);
    console.log(_id);
    let res1=await Regs.findById({_id:_id});
    Object.assign(res1, req.body);
    await res1.save();
    res.redirect('/Admin');
})
module.exports=router;