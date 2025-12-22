import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import InputGroup from '../InputGroup/InputGroup'
import { chromaticScale, calculateSemitoneInterval, analyzeFrequencyAccuracy } from '../../utils/calculations'
import { sanitizeNumericInput, parseNumericInput } from '../../utils/inputHelpers'

// Component for frequency input with local display state
function FrequencyInput({ value, onChange }) {
  const roundToHalf = (num) => Math.round(num * 2) / 2
  const [displayValue, setDisplayValue] = useState(roundToHalf(value).toString().replace('.', ','))

  useEffect(() => {
    setDisplayValue(roundToHalf(value).toString().replace('.', ','))
  }, [value])

  return (
    <input
      type="text"
      value={displayValue}
      onChange={(e) => {
        const sanitized = sanitizeNumericInput(e.target.value)
        setDisplayValue(sanitized)
        const parsed = parseNumericInput(sanitized)
        if (!isNaN(parsed)) onChange(parsed)
      }}
      style={{ paddingRight: '35px' }}
      onWheel={(e) => e.target.blur()}
    />
  )
}

// Component for diameter input with local display state
function DiameterInput({ value, onChange }) {
  const [displayValue, setDisplayValue] = useState(value.toString().replace('.', ','))

  useEffect(() => {
    setDisplayValue(value.toString().replace('.', ','))
  }, [value])

  return (
    <input
      type="text"
      value={displayValue}
      onChange={(e) => {
        const sanitized = sanitizeNumericInput(e.target.value)
        setDisplayValue(sanitized)
        const parsed = parseNumericInput(sanitized)
        if (!isNaN(parsed)) onChange(parsed)
      }}
      style={{ paddingRight: '35px' }}
    />
  )
}

function Step3TargetNotes({
  targetNotes,
  maxNotes,
  baseFrequency,
  onUpdateNote,
  onMeasureNote,
  onAddNote,
  onRemoveNote,
  onResetNote,
  onAdjustInterval
}) {
  const { t } = useTranslation()

  // Arrondi à l'unité ou .5 le plus proche
  const roundToHalf = (num) => {
    return Math.round(num * 2) / 2
  }

  return (
    <div className="input-section">
      <h3>{t('step3_title')}</h3>

      {targetNotes.map((note, index) => (
        <div key={note.id} style={{
          marginBottom: '20px',
          padding: '15px',
          background: '#e8dcc8',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            {/* Reset button - Left */}
            <button
              onClick={() => onResetNote(index)}
              disabled={false}
              style={{
                padding: '0',
                fontSize: '0.9em',
                background: '#B85542',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '36px',
                width: '36px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(184, 85, 66, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              title="Reset to default"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </button>

            {/* Title - Center */}
            <h4 style={{ margin: 0 }}>{t('step3_note_label')} {index + 1}</h4>

            {/* Measure button or Measured badge - Right */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', minWidth: '36px', justifyContent: 'flex-end' }}>
              {!note.isMeasured && (index === 0 || targetNotes[index - 1]?.isMeasured) ? (
                <button
                  style={{
                    padding: '0',
                    fontSize: '1.2em',
                    background: 'linear-gradient(135deg, #8b6f47 0%, #6d5738 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '36px',
                    width: '36px',
                    margin: 0,
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => onMeasureNote(index)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 111, 71, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title="Measure note"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/>
                    <path d="m8 6 2-2"/>
                    <path d="m18 16 2-2"/>
                    <path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"/>
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                    <path d="m15 5 4 4"/>
                  </svg>
                </button>
              ) : note.isMeasured ? (
                <button style={{
                  padding: '8px 15px',
                  fontSize: '1.2em',
                  background: '#e8f5e9',
                  color: '#4caf50',
                  border: '2px solid #4caf50',
                  borderRadius: '5px',
                  cursor: 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '36px',
                  width: '36px',
                  margin: 0
                }} disabled>
                  ✓
                </button>
              ) : (
                <div style={{ width: '36px' }}></div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', flex: '1', flexWrap: 'wrap', alignItems: 'flex-start' }}>

              {!note.isMeasured ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <InputGroup label={t('step3_target_frequency')} unit="Hz">
                    <FrequencyInput
                      value={note.frequency}
                      onChange={(val) => onUpdateNote(index, 'frequency', val)}
                    />
                  </InputGroup>
                </div>
              ) : (
                <div style={{ alignSelf: 'center' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.95em', color: '#6d5738', fontWeight: 600, textAlign: 'center' }}>{t('step3_target_frequency')}</label>
                  <div style={{
                    padding: '12px 15px',
                    width: '120px',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    {roundToHalf(note.frequency)}
                  </div>
                </div>
              )}

              {!note.isMeasured ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <InputGroup label={t('step3_hole_diameter')} unit="mm">
                    <DiameterInput
                      value={note.holeDiameter}
                      onChange={(val) => onUpdateNote(index, 'holeDiameter', val)}
                    />
                  </InputGroup>
                </div>
              ) : (
                <div style={{ alignSelf: 'center' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.95em', color: '#6d5738', fontWeight: 600, textAlign: 'center' }}>{t('step3_hole_diameter')}</label>
                  <div style={{
                    padding: '12px 15px',
                    width: '100px',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    {note.holeDiameter}
                  </div>
                </div>
              )}

              {/* Interval display inline */}
              {(() => {
                const refFreq = index === 0 ? baseFrequency : targetNotes[index - 1]?.frequency
                if (!refFreq) return null
                
                const interval = calculateSemitoneInterval(refFreq, note.frequency)
                const accuracy = analyzeFrequencyAccuracy(note.frequency)
                const displayNote = accuracy.isExact ? accuracy.closestNote : `~${accuracy.closestNote}`
                
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="interval-spacer"></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '44px' }}>
                      {!note.isMeasured && (
                        <button
                        onClick={() => onAdjustInterval(index, -1)}
                        style={{
                          padding: '0',
                          background: 'linear-gradient(135deg, #8b6f47 0%, #6d5738 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '28px',
                          width: '28px',
                          fontSize: '1.3em',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 111, 71, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        title={t('step3_decrease_interval')}
                      >
                        −
                      </button>
                    )}
                    <span style={{ fontSize: '1em', color: '#3e2723', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      +{interval.toFixed(2)} {t("step3_tone")} ({displayNote})
                    </span>
                    {!note.isMeasured && (
                      <button
                        onClick={() => onAdjustInterval(index, +1)}
                        style={{
                          padding: '0',
                          background: 'linear-gradient(135deg, #8b6f47 0%, #6d5738 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '28px',
                          width: '28px',
                          fontSize: '1.3em',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 111, 71, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        title={t('step3_increase_interval')}
                      >
                        +
                      </button>
                    )}
                    </div>
                  </div>
                )
              })()}

              {/* Position from base - à droite */}
              <div style={{ marginLeft: 'auto', paddingLeft: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.95em', color: '#6d5738', fontWeight: 600, textAlign: 'center' }}>{t('step3_position_from_base')}</label>
                <div style={{ padding: '12px 15px', fontWeight: 'bold', fontSize: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '44px', background: '#fffcf7', borderRadius: '5px' }}>
                  {note.position ? `${roundToHalf(note.position)} mm` : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
        {targetNotes.length < maxNotes && (
          <button className="calculate-button" onClick={onAddNote}>
            {t('step3_add_note')}
          </button>
        )}
        {targetNotes.length > 3 && (
          <button 
            className="calculate-button" 
            onClick={() => onRemoveNote(targetNotes.length - 1)}
            style={{ background: '#92867cff' }}
          >
            {t('step3_remove_note')}
          </button>
        )}
      </div>

    </div>
  )
}

export default Step3TargetNotes
