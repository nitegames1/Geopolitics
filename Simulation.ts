import { economySystem } from './systems/EconomySystem'

export interface SimulationState {
  tick: number
  resources: number
}

type Listener = (state: SimulationState) => void
type System = (state: SimulationState) => void

export class Simulation {
  private state: SimulationState = { tick: 0, resources: 0 }
  private listeners = new Set<Listener>()
  private systems = new Set<System>()
  private intervalId: ReturnType<typeof setInterval> | null = null

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    listener(this.state)
    return () => this.listeners.delete(listener)
  }

  addSystem(system: System): () => void {
    this.systems.add(system)
    return () => this.systems.delete(system)
  }

  start(intervalMs = 1000) {
    if (this.intervalId) return
    this.intervalId = setInterval(() => this.tick(), intervalMs)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  isRunning() {
    return this.intervalId !== null
  }

  getState() {
    return this.state
  }

  tick() {
    this.state.tick += 1
    for (const system of this.systems) {
      system(this.state)
    }
    for (const listener of this.listeners) {
      listener(this.state)
    }
  }
}

export const simulation = new Simulation()
simulation.addSystem(economySystem)
