import React, { useState } from 'react'

import { initialLeaders, Character, getLeaderById, getRandomLeader } from './leaders'

export default function Lore() {
  const [selected, setSelected] = useState<Character>(getRandomLeader())

import { initialLeaders, Character } from './leaders'

export default function Lore() {
  const [selected, setSelected] = useState<Character | null>(null)

  const [lore, setLore] = useState('')
  const [loading, setLoading] = useState(false)

  async function generateLore() {

    const char = selected
    if (!char) return

    setLoading(true)
    setLore('')
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You write concise historical biographies for geopolitical simulation characters set in January 1936.' },
            { role: 'user', content: `Describe ${selected.name} and their outlook as of January 1936.` }
          ],
          max_tokens: 150,
        })
      })
      const data = await res.json()
      setLore(data.choices?.[0]?.message?.content ?? 'No lore generated.')
    } catch (e) {
      setLore('Failed to generate lore.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sim-container">
      <h1>AI Lore Generator</h1>
      <select

        value={selected.id}
        onChange={e => {
          const leader = getLeaderById(e.target.value)
          if (leader) setSelected(leader)
        }}

        value={selected?.id ?? ''}
        onChange={e => setSelected(initialLeaders.find(l => l.id === e.target.value) ?? null)}

      >
        <option value="">Select a character</option>
        {initialLeaders.map(l => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
      <button className="ml-2" disabled={loading} onClick={generateLore}>
        {loading ? 'Generating...' : 'Generate Lore'}
      </button>
      {lore && <p className="mt-4 whitespace-pre-line">{lore}</p>}
    </div>
  )
}
