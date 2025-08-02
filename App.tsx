import React, { useEffect, useState } from 'react'
import { Character, initialLeaders } from './leaders'

export default function App() {
  const [leaders, setLeaders] = useState<Character[]>(initialLeaders)

  useEffect(() => {
    Promise.all(
      initialLeaders.map(async l => {
        try {
          const res = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(l.wiki)}`
          )
          const data = await res.json()
          return { ...l, portrait: data.thumbnail?.source || l.portrait }
        } catch {
          return l
        }
      })
    ).then(setLeaders)
  }, [])

  return (
    <div className="sim-container">
      <h1>Geopolitical Simulator</h1>
      <ul className="space-y-1">
        {leaders.map(l => (
          <li key={l.id}>
            {l.portrait && <img src={l.portrait} alt={l.name} className="portrait mr-2" />}
            <a href={`https://en.wikipedia.org/wiki/${l.wiki}`} target="_blank" rel="noopener noreferrer">
              {l.name}
            </a>
            {' - '}{l.country}{l.party ? ` (${l.party})` : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}
