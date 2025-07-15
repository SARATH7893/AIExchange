import "./Chat.css"
import{ useContext, useState,useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkDown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat(){
    const {newChat,previousChats,reply}=useContext(MyContext);
    const [latestReply,setLatestReply]=useState(null)


    useEffect(()=>{
      if(reply===null){
        setLatestReply(null);
        return;
      }
        if(!previousChats.length) return;
        const content=reply.split(" ");
        let idx=0;
        const interval=setInterval(()=>{
            setLatestReply(content.slice(0,idx).join(" "));
            idx++;
            if(idx >= content.length) clearInterval(interval);
        },40)
        return () => clearInterval(interval);
    },[previousChats,reply]);

    return (
      <>
        {newChat && <h1>WHERE SHOULD WE BEGIN?</h1>}
        <div className="chats">
          {previousChats?.slice(0,-1).map((chat, idx) => 
                <div
                className={chat.role === "user" ? "userDiv" : "gptDiv"}
                key={idx}
                >
                {chat.role === "user" ? 
                    <p className="userMessage">{chat.content}</p>
                : 
                    <ReactMarkDown rehypePlugins={rehypeHighlight}>{chat.content}</ReactMarkDown>
                }
                </div>
          )}

        {
          previousChats.length > 0 && latestReply!==null &&
          <div className="gptDiv" key={"typing"}>
            <ReactMarkDown rehypePlugins={rehypeHighlight}>
              {latestReply}
            </ReactMarkDown>
          </div>
    }
        {
          previousChats.length > 0 && latestReply===null &&
          <div className="gptDiv" key={"non-typing"}>
            <ReactMarkDown rehypePlugins={rehypeHighlight}>
              {previousChats[previousChats.length - 1].content}
            </ReactMarkDown>
          </div>
        }
        
          {/* <div className="userDiv">
            <p className="userMessage">user</p>
          </div>
          <div className="gptDiv">
            <p className="gptMessage">gpt</p>
          </div> */}
        </div>
      </>
    );
}

export default Chat;