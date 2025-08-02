import React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

interface Props {
  onSelectCountry: (name: string) => void
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function WorldMap({ onSelectCountry }: Props) {
  return (
    <div className="map-container">
      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => onSelectCountry(geo.properties.name)}
                style={{
                  default: { fill: '#d6d6da', outline: 'none' },
                  hover: { fill: '#f53', outline: 'none' },
                  pressed: { fill: '#e42', outline: 'none' }
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}
