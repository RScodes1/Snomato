const express = require('express');
const { UserModel } = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { BlackTokenModel } =require('../models/token.models');
const { auth } = require('../middleware/auth.middleware');
const userRouter = express.Router();

const { isAdmin } = require("../middleware/admin.middleware");
const { sendEmail } = require('../utils/mailingService');


userRouter.post("/create", auth, isAdmin, async (req, res) => {
  try {
    const { username, email, role } = req.body;

    if (!["Manager", "Member"].includes(role)) {
      return res.status(400).json({ msg: "Admin can only create Manager or Member" });
    }

    // check exists
    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    // generate password
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(randomPassword, 10);

    const user = new UserModel({
      username,
      email,
      password: hashed,
      role,
    });

    await user.save();

    // Send email
    await sendEmail(email, username, randomPassword);

    res.json({ msg: "User created successfully and email sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating user", error: err });
  }
});


userRouter.post('/login', async(req, res)=>{
    const {email, password} =req.body;
    try {
          const existingUser = await UserModel.findOne({email});
          if(!existingUser){
            res.send({msg: "user doesnt exist"});
          } else{
            bcrypt.compare(password, existingUser.password, (err,result)=> {
                if(result){
                    const token = jwt.sign({userID : existingUser._id, author : existingUser.username},process.env.tokenSecretKey,{expiresIn:'1h'})
                    res.send({msg: "login successful", token});
                } else if(err){
                    res.send({msg: "wrong credentials", err});
                }
            })
          }
    } catch (error) {
        res.send(error);
    }
})

userRouter.post('/logout', async(req,res) =>{
    try{

        const token =req.headers.authorization?.split(' ')[1];

        if(token){
            const blacktoken = await BlackTokenModel({blackToken:token})
            await blacktoken.save();

            res.status(200).send({msg:'user logged out successfully'})
        }

    }catch(err){
        res.status(404).send({msg:'error in user logout',Errors:err})
    }
})

userRouter.get('/profile',  auth, async(req, res) => {
     try {

        const id = req.clinician;
     const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      data: {
        name: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
})

module.exports = {
    userRouter
}