import React, { useState } from 'react';
import style from './App.module.scss';
import Button from './components/Button/Button';
import Input from './components/Input/Input';
import Popup from './components/Popup/Popup';
import Table from './components/Table/Table';
import Plot from './components/Plot/Plot';

function App() {

  const [functionIndex, setFunctionIndex] = useState('1');
  const [results, setResults] = useState(null);

  const [leftLimit, setLeftLimit] = useState('');
  const [rightLimit, setRightLimit] = useState('');
  const [amountOfPoints, setAmountOfPoints] = useState('');

  const [popup, setModal] = useState(false);
  const [message, setMessage] = useState(null);

  const togglePopup = () => setModal(!popup);
  const radioButtonChangeHandler = event => setFunctionIndex(event.target.value);
  const leftLimitInputChangeHandler = event => setLeftLimit(event.target.value);
  const rightLimitInputChangeHandler = event => setRightLimit(event.target.value);
  const amountOfPointsInputChangeHandler = event => setAmountOfPoints(event.target.value);

  const f1 = x => 10 ** (1 + x ** 2) - 10 ** (1 - x ** 2);
  const f2 = x => Math.tan(3 * x - 156) + Math.tan(x) - 4 * Math.sin(x);

  const formula1 = <span>10<sup>1+x<sup>2</sup></sup> - 10<sup>1-x<sup>2</sup></sup></span>
  const formula2 = <span>tg(3x-156) + tgx - 4sinx</span>

  function calculateButtonClickHandler() {

    if (isValid()) calculate();

    else togglePopup();

  }

  function inputKeyPressHandler(event) {

    if (event.key === 'Enter') {

      if (isValid()) calculate();

      else togglePopup();

    }

  }

  function round(number, accuracy) {

    const digitsAfterComa = String(accuracy).split('.')[1].length

    return Math.round(number * 10 * digitsAfterComa) / (digitsAfterComa * 10)

  }

  function calculate() {

    const results = {}
    const calculations = [];

    const step = (Number(rightLimit) - Number(leftLimit)) / (Number(amountOfPoints) - 1);

    switch (functionIndex) {

      case '1':
        results.formula = formula1;
        for (let x = Number(leftLimit); x <= Number(rightLimit); x += Number(step)) {
          x = round(x, 0.0001);
          const y = round(f1(x), 0.0001);
          calculations.push({ x, y });
        }
        break;

      case '2':
        results.formula = formula2;
        for (let x = Number(leftLimit); x <= Number(rightLimit); x += Number(step)) {
          x = round(x, 0.0001);
          const y = round(f2(x), 0.0001);
          calculations.push({ x, y });
        }
        break;

    }

    results.calculations = calculations;

    setResults(results);

  }

  const isNumber = string => /^-?\d+(\.\d+)?$/.test(string);

  function isValid() {

    if (isNumber(leftLimit) && isNumber(rightLimit) && isNumber(amountOfPoints)) {

      if (Number(rightLimit) < Number(leftLimit)) {

        setMessage('The right limit should be larger than the left');

        return false;
      }

      if (Number(amountOfPoints) < 2) {

        setMessage('The amount of points must be at least 2');

        return false;
      }

      return true;

    } else {

      setMessage('You entered incorrect data. You should enter the numbers');

      return false;
    }

  }

  function renderTable() {

    return <Table
      formula={results.formula}
      calculations={results.calculations}
    />

  }

  function renderPlot() {

    return <Plot data={results.calculations} />

  }

  function renderResults() {

    return <div className={style.Results}>

      {renderTable()}

      {renderPlot()}

    </div>


  }

  return (
    <div className={style.App}>

      {
        popup &&
        <Popup
          handleClose={togglePopup}
          text={message}
        />
      }

      <div className={style.Form}>

        <div className={style.Top}>

          <p> Select a function from the list below: </p>

          <ul className={style.FunctionList}>

            <li className={style.FunctionList__Item}>

              <input
                type='radio'
                value="1"
                checked={functionIndex === '1' ? true : false}
                onChange={radioButtonChangeHandler}
              />

              <span className={style.Function}>
                {formula1}
              </span>

            </li>

            <li className={style.FunctionList__Item}>

              <input
                type='radio'
                value="2"
                checked={functionIndex === '2' ? true : false}
                onChange={radioButtonChangeHandler}
              />

              <span className={style.Function}>
                {formula2}
              </span>

            </li>

          </ul>

          <Input
            placeholder='Enter the left limit'
            value={leftLimit}
            onChange={leftLimitInputChangeHandler}
            onKeyPress={inputKeyPressHandler}
            width='90%'
          />

          <Input
            placeholder='Enter the right limit'
            value={rightLimit}
            onChange={rightLimitInputChangeHandler}
            onKeyPress={inputKeyPressHandler}
            width='90%'
          />

          <Input
            placeholder='Enter the amount of points'
            value={amountOfPoints}
            onChange={amountOfPointsInputChangeHandler}
            onKeyPress={inputKeyPressHandler}
            width='90%'
          />

          <Button
            isActive={leftLimit && rightLimit && amountOfPoints ? true : false}
            onClick={calculateButtonClickHandler}
            color='Blue'
            width='90%'
            height='50px'
          >
            Calculate
          </Button>

        </div>

        <div className={style.Bottom}>

          {
            results ? renderResults() : null
          }

        </div>

      </div>

    </div>
  )

}

export default App