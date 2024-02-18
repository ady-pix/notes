import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({value, text}) => {
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad, all, average, positive, texts}) =>
{
  if (all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine value={good} text={texts.goodText}/>
        <StatisticLine value={neutral} text={texts.neutralText}/>
        <StatisticLine value={bad} text={texts.badText}/> 
        <StatisticLine value={all} text={texts.allText}/> 
        <StatisticLine value={average} text={texts.averageText}/> 
        <StatisticLine value={positive} text={texts.positiveText}/> 
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
    setAll(all + 1)
    setAverage((good - bad + 1) / (all + 1))
    setPositive((good + 1) / (all + 1) * 100)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral+1)
    setAll(all + 1)
    setPositive((good) / (all + 1) * 100)
  }

  const handleBadClick = () => {
    setBad(bad+1)
    setAll(all + 1)
    setAverage((good - bad - 1) / (all + 1))
    setPositive((good) / (all + 1) * 100)
  }

  const texts = {
    goodText: 'good', 
    neutralText: 'neutral', 
    badText: 'bad', 
    allText: 'all', 
    averageText: 'average',
    positiveText: 'positive'
  };
  
  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={handleGoodClick} text={texts.goodText}/>
      <Button handleClick={handleNeutralClick} text={texts.neutralText}/>
      <Button handleClick={handleBadClick} text={texts.badText}/>
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} texts={texts}/>
    </div>
  )
}

export default App