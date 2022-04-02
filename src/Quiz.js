
import React from 'react'
import { nanoid } from 'nanoid'
import MyLoader from "./myLoader";

export default function Quiz() {

    // Init states, setting form responses.

    const [loading, setLoading] = React.useState(true)

    const questionAmount = 1;
    const answerDataInit = [...new Array(questionAmount)].map(ans => ({ questionIndex: -1, answer: "", isCorrect: false }))
    const [questionData, setQuestionData] = React.useState([])


    // Setting / Handling Form Data.

    const [formResponse, setFormResponse] = React.useState(answerDataInit)
    function handleChange(e, index, rightAns) {
        const { name, value } = e.target;
        setFormResponse(prevFormData => {
            const newArray = prevFormData.slice(0);
            newArray[index] = { questionIndex: index, answer: value, isCorrect: value === rightAns ? true : false }
            return newArray;
        })
    }
    console.log(formResponse[0].answer)

    // Fetching Data.

    React.useEffect(() => {
        async function getData() {
            const res = await fetch(`https://opentdb.com/api.php?amount=${questionAmount}&category=9&difficulty=easy&type=multiple`);
            const data = await res.json();
            setQuestionData(data.results);
            setLoading(false);
        }
        getData()
    }, [])


    // Mapping questions from Data.

    const questionJSX = questionData.map((questionDetails, index) => {
        const { question, correct_answer, incorrect_answers } = questionDetails;
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
                return array
            }
        }
        const choices = shuffleArray([correct_answer, ...incorrect_answers]);
        const optionList = choices.map((choice) => {

            return (
                <>
                    <input
                        type="radio"
                        id={choice}
                        name={`question${index + 1}`}
                        value={choice}
                        onChange={e => handleChange(e, index, correct_answer)}
                    />
                    <label htmlFor={choice}>{choice}</label>
                </>
            )
        })

        return (
            <>
                <h3>{question}</h3>
                {optionList}

            </>
        )
    })

    // Submission

    function handleSubmit() {
        console.log("Form submitted")
    }

    return (
        <>
            {
                loading ? <MyLoader />
                    : <form>
                        {questionJSX}
                    </form>
            }
        </>
    )
}
