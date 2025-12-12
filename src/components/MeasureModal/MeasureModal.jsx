import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './MeasureModal.css'

function MeasureModal({ isOpen, onClose, onConfirm, initialFrequency, initialDiameter }) {
  const { t } = useTranslation()
  const [frequency, setFrequency] = useState(initialFrequency || '')
  const [diameter, setDiameter] = useState(initialDiameter || '')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (frequency && diameter) {
      onConfirm(parseFloat(frequency), parseFloat(diameter))
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
        
        <div className="modal-input-group">
          <label>{t('measure_modal_frequency')}</label>
          <input
            type="number"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            min="100"
            max="2000"
            step="0.01"
            placeholder="Enter frequency"
            autoFocus
          />
        </div>

        <div className="modal-input-group">
          <label>{t('measure_modal_diameter')}</label>
          <input
            type="number"
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
            min="3"
            max="15"
            step="0.5"
            placeholder="Enter diameter"
          />
        </div>

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
