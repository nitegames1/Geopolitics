
import { useState, useEffect } from 'react'

function App() {
  const [view, setView] = useState<'menu' | 'sim'>('menu')
  const [startGdp, setStartGdp] = useState(100)
  const [gdp, setGdp] = useState(startGdp)
  const [turn, setTurn] = useState(0)
  const [history, setHistory] = useState<number[]>([startGdp])
  const [events, setEvents] = useState<{ text: string; amount: number }[]>([])
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal')
  const [darkMode, setDarkMode] = useState(true)
  const [showHelp, setShowHelp] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [funMode, setFunMode] = useState(false)

  const config = {
    easy: { eventChance: 0.2, eventMagnitude: 5, policyImpact: 10 },
    normal: { eventChance: 0.3, eventMagnitude: 10, policyImpact: 5 },
    hard: { eventChance: 0.5, eventMagnitude: 15, policyImpact: 3 }
  }[difficulty]

  useEffect(() => {
    document.body.classList.toggle('light', !darkMode)
  }, [darkMode])

  const randomEvent = (nextTurn: number): number => {
    if (Math.random() < config.eventChance) {
      const positive = Math.random() > 0.5
      const magnitude = funMode ? config.eventMagnitude * 2.5 : config.eventMagnitude
      const amount = positive ? magnitude : -magnitude
      const description = positive
        ? 'Technological breakthrough boosts industry'
        : 'Natural disaster disrupts production'
      setEvents(prev => [
        ...prev,
        {
          text: `Turn ${nextTurn}: ${description} (${amount > 0 ? '+' : ''}${amount})`,
          amount
        }
      ])
      return amount
    }
    return 0
  }

  const nextTurn = (delta: number) => {
    const upcomingTurn = turn + 1
    const eventDelta = randomEvent(upcomingTurn)
    const newGdp = Math.max(0, gdp + delta + eventDelta)
    setGdp(newGdp)
    setTurn(upcomingTurn)
    setHistory(prev => [...prev, newGdp])
  }

  const invest = () => nextTurn(config.policyImpact)
  const cutSpending = () => nextTurn(-config.policyImpact)

  const reset = () => {
    setTurn(0)
    setGdp(startGdp)
    setHistory([startGdp])
    setEvents([])
  }

  const maxGdp = Math.max(...history)
  const lastGdp = history.length > 1 ? history[history.length - 2] : history[0]
  const change = gdp - lastGdp
  const points =
    history.length > 1
      ? history
          .map((val, idx) => {
            const x = (idx / (history.length - 1)) * 100
            const y = 100 - (val / maxGdp) * 100
            return `${x},${y}`
          })
          .join(' ')
      : `0,${100 - (history[0] / maxGdp) * 100}`

  const modal =
    (showHelp || showSettings) && (
      <div className="modal-overlay">
        <div className="modal text-left">
          {showHelp ? (
            <>
              <h2 className="text-xl font-bold mb-2">How to Play</h2>
              <p className="mb-2">
                Adjust spending each turn and watch GDP respond. Random events
                may boost or hurt your economy based on your settings.
              </p>
              <p className="mb-4">
                Keep GDP above zero to keep the simulation going. Use the
                Settings menu to set the starting GDP, pick a difficulty level,
                toggle Fun Mode, or switch between dark and light themes.
              </p>
              <button
                className="btn bg-blue-700 hover:bg-blue-600"
                onClick={() => setShowHelp(false)}
              >
                Close
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">Settings</h2>
              <label className="block mb-2">
                Starting GDP:
                <input
                  type="number"
                  className="ml-2 w-24 p-1 text-right"
                  value={startGdp}
                  min={0}
                  onChange={e => setStartGdp(Math.max(0, Number(e.target.value)))}
                />
              </label>
              <label className="block mb-2">
                Difficulty:
                <select
                  className="ml-2 p-1"
                  value={difficulty}
                  onChange={e =>
                    setDifficulty(e.target.value as 'easy' | 'normal' | 'hard')
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={funMode}
                    onChange={e => setFunMode(e.target.checked)}
                  />
                  Enable Fun Mode (wild events)
                </label>
              </div>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={darkMode}
                    onChange={e => setDarkMode(e.target.checked)}
                  />
                  Dark Mode
                </label>
              </div>
              <button
                className="btn bg-blue-700 hover:bg-blue-600 mt-4"
                onClick={() => setShowSettings(false)}
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    );

  if (view === 'sim') {
    return (
      <>
        <div className="sim-container">
          <h2 className="text-2xl font-bold mb-4">Mini Economy Simulation</h2>
        <div className="panel text-center">
          <p
            className={`mb-3 ${
              change > 0
                ? 'text-green-400'
                : change < 0
                ? 'text-red-400'
                : ''
            }`}
          >
            Turn {turn} | GDP: {gdp}B {change !== 0 && `(${change > 0 ? '+' : ''}${change})`}
          </p>
          <svg viewBox="0 0 100 100" className="gdp-chart mb-3">
            <polyline
              points={points}
              fill="none"
              stroke="#4ade80"
              strokeWidth="2"
            />
          </svg>
          <button className="btn bg-blue-700 hover:bg-blue-600 mr-2" onClick={invest}>
            Invest in Infrastructure
          </button>
          <button className="btn bg-red-700 hover:bg-red-600 mr-2" onClick={cutSpending}>
            Cut Spending
          </button>
        </div>
        <div className="panel mt-4">
          <h3 className="text-xl font-bold mb-2">Event Log</h3>
          {events.length > 0 ? (
            <ul className="event-log text-left space-y-1">
              {events.map((e, i) => (
                <li
                  key={i}
                  className={e.amount > 0 ? 'text-green-400' : 'text-red-400'}
                >
                  {e.text}
                </li>
              ))}
            </ul>
          ) : (
            <p>No events yet.</p>
          )}
        </div>
        <div className="mt-4 flex justify-between">
          <button
            className="btn bg-gray-700 hover:bg-gray-600"
            onClick={() => setView('menu')}
          >
            Back to Menu
          </button>
          <button
            className="btn bg-gray-700 hover:bg-gray-600"
            onClick={() => {
              setShowSettings(true)
              setShowHelp(false)
            }}
          >
            Settings
          </button>
          <button className="btn bg-yellow-700 hover:bg-yellow-600" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
      {modal}
    </>
  )
}

  return (
    <>
      <div className="sim-container text-center">
        <h1 className="text-3xl font-bold mb-4">Geopolitics Prototype</h1>
        <p className="text-gray-300 mb-6">
          Manage a country's economy and watch the effects of your decisions.
        </p>
        <button
          className="btn bg-green-700 hover:bg-green-600 mr-2"
          onClick={() => {
            reset()
            setView('sim')
          }}
        >
          Start Simulation
        </button>
      <button
        className="btn bg-gray-700 hover:bg-gray-600 mt-4"
        onClick={() => {
          setShowSettings(true)
          setShowHelp(false)
        }}
      >
        Settings
      </button>
      <button
        className="btn bg-blue-700 hover:bg-blue-600 mt-4"
        onClick={() => {
          setShowHelp(true)
          setShowSettings(false)
        }}
      >
        How to Play
      </button>
      </div>
      {modal}
    </>
  )
}

export default App
