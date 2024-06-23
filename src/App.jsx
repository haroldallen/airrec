import { useEffect, useState } from "react";
import items from "./assets/items.json";
import questions from "./assets/questions.json";

import toast from "react-hot-toast";

export default function App({nextScore, categories, types, showAnswers}) {
    const [itemIndex, setItemIndex] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [multipleChoiceOptions, setMultipleChoiceOptions] = useState([]);
    const [completed, setCompleted] = useState([]);

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        if (categories.length === 0 || types.length === 0) return;

        let newSelectedItems = items.map((r)=>categories.includes(r.category)&&types.includes(r.type)?r:null).filter((r)=>r!==null);
        if (newSelectedItems.length === 0) return;
        setSelectedItems(newSelectedItems);

        let newItemIndex = pickNewItem(false, newSelectedItems);
        
        let newQuestionIndex = Math.floor(Math.random() * questions.length);
        if (questions[newQuestionIndex].type === "multiple_choice") loadMultipleChoice(newItemIndex, questions[newQuestionIndex].answer);
        setQuestionIndex(newQuestionIndex);
    }, [categories]);

    function pickNewItem(next=false, selectedItemsOverride=selectedItems) {
        let newItemIndex;

        if (next) {
            /*let currentSIIndex = selectedItemsOverride.indexOf(items[itemIndex].callsign);
            newItemIndex = items.indexOf(selectedItemsOverride[currentSIIndex===selectedItemsOverride.length-1?0:currentSIIndex+1]);
            console.log("items", items, "selected items", selectedItems, "sio[csii==sio.l-1?0:cstii+1]", selectedItemsOverride[currentSIIndex===selectedItemsOverride.length-1?0:currentSIIndex+1], "items[previous]", items[selectedItemsOverride[currentSIIndex===selectedItemsOverride.length-1?0:currentSIIndex+1]]);
            */

            let currentSTIndex = selectedItemsOverride.indexOf(items[itemIndex]);
            newItemIndex = items.indexOf(selectedItemsOverride[currentSTIndex===selectedItemsOverride.length-1?0:currentSTIndex+1]);

        } else {
            newItemIndex = items.indexOf(selectedItemsOverride[Math.floor(Math.random() * selectedItemsOverride.length)]);
        }

        console.log(completed.length, selectedItemsOverride.length)
        if (completed.length === selectedItemsOverride.length && completed.length !== 0) {
            setCompleted([]);
            toast.success("Completed all items in selected categories/types")
        }
        else if (completed.includes(items[newItemIndex].callsign)) {
            if (next) setItemIndex(newItemIndex);
            
            newItemIndex = pickNewItem(true);
        }
        setItemIndex(newItemIndex);

        return newItemIndex;
    }

    function check() {
        const inputs = document.querySelectorAll(".inputs input");

        if (questions[questionIndex].type === "multiple_choice") {
            const userAnswer = document.querySelector("input[name=multiple_choice]:checked").nextSibling.textContent;
            const answer = items[itemIndex][questions[questionIndex].answer];
            
            if (checkAnswer(answer, userAnswer)) {
                toast.success("Correct!");
                next();
                nextScore(true);
            } else {
                if (showAnswers) toast("Correct answer: "+answer);
                toast.error("Incorrect!");
                next();
                nextScore();
            }
        } else if (questions[questionIndex].type === "text") {
            const userAnswers = Array.from(inputs).map((r)=>r.value);
        
            const answers = questions[questionIndex].inputs.map((r)=>items[itemIndex][r.answer]);
            
            if (answers.filter((r, index)=>checkAnswer(r, userAnswers[index])).length === 3) {//JSON.stringify(answers) === JSON.stringify(userAnswers)) {
                toast.success("Correct!");
                setCompleted([...completed, items[itemIndex].callsign]);
                next(inputs);
                nextScore(true);
            } else {
                // determine which ones are wrong
                const wrong = answers.map((r, i)=>r===userAnswers[i]?null:i).filter((r)=>r!==null);
                // error toast which ones are wrong
                toast.error("Incorrect: "+wrong.map((r)=>questions[questionIndex].inputs[r].name).join(", "));
                next(inputs);
                nextScore();
            }
        }
    }

    function checkAnswer(answer, userAnswer) {
        if (answer === null && (userAnswer === "" || userAnswer.toLowerCase() === "none")) return true;
        else return answer.toLowerCase().replaceAll(" ", "").replaceAll("-", "") === userAnswer.toLowerCase().replaceAll(" ", "").replaceAll("-", "");
    }

    function next(inputs = []) {
        if (questions[questionIndex].type === "multiple_choice") inputs.forEach((r)=>r.parentElement.delete());
        else inputs.forEach((r)=>r.value = "");

        let newItemIndex = pickNewItem(true);

        let newQuestionIndex = Math.floor(Math.random() * questions.length);
        if (questions[newQuestionIndex].type === "multiple_choice") loadMultipleChoice(newItemIndex, questions[newQuestionIndex].answer);
        setQuestionIndex(newQuestionIndex);
    }

    function loadMultipleChoice(newItemIndex, key) {
        let options = [ ...items.map((r)=>r[key]) ];
        options.sort(()=>Math.random()-0.5); // randomize order
        options = [...new Set(options)]; // remove duplicates
        options = options.slice(0, 2); // take 2 other options
        if (!options.includes(items[newItemIndex][key])) options.push(items[newItemIndex][key]); // add back the correct answer if it's not in the options
        options.sort(()=>Math.random()-0.5); // randomize order
        setMultipleChoiceOptions(options); // set
    }

    return <>
        { categories.length === 0 || types.length === 0 || selectedItems.length === 0 ? <p>No items match selected filters</p>
        : <>
            <img className="image" src={items[itemIndex]?.image} />
            <div className="question">
                <div className="jsb">
                    <h1 className="title">{questions[questionIndex]?.title.replace("[type]", items[itemIndex]?.type)}</h1>
                    <p className={"difficulty "+(questions[questionIndex]?.difficulty)}>{questions[questionIndex]?.difficulty}</p>
                </div>
                { questions[questionIndex].type === "text" ? <>
                    <div className="inputs">
                        {questions[questionIndex]?.inputs.map((r)=>(
                            <input key={r.answer} type="text" placeholder={r.placeholder} />
                        ))}
                    </div>
                    <button onClick={()=>{check()}}>Check answers</button>
                </> : questions[questionIndex].type === "multiple_choice" ? <>
                    <form className="inputs" name={Math.random()*1000}>
                        {multipleChoiceOptions.map((r, index)=>(
                            <div key={index} className="option">
                                <input name="multiple_choice" type="radio" />
                                <label name="multiple_choice">{r ? r : "None"}</label>
                            </div>
                        ))}
                    </form>
                    <button onClick={()=>{check()}}>Check answer</button>
                </> : "Invalid question type" }
            </div>
        </>}
    </>;
}
