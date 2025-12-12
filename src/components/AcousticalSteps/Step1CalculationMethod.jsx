import { useTranslation } from 'react-i18next'
import InputGroup from '../InputGroup/InputGroup'

function Step1CalculationMethod({ calculationMethod, onMethodChange }) {
  const { t } = useTranslation()

  return (
    <div className="input-section">
      <h3>{t('step1_title')}</h3>
      <div className="input-grid">
        <InputGroup label={t('step1_method_label')}>
          <select 
            value={calculationMethod} 
            onChange={(e) => onMethodChange(e.target.value)}
          >
            <option value="half-wave">{t('step1_half_wave')}</option>
            <option value="quarter-wave">{t('step1_quarter_wave')}</option>
          </select>
        </InputGroup>
      </div>
      {calculationMethod === 'half-wave' && (
        <div className="input-hint">
          {t('step1_half_wave_hint')}<br />
          {t('step1_half_wave_delta')}
        </div>
      )}
      {calculationMethod === 'quarter-wave' && (
        <div className="input-hint">
          {t('step1_quarter_wave_hint')}<br />
          {t('step1_quarter_wave_delta')}
        </div>
      )}
    </div>
  )
}

export default Step1CalculationMethod
