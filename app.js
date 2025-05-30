const express=require('express')
require('dotenv').config();
const connectDB = require('./config/database');
const userRoutes=require("./routes/userRoutes")
const bookRoutes=require("./routes/bookRoutes")
const reviewRoutes=require("./routes/reviewRoutes")
const PORT = process.env.PORT || 4000 ;
const app=express()
connectDB()
app.use(express.json())
app.get("/",(req,res)=>{
    return res.status(200).send("Hello website")
})
app.use("/api/user",userRoutes)
app.use("/api/book",bookRoutes)
app.use("/api/review",reviewRoutes)
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})