import React, { useEffect, useState } from 'react'
import { simulation, SimulationState } from './Simulation'

function App() {
  const [state, setState] = useState<SimulationState>(simulation.getState())

  useEffect(() => {
    const unsubscribe = simulation.subscribe(setState)
    simulation.start()
    return () => {
      simulation.stop()
      unsubscribe()
    }
  }, [])

  const toggle = () => {
    if (simulation.isRunning()) simulation.stop()
    else simulation.start()
  }

  return (
    <div className="sim-container">
      <h1>Simulation tick: {state.tick}</h1>
      <p>Resources: {state.resources}</p>
      <button onClick={toggle}>{simulation.isRunning() ? 'Pause' : 'Start'}</button>
    </div>
  )
}

export default App
