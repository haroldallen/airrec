import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/themes.css";
import "./assets/styles.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Main />
);

function Main() {
    const [score, setScore] = useState({score: 0, total: 0});
    function nextScore(correct=false) {
        setScore({ score: correct?score.score+1:score.score, total: score.total+1});
    }
    return <>
        <header className="jsb">
            <div>
                <p className="title">airrec</p>
                <p>Designed by Cdt Allen (104 Sqn Air Cadets)</p>
            </div>
            <p className="score">{score.score}/{score.total}</p>
        </header>
        <div className="content">
            <App nextScore={nextScore} />
        </div>
        <Toaster />
    </>;
}
