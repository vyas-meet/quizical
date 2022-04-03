
import React from 'react'
import { nanoid } from 'nanoid'
import MyLoader from "./myLoader";
import { parseEntities } from 'parse-entities'

export default function Quiz() {

    // Init states, setting form responses.
    const [quizActive, setQuizActive] = React.useState(true)
    const [infoText, setInfoText] = React.useState("");
    const [loading, setLoading] = React.useState(true)
    const questionAmount = 5;
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
        if (quizActive) {
            async function getData() {
                const res = await fetch(`https://opentdb.com/api.php?amount=${questionAmount}&category=9&difficulty=easy&type=multiple`);
                const data = await res.json();

                // Mapping the fetched data with desired properties for our app.

                const ourData = data.results.map(questionDetails => {

                    // Fixing HTML entity issue by decoding using parse entities library. 

                    questionDetails.question = parseEntities(questionDetails.question)
                    questionDetails.correct_answer = parseEntities(questionDetails.correct_answer)
                    questionDetails.incorrect_answers = questionDetails.incorrect_answers.map(ans => parseEntities(ans))

                    // Randomising options and saving them in choices.

                    function shuffleArray(array) {
                        for (let i = array.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [array[i], array[j]] = [array[j], array[i]];
                            return array
                        }
                    }
                    const choices = shuffleArray([...questionDetails.incorrect_answers, questionDetails.correct_answer]);


                    return {
                        ...questionDetails,
                        choices: choices
                    }
                })

                setQuestionData(ourData)
                setLoading(false);
            }
            getData()
        }
    }, [quizActive])


    // Mapping questions from Data.

    const questionJSX = questionData.map((questionDetails, index) => {
        const { question, correct_answer, choices } = questionDetails;

        const choicesJSX = choices.map(choice => {

            let style = "";
            if (!quizActive) {
                if (choice === correct_answer) {
                    style = "bg-green text-gray-800";
                } else {
                    style = `peer-checked:bg-rose-300`
                }
            }
            // !quizActive && formResponse[index].isCorrect ? "peer-checked:bg-green"
            //                             : !quizActive && !formResponse[index].isCorrect :  "peer-checked:bg-red"

            return (
                <li className='inline text-center'>
                    <input
                        type="radio"
                        name={`question${index + 1}`}
                        id={choice}
                        value={choice}
                        onChange={e => handleChange(e, index, correct_answer)}
                        className="hidden peer"
                        disabled={!quizActive}
                    />
                    <label className={`border-2 rounded-md px-3 py-1 cursor-pointer
                                        ${quizActive && "border-teal-800 peer-checked:bg-emerald-50"}
                                        ${style}
                                        `}
                        htmlFor={choice}>{choice}</label>
                </li>
            )
        })

        return (
            <div>
                <h3 className='font-karla text-2xl'>{question}</h3>
                <ul className='flex justify-around my-3 gap-4 list '>
                    {choicesJSX}
                </ul>
                <hr className="border-b-2 border-teal-800 my-5" />
            </div>
        )
    })

    // Submission

    function handleSubmit(e) {
        e.preventDefault()
        const allChosen = formResponse.every(question => question.answer)
        if (allChosen) {
            setQuizActive(false)
            let score = 0;
            formResponse.forEach(question => {
                if (question.isCorrect) score++
            })
            setInfoText(`You have scored ${score} / ${questionAmount}`)
        } else {
            setInfoText("Please answer all questions")
        }
    }

    function handleRestart(e) {
        e.preventDefault()
        setLoading(true)
        setQuizActive(true)
        setInfoText("")
    }

    return (
        <>
            {
                loading ? <MyLoader />
                    : <form onSubmit={handleSubmit} className="max-w-4xl w-11/12 my-4">
                        {questionJSX}
                        <div className='flex justify-center items-center gap-10'>
                            <div><h4 className='text-lg font-bold'>{infoText}</h4></div>
                            {quizActive ?
                                <button className='py-2 px-9 text-white bg-purpleBtn rounded-xl
                                 hover:bg-indigo-900 duration-300'>Submit</button>
                                : <button onClick={e => handleRestart(e)} className='py-2 px-9 text-white bg-purpleBtn rounded-xl hover:bg-indigo-900 duration-300'
                                > Play Again </button>
                            }
                        </div>
                    </form>
            }
        </>
    )
}
