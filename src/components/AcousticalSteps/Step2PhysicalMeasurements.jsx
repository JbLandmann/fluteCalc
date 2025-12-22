import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import InputGroup from '../InputGroup/InputGroup'
import { sanitizeNumericInput, parseNumericInput } from '../../utils/inputHelpers'

// Composant icône info (juste le bouton)
function InfoIcon({ onToggle }) {
  return (
    <div 
      style={{
        position: 'absolute',
        right: '0',
        top: '0',
        cursor: 'pointer',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: '2px solid #6d5738',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#6d5738',
        background: '#fff',
        zIndex: 10
      }}
      onClick={onToggle}
    >
      i
    </div>
  )
}

// Composant tooltip séparé
function Tooltip({ imageKey, isVisible }) {
  const { t } = useTranslation()
  
  if (!isVisible) return null
  
  // Mapping des clés vers les noms de fichiers
  const imageFiles = {
    'lphys': 'guide_longueur.png',
    'dinner': 'guide_diametre.png',
    'wall': 'guide_paroi.png',
    'freq': 'guide_frequence.png'
  }
  
  return (
    <div style={{
      position: 'absolute',
      top: '110px',
      left: '0',
      right: '0',
      height: '180px',
      background: '#f5e6d3',

      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
      pointerEvents: 'none',
      padding: '0',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <img
        src={`${import.meta.env.BASE_URL}${imageFiles[imageKey]}`}
        alt={t(`step2_${imageKey}_img_alt`)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '6px'
        }}
      />
    </div>
  )
}

function Step2PhysicalMeasurements({ 
  physicalLength, 
  setPhysicalLength,
  innerDiameter, 
  setInnerDiameter,
  wallThickness,
  setWallThickness,
  temperature, 
  setTemperature,
  note1Frequency, 
  setNote1Frequency,
  effectiveLength,
  deltaAverage,
  baseNoteName,
  validationError
}) {
  const { t } = useTranslation()
  const [activeTooltip, setActiveTooltip] = useState(null)

  // Local display states for inputs (strings with comma)
  const [displayLphys, setDisplayLphys] = useState(physicalLength.toString().replace('.', ','))
  const [displayDinner, setDisplayDinner] = useState(innerDiameter.toString().replace('.', ','))
  const [displayWall, setDisplayWall] = useState(wallThickness.toString().replace('.', ','))
  const [displayTemp, setDisplayTemp] = useState(temperature.toString().replace('.', ','))
  const [displayFreq, setDisplayFreq] = useState(note1Frequency.toString().replace('.', ','))

  // Sync display with prop changes (when parent updates)
  useEffect(() => {
    setDisplayLphys(physicalLength.toString().replace('.', ','))
  }, [physicalLength])
  
  useEffect(() => {
    setDisplayDinner(innerDiameter.toString().replace('.', ','))
  }, [innerDiameter])
  
  useEffect(() => {
    setDisplayWall(wallThickness.toString().replace('.', ','))
  }, [wallThickness])
  
  useEffect(() => {
    setDisplayTemp(temperature.toString().replace('.', ','))
  }, [temperature])
  
  useEffect(() => {
    setDisplayFreq(note1Frequency.toString().replace('.', ','))
  }, [note1Frequency])

  const toggleTooltip = (key) => {
    if (typeof key === 'boolean') {
      // Hover: key = true/false
      setActiveTooltip(key ? activeTooltip : null)
    } else {
      // Click: toggle
      setActiveTooltip(prev => prev === key ? null : key)
    }
  }

  // Arrondi à l'unité ou .5 le plus proche
  const roundToHalf = (num) => {
    return Math.round(num * 2) / 2
  }

  // Vérifier si la note est à +/- 10 cents de la fréquence en 440
  const analyzeFrequencyAccuracy = (frequency) => {
    const A4 = 440
    const C0 = A4 * Math.pow(2, -4.75)
    const actualSemitones = 12 * Math.log2(frequency / C0)
    const targetSemitones = Math.round(actualSemitones)
    const centsDiff = (actualSemitones - targetSemitones) * 100
    return Math.abs(centsDiff) > 10
  }

  const displayBaseNote = (analyzeFrequencyAccuracy(note1Frequency) ? '~' : '') + baseNoteName

  return (
    <div className="input-section">
      <h3>{t('step2_title')}</h3>
      <div className="input-grid">
        <div style={{ position: 'relative' }}>
          <InputGroup label={t('step2_lphys')} hint={t('step2_lphys_hint')} unit="mm">
            <input
              type="text"
              value={displayLphys}
              onChange={(e) => {
                const sanitized = sanitizeNumericInput(e.target.value)
                setDisplayLphys(sanitized)
                const parsed = parseNumericInput(sanitized)
                if (!isNaN(parsed)) setPhysicalLength(parsed)
              }}
              style={{ paddingRight: '35px' }}
            />
          </InputGroup>
          <InfoIcon onToggle={() => toggleTooltip('lphys')} />
          <Tooltip imageKey="lphys" isVisible={activeTooltip === 'lphys'} />
        </div>
        
        <div style={{ position: 'relative' }}>
          <InputGroup label={t('step2_dinner')} hint={t('step2_dinner_hint')} unit="mm">
            <input
              type="text"
              value={displayDinner}
              onChange={(e) => {
                const sanitized = sanitizeNumericInput(e.target.value)
                setDisplayDinner(sanitized)
                const parsed = parseNumericInput(sanitized)
                if (!isNaN(parsed)) setInnerDiameter(parsed)
              }}
              style={{ paddingRight: '35px' }}
            />
          </InputGroup>
          <InfoIcon onToggle={() => toggleTooltip('dinner')} />
          <Tooltip imageKey="dinner" isVisible={activeTooltip === 'dinner'} />
        </div>
        
        <div style={{ position: 'relative' }}>
          <InputGroup label={t('step2_wall_thickness')} hint={t('step2_wall_thickness_hint')} unit="mm">
            <input
              type="text"
              value={displayWall}
              onChange={(e) => {
                const sanitized = sanitizeNumericInput(e.target.value)
                setDisplayWall(sanitized)
                const parsed = parseNumericInput(sanitized)
                if (!isNaN(parsed)) setWallThickness(parsed)
              }}
              style={{ paddingRight: '35px' }}
            />
          </InputGroup>
          <InfoIcon onToggle={() => toggleTooltip('wall')} />
          <Tooltip imageKey="wall" isVisible={activeTooltip === 'wall'} />
        </div>
        
        <div>
          <InputGroup label={t('temperature')} hint={t('temperature_hint')} unit="°C">
            <input
              type="text"
              value={displayTemp}
              onChange={(e) => {
                const sanitized = sanitizeNumericInput(e.target.value)
                setDisplayTemp(sanitized)
                const parsed = parseNumericInput(sanitized)
                if (!isNaN(parsed)) setTemperature(parsed)
              }}
              style={{ paddingRight: '35px' }}
            />
          </InputGroup>
        </div>

        <div style={{ position: 'relative' }}>
          <InputGroup label={t('step2_note1_freq')} hint={t('step2_note1_hint')} unit="Hz">
            <input
              type="text"
              value={displayFreq}
              onChange={(e) => {
                const sanitized = sanitizeNumericInput(e.target.value)
                setDisplayFreq(sanitized)
                const parsed = parseNumericInput(sanitized)
                if (!isNaN(parsed)) setNote1Frequency(parsed)
              }}
              style={{ paddingRight: '35px' }}
            />
          </InputGroup>
          <InfoIcon onToggle={() => toggleTooltip('freq')} />
          <Tooltip imageKey="freq" isVisible={activeTooltip === 'freq'} />
        </div>
      </div>

      {effectiveLength > 0 && (
        <>
          <div style={{ marginTop: '20px', padding: '15px', background: '#e8dcc8', borderRadius: '8px' }}>
            <strong>{t('step2_calculated_values')}</strong><br />
            {t('step2_leff')} {roundToHalf(effectiveLength)} mm<br />
            {t('step2_delta')} {deltaAverage ? roundToHalf(deltaAverage) : '—'} mm<br />
            <em>{t('step2_base_note')}</em> <strong>{displayBaseNote}</strong>
          </div>
          
          {validationError && (
            <div style={{
              marginTop: '15px',
              padding: '15px',
              background: 'rgba(184, 85, 66, 0.2)',
              border: '2px solid #B85542',
              borderRadius: '8px',
              color: '#5d4a37'
            }}>
              <strong style={{ color: '#B85542' }}>{t('step2_error_title')}</strong><br />
              {t('step2_error_invalid_positions')}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Step2PhysicalMeasurements
