import './App.css'
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx"
import SideBar from './SideBar.jsx'
import {useState} from 'react'
import {v1 as uuidv1} from 'uuid'


function App() {
  const [prompt, setPrompt] = useState("");
  const [reply,setReply]=useState(null)
  const [currThreadId,setCurrThreadId]=useState(uuidv1())
  const [previousChats, setPreviousChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads,setAllThreads]=useState([]);

  const providerValues={
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setCurrThreadId,
    previousChats, setPreviousChats,
    newChat, setNewChat,
    allThreads,setAllThreads
  }
  return (
      <div className='app'>
        <MyContext.Provider value={providerValues}>
          <SideBar></SideBar>
          <ChatWindow></ChatWindow>
        </MyContext.Provider>
      </div>
  )
}

export default App
