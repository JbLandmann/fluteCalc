import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import AlgorithmExplanation from '../components/AlgorithmExplanation/AlgorithmExplanation'
import InputGroup from '../components/InputGroup/InputGroup'
import FluteVisualizationModal from '../components/FluteVisualizationModal/FluteVisualizationModal'
import { 
  getNoteName, 
  calculateHolePositions, 
  isSpecialHolePair 
} from '../utils/calculations'
import { xiaoModels, getModelsByHoles, modelDescriptions } from '../utils/models'

function XiaoPage() {
  const { t } = useTranslation()
  
  // Input states
  const [baseFrequency, setBaseFrequency] = useState(440)
  const [diameter, setDiameter] = useState(19)
  const [temperature, setTemperature] = useState(20)
  const [numHoles, setNumHoles] = useState(6)
  const [selectedModel, setSelectedModel] = useState('')
  
  // Results states
  const [results, setResults] = useState(null)
  const [hasOverlapWarning, setHasOverlapWarning] = useState(false)
  const [showVisualization, setShowVisualization] = useState(false)
  const [fluteData, setFluteData] = useState(null)

  // Get available models for current hole count
  const availableModels = getModelsByHoles(numHoles)

  // Handle hole count change
  const handleHoleCountChange = (e) => {
    const newHoles = parseInt(e.target.value)
    setNumHoles(newHoles)
    setSelectedModel('')
    setResults(null)
  }

  // Handle model selection
  const handleModelChange = (e) => {
    const modelKey = e.target.value
    setSelectedModel(modelKey)
    
    if (modelKey) {
      calculateWithModel(xiaoModels[modelKey])
    } else {
      setResults(null)
    }
  }

  // Calculate positions with model
  const calculateWithModel = useCallback((model) => {
    const { positions, frequencies } = calculateHolePositions(
      model, 
      baseFrequency, 
      diameter, 
      temperature
    )
    
    let hasOverlap = false
    const numHolesModel = model.intervals.length
    
    const tableResults = model.intervals.map((semitone, i) => {
      const position = positions[i]
      const frequency = frequencies[i]
      const note = getNoteName(frequency)
      
      let distance = null
      let warning = null
      
      if (i < numHolesModel - 1) {
        distance = Math.abs(positions[i] - positions[i + 1])
        const shouldCheckOverlap = !isSpecialHolePair(i, numHolesModel)
        
        if (shouldCheckOverlap) {
          if (distance < 10) {
            warning = 'limit'
            hasOverlap = true
          } else if (distance < 15) {
            warning = 'difficult'
          }
        }
      }
      
      return {
        hole: i + 1,
        position,
        distance,
        semitone,
        note,
        frequency,
        warning
      }
    })
    
    setResults(tableResults)
    setHasOverlapWarning(hasOverlap)
    setFluteData({
      positions,
      numHoles: numHolesModel,
      diameter
    })
  }, [baseFrequency, diameter, temperature])

  // Recalculate when inputs change if model is selected
  const handleInputChange = useCallback(() => {
    if (selectedModel && xiaoModels[selectedModel]) {
      calculateWithModel(xiaoModels[selectedModel])
    }
  }, [selectedModel, calculateWithModel])

  // Input handlers with recalculation
  const handleFrequencyChange = (e) => {
    setBaseFrequency(parseFloat(e.target.value))
    setTimeout(handleInputChange, 0)
  }

  const handleDiameterChange = (e) => {
    setDiameter(parseFloat(e.target.value))
    setTimeout(handleInputChange, 0)
  }

  const handleTemperatureChange = (e) => {
    setTemperature(parseFloat(e.target.value))
    setTimeout(handleInputChange, 0)
  }

  // Current inputs display for algorithm explanation
  const currentInputs = (
    <>
      <strong>{t('algo_current_inputs')}</strong><br />
      {t('algo_base_frequency')} {baseFrequency} Hz<br />
      {t('algo_inner_diameter')} {diameter} mm<br />
      {t('algo_temperature')} {temperature} °C<br />
      {t('algo_number_of_holes')} {numHoles}
    </>
  )

  return (
    <div>
      <AlgorithmExplanation 
        title={t('algo_xiao_title')}
        inputs={currentInputs}
      >
        <p>{t('algo_xiao_intro')}</p>
        
        <h3>{t('algo_xiao_how_title')}</h3>
        <ul>
          <li>{t('algo_xiao_how_1')}</li>
          <li>{t('algo_xiao_how_2')}</li>
          <li>{t('algo_xiao_how_3')}</li>
          <li>{t('algo_xiao_how_4')}</li>
          <li>{t('algo_xiao_how_5')}</li>
        </ul>

        <h3>{t('algo_calc_details_title')}</h3>
        <p>{t('algo_calc_details_intro')}</p>
        <ul>
          <li>{t('algo_xiao_calc_1')}</li>
          <li>{t('algo_xiao_calc_2')}</li>
          <li>{t('algo_xiao_calc_3')}</li>
          <li>{t('algo_xiao_calc_4')}</li>
        </ul>

        <h3>{t('algo_xiao_intervals_title')}</h3>
        <ul>
          <li>{t('algo_xiao_interval_1')}</li>
          <li>{t('algo_xiao_interval_2')}</li>
          <li>{t('algo_xiao_interval_3')}</li>
          <li>{t('algo_xiao_interval_4')}</li>
          <li>{t('algo_xiao_interval_5')}</li>
        </ul>

        <div className="empirical-warning">
          <h3>{t('algo_empirical_title')}</h3>
          <p>{t('algo_empirical_intro')}</p>
          <ul>
            <li>{t('algo_empirical_1')}</li>
            <li>{t('algo_empirical_2')}</li>
            <li>{t('algo_empirical_3')}</li>
            <li>{t('algo_empirical_4')}</li>
          </ul>
        </div>
      </AlgorithmExplanation>

      <div className="input-section">
        <h3>{t('input_parameters')}</h3>
        <div className="input-grid input-grid-three-cols">
          <InputGroup label={t('base_frequency')} hint={t('base_frequency_hint')}>
            <input
              type="number"
              value={baseFrequency}
              onChange={handleFrequencyChange}
              min="100"
              max="1000"
              step="1"
            />
          </InputGroup>
          
          <InputGroup label={t('inner_diameter')} hint={t('inner_diameter_hint')}>
            <input
              type="number"
              value={diameter}
              onChange={handleDiameterChange}
              min="10"
              max="50"
              step="0.5"
            />
          </InputGroup>
          
          <InputGroup label={t('temperature')} hint={t('temperature_hint')}>
            <input
              type="number"
              value={temperature}
              onChange={handleTemperatureChange}
              min="-10"
              max="40"
              step="1"
            />
          </InputGroup>
        </div>
      </div>

      <div className="input-section">
        <h3>{t(`select_model_${numHoles}`)}</h3>
        <div className="input-grid input-grid-model-selection">
          <InputGroup label={t('number_of_holes')}>
            <select value={numHoles} onChange={handleHoleCountChange}>
              <option value="4">{t('holes_4')}</option>
              <option value="5">{t('holes_5')}</option>
              <option value="6">{t('holes_6')}</option>
              <option value="7">{t('holes_7')}</option>
              <option value="8">{t('holes_8')}</option>
            </select>
          </InputGroup>
          
          <InputGroup label={t('choose_model')}>
            <select value={selectedModel} onChange={handleModelChange}>
              <option value="">{t('select_model_placeholder')}</option>
              {availableModels.map((model) => (
                <option key={model.key} value={model.key}>
                  {model.name}
                </option>
              ))}
            </select>
          </InputGroup>
        </div>

        {selectedModel && modelDescriptions[selectedModel] && (
          <div className="model-description">
            {modelDescriptions[selectedModel]}
          </div>
        )}
      </div>

      {results && results.length > 0 && (
        <div className="results-section">
          <h3>{t('calculated_positions')}</h3>
          <button 
            className="visualization-button" 
            onClick={() => setShowVisualization(true)}
          >
            {t('visualize_flute')}
          </button>
          
          <table>
            <thead>
              <tr>
                <th>{t('table_hole')}</th>
                <th>{t('table_distance_from_edge')}</th>
                <th>{t('table_distance_to_next')}</th>
                <th>{t('table_interval')}</th>
                <th>{t('table_note')}</th>
                <th>{t('table_frequency')}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.hole}>
                  <td>{row.hole}</td>
                  <td>{row.position.toFixed(2)}</td>
                  <td>{row.distance !== null ? row.distance.toFixed(2) : '—'}</td>
                  <td>+{row.semitone} demi-tons</td>
                  <td>
                    {row.note}
                    {row.warning === 'limit' && (
                      <span className="warning-indicator warning-limit">
                        {t('overlap_warning')}
                      </span>
                    )}
                    {row.warning === 'difficult' && (
                      <span className="warning-indicator warning-difficult">
                        {t('close_holes_warning')}
                      </span>
                    )}
                  </td>
                  <td>{row.frequency.toFixed(2)}</td>
                </tr>
              ))}
              {hasOverlapWarning && (
                <tr>
                  <td 
                    colSpan="6" 
                    style={{ 
                      background: '#fff3cd', 
                      color: '#856404', 
                      fontWeight: 'bold', 
                      padding: '15px' 
                    }}
                  >
                    {t('empirical_warning')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <FluteVisualizationModal
        isOpen={showVisualization}
        onClose={() => setShowVisualization(false)}
        fluteData={fluteData}
      />
    </div>
  )
}

export default XiaoPage
