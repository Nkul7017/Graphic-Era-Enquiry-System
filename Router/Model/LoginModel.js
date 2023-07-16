const mongoose=require('mongoose')
const validator=require('validator');
const bcrypt=require('bcrypt');
const LoginSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid Email");
            }
        }
    },
    password:{
        type:String,
        required:true
    }
})
LoginSchema.pre("save",async function(next){
    if(this.isModified("password"))
{
    this.password=await bcrypt.hash(this.password,10);
}
next();
})
module.exports=mongoose.model("Login",LoginSchema);