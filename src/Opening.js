import React from 'react'

export default function Opening({ handleClick }) {
    return (
        <>
            <h1 className='font-karla font-bold text-5xl my-4'>Quizzical</h1>
            <p className='my-4'>Test your general knowledge 🤯 .. or my react skills ⚛ .. or both! 🤗 </p>
            <button className='w-48 h-12 my-4 bg-purpleBtn text-white rounded-md
             hover:bg-indigo-600 duration-300 hover:-translate-y-1
             transition ease-in-out delay-75'
                onClick={handleClick}
            >Start quiz</button>
        </>
    )
}
