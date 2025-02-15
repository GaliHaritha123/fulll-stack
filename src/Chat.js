import React, { useState, useEffect } from "react";
import axios from "axios";

const backendURL = "https://fullstack-real-time-chat-app-3.onrender.com"; // Your hosted backend URL
const ws = new WebSocket("wss://fullstack-real-time-chat-app-3.onrender.com");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    axios.get(`${backendURL}/api/messages`)
      .then(response => {
        const savedMessages = response.data.data.map(msg => msg.attributes.content);
        setMessages(savedMessages);
      })
      .catch(error => console.error("❌ Error fetching messages:", error));

    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;
    ws.send(input);
    setInput("");
  };

  return (
    <div>
      <h2>Chat with Server</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
