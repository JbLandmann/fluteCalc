import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AlgorithmExplanation from '../components/AlgorithmExplanation/AlgorithmExplanation'
import InputGroup from '../components/InputGroup/InputGroup'
import { 
  calculateEffectiveLength, 
  calculateDeltaFromTwoNotes, 
  calculateHolePosition,
  recalculatePositionsAfterMeasurement,
  shiftFollowingNotes
} from '../utils/calculations'

function AcousticalPage() {
  const { t } = useTranslation()
  
  // Step 1: Calculation method selection
  const [calculationMethod, setCalculationMethod] = useState('half-wave') // 'half-wave' or 'quarter-wave'
  
  // Step 2: Physical measurements
  const [physicalLength, setPhysicalLength] = useState(400) // Lphys
  const [innerDiameter, setInnerDiameter] = useState(19) // Dinner
  const [temperature, setTemperature] = useState(20)
  const [note1Frequency, setNote1Frequency] = useState(293.66) // Normal breath
  const [note2Frequency, setNote2Frequency] = useState(0) // Strong breath (optional)
  
  // Calculated values from Step 2
  const [effectiveLength, setEffectiveLength] = useState(null) // Leff
  const [deltaAverage, setDeltaAverage] = useState(null) // Delta
  
  // Step 3: Target notes
  const [targetNotes, setTargetNotes] = useState([
    { id: 1, frequency: 330, holeDiameter: 5, position: null, isMeasured: false }
  ])
  
  const maxNotes = calculationMethod === 'half-wave' ? 10 : 7

  // Calculate Step 2 values
  const handleCalculateStep2 = () => {
    const leff = calculateEffectiveLength(
      note1Frequency, 
      temperature, 
      calculationMethod
    )
    setEffectiveLength(leff)
    
    // Calculate Delta
    let delta
    if (note2Frequency > 0) {
      // Si note2 renseignée, calculer Delta moyen
      delta = calculateDeltaFromTwoNotes(
        note1Frequency,
        note2Frequency,
        temperature,
        calculationMethod
      )
    } else {
      // Sinon Delta par défaut selon la méthode
      delta = calculationMethod === 'half-wave' 
        ? 0.6 * (innerDiameter / 2) // ~0.6-1.2 × radius
        : 1.0 * (innerDiameter / 2) // TSH correction
    }
    setDeltaAverage(delta)
    
    // Recalculate all target note positions
    recalculateAllPositions(delta, leff)
  }

  // Recalculate all target note positions
  const recalculateAllPositions = (delta, leff) => {
    const updated = targetNotes.map((note, index) => {
      if (!note.isMeasured) {
        const position = calculateHolePosition(
          note.frequency,
          note.holeDiameter,
          innerDiameter,
          temperature,
          calculationMethod,
          delta,
          leff
        )
        
        // Apply shift based on previous holes
        const shifted = shiftFollowingNotes(position, index, targetNotes)
        
        return { ...note, position: shifted }
      }
      return note
    })
    setTargetNotes(updated)
  }

  // Add new target note
  const addTargetNote = () => {
    if (targetNotes.length < maxNotes) {
      setTargetNotes([
        ...targetNotes,
        {
          id: targetNotes.length + 1,
          frequency: 0,
          holeDiameter: 5,
          position: null,
          isMeasured: false
        }
      ])
    }
  }

  // Update target note
  const updateTargetNote = (index, field, value) => {
    const updated = [...targetNotes]
    updated[index][field] = value
    setTargetNotes(updated)
    
    // Recalculate position if we have delta
    if (deltaAverage && effectiveLength && (field === 'frequency' || field === 'holeDiameter')) {
      recalculateAllPositions(deltaAverage, effectiveLength)
    }
  }

  // Add measured note (gain precision)
  const addMeasuredNote = (index, measuredFreq, measuredDiameter) => {
    // Calculate new Delta from measurement
    const newDelta = calculateDeltaFromTwoNotes(
      note1Frequency,
      measuredFreq,
      temperature,
      calculationMethod
    )
    setDeltaAverage(newDelta)
    
    // Mark this note as measured
    const updated = [...targetNotes]
    updated[index].isMeasured = true
    updated[index].frequency = measuredFreq
    updated[index].holeDiameter = measuredDiameter
    setTargetNotes(updated)
    
    // Recalculate all following positions with new Delta
    recalculatePositionsAfterMeasurement(index, updated, newDelta, effectiveLength, innerDiameter, temperature, calculationMethod)
  }

  // Remove target note
  const removeTargetNote = (index) => {
    const updated = targetNotes.filter((_, i) => i !== index)
    setTargetNotes(updated)
  }

  // Current inputs display for algorithm explanation
  const currentInputs = effectiveLength ? (
    <>
      <strong>{t('algo_current_inputs')}</strong><br />
      Lphys: {physicalLength} mm<br />
      Leff: {effectiveLength.toFixed(2)} mm<br />
      Delta: {deltaAverage?.toFixed(2)} mm<br />
      {t('algo_inner_diameter')} {innerDiameter} mm<br />
      {t('algo_temperature')} {temperature} °C
    </>
  ) : null

  return (
    <div>
      <AlgorithmExplanation 
        title={t('algo_acoustical_title')}
        inputs={currentInputs}
      >
        <p>{t('algo_acoustical_intro')}</p>
        
        <h3>{t('algo_xiao_how_title')}</h3>
        <ul>
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_how_1') }} />
          <li>{t('algo_acoustical_how_2')}</li>
          <li>{t('algo_acoustical_how_3')}</li>
          <li>{t('algo_acoustical_how_4')}</li>
        </ul>

        <h3>{t('algo_calc_details_title')}</h3>
        <p>{t('algo_calc_details_intro')}</p>
        <ul>
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_calc_1') }} />
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_calc_2') }} />
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_calc_3') }} />
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_calc_4') }} />
        </ul>
      </AlgorithmExplanation>

      {/* STEP 1: Calculation Method */}
      <div className="input-section">
        <h3>Step 1: Pick a frequency calculation method</h3>
        <div className="input-grid">
          <InputGroup label="Calculation Method">
            <select 
              value={calculationMethod} 
              onChange={(e) => setCalculationMethod(e.target.value)}
            >
              <option value="half-wave">Ouvert aux deux extrémités | Demi-onde (L_eff = c / (2 * f0))</option>
              <option value="quarter-wave">Fermé à un bout, TSH | Quart d'onde (L_eff = c / (4 * f0))</option>
            </select>
          </InputGroup>
        </div>
        {calculationMethod === 'half-wave' && (
          <div className="input-hint">
            Flûte traversière, Bansuri, flûte simple ouverte (max 10 trous)<br />
            Delta = ~0.6–1.2 × rayon tube
          </div>
        )}
        {calculationMethod === 'quarter-wave' && (
          <div className="input-hint">
            Flûte Native américaine à double chambre (max 7 trous)<br />
            Delta = déplacement du nœud dû à TSH + end correction
          </div>
        )}
      </div>

      {/* STEP 2: Physical Measurements */}
      <div className="input-section">
        <h3>Step 2: Enter physical measurements</h3>
        <div className="input-grid">
          <InputGroup label="Lphys - Physical Length (mm)" hint="Longueur mesurée de la flûte">
            <input
              type="number"
              value={physicalLength}
              onChange={(e) => setPhysicalLength(parseFloat(e.target.value))}
              min="100"
              max="1000"
              step="1"
            />
          </InputGroup>
          
          <InputGroup label="Dinner - Inner Diameter (mm)" hint="Diamètre intérieur du tube">
            <input
              type="number"
              value={innerDiameter}
              onChange={(e) => setInnerDiameter(parseFloat(e.target.value))}
              min="10"
              max="50"
              step="0.5"
            />
          </InputGroup>
          
          <InputGroup label={t('temperature')} hint="Pour la vitesse du son (optionnel)">
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              min="-10"
              max="40"
              step="1"
            />
          </InputGroup>

          <InputGroup label="Note 1 Frequency (Hz)" hint="Fréquence mesurée - souffle normal">
            <input
              type="number"
              value={note1Frequency}
              onChange={(e) => setNote1Frequency(parseFloat(e.target.value))}
              min="100"
              max="1000"
              step="0.01"
            />
          </InputGroup>

          <InputGroup label="Note 2 Frequency (Hz)" hint="Fréquence mesurée - souffle fort (optionnel)">
            <input
              type="number"
              value={note2Frequency}
              onChange={(e) => setNote2Frequency(parseFloat(e.target.value))}
              min="0"
              max="1000"
              step="0.01"
            />
          </InputGroup>
        </div>
        
        <button className="calculate-button" onClick={handleCalculateStep2}>
          Calculate Leff and Delta
        </button>

        {effectiveLength && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '8px' }}>
            <strong>Calculated Values:</strong><br />
            Leff (Effective Length): {effectiveLength.toFixed(2)} mm<br />
            Delta (End Correction): {deltaAverage?.toFixed(2)} mm
          </div>
        )}
      </div>

      {/* STEP 3: Target Notes */}
      {effectiveLength && deltaAverage && (
        <div className="input-section">
          <h3>Step 3: Target Notes (low to high)</h3>
          
          {targetNotes.map((note, index) => (
            <div key={note.id} style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              background: note.isMeasured ? '#e3f2fd' : '#fff8f0',
              borderRadius: '8px',
              border: `2px solid ${note.isMeasured ? '#2196f3' : '#d4b896'}`
            }}>
              <h4>Note {index + 1} {note.isMeasured && '(Measured)'}</h4>
              
              <div className="input-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <InputGroup label="Target Frequency (Hz)">
                  <input
                    type="number"
                    value={note.frequency}
                    onChange={(e) => updateTargetNote(index, 'frequency', parseFloat(e.target.value))}
                    min="100"
                    max="2000"
                    step="0.01"
                    disabled={note.isMeasured}
                  />
                </InputGroup>

                <InputGroup label="Hole Diameter (mm)">
                  <input
                    type="number"
                    value={note.holeDiameter}
                    onChange={(e) => updateTargetNote(index, 'holeDiameter', parseFloat(e.target.value))}
                    min="3"
                    max="15"
                    step="0.5"
                    disabled={note.isMeasured}
                  />
                </InputGroup>

                <InputGroup label="Position (mm)">
                  <input
                    type="number"
                    value={note.position || 0}
                    readOnly
                    style={{ background: '#f5f5f5' }}
                  />
                </InputGroup>
              </div>

              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                {(index === 0 || targetNotes[index - 1]?.isMeasured) && !note.isMeasured && (
                  <button 
                    className="calculate-button" 
                    style={{ padding: '8px 15px', fontSize: '0.9em' }}
                    onClick={() => {
                      const freq = prompt('Enter measured frequency (Hz):')
                      const diam = prompt('Enter measured hole diameter (mm):')
                      if (freq && diam) {
                        addMeasuredNote(index, parseFloat(freq), parseFloat(diam))
                      }
                    }}
                  >
                    📏 Measure this hole
                  </button>
                )}
                
                {targetNotes.length > 1 && (
                  <button 
                    onClick={() => removeTargetNote(index)}
                    style={{ 
                      padding: '8px 15px', 
                      background: '#f44336', 
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          {targetNotes.length < maxNotes && (
            <button className="calculate-button" onClick={addTargetNote}>
              + Add Target Note
            </button>
          )}

          {targetNotes.length > 0 && targetNotes[0].position !== null && (
            <div className="results-section" style={{ marginTop: '30px' }}>
              <h3>Calculated Hole Positions</h3>
              <table>
                <thead>
                  <tr>
                    <th>Note #</th>
                    <th>Target Frequency (Hz)</th>
                    <th>Hole Diameter (mm)</th>
                    <th>Position (mm)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {targetNotes.map((note, index) => (
                    <tr key={note.id}>
                      <td>{index + 1}</td>
                      <td>{note.frequency.toFixed(2)}</td>
                      <td>{note.holeDiameter}</td>
                      <td>{note.position?.toFixed(2) || '—'}</td>
                      <td>{note.isMeasured ? '✓ Measured' : 'Calculated'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AcousticalPage
