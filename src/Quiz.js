
import React from 'react'
import { nanoid } from 'nanoid'
import MyLoader from "./myLoader";

export default function Quiz() {

    // Init states, setting form responses.

    const [loading, setLoading] = React.useState(true)

    const questionAmount = 3;
    const answerDataInit = [...new Array(questionAmount)].map(ans => ({ questionIndex: -1, answer: "", isCorrect: false }))
    const [questionData, setQuestionData] = React.useState([])


    // Setting / Handling Form Data.

    const [formResponse, setFormResponse] = React.useState(answerDataInit)
    function handleChange(e, index, rightAns) {
        const { value } = e.target;
        setFormResponse(prevFormData => {
            const newArray = prevFormData.slice(0);
            newArray[index] = { questionIndex: index, answer: value, isCorrect: value === rightAns ? true : false }
            return newArray;
        })
    }

    // Fetching Data.

    React.useEffect(() => {
        async function getData() {
            const res = await fetch(`https://opentdb.com/api.php?amount=${questionAmount}&category=9&difficulty=easy&type=multiple`);
            const data = await res.json();

            // Mapping the fetched data such that we have a choices property with all options randomised.

            const ourData = data.results.map(questionDetails => {
                function shuffleArray(array) {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                        return array
                    }
                }
                const choices = shuffleArray([questionDetails.correct_answer, ...questionDetails.incorrect_answers]);

                return {
                    ...questionDetails,
                    choices: choices
                }
            })

            setQuestionData(ourData)
            setLoading(false);
        }
        getData()
    }, [])


    // Mapping questions from Data.

    const questionJSX = questionData.map((questionDetails, index) => {
        const { question, correct_answer, choices } = questionDetails;

        const optionList = choices.map((choice) => {

            return (
                <span key={nanoid()}>
                    <input
                        type="radio"
                        id={choice}
                        name={`question${index + 1}`}
                        value={choice}
                        onChange={e => handleChange(e, index, correct_answer)}
                    />
                    <label htmlFor={choice}>{choice}</label>
                </span>
            )
        })

        return (
            <div key={nanoid()}>
                <h3>{question}</h3>
                {optionList}

            </div>
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
                    : <form onSubmit={handleSubmit}>
                        {questionJSX}
                    </form>
            }
        </>
    )
}
