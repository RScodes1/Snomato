const express = require('express');
const { UserModel } = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { BlackTokenModel } =require('../models/token.models');
const { PendingUserModel } = require('../models/pendingUser.model');
const { auth } = require('../middleware/auth.middleware');
const userRouter = express.Router();

const { isAdmin } = require("../middleware/admin.middleware");
const { sendEmail } = require('../utils/mailingService');


userRouter.post("/create-user/:pendingId", auth, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const { pendingId } = req.params;

    if (!["Manager", "Member"].includes(role)) {
      return res.status(400).json({ msg: "Admin can only create Manager or Member" });
    }

    // Fetch pending request
    const pendingUser = await PendingUserModel.findById(pendingId);
    if (!pendingUser) {
      return res.status(404).json({ msg: "Pending user not found" });
    }

    const { username, email } = pendingUser;

    // If user already created
    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Generate password
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(randomPassword, 10);

    // Create user
    await UserModel.create({
      username,
      email,
      password: hashed,
      role,
    });
        pendingUser.status = "approved";
           await pendingUser.save();
     
    try {
         // Mark pending request as approved
        
        await sendEmail(email, username, randomPassword);
        return res.json({ msg: "User created. Check your email." });
        
    } catch (emailErr) {
        // rollback
        await UserModel.deleteOne({ email });
          pendingUser.status = "pending";
          await pendingUser.save();
        console.error("Email failed:", emailErr);
        return res.status(500).json({ msg: "Failed to send email. Please try again." });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating user", err });
  }
});

userRouter.post("/request-access", async (req, res) => {
  try {
     const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ msg: "Username and email required" });
    }

    // Check if pending request exists
    const pending = await PendingUserModel.findOne({ email });
    if (pending) {
      return res.status(400).json({ msg: "A request for this email already exists" });
    }

    // Store request
    await PendingUserModel.create({ username, email });

    res.json({ msg: "Request submitted. Admin will create your account soon." });

  } catch (err) {
    console.error(err);
    console.log(err);
    res.status(500).json({ msg: "Error submitting request", err });
  }
});

userRouter.get("/pending-users", auth, isAdmin, async (req, res) => {
  const pending = await PendingUserModel.find({ status: "pending" });
  res.json({ pending });
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
                    const token = jwt.sign({userID : existingUser._id, author : existingUser.username, role : existingUser.role},process.env.tokenSecretKey,{expiresIn:'1h'})
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