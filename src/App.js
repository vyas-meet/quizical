
import Opening from "./Opening";
import Quiz from "./Quiz";
import React from "react";


function App() {

  const [gameState, setGameState] = React.useState(false)



  return (
    <>
      <div>
        <section className="spacer layer1 h-screen flex justify-center items-center flex-col ">
          {!gameState ?
            <Opening gameState={gameState} handleClick={_ => setGameState(prev => !prev)} />
            : <Quiz gameState={gameState} />}
        </section>
      </div>
    </>

  );
}

export default App;
