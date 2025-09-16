import {useState, useRef, useEffect} from 'react';
import Die from "./assets/components/Die"
import { nanoid } from 'nanoid';
import ReactConfetti from 'react-confetti';

function App() {

  // Timer
  const [allseconds, setAllSeconds] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const secInterval = useRef(null);

  // Timer Function
  function startTimer() {
    clearInterval(secInterval.current); 

    secInterval.current = setInterval(() => {
      setSeconds(prev => {
        if (prev === 59) {
          setAllSeconds(prevAllSecs => prevAllSecs + 60);
          return 0;
        } else {
          return prev + 1;
        }
      });
    }, 1000);
  }

  // Play Timer Once & Clean Up
  useEffect(() => {
    startTimer();
    return () => clearInterval(secInterval.current); 
  }, []);


  // Generate All New Dies Number
  const [allDies, setAllDies] = useState(() => generateAllNewDies())

  function generateAllNewDies() {
    const allNewDies = [];
    for (let i = 0; i < 10; i++) {
      const randomNum = Math.ceil(Math.random(1) * 6);
      allNewDies.push({
        id: nanoid(),
        value: randomNum, 
        isHeld: false
      })
    }
    return allNewDies
  }
  
  // Dies Componenets
  const diesElements =  allDies.map((die) => <Die key={die.id} id={die.id} value={die.value} isHeld={die.isHeld} holdFun={hold} />)
  
  // Click On A Die Button
  function hold(id) {
    setAllDies(prevDies => 
      prevDies.map(die => 
        die.id === id ? {...die, isHeld: !die.isHeld} : die
      )
    )
  }
  
  // Click On Roll Button
  function rollDies() {
    if (gameWon) {
      setAllDies(generateAllNewDies());
      setAllSeconds(0)
      setSeconds(0)
      clearInterval(secInterval.current)
      startTimer()
    }
    else {
      setAllDies( prevDies =>
        prevDies.map(die => 
          die.isHeld ? die : {...die, value: Math.ceil(Math.random(1) * 6)}
        )
      )
    }
  }

  // Is Game Won
  const gameWon = allDies.every(die => die.isHeld && die.value == allDies[0].value);


  // Focus On New Game Button When Game Is Won
  const newGameRef = useRef(null)

  useEffect(() => {
    if (gameWon) {
      // Focus On New Game Button
      newGameRef.current.focus();
      // Stop Timer
      clearInterval(secInterval.current)
    }
  }, [gameWon])
  

  return (
    <>
      <main className='text-center m-1 py-3 px-2 rounded-1 d-flex flex-column justify-content-center align-items-center'>
        {gameWon && <ReactConfetti/>}
        <h1 className="title fw-bold">Tenzies</h1>
        <p className="instructions mx-2 fs-5 fw-bold">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="timer d-flex align-items-center fs-3 my-5">
          <p className='m-0'>Timer </p>
          <span className="min">{Math.floor(allseconds / 60)}</span> :
          <span className="sec">{seconds}</span> 
        </div>
        <div className="dies container w-75 ">
          <div className="row row-cols-4 row-cols-md-5 justify-content-center gy-4">
            {diesElements}
          </div>
        </div>
        <button className='roll-btn w-25 text-white fs-5 fw-bold p-2 mt-5 rounded' onClick={rollDies} ref={newGameRef}>{gameWon ? "New Game" : "Roll"}</button>
      </main>
    </>
  )
}
export default App
