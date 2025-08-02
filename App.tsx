import React, { useState, useEffect } from 'react'
import { Character, initialLeaders } from './data/leaders'
import WorldMap from './WorldMap'

interface CabinetMember {
  position: string
  assigned?: Character
  candidates: Character[]
}

interface ElectionCandidate {
  name: string
  party: string
  support: number
}

interface Congress {
  senate: { democrats: number; republicans: number; independents: number }
  house: { democrats: number; republicans: number }
}

export default function App() {
  const [leaders, setLeaders] = useState<Character[]>(initialLeaders)
  const [approval, setApproval] = useState(50)
  const [year, setYear] = useState(1936)
  const [log, setLog] = useState<string[]>([])
  const [hovered, setHovered] = useState<Character | null>(null)
  const playerCountry = 'United States'
  const [selectedCountry, setSelectedCountry] = useState(playerCountry)
  const [countryTab, setCountryTab] = useState<'player' | 'selected'>('player')
  const [cabinet, setCabinet] = useState<CabinetMember[]>([
    {
      position: 'Secretary of State',
      candidates: leaders.filter(l => l.country === 'United States'),
    },
    {
      position: 'Secretary of Defense',
      candidates: leaders.filter(l => l.country === 'United States'),
    },
    {
      position: 'Treasury Secretary',
      candidates: leaders.filter(l => l.country === 'United States'),
    },
    {
      position: 'Attorney General',
      candidates: leaders.filter(l => l.country === 'United States'),
    },
    {
      position: 'Secretary of Commerce',
      candidates: leaders.filter(l => l.country === 'United States'),
    },
  ])
  useEffect(() => {
    Promise.all(
      leaders.map(async l => {
        try {
          const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(l.wiki)}`)
          const data = await res.json()
          return { ...l, portrait: data.thumbnail?.source || l.portrait }
        } catch {
          return l
        }
      })
    ).then(updated => {
      setLeaders(updated)
      setCabinet(prev => prev.map(c => ({
        ...c,
        candidates: updated.filter(l => l.country === 'United States')
      })))
    })
  }, [])

  const clamp = (val: number) => Math.max(0, Math.min(100, val))

  function assignCabinet(position: string, id: string) {
    setCabinet(cabinet.map(c =>
      c.position === position ? { ...c, assigned: leaders.find(l => l.id === id) } : c
    ))
  }

  const electionCycles: { year: number; candidates: ElectionCandidate[] }[] = [
    {
      year: 1936,
      candidates: [
        { name: 'Franklin D. Roosevelt', party: 'Democratic', support: 0.608 },
        { name: 'Alf Landon', party: 'Republican', support: 0.365 },
      ],
    },
    {
      year: 1940,
      candidates: [
        { name: 'Franklin D. Roosevelt', party: 'Democratic', support: 0.547 },
        { name: 'Wendell Willkie', party: 'Republican', support: 0.448 },
      ],
    },
    {
      year: 1944,
      candidates: [
        { name: 'Franklin D. Roosevelt', party: 'Democratic', support: 0.534 },
        { name: 'Thomas E. Dewey', party: 'Republican', support: 0.459 },
      ],
    },
    {
      year: 1948,
      candidates: [
        { name: 'Harry S. Truman', party: 'Democratic', support: 0.496 },
        { name: 'Thomas E. Dewey', party: 'Republican', support: 0.451 },
      ],
    },
  ]

  const [cycleIndex, setCycleIndex] = useState(0)
  const [election, setElection] = useState<{ year: number; candidates: ElectionCandidate[]; winner?: string }>(electionCycles[0])

  function runElection() {
    const winnerCandidate = election.candidates.reduce((max, c) => (c.support > max.support ? c : max))
    setElection({ ...election, winner: winnerCandidate.name })
    setYear(election.year)
    const player = election.candidates[0]
    setApproval(a => clamp(a + (winnerCandidate.name === player.name ? 10 : -10)))
    setLog(prev => [...prev, `Election ${election.year} won by ${winnerCandidate.name}`])
  }

  const [congress] = useState<Congress>({
    senate: { democrats: 70, republicans: 24, independents: 2 },
    house: { democrats: 322, republicans: 103 },
  })
  const [billLog, setBillLog] = useState<string[]>([])
  const [customBill, setCustomBill] = useState('')

  function passBill(name: string) {
    const passed = Math.random() < 0.6
    setBillLog(prev => [...prev, `${name} ${passed ? 'passed' : 'failed'}`])
    setApproval(a => clamp(a + (passed ? 5 : -5)))
    setLog(prev => [...prev, `Bill ${name} ${passed ? 'passed' : 'failed'}`])
  }

  function nextElection() {
    const next = Math.min(cycleIndex + 1, electionCycles.length - 1)
    setCycleIndex(next)
    setElection(electionCycles[next])
    setYear(electionCycles[next].year)
  }

  return (
    <div className="sim-container">
      <h1>Geopolitical Simulator</h1>
      <div><a href="lore.html" target="_blank" rel="noopener noreferrer">AI Lore Generator</a></div>
      <div className="hud mb-2">Year: {year} | Approval Rating: {approval}%</div>

        <div className="panel">
          <h2>World Map</h2>
          <WorldMap onSelectCountry={name => { setSelectedCountry(name); setCountryTab('selected') }} />
        </div>

        <div className="panel">
          <h2>Country Overview</h2>
          <div className="tabs">
            <button className={countryTab === 'player' ? 'active' : ''} onClick={() => setCountryTab('player')}>Player Country</button>
            <button className={countryTab === 'selected' ? 'active' : ''} onClick={() => setCountryTab('selected')}>Selected Country</button>
          </div>
          <h3>{countryTab === 'player' ? playerCountry : selectedCountry}</h3>
          <ul className="space-y-1">
            {leaders.filter(l => l.country === (countryTab === 'player' ? playerCountry : selectedCountry)).map(l => (
              <li
                key={l.id}
                onMouseEnter={() => setHovered(l)}
                onMouseLeave={() => setHovered(null)}
                className="relative"
              >
                {l.portrait && <img src={l.portrait} alt={l.name} className="portrait mr-2" />}
                <a href={`https://en.wikipedia.org/wiki/${l.wiki}`} target="_blank" rel="noopener noreferrer">{l.name}</a>{l.party ? ` (${l.party})` : ''}
                {hovered?.id === l.id && (
                  <div className="tooltip">{hovered.bio}</div>
                )}
              </li>
            ))}
            {leaders.filter(l => l.country === (countryTab === 'player' ? playerCountry : selectedCountry)).length === 0 && (
              <li>No data available</li>
            )}
          </ul>
        </div>

      <div className="panel">
        <h2>Cabinet Selection</h2>
        {cabinet.map(c => (
          <div key={c.position} className="mb-2">
            <strong>{c.position}:</strong>{' '}
            <select value={c.assigned?.id ?? ''} onChange={e => assignCabinet(c.position, e.target.value)}>
              <option value="">-- choose --</option>
              {c.candidates.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {c.assigned && <span className="ml-2 italic">{c.assigned.name}</span>}
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>Election {election.year}</h2>
        {election.winner ? (
          <div>
            <p>Winner: {election.winner}</p>
            {cycleIndex < electionCycles.length - 1 && (
              <button onClick={nextElection} className="mt-2">Next Election</button>
            )}
          </div>
        ) : (
          <div>
            <ul>
              {election.candidates.map(c => (
                <li key={c.name}>{c.name} ({c.party}) - {Math.round(c.support * 100)}%</li>
              ))}
            </ul>
            <button onClick={runElection} className="mt-2">Run Election</button>
          </div>
        )}
      </div>

      <div className="panel">
        <h2>Congress</h2>
        <div>Senate: D{congress.senate.democrats} R{congress.senate.republicans} I{congress.senate.independents}</div>
        <div>House: D{congress.house.democrats} R{congress.house.republicans}</div>
        <div className="mt-2">
          <input
            value={customBill}
            onChange={e => setCustomBill(e.target.value)}
            placeholder="Bill Name"
            className="mr-2"
          />
          <button onClick={() => { if(customBill) { passBill(customBill); setCustomBill('') } }}>Introduce Bill</button>
        </div>
        <ul>
          {billLog.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </div>

      <div className="panel">
        <h2>Event Log</h2>
        <ul>
          {log.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </div>
    </div>
  )
}
