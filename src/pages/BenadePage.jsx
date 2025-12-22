import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AlgorithmExplanation from '../components/AlgorithmExplanation/AlgorithmExplanation'
import InputGroup from '../components/InputGroup/InputGroup'
import { calculateBenadePositions } from '../utils/calculations'

function BenadePage() {
  const { t } = useTranslation()
  
  // Input states
  const [fundamentalLength, setFundamentalLength] = useState(400)
  const [boreDiameter, setBoreDiameter] = useState(19)
  const [holeDiameter, setHoleDiameter] = useState(8)
  const [wallThickness, setWallThickness] = useState(3)
  const [numHoles, setNumHoles] = useState(6)
  
  // Results state
  const [results, setResults] = useState(null)

  // Calculate positions
  const handleCalculate = () => {
    const positions = calculateBenadePositions(
      fundamentalLength,
      boreDiameter,
      holeDiameter,
      wallThickness,
      numHoles
    )
    setResults(positions)
  }

  // Current inputs display for algorithm explanation
  const currentInputs = (
    <>
      <strong>{t('algo_current_inputs')}</strong><br />
      {t('algo_fundamental_length')} {fundamentalLength} mm<br />
      {t('algo_bore_diameter')} {boreDiameter} mm<br />
      {t('algo_hole_diameter')} {holeDiameter} mm<br />
      {t('algo_wall_thickness')} {wallThickness} mm<br />
      {t('algo_number_of_holes')} {numHoles}
    </>
  )

  return (
    <div>
      <AlgorithmExplanation 
        title={t('algo_benade_title')}
        inputs={currentInputs}
      >
        <p>{t('algo_benade_intro')}</p>
        
        <h3>{t('algo_xiao_how_title')}</h3>
        <ul>
          <li>{t('algo_benade_how_1')}</li>
          <li>{t('algo_benade_how_2')}</li>
          <li>{t('algo_benade_how_3')}</li>
          <li>{t('algo_benade_how_4')}</li>
        </ul>

        <h3>{t('algo_calc_details_title')}</h3>
        <p>{t('algo_benade_calc_intro')}</p>
        <ul>
          <li>{t('algo_benade_calc_1')}</li>
          <li>{t('algo_benade_calc_2')}</li>
          <li>{t('algo_benade_calc_3')}</li>
          <li>{t('algo_benade_calc_4')}</li>
        </ul>
      </AlgorithmExplanation>

      <div className="input-section">
        <h3>{t('input_parameters')}</h3>
        <div className="input-grid">
          <InputGroup label={t('fundamental_length')} hint={t('fundamental_length_hint')}>
            <input
              type="number"
              value={fundamentalLength}
              onChange={(e) => setFundamentalLength(parseFloat(e.target.value))}
              min="100"
              max="1000"
              step="1"
            />
          </InputGroup>
          
          <InputGroup label={t('bore_diameter')} hint={t('bore_diameter_hint')}>
            <input
              type="number"
              value={boreDiameter}
              onChange={(e) => setBoreDiameter(parseFloat(e.target.value))}
              min="10"
              max="50"
              step="0.5"
            />
          </InputGroup>
          
          <InputGroup label={t('hole_diameter')} hint={t('hole_diameter_hint')}>
            <input
              type="number"
              value={holeDiameter}
              onChange={(e) => setHoleDiameter(parseFloat(e.target.value))}
              min="3"
              max="20"
              step="0.5"
            />
          </InputGroup>
          
          <InputGroup label={t('wall_thickness')} hint={t('wall_thickness_hint')}>
            <input
              type="number"
              value={wallThickness}
              onChange={(e) => setWallThickness(parseFloat(e.target.value))}
              min="1"
              max="10"
              step="0.5"
            />
          </InputGroup>
          
          <InputGroup label={t('number_of_holes')}>
            <select 
              value={numHoles} 
              onChange={(e) => setNumHoles(parseInt(e.target.value))}
            >
              <option value="5">{t('holes_5')}</option>
              <option value="6">{t('holes_6')}</option>
              <option value="7">{t('holes_7')}</option>
              <option value="8">{t('holes_8')}</option>
            </select>
          </InputGroup>
        </div>
        
        <button className="calculate-button" onClick={handleCalculate}>
          {t('calculate_positions')}
        </button>
      </div>

      {results && results.length > 0 && (
        <div className="results-section">
          <h3>{t('calculated_positions')}</h3>
          <table>
            <thead>
              <tr>
                <th>{t('table_hole')}</th>
                <th>{t('table_distance_from_edge')}</th>
                <th>{t('table_corrected_position')}</th>
                <th>{t('table_note')}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.hole}>
                  <td>{row.hole}</td>
                  <td>{row.basicPosition.toFixed(2)}</td>
                  <td>{row.correctedPosition.toFixed(2)}</td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BenadePage
