import express from "express"
import Thread from "../models/Thread.js"
import getOpenApiResponse from "../utils/openAi.js"
const router=express.Router();

router.post("/test",async(req,res)=>{
    try {
        const thread=new Thread({
            threadId:"kdfgb",
            message:"testing"
        })
        const response=await thread.save()
        res.send(response)
    } catch (error) {
        res.status(500).json({error:"failed to save"})
    }
})

router.get("/thread",async(req,res)=>{
    try {
        const thread=await Thread.find({}).sort({updatedAt:-1});
        res.json({thread});
    } catch (error) {
        res.status(500).json({error:"Failed To Fetch Data"})
    }
})

router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params
    try {
        const thread=await Thread.findOne({threadId})
        if(!thread){
            return res.status(404).json({error:"Thread Not Found"})
        }
        res.json(thread.messages)
    } catch (error) {
        res.status(500).json({error:"Failed To Fetch Chat Data"})
    }
})


router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params
    try {
        const thread=await Thread.findOneAndDelete({threadId})
        if(!thread){
            return res.status(404).json({error:"Thread Not Found"})
        }
        res.json({message:"Thread Deleted Successfully"})
    } catch (error) {
        res.status(500).json({error:"Failed To Delete Thread"})
    }
})

router.post("/chat",async (req,res)=>{
    const {threadId, message} = req.body;
    if(!threadId || !message){
        return res.status(400).json({error:"Thread ID and Message are required"})
    }
    try {
        let thread = await Thread.findOne({threadId});
        if(!thread){
           thread = new Thread({
              threadId,
              title:message,
              messages:[{role:"user", content:message}]
          });
        }else{
            thread.messages.push({role:"user", content:message});
        }

        const aiReply = await getOpenApiResponse(message);
        thread.messages.push({role:"assistant", content:aiReply});
        thread.updatedAt = new Date();
        await thread.save();
        res.json({reply:aiReply})
    } catch (error) {
        res.status(500).json({error:"Failed To Process Chat"})
    }
})
export default router