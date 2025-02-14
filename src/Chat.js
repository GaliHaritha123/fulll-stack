import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");
        setSocket(ws);

        ws.onmessage = async (event) => {
            try {
                // Convert Blob to text if needed
                if (event.data instanceof Blob) {
                    const text = await event.data.text();
                    setMessages((prev) => [...prev, text]);
                } else {
                    setMessages((prev) => [...prev, event.data]);
                }
            } catch (error) {
                console.error("Error processing message:", error);
            }
        };

        ws.onclose = () => console.log("⚠️ WebSocket Disconnected");

        // Fetch previous messages from Strapi
        axios.get("http://localhost:1337/api/messages")
            .then(response => {
                const savedMessages = response.data.data.map(msg => msg.attributes.content);
                setMessages(savedMessages);
            })
            .catch(error => console.error("❌ Error fetching messages:", error));

        return () => ws.close();
    }, []);

    const sendMessage = () => {
        if (socket && input.trim() !== "") {
            socket.send(input); // Send message to WebSocket
            setInput(""); // Clear input field
        }
    };

    return (
        <Container className="mt-4">
            <h2>Chat with Server</h2>
            <div className="border p-3 mb-3" style={{ height: "300px", overflowY: "auto" }}>
                {messages.map((msg, index) => (
                    <div key={index} className="alert alert-primary">{msg}</div>
                ))}
            </div>
            <Form.Group>
                <Form.Control
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
            </Form.Group>
            <Button className="mt-2" variant="primary" onClick={sendMessage}>Send</Button>
        </Container>
    );
};

export default Chat;
