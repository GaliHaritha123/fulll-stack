import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Import createRoot
import Chat from "./Chat";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Chat />);
