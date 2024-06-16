import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/themes.css";
import "./assets/styles.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
    <>
        <header>
            <p className="title">airrec</p>
            <p>Designed by Cdt Harold Allen</p>
        </header>
        <div className="content">
            <App />
        </div>
        <Toaster />
    </>
);
