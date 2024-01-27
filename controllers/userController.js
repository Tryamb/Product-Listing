import UserModel from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import transporter from '../config/emailConfig.js'

class UserController{
    static userRegistration= async(req,res)=>{
        const{name, email, password, password_confirmation, isAdmin}=req.body
        const user=await UserModel.findOne({email:email})
        if(user){
            res.send({"status":"failed","message":"Email already exists"})
        }else{
            if(name && email && password && password_confirmation && isAdmin){
              if(password===password_confirmation){
      try{          
                const salt= await bcrypt.genSalt(10)
                const hashPassword=await bcrypt.hash(password,salt)
                const doc=new UserModel({
                name:name,
                email:email,
                password:hashPassword,
                isAdmin:isAdmin
            })
            await doc.save()
            res.status(201).send({"status":"success","message":"Registration Successful"})

            
        } catch(error){
            res.send({"status":"failed","message":`Unable to Register with error${error}`})
        }


              }else{
                res.send({"status":"failed","message":"Password doesn't match"})
              }
            }else{
                res.send({"status":"failed","message":"All fields are required"})
            }
        }
    }

    static userLogin= async (req,res)=>{
        try{
            const {email,password}=req.body
            if(email && password){
                const user=await UserModel.findOne({email:email})
                if(user!=null){
                     const isMatch= await bcrypt.compare(password,user.password)
                     if(user.email===email && isMatch){
                        //Generate JWT Token
                        const token= jwt.sign({userID:user._id}, process.env.JWT_SECRET_KEY,{expiresIn:'3d'})
                        res.send({"status":"success","message":"Login Successful","token":token})
                     }else{
                        res.send({"status":"failed","message":"Email or password is not valid"})
                     }
                }else{
                    res.send({"status":"failed","message":"You are not a registered user"})
                }
            }else{
                res.send({"status":"failed","message":"All fields are required"})
            }
        }catch(error){
            res.send({"status":"failed","message":`Unable to login with error ${error}`})
        }
    } 

    static changeUserPassword=async (req,res)=>{
        const {password,password_confirmation}=req.body

        if(password && password_confirmation){
           if(password!==password_confirmation){
            res.send({"status":"failed","message":"Password doesn't match"})
           }else{
            const salt= await bcrypt.genSalt(10)
            const newHashPassword=await bcrypt.hash(password,salt)

            await UserModel.findByIdAndUpdate(req.user._id, {$set:{
                password:newHashPassword
            }})
            res.send({"status":"success","message":"password changed successfully"})
           }
        }else{
            res.send({"status":"failed","message":"All fields are required"})
        }
    }
     static loggedUser= async(req,res)=>{
        res.send({"user":req.user})
     }
     static sendUserPasswordResetEmail=async(req,res)=>{
        const {email}=req.body
        if(email){
           const user= await UserModel.findOne({email:email})
           if(user){
             const secret= user._id+process.env.JWT_SECRET_KEY
             const token=jwt.sign({userID:user._id}, secret, {expiresIn:'15m'})
             const link= `http://127.0.0.0.1:3000/api/user/reset/${user._id}/${token}`
             console.log(`http://127.0.0.0.1:3000/api/user/reset/${user._id}/${token}`)
             //send email
             let info= await transporter.sendMail({
                from:process.env.EMAIL_FROM,
                to:user.email,
                subject:"Password Reset Link",
                html:`<a href=${link}>Click Here</a> to reset your password`
             })
             res.send({"status":"success","message":"Password Reset Email Sent... Please Check Your Email","info":info})
           }else{
            res.send({"status":"failed","message":"Email doesn't exist"})
           }
        }else{
            res.send({"status":"failed","message":"Email is required"})
        }
     }

     static userPasswordReset= async(req,res)=>{
        const {password,password_confirmation}=req.body
        const {id,token}=req.params
        const user=await UserModel.findById(id)
        const new_secret=user._id+process.env.JWT_SECRET_KEY
        try{
           jwt.verify(token,new_secret)
           if(password && password_confirmation){
            if(password!==password_confirmation){
                res.send({"status":"failed","message":"Password doesn't match"})
            }else{
                const salt=await bcrypt.genSalt(10)
                const newHashPassword=await bcrypt.hash(password,salt)
                await UserModel.findByIdAndUpdate(user._id,{$set:{
                    password:newHashPassword
                }})
                res.send({"status":"success","message":"Password Reset Successfully"})
            }
           }else{
            res.send({"status":"failed","message":"All fields are required"})
           }
        }catch{
            res.send({"status":"failed","message":"Invalid Token, Token is expired"})
        }

     }
}
export default UserController