import { SimulationState } from '../Simulation'

// Simple economic model: add 5 resources each tick
export function economySystem(state: SimulationState) {
  state.resources += 5
}
