import express from 'express'
import cors from 'cors'
import "dotenv/config"
import mongoose from 'mongoose';
import chatRoutes from "./routes/chat.js"

const app=express();

const port=8080;


app.use(express.json());
app.use(cors())
app.use("/api",chatRoutes)
app.listen(port,()=>{
    console.log("server listening at port")
    connectDb()
})


const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connnected with database")
    } catch (error) {
        console.log(error)
    }
}

