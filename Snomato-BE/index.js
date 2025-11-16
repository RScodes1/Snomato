const express = require('express');
const { connection } = require('./config/db');
const { userRouter } = require('./routes/user.routes');
 const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT;
 const app = express();

 app.use(
  cors({
    origin: ["https://snomato-jb2qvzvfl-rajasekhars-projects.vercel.app/login", "http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

 app.get('/', async(req, res) => {
     res.send("hello");
 })

app.use(express.json({limit : '10mb'}));

app.use('/api/auth', userRouter);
app.listen(port, async() => {
      try {
        await connection
        console.log("hi this is mongodb");
        console.log(`The server is running on port http://localhost:${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
})