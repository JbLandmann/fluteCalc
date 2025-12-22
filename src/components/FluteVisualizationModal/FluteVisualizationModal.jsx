import { useEffect } from 'react'
import { FluteSVG } from '../../utils/fluteDrawing'

function FluteVisualizationModal({ isOpen, onClose, fluteData }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !fluteData) {
    return null
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className={`modal-backdrop ${isOpen ? 'active' : ''}`} 
      onClick={handleBackdropClick}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <FluteSVG fluteData={fluteData} />
      </div>
    </div>
  )
}

export default FluteVisualizationModal
