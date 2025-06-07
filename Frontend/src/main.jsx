// index.js or Start.jsx
import React from "react";
import { createRoot } from "react-dom/client"; // Update the import
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { AuthProvider } from './context/AuthContext.js'; // Adjust the path as necessary

const container = document.getElementById("root");
const root = createRoot(container); // createRoot from 'react-dom/client'
root.render(
  <React.StrictMode>
     {/* <AuthProvider> */}
    <ToastContainer position="bottom-right" />
    <App />
    {/* </AuthProvider> */}
  </React.StrictMode>
);
