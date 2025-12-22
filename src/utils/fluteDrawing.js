// Generate SVG drawing of the flute as React component
export function FluteSVG({ fluteData }) {
  const { positions, numHoles, diameter } = fluteData
  
  // Calculate SVG dimensions
  const maxPosition = Math.max(...positions)
  const fluteLength = maxPosition + 50
  
  // SVG scaling factor (pixels per mm)
  const scale = 1.5
  const svgHeight = fluteLength * scale
  const svgWidth = 300
  
  // Flute tube dimensions
  const tubeWidth = diameter * scale
  const tubeX = (svgWidth - tubeWidth) / 2
  
  // Default hole diameter (8mm)
  const holeRadius = 4 * scale
  
  return (
    <svg className="flute-svg" viewBox={`0 0 ${svgWidth} ${svgHeight}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="20" height="100">
          <path d="M0,0 Q10,50 0,100" stroke="#8b6f47" strokeWidth="0.5" fill="none" opacity="0.3"/>
          <path d="M10,0 Q20,50 10,100" stroke="#8b6f47" strokeWidth="0.5" fill="none" opacity="0.3"/>
        </pattern>
      </defs>
      
      {/* Background */}
      <rect width={svgWidth} height={svgHeight} fill="#f5e6d3"/>
      
      {/* Flute tube */}
      <rect x={tubeX} y="0" width={tubeWidth} height={svgHeight} 
            fill="#d4b896" stroke="#8b6f47" strokeWidth="2" rx="5"/>
      
      {/* Wood grain effect */}
      <rect x={tubeX} y="0" width={tubeWidth} height={svgHeight} 
            fill="url(#woodGrain)" opacity="0.3" rx="5"/>
      
      {/* Blowing edge (embouchure) */}
      <ellipse cx={svgWidth / 2} cy="20" rx={tubeWidth / 2 + 5} ry="10" 
               fill="#6d5738" stroke="#5d4a37" strokeWidth="2"/>
      <text x={svgWidth / 2} y="50" textAnchor="middle" fontSize="12" fill="#3e2723" fontWeight="bold">
        Embouchure
      </text>
      
      {/* Holes */}
      {positions.map((position, i) => {
        const posY = position * scale
        let holeX = svgWidth / 2
        
        let isBackHole = false
        let isPinkyHole = false
        
        if (numHoles === 8) {
          if (i === 0) {
            holeX = svgWidth / 2 + tubeWidth / 2 - 5
            isPinkyHole = true
          } else if (i === 7) {
            holeX = svgWidth / 2 - tubeWidth / 2 - 5
            isBackHole = true
          }
        } else if (numHoles === 7 && i === 6) {
          holeX = svgWidth / 2 - tubeWidth / 2 - 5
          isBackHole = true
        }
        
        // Label
        let label = `Trou ${i + 1}`
        if (isBackHole) label += ' (dos)'
        if (isPinkyHole) label += ' (auriculaire)'
        
        const labelX = holeX + holeRadius + 15
        
        return (
          <g key={i}>
            {/* Hole */}
            <circle 
              cx={holeX} 
              cy={posY} 
              r={holeRadius} 
              fill={isBackHole ? '#4a5d4a' : '#3e2723'} 
              stroke={isBackHole || isPinkyHole ? '#ff6b6b' : '#2d1f1a'} 
              strokeWidth="2"
            />
            
            {/* Labels */}
            <text x={labelX} y={posY + 4} fontSize="11" fill="#3e2723">
              {label}
            </text>
            <text x={labelX} y={posY + 16} fontSize="9" fill="#6d5738" fontStyle="italic">
              {position.toFixed(1)} mm
            </text>
            
            {/* Distance lines between holes */}
            {i < numHoles - 1 && (() => {
              const nextPosition = positions[i + 1] * scale
              const midY = (posY + nextPosition) / 2
              const lineX = tubeX - 20
              const distance = Math.abs(positions[i] - positions[i + 1])
              
              return (
                <g>
                  <line x1={lineX} y1={posY} x2={lineX} y2={nextPosition} 
                        stroke="#8b6f47" strokeWidth="1" strokeDasharray="2,2"/>
                  <line x1={lineX - 3} y1={posY} x2={lineX + 3} y2={posY} 
                        stroke="#8b6f47" strokeWidth="1"/>
                  <line x1={lineX - 3} y1={nextPosition} x2={lineX + 3} y2={nextPosition} 
                        stroke="#8b6f47" strokeWidth="1"/>
                  <text x={lineX - 5} y={midY} fontSize="9" fill="#6d5738" textAnchor="end">
                    {distance.toFixed(1)}mm
                  </text>
                </g>
              )
            })()}
          </g>
        )
      })}
    </svg>
  )
}
