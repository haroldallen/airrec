import { useEffect, useState } from "react";
import items from "./assets/items.json";
import questions from "./assets/questions.json";

import toast from "react-hot-toast";

export default function App() {
    const [itemIndex, setItemIndex] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);

    useEffect(() => {
        setItemIndex(Math.floor(Math.random() * items.length));
        setQuestionIndex(Math.floor(Math.random() * questions.length));
    }, []);

    function check() {
        const inputs = document.querySelectorAll(".inputs input");
        const userAnswers = Array.from(inputs).map((r)=>r.value);
        
        const answers = questions[questionIndex].inputs.map((r)=>items[itemIndex][r.answer]);
        
        if (answers.filter((r, index)=>checkAnswer(r, userAnswers[index])).length === 3) {//JSON.stringify(answers) === JSON.stringify(userAnswers)) {
            toast.success("Correct!");
            next(inputs);
        } else {
            // determine which ones are wrong
            const wrong = answers.map((r, i)=>r===userAnswers[i]?null:i).filter((r)=>r!==null);
            // error toast which ones are wrong
            toast.error("Incorrect: "+wrong.map((r)=>questions[questionIndex].inputs[r].name).join(", "));
            next(inputs);
        }
    }

    function checkAnswer(answer, userAnswer) {
        if (answer === null && (userAnswer === "" || userAnswer.toLowerCase() === "none")) return true;
        else return answer.toLowerCase().replaceAll(" ", "").replaceAll("-", "") === userAnswer.toLowerCase().replaceAll(" ", "").replaceAll("-", "");
    }

    function next(inputs = []) {
        setItemIndex(itemIndex==items.length-1?0:itemIndex+1);
        setQuestionIndex(Math.floor(Math.random() * questions.length));
        inputs.forEach((r)=>r.value = "");
    }

    return <>
        
            <img className="image" src={items[itemIndex]?.image} />
            <div className="question">
                <div className="jsb">
                    <h1 className="title">{questions[questionIndex]?.title}</h1>
                    <p className={"difficulty "+(questions[questionIndex]?.difficulty)}>{questions[questionIndex]?.difficulty}</p>
                </div>
                <div className="inputs">
                    {questions[questionIndex]?.inputs.map((r)=>(
                        <input key={r.answer} type="text" placeholder={r.placeholder} />
                    ))}
                </div>
                <button onClick={()=>{check()}}>Check answers</button>
            </div>
        
    </>;
}
