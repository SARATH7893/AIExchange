import Chat from "./Chat.jsx";
import "./ChatWindow.css";
import { MyContext } from "./MyContext.jsx";
import { useContext,useState,useEffect } from "react";
import {PacmanLoader} from "react-spinners";

function ChatWindow(){
        const { prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId,previousChats, setPreviousChats,setNewChat } = useContext(MyContext);
        const [loading, setLoading] = useState(false);

        const getReply=async()=>{
                setLoading(true);
                setNewChat(false);
                const options={
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            message: prompt,
                            threadId:currThreadId
                        })
                }
                try {
                   const response=await fetch("https://aiexchange.onrender.com/api/chat", options);
                   const reply= await response.json();
                   console.log(reply)
                   setReply(reply.reply)
                } catch (error) {
                        console.error("Error fetching reply:", error);    
                }
                setLoading(false);
        }

        useEffect(()=>{
                if(prompt && reply){
                        setPreviousChats(previousChats=>(
                                [...previousChats,{
                                        role:"user",
                                        content:prompt
                                },{
                                        role:"assistant",
                                        content:reply
                                }]
                        ))
                }
                setPrompt("");
        },[reply]);
return (
        <div className="chatWindow">
                <div className="navbar">
                    <span>AIExchange <i className="fa-solid fa-chevron-down"></i></span>
                    <div className="userIconDiv">
                        <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                    </div>
                </div>
                <Chat></Chat>
                <PacmanLoader color="#fff" loading={loading}></PacmanLoader>
                <div className="chatInput">
                        <div className="inputBox">
                                <input placeholder="Ask Anything?" value={prompt} onChange={(e)=>{setPrompt(e.target.value)}} onKeyDown={(e)=>e.key==='Enter'?getReply():""}></input>
                                <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                        </div>
                        <p className="info">
                           AIExchange can make mistakes. Check important info. See Cookie Preferences.
                        </p>
                </div>
        </div>
)
}

export default ChatWindow;