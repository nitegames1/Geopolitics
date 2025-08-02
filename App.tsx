import React, { useState, useEffect } from 'react'

export interface Character {
  id: string
  name: string
  country: string
  party?: string
  bio: string
  wiki: string
  portrait?: string
}

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

export const initialLeaders: Character[] = [
  // Key American figures
  {
    id: 'fdr',
    name: 'Franklin D. Roosevelt',
    country: 'United States',
    party: 'Democratic',
    bio: 'Incumbent 32nd president seeking re-election in 1936, pushing an expanded New Deal as the nation slowly recovers from the Depression.',
    wiki: 'Franklin_D._Roosevelt'
  },
  {
    id: 'landon',
    name: 'Alf Landon',
    country: 'United States',
    party: 'Republican',
    bio: "Kansas governor mounting a 1936 challenge to FDR on a platform of fiscal restraint and states' rights.",
    wiki: 'Alf_Landon'
  },
  {
    id: 'willkie',
    name: 'Wendell Willkie',
    country: 'United States',
    party: 'Republican',
    bio: 'Utility executive and New Deal critic whose business career in 1936 would later catapult him into the 1940 presidential race.',
    wiki: 'Wendell_Willkie'
  },
  {
    id: 'dew',
    name: 'Thomas E. Dewey',
    country: 'United States',
    party: 'Republican',
    bio: 'Manhattan district attorney famed for taking on organized crime, emerging as a rising Republican star by 1936.',
    wiki: 'Thomas_E._Dewey'
  },
  {
    id: 'truman',
    name: 'Harry S. Truman',
    country: 'United States',
    party: 'Democratic',
    bio: 'Freshman senator from Missouri tied to the Pendergast machine, still little-known nationally in 1936.',
    wiki: 'Harry_S._Truman'
  },
  {
    id: 'garner',
    name: 'John Nance Garner',
    country: 'United States',
    party: 'Democratic',
    bio: "Texan vice president and former Speaker balancing FDR's reform agenda with conservative Democrats.",
    wiki: 'John_Nance_Garner'
  },
  {
    id: 'hull',
    name: 'Cordell Hull',
    country: 'United States',
    party: 'Democratic',
    bio: 'Veteran congressman turned Secretary of State pursuing reciprocal trade deals to revive the world economy.',
    wiki: 'Cordell_Hull'
  },
  {
    id: 'morgenthau',
    name: 'Henry Morgenthau Jr.',
    country: 'United States',
    party: 'Democratic',
    bio: 'Treasury secretary overseeing federal financing of relief projects and stabilizing gold inflows in 1936.',
    wiki: 'Henry_Morgenthau_Jr.'
  },
  {
    id: 'wallace',
    name: 'Henry A. Wallace',
    country: 'United States',
    party: 'Democratic',
    bio: 'Progressive Iowa farm editor serving as Secretary of Agriculture, championing crop supports under the New Deal.',
    wiki: 'Henry_A._Wallace'
  },
  {
    id: 'hopkins',
    name: 'Harry Hopkins',
    country: 'United States',
    party: 'Democratic',
    bio: 'Key New Deal aide running the Works Progress Administration and providing FDR with political counsel.',
    wiki: 'Harry_Hopkins'
  },

  // Prominent world leaders
  {
    id: 'churchill',
    name: 'Winston Churchill',
    country: 'United Kingdom',
    party: 'Conservative',
    bio: 'British backbencher warning of German rearmament while outside the 1936 government.',
    wiki: 'Winston_Churchill'
  },
  {
    id: 'baldwin',
    name: 'Stanley Baldwin',
    country: 'United Kingdom',
    party: 'Conservative',
    bio: 'Prime minister navigating abdication turmoil and appeasement debates in early 1936.',
    wiki: 'Stanley_Baldwin'
  },
  {
    id: 'stalin',
    name: 'Joseph Stalin',
    country: 'Soviet Union',
    party: 'Communist',
    bio: 'Soviet ruler deep into the Second Five-Year Plan and beginning the Great Purge by 1936.',
    wiki: 'Joseph_Stalin'
  },
  {
    id: 'hitler',
    name: 'Adolf Hitler',
    country: 'Germany',
    party: 'Nazi',
    bio: 'Führer consolidating power after the remilitarization of the Rhineland in 1936.',
    wiki: 'Adolf_Hitler'
  },
  {
    id: 'mussolini',
    name: 'Benito Mussolini',
    country: 'Italy',
    party: 'Fascist',
    bio: 'Il Duce pursuing empire through the ongoing invasion of Ethiopia and tightening ties with Nazi Germany.',
    wiki: 'Benito_Mussolini'
  },
  {
    id: 'degaulle',
    name: 'Charles de Gaulle',
    country: 'France',
    party: 'Republican',
    bio: 'French armored warfare advocate and colonel whose ideas are ignored by the 1936 high command.',
    wiki: 'Charles_de_Gaulle'
  },
  {
    id: 'chiang',
    name: 'Chiang Kai-shek',
    country: 'China',
    party: 'Nationalist',
    bio: 'Nationalist generalissimo balancing war with Chinese communists and rising Japanese aggression in 1936.',
    wiki: 'Chiang_Kai-shek'
  },
  {
    id: 'hirohito',
    name: 'Emperor Hirohito',
    country: 'Japan',
    bio: 'Symbolic emperor presiding over a militarized Japan embarking on expansion across Asia.',
    wiki: 'Hirohito'
  },
  {
    id: 'selassie',
    name: 'Haile Selassie',
    country: 'Ethiopia',
    bio: 'Ethiopian emperor resisting the Italian invasion during the 1935–1936 war.',
    wiki: 'Haile_Selassie'
  },
]

export default function App() {
  const [leaders, setLeaders] = useState<Character[]>(initialLeaders)
  const [approval, setApproval] = useState(50)
  const [hovered, setHovered] = useState<Character | null>(null)
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
      setCabinet(cabinet.map(c => ({
        ...c,
        candidates: updated.filter(l => l.country === 'United States')
      })))
    })
  }, [])

  function assignCabinet(position: string, id: string) {
    setCabinet(cabinet.map(c =>
      c.position === position ? { ...c, assigned: leaders.find(l => l.id === id) } : c
    ))
  }

  const electionCycles: { year: number; candidates: ElectionCandidate[] }[] = [
    {
      year: 1936,
      candidates: [
        { name: 'Franklin D. Roosevelt', party: 'Democratic', support: 0.55 },
        { name: 'Alf Landon', party: 'Republican', support: 0.45 },
      ],
    },
    {
      year: 1940,
      candidates: [
        { name: 'Franklin D. Roosevelt', party: 'Democratic', support: 0.53 },
        { name: 'Wendell Willkie', party: 'Republican', support: 0.47 },
      ],
    },
    {
      year: 1944,
      candidates: [
        { name: 'Franklin D. Roosevelt', party: 'Democratic', support: 0.52 },
        { name: 'Thomas E. Dewey', party: 'Republican', support: 0.48 },
      ],
    },
    {
      year: 1948,
      candidates: [
        { name: 'Harry S. Truman', party: 'Democratic', support: 0.5 },
        { name: 'Thomas E. Dewey', party: 'Republican', support: 0.5 },
      ],
    },
  ]

  const [cycleIndex, setCycleIndex] = useState(0)
  const [election, setElection] = useState<{ year: number; candidates: ElectionCandidate[]; winner?: string }>(electionCycles[0])

  function runElection() {
    const winner = election.candidates.reduce((max, c) => (c.support > max.support ? c : max)).name
    setElection({ ...election, winner })
  }

  const [congress] = useState<Congress>({
    senate: { democrats: 70, republicans: 24, independents: 2 },
    house: { democrats: 322, republicans: 103 },
  })
  const [billLog, setBillLog] = useState<string[]>([])
  const [customBill, setCustomBill] = useState('')

  function passBill(name: string) {
    const passed = Math.random() < 0.6
    setBillLog([...billLog, `${name} ${passed ? 'passed' : 'failed'}`])
  }

  function nextElection() {
    const next = Math.min(cycleIndex + 1, electionCycles.length - 1)
    setCycleIndex(next)
    setElection(electionCycles[next])
  }

  return (
    <div className="sim-container">
      <h1>Geopolitical Simulator</h1>
      <div><a href="lore.html" target="_blank" rel="noopener noreferrer">AI Lore Generator</a></div>
      <div className="hud mb-2">Approval Rating: {approval}%</div>

      <div className="panel">
        <h2>World Leaders</h2>
        <ul className="space-y-1">
          {leaders.map(l => (
            <li
              key={l.id}
              onMouseEnter={() => setHovered(l)}
              onMouseLeave={() => setHovered(null)}
              className="relative"
            >
              {l.portrait && <img src={l.portrait} alt={l.name} className="portrait mr-2" />}
              <a href={`https://en.wikipedia.org/wiki/${l.wiki}`} target="_blank" rel="noopener noreferrer">{l.name}</a> - {l.country}{l.party ? ` (${l.party})` : ''}
              {hovered?.id === l.id && (
                <div className="tooltip">{hovered.bio}</div>
              )}
            </li>
          ))}
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
    </div>
  )
}
