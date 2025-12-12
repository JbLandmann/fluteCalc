import { useTranslation } from 'react-i18next'
import InputGroup from '../InputGroup/InputGroup'

function Step2PhysicalMeasurements({ 
  physicalLength, 
  setPhysicalLength,
  innerDiameter, 
  setInnerDiameter,
  temperature, 
  setTemperature,
  note1Frequency, 
  setNote1Frequency,
  note2Frequency, 
  setNote2Frequency,
  onCalculate,
  effectiveLength,
  deltaAverage,
  baseNoteName
}) {
  const { t } = useTranslation()

  return (
    <div className="input-section">
      <h3>{t('step2_title')}</h3>
      <div className="input-grid">
        <InputGroup label={t('step2_lphys')} hint={t('step2_lphys_hint')}>
          <input
            type="number"
            value={physicalLength}
            onChange={(e) => setPhysicalLength(parseFloat(e.target.value))}
            min="100"
            max="1000"
            step="1"
          />
        </InputGroup>
        
        <InputGroup label={t('step2_dinner')} hint={t('step2_dinner_hint')}>
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

        <InputGroup label={t('step2_note1_freq')} hint={t('step2_note1_hint')}>
          <input
            type="number"
            value={note1Frequency}
            onChange={(e) => setNote1Frequency(parseFloat(e.target.value))}
            min="100"
            max="1000"
            step="0.01"
          />
        </InputGroup>

        <InputGroup label={t('step2_note2_freq')} hint={t('step2_note2_hint')}>
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
      
      <button className="calculate-button" onClick={onCalculate}>
        {t('step2_validate')}
      </button>

      {effectiveLength && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '8px' }}>
          <strong>{t('step2_calculated_values')}</strong><br />
          {t('step2_leff')} {effectiveLength.toFixed(2)} mm<br />
          {t('step2_delta')} {deltaAverage?.toFixed(2)} mm<br />
          {t('step2_base_note')} {baseNoteName}
        </div>
      )}
    </div>
  )
}

export default Step2PhysicalMeasurements
