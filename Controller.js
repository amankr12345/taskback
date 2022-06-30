const User=require('./Model/model')
const Doc=require('./Model/user')
const joi=require('@hapi/joi')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
exports.SignUp=async(req,res)=>{
    const emailExist=await User.findOne({email:req.body.email})

    if(emailExist){
        res.status(400).send("emailAlready exists")
        return;
    }
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(req.body.password,salt)

    const user= new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    })

    try{
        //valodation of userinputs
        const registrationSchema=joi.object({
            name:joi.string().min(3).max(255).required(),
            email:joi.string().min(3).max(255).required().email(),
            password:joi.string().min(8).max(255).required()
        })
        const {err}=await registrationSchema.validateAsync(req.body)

        if(err){
            res.status(400).send(err.details[0].message)
            return;
        }
        else{
            const saveUser=await user.save()
            res.status(200).send("User created successfully")
        }

    }
    catch(err){
        res.status(500).send(err)

    }

}

exports.login=async (req,res)=>{
    const user=await User.findOne({email:req.body.email})
    if(!user)return res.status(400).send("Incoorect email Id")

    // Checking if user password matches or not
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(req.body.password,salt)

    const validatePassword=await bcrypt.compare(req.body.password,user.password)
    if(!validatePassword) return res.status(400).send("incorrect password")

    try{
        const loginSchema=joi.object({
            email:joi.string().min(3).required().email(),
            password:joi.string().min(8).required()
        })     
    const {err}=await loginSchema.validateAsync(req.body)
    if(err) return res.status(400).send(err.details[0].message)
    else{
        const token=jwt.sign({id:user._id},process.env.TOKEN_SECRET)
        res.send(token)
        res.send({message:"logged successfully",user:user})
    }

    }catch(err){
        res.status(500).send(err)

    }
}



exports.add=async(req,res)=>{
    const newDoc=new Doc({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        city:req.body.city
    })

    try{
        const UserSchema=joi.object({
            name:joi.string().min(3).max(255).required(),
            email:joi.string().min(3).max(255).required().email(),
            phone:joi.number().min(10).required(),
            city:joi.string().min(4).max(255).required()
        })
        const {err}=await UserSchema.validateAsync(req.body)

        if(err){
            res.status(400).send(err.details[0].message)
            return;
        }
        else{
            const saveUser=await newDoc.save()
            res.status(200).send("User created successfully")
        }

    }
    catch(err){
        res.status(500).send(err)

    }
}

exports.showUser=async (req,res)=>{
    const allUser=await Doc.find()
    try{
        res.status(200).send(allUser)

    }catch(err){
        res.status(500).send(err)
    }
}