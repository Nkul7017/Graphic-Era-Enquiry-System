const mongoose=require('mongoose')
const validator=require('validator');
const bcrypt=require('bcrypt');
const AdminSchema=new mongoose.Schema({
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
AdminSchema.pre("save",async function(next){
    if(this.isModified("password"))
{
    this.password=await bcrypt.hash(this.password,10);
}
next();
})
module.exports=mongoose.model("Admin",AdminSchema);