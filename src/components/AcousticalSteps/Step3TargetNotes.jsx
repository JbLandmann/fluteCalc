import { useTranslation } from 'react-i18next'
import InputGroup from '../InputGroup/InputGroup'
import { chromaticScale } from '../../utils/calculations'

function Step3TargetNotes({ 
  targetNotes,
  minNotes,
  maxNotes,
  physicalLength,
  onUpdateNote,
  onMeasureNote,
  onRemoveNote,
  onAddNote,
  onChangeNoteSemitone,
  onResetNote
}) {
  const { t } = useTranslation()

  return (
    <div className="input-section">
      <h3>{t('step3_title')}</h3>
      
      {targetNotes.map((note, index) => (
        <div key={note.id} style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          background: note.isMeasured ? '#e8f5e9' : '#fff8f0',
          borderRadius: '8px',
          border: `2px solid ${note.isMeasured ? '#4caf50' : '#d4b896'}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            {/* Reset button - Left */}
            <button 
              onClick={() => onResetNote(index)}
              disabled={false}
              style={{ 
                padding: '8px 15px',
                fontSize: '0.9em',
                background: '#C44536', 
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
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(196, 69, 54, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              title="Reset to default"
            >
              ↻
            </button>

            {/* Title - Center */}
            <h4 style={{ margin: 0 }}>{t('step3_note_label')} {index + 1}</h4>
            
            {/* Measure button or Measured badge - Right */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', minWidth: '120px', justifyContent: 'flex-end' }}>
              {!note.isMeasured && (index === 0 || targetNotes[index - 1]?.isMeasured) ? (
                <button 
                  className="calculate-button" 
                  style={{ padding: '8px 15px', fontSize: '0.9em', whiteSpace: 'nowrap', margin: 0 }}
                  onClick={() => onMeasureNote(index)}
                >
                  {t('step3_measure_button')}
                </button>
              ) : note.isMeasured ? (
                <div style={{ 
                  padding: '8px 15px',
                  background: '#4caf50',
                  color: 'white',
                  borderRadius: '5px',
                  fontSize: '0.9em',
                  fontWeight: 'bold'
                }}>
                  {t('step3_measured_badge')}
                </div>
              ) : (
                <div style={{ width: '100px' }}></div>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', flex: '1', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* Note selector with +/- */}
              {!note.isMeasured ? (
                <div style={{ alignSelf: 'center' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.95em', color: '#6d5738', fontWeight: 600, textAlign: 'center' }}>{t('step3_note_label')}</label>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <button
                      onClick={() => onChangeNoteSemitone(index, -1)}
                      style={{
                        padding: '12px 15px',
                        background: 'linear-gradient(135deg, #8b6f47 0%, #6d5738 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1em',
                        fontWeight: 'bold'
                      }}
                    >
                      −
                    </button>
                    <div style={{
                      padding: '12px 15px',
                      background: '#f5f5f5',
                      borderRadius: '5px',
                      minWidth: '50px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '1em'
                    }}>
                      {note.noteName}
                    </div>
                    <button
                      onClick={() => onChangeNoteSemitone(index, 1)}
                      style={{
                        padding: '12px 15px',
                        background: 'linear-gradient(135deg, #8b6f47 0%, #6d5738 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1em',
                        fontWeight: 'bold'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ alignSelf: 'center' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.95em', color: '#6d5738', fontWeight: 600, textAlign: 'center' }}>{t('step3_note_label')}</label>
                  <div style={{
                    padding: '12px 15px',
                    minWidth: '50px',
                    fontWeight: 'bold',
                    fontSize: '1em',
                    textAlign: 'center'
                  }}>
                    {note.noteName}
                  </div>
                </div>
              )}

              {!note.isMeasured ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <InputGroup label={t('step3_target_frequency')}>
                    <input
                      type="number"
                      value={note.frequency}
                      onChange={(e) => onUpdateNote(index, 'frequency', parseFloat(e.target.value))}
                      min="100"
                      max="2000"
                      step="0.01"
                      style={{ 
                        width: '120px',
                        MozAppearance: 'textfield'
                      }}
                      onWheel={(e) => e.target.blur()}
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
                    {note.frequency.toFixed(2)}
                  </div>
                </div>
              )}

              {!note.isMeasured ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <InputGroup label={t('step3_hole_diameter')}>
                    <input
                      type="number"
                      value={note.holeDiameter}
                      onChange={(e) => onUpdateNote(index, 'holeDiameter', parseFloat(e.target.value))}
                      min="3"
                      max="15"
                      step="0.5"
                      style={{ width: '100px' }}
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

              {/* Position from base - à droite */}
              <div style={{ marginLeft: 'auto', paddingLeft: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.95em', color: '#6d5738', fontWeight: 600 }}>{t('step3_position_from_base')}</label>
                <div style={{ padding: '12px 15px', fontWeight: 'bold', fontSize: '1em', display: 'flex', alignItems: 'center', minHeight: '44px' }}>
                  {note.position ? `${Math.abs(physicalLength - note.position).toFixed(2)} mm` : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {targetNotes.length < maxNotes && (
        <button className="calculate-button" onClick={onAddNote}>
          {t('step3_add_note')}
        </button>
      )}

      {targetNotes.length > 0 && targetNotes[0].position !== null && (
        <div className="results-section" style={{ marginTop: '30px' }}>
          <h3>{t('step3_results_title')}</h3>
          <table>
            <thead>
              <tr>
                <th>{t('step3_table_note_num')}</th>
                <th>{t('step3_table_note_name')}</th>
                <th>{t('step3_table_target_freq')}</th>
                <th>{t('step3_table_hole_diam')}</th>
                <th>{t('step3_table_position')}</th>
                <th>{t('step3_table_status')}</th>
              </tr>
            </thead>
            <tbody>
              {targetNotes.map((note, index) => (
                <tr key={note.id}>
                  <td>{index + 1}</td>
                  <td><strong>{note.noteName}</strong></td>
                  <td>{note.frequency.toFixed(2)}</td>
                  <td>{note.holeDiameter}</td>
                  <td>{note.position ? Math.abs(physicalLength - note.position).toFixed(2) : '—'}</td>
                  <td>{note.isMeasured ? t('step3_status_measured') : t('step3_status_calculated')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Step3TargetNotes
