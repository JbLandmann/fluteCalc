import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import InputGroup from '../InputGroup/InputGroup'
import './MeasureModal.css'
import { sanitizeNumericInput, parseNumericInput } from '../../utils/inputHelpers'

function MeasureModal({ isOpen, onClose, onConfirm, initialFrequency, initialDiameter, targetFrequency, targetDiameter }) {
  const { t } = useTranslation()
  const [frequency, setFrequency] = useState('')
  const [diameter, setDiameter] = useState('')
  const [displayFrequency, setDisplayFrequency] = useState('')
  const [displayDiameter, setDisplayDiameter] = useState('')

  // Update fields when modal opens with new values
  useEffect(() => {
    if (isOpen) {
      const freq = targetFrequency || initialFrequency || ''
      const diam = targetDiameter || initialDiameter || ''
      setFrequency(freq)
      setDiameter(diam)
      setDisplayFrequency(freq.toString().replace('.', ','))
      setDisplayDiameter(diam.toString().replace('.', ','))
    }
  }, [isOpen, targetFrequency, initialFrequency, targetDiameter, initialDiameter])

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!isNaN(frequency) && !isNaN(diameter) && frequency && diameter) {
      onConfirm(frequency, diameter)
      onClose()
    }
  }

  const handleCancel = () => {
    setFrequency(initialFrequency || '')
    setDiameter(initialDiameter || '')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{t('measure_modal_title')}</h3>
        
        <InputGroup label={t('measure_modal_frequency')} unit="Hz">
          <input
            type="text"
            value={displayFrequency}
            onChange={(e) => {
              const sanitized = sanitizeNumericInput(e.target.value)
              setDisplayFrequency(sanitized)
              const parsed = parseNumericInput(sanitized)
              if (!isNaN(parsed)) setFrequency(parsed)
            }}
            placeholder="Enter frequency"
            autoFocus
            style={{ paddingRight: '35px' }}
          />
        </InputGroup>

        <InputGroup label={t('measure_modal_diameter')} unit="mm">
          <input
            type="text"
            value={displayDiameter}
            onChange={(e) => {
              const sanitized = sanitizeNumericInput(e.target.value)
              setDisplayDiameter(sanitized)
              const parsed = parseNumericInput(sanitized)
              if (!isNaN(parsed)) setDiameter(parsed)
            }}
            placeholder="Enter diameter"
            style={{ paddingRight: '35px' }}
          />
        </InputGroup>

        <div className="modal-buttons">
          <button className="modal-button cancel" onClick={handleCancel}>
            {t('measure_modal_cancel')}
          </button>
          <button className="modal-button confirm" onClick={handleConfirm}>
            {t('measure_modal_validate')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MeasureModal
