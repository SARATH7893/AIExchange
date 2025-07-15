import './SideBar.css';
import { useContext,useEffect,useState } from 'react';
import {MyContext} from './MyContext.jsx';
import {v1 as uuidv1} from 'uuid';

function SideBar(){

    const {allThreads,setAllThreads,currThreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPreviousChats} = useContext(MyContext);

    const getAllThreads=async ()=>{
        try {
            const repsone=await fetch("https://aiexchange.onrender.com/api/thread")
            const res= await repsone.json();
            const filteredData = res.thread.map(thread => ({threadId: thread.threadId, title: thread.title}));
             //console.log("Filtered Threads:", filteredData);
             setAllThreads(filteredData);
        } catch (error) {
            console.error("Error fetching threads:", error);
        }
    }
    useEffect(()=>{
        getAllThreads();
    },[currThreadId])

    const createNewChat=()=>{
        setNewChat(true)
        setPrompt("");
        setReply(null)
        setCurrThreadId(uuidv1());
        setPreviousChats([]);
    }

    const changeThread=async (newThreadId)=>{
        setCurrThreadId(newThreadId)
        try {
            const response = await fetch(`https://aiexchange.onrender.com/api/thread/${newThreadId}`);
            const res=await response.json();
            console.log("Thread Data:", res);
            setPreviousChats(res)
            setNewChat(false)
            setReply(null);
        } catch (error) {
            console.log("Error changing thread:", error);
        }
    }
    const deleteThread=async (threadId)=>{
        try {
            const response = await fetch(`https://aiexchange.onrender.com/api/thread/${threadId}`, {
                method: 'DELETE',
            });
            const res = await response.json();
            setAllThreads(prevThreads => prevThreads.filter(thread => thread.threadId !== threadId));
            if(currThreadId===threadId){
                createNewChat();
            }
        } catch (error) {
            console.error("Error deleting thread:", error);
        }
    }
    return(
        <section className='sideBar'>
            <button onClick={createNewChat}>
                <img src="src/assets/Abstract AI Tech Logo without Text.png" alt="logo"  className='logo'/>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className='history'>
                {
                    allThreads?.map((thread,idx)=>(
                        <li key={idx} onClick={(e)=>changeThread(thread.threadId)}>{thread.title} <i className="fa-solid fa-trash" onClick={(e)=>{e.stopPropagation(); deleteThread(thread.threadId)}}></i></li>
                    ))
                }
            </ul>
            <div className="sign">
                <p>By Sarath &hearts;</p>
            </div>
        </section>
    )
}

export default SideBar;