import { useState } from 'react'

function HUD({ turn, treasury, influence }: { turn: number; treasury: number; influence: number }) {
  return (
    <div className="hud shadow-lg">
      <div className="hud-item">
        <span className="hud-label">Turn</span>
        <span className="hud-value">{turn}</span>
      </div>
      <div className="hud-item">
        <span className="hud-label">Treasury</span>
        <span className="hud-value">{`$${treasury}B`}</span>
      </div>
      <div className="hud-item">
        <span className="hud-label">Influence</span>
        <span className="hud-value">{influence}</span>
      </div>
    </div>
  )
}

function Sidebar({ onAdvance }: { onAdvance: () => void }) {
  return (
    <div className="sidebar">
      <h2 className="mb-2 text-xl">Actions</h2>
      <button className="btn btn-primary w-full mb-2" onClick={onAdvance}>
        Advance Turn
      </button>
      <button className="btn w-full mb-2">Diplomacy</button>
      <button className="btn w-full">Economy</button>
    </div>
  )
}

function MapView() {
  return (
    <div className="map-view flex items-center justify-center">
      <span className="italic text-gray-500">Map coming soon...</span>
    </div>
  )
}

function InfoPanel({ log }: { log: string[] }) {
  return (
    <div className="info-panel">
      <h2 className="mb-2 text-xl">Event Log</h2>
      <ul className="space-y-1 text-sm">
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </div>
  )
}

function App() {
  const [turn, setTurn] = useState(1)
  const [treasury, setTreasury] = useState(50)
  const [influence, setInfluence] = useState(20)
  const [log, setLog] = useState<string[]>([])

  const advanceTurn = () => {
    setTurn(t => {
      const next = t + 1
      setLog(l => [`Turn ${next} begins`, ...l])
      return next
    })
  }

  return (
    <div className="sim-container">
      <HUD turn={turn} treasury={treasury} influence={influence} />
      <div className="game-grid">
        <Sidebar onAdvance={advanceTurn} />
        <MapView />
        <InfoPanel log={log} />
      </div>
    </div>
  )
}

export default App
