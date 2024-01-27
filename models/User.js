import mongoose from "mongoose"

//schema
const userSchema=new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    email:{type:String, required:true, trim:true},
    password:{type:String, required:true, trim:true},
    isAdmin:{type:Boolean, required:true}
})

//model
const UserModel= mongoose.model("user",userSchema)

export default UserModel