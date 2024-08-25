import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/themes.css";
import "./assets/styles.css";
import { Toaster } from "react-hot-toast";

import iconSettings from "./assets/icons/cog.svg";
import iconClose from "./assets/icons/close.svg";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Main />
);

const availableCategories = [
    "military",
    "reconnaissance",
    "commercial",
    "training"
];
const availableTypes = [
    "plane",
    "glider",
    "helicopter",
    "drone"
];


function Main() {
    const [score, setScore] = useState({score: 0, total: 0});
    
    const [categories, setCategories] = useState(availableCategories);
    const [types, setTypes] = useState(availableTypes);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [showAnswers, setShowAnswers] = useState(true);

    function nextScore(correct=false) {
        setScore({ score: correct?score.score+1:score.score, total: score.total+1});
    }
    function toggle(list, setList, item) {
        if (list.includes(item)) setList(list.filter((r)=>r!==item));
        else setList([...list, item]);
    }
    return <>
        <header className="jsb">
            <div className="left">
                <a className="logo" href="https://www.hallen.uk">ALLEN</a><span>/</span>
                <p className="title">airrec</p>
            </div>
            <div>
                <p className="score">{score.score}/{score.total}</p>
                <button className="settings" onClick={()=>{setSettingsOpen(!settingsOpen)}}>
                    <img src={ !settingsOpen ? iconSettings : iconClose} />
                </button>
            </div>
        </header>
        <div className="content">
            { !settingsOpen ? <App nextScore={nextScore} categories={categories} types={types} showAnswers={showAnswers} />
            : <>
                <h1 className="title">Settings</h1>
                <br />
                <p className="subtitle">Categories</p>
                <div className="setting checkboxes">
                    { availableCategories.map((category) => <div key={category}>
                            <input type="checkbox" name="categories" checked={categories.includes(category)} onChange={()=>{toggle(categories, setCategories, category)}} />
                            <label>{category}</label>
                        </div>) }
                </div>

                <br />
                <p className="subtitle">Types</p>
                <div className="setting checkboxes">
                    { availableTypes.map((type) => <div key={type}>
                            <input type="checkbox" name="types" checked={types.includes(type)} onChange={()=>{toggle(types, setTypes, type)}} />
                            <label>{type}</label>
                        </div>) }
                </div>

                <br />
                <div>
                    <input type="checkbox" name="showanswers" checked={showAnswers} onChange={()=>{setShowAnswers(!showAnswers)}} />
                    <label>Show correct answers after multiple choice mistakes</label>
                </div>
            </> }
        </div>
        <Toaster />
    </>;
}
