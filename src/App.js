
import Opening from "./Opening";
import Quiz from "./Quiz";
import React from "react";

function App() {

  const [gameOn, setGameOn] = React.useState(false)


  return (
    <>
      <section className="bg-white flex justify-center items-center h-screen flex-col">
        {!gameOn ?
          <Opening handleClick={_ => setGameOn(prev => !prev)} />
          : <Quiz handleResetGame={_ => setGameOn(false)} />}
      </section>
    </>
  );
}

export default App;
