import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import './App.css';

let socket
const CONNECTION_PORT = 'localhost:3001/'

function App() {

  //Before Login
  const [loggedIn, setLoggedIn] = useState(false)
  const [room, setRoom] = useState('Class of 2023')
  const [userName, setUserName] = useState([])

  //AfterLogin
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([
    {author: "hhh", message: "kkkk"}
  ]);


  useEffect(() => {
    socket = io(CONNECTION_PORT)
  }, [CONNECTION_PORT]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data])
    })
  }, []);
  
  
  const connectToRoom = () => {
    setLoggedIn(true)
    socket.emit('join_room', room)
  }

  const sendMessage = async () => {

    let messageContent = {
      room: room,
      content: {
        author: userName,
        message: message,
      },
    }

    await socket.emit("send_message", messageContent)
    setMessageList([...messageList, messageContent.content])
    setMessage("")
  }

  return (
    <div className="App">
      {!loggedIn ? (
        <div className="logIn">
          <div className="inputs">
            <input 
              type="text" 
              placeholder="Name..." 
              onChange={(e) => {
                setUserName(e.target.value)
              }} 
            />
            <input 
              type="text" 
              placeholder="Room..." 
              onChange={(e) => {
                setRoom(e.target.value)
              }} 
            />
          </div>
          <div>
            <button onClick={connectToRoom}>Enter Chat</button>
          </div>
        </div>
      ) : (
        <div className="chatContainer">
          <div className="messages">
          {messageList.map((val, key) => {
            return (
              <div 
                className='messageContainer'
                id={val.author === userName ? "You" : "Other"}
              >
                <div className='messageIndividual'>
                  {val.author} :    {val.message}
                </div>
              </div>
            )
          })}
          </div>
          <div className="messageInputs">
            <input 
              type="text" 
              placeholder="Message ..." 
              onChange={(e) => {setMessage(e.target.value)}}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
