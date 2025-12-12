import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AlgorithmExplanation from '../components/AlgorithmExplanation/AlgorithmExplanation'
import Step1CalculationMethod from '../components/AcousticalSteps/Step1CalculationMethod'
import Step2PhysicalMeasurements from '../components/AcousticalSteps/Step2PhysicalMeasurements'
import Step3TargetNotes from '../components/AcousticalSteps/Step3TargetNotes'
import MeasureModal from '../components/MeasureModal/MeasureModal'
import { 
  calculateEffectiveLength, 
  calculateDeltaFromTwoNotes, 
  calculateHolePosition,
  recalculatePositionsAfterMeasurement,
  shiftFollowingNotes,
  generateTargetNotes,
  getClosestNote,
  calculateFrequencyFromNote,
  chromaticScale
} from '../utils/calculations'

function AcousticalPage() {
  const { t } = useTranslation()
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentMeasureIndex, setCurrentMeasureIndex] = useState(null)
  
  // Step 1: Calculation method selection
  const [calculationMethod, setCalculationMethod] = useState('half-wave') // 'half-wave' or 'quarter-wave'
  
  // Step 2: Physical measurements
  const [physicalLength, setPhysicalLength] = useState(400) // Lphys
  const [innerDiameter, setInnerDiameter] = useState(19) // Dinner
  const [temperature, setTemperature] = useState(20)
  const [note1Frequency, setNote1Frequency] = useState(293.66) // Normal breath
  const [note2Frequency, setNote2Frequency] = useState(0) // Strong breath (optional)
  
  // Calculated values from Step 2
  const [effectiveLength, setEffectiveLength] = useState(null) // Leff
  const [deltaAverage, setDeltaAverage] = useState(null) // Delta
  
  // Step 3: Target notes (5 notes minimum, generated from base frequency)
  const [targetNotes, setTargetNotes] = useState(generateTargetNotes(293.66, 5))
  
  const minNotes = 5
  const maxNotes = calculationMethod === 'half-wave' ? 10 : 7

  // Regenerate target notes when base frequency changes
  useEffect(() => {
    setTargetNotes(generateTargetNotes(note1Frequency, targetNotes.length))
  }, [note1Frequency])

  // Calculate Step 2 values
  const handleCalculateStep2 = () => {
    const leff = calculateEffectiveLength(
      note1Frequency, 
      temperature, 
      calculationMethod
    )
    setEffectiveLength(leff)
    
    // Calculate Delta
    let delta
    if (note2Frequency > 0) {
      // Si note2 renseignée, calculer Delta moyen
      delta = calculateDeltaFromTwoNotes(
        note1Frequency,
        note2Frequency,
        temperature,
        calculationMethod
      )
    } else {
      // Sinon Delta par défaut selon la méthode
      delta = calculationMethod === 'half-wave' 
        ? 0.6 * (innerDiameter / 2) // ~0.6-1.2 × radius
        : 1.0 * (innerDiameter / 2) // TSH correction
    }
    setDeltaAverage(delta)
    
    // Recalculate all target note positions
    recalculateAllPositions(delta, leff)
  }

  // Recalculate all target note positions
  const recalculateAllPositions = (delta, leff) => {
    const updated = targetNotes.map((note, index) => {
      if (!note.isMeasured) {
        const position = calculateHolePosition(
          note.frequency,
          note.holeDiameter,
          innerDiameter,
          temperature,
          calculationMethod,
          delta,
          leff
        )
        
        // Apply shift based on previous holes
        const shifted = shiftFollowingNotes(position, index, targetNotes)
        
        return { ...note, position: shifted }
      }
      return note
    })
    setTargetNotes(updated)
  }

  // Add new target note
  const addTargetNote = () => {
    if (targetNotes.length < maxNotes) {
      const newNotes = generateTargetNotes(note1Frequency, targetNotes.length + 1)
      setTargetNotes(newNotes)
    }
  }

  // Update target note
  const updateTargetNote = (index, field, value) => {
    const updated = [...targetNotes]
    updated[index][field] = value
    setTargetNotes(updated)
    
    // Recalculate position if we have delta
    if (deltaAverage && effectiveLength && (field === 'frequency' || field === 'holeDiameter')) {
      recalculateAllPositions(deltaAverage, effectiveLength)
    }
  }

  // Add measured note (gain precision)
  const addMeasuredNote = (index) => {
    setCurrentMeasureIndex(index)
    setIsModalOpen(true)
  }

  const handleMeasureConfirm = (freq, diam) => {
    if (currentMeasureIndex !== null) {
      // Calculate new Delta from measurement
      const newDelta = calculateDeltaFromTwoNotes(
        note1Frequency,
        freq,
        temperature,
        calculationMethod
      )
      setDeltaAverage(newDelta)
      
      // Mark this note as measured
      const updated = [...targetNotes]
      updated[currentMeasureIndex].isMeasured = true
      updated[currentMeasureIndex].frequency = freq
      updated[currentMeasureIndex].holeDiameter = diam
      setTargetNotes(updated)
      
      // Recalculate all following positions with new Delta
      recalculatePositionsAfterMeasurement(currentMeasureIndex, updated, newDelta, effectiveLength, innerDiameter, temperature, calculationMethod)
      
      setCurrentMeasureIndex(null)
    }
  }

  // Remove target note
  const removeTargetNote = (index) => {
    const updated = targetNotes.filter((_, i) => i !== index)
    setTargetNotes(updated)
  }

  // Change note by semitone (+1 or -1)
  const changeNoteSemitone = (index, direction) => {
    const updated = [...targetNotes]
    const currentNote = updated[index]
    
    // Find current note index in chromatic scale
    const currentNoteIndex = chromaticScale.indexOf(currentNote.noteName)
    
    // Calculate new note index (wraps around)
    let newNoteIndex = (currentNoteIndex + direction + 12) % 12
    const newNoteName = chromaticScale[newNoteIndex]
    
    // Calculate new frequency (base frequency + semitone offset)
    const baseNote = getClosestNote(note1Frequency)
    const currentOffset = index + 1 // Original offset from base
    const newOffset = currentOffset + direction
    const newFrequency = calculateFrequencyFromNote(note1Frequency, newOffset)
    
    // Update note
    updated[index] = {
      ...currentNote,
      noteName: newNoteName,
      frequency: parseFloat(newFrequency.toFixed(2))
    }
    setTargetNotes(updated)
    
    // Recalculate position if we have delta
    if (deltaAverage && effectiveLength) {
      recalculateAllPositions(deltaAverage, effectiveLength)
    }
  }

  // Reset note to default (5mm diameter, +1 semitone from previous)
  const resetNote = (index) => {
    const updated = [...targetNotes]
    const baseNote = getClosestNote(note1Frequency)
    
    // Calculate default values: +1 semitone per note from base
    const semitoneOffset = index + 1
    const nextNoteIndex = (baseNote.index + semitoneOffset) % 12
    const defaultNoteName = chromaticScale[nextNoteIndex]
    const defaultFrequency = calculateFrequencyFromNote(note1Frequency, semitoneOffset)
    
    // Reset note to defaults
    updated[index] = {
      ...updated[index],
      noteName: defaultNoteName,
      frequency: parseFloat(defaultFrequency.toFixed(2)),
      holeDiameter: 5,
      isMeasured: false
    }
    setTargetNotes(updated)
    
    // Recalculate position if we have delta
    if (deltaAverage && effectiveLength) {
      recalculateAllPositions(deltaAverage, effectiveLength)
    }
  }

  // Current inputs display for algorithm explanation
  const currentInputs = effectiveLength ? (
    <>
      <strong>{t('algo_current_inputs')}</strong><br />
      Lphys: {physicalLength} mm<br />
      Leff: {effectiveLength.toFixed(2)} mm<br />
      Delta: {deltaAverage?.toFixed(2)} mm<br />
      {t('algo_inner_diameter')} {innerDiameter} mm<br />
      {t('algo_temperature')} {temperature} °C
    </>
  ) : null

  return (
    <div>
      <AlgorithmExplanation 
        title={t('algo_acoustical_title')}
        inputs={currentInputs}
      >
        <p>{t('algo_acoustical_intro')}</p>
        
        <h3>{t('algo_xiao_how_title')}</h3>
        <ul>
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_how_1') }} />
          <li>{t('algo_acoustical_how_2')}</li>
          <li>{t('algo_acoustical_how_3')}</li>
          <li>{t('algo_acoustical_how_4')}</li>
        </ul>

        <h3>{t('algo_calc_details_title')}</h3>
        <p>{t('algo_calc_details_intro')}</p>
        <ul>
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_calc_1') }} />
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_calc_2') }} />
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_calc_3') }} />
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_calc_4') }} />
        </ul>
      </AlgorithmExplanation>

      {/* STEP 1: Calculation Method */}
      <Step1CalculationMethod 
        calculationMethod={calculationMethod}
        onMethodChange={setCalculationMethod}
      />

      {/* STEP 2: Physical Measurements */}
      <Step2PhysicalMeasurements 
        physicalLength={physicalLength}
        setPhysicalLength={setPhysicalLength}
        innerDiameter={innerDiameter}
        setInnerDiameter={setInnerDiameter}
        temperature={temperature}
        setTemperature={setTemperature}
        note1Frequency={note1Frequency}
        setNote1Frequency={setNote1Frequency}
        note2Frequency={note2Frequency}
        setNote2Frequency={setNote2Frequency}
        onCalculate={handleCalculateStep2}
        effectiveLength={effectiveLength}
        deltaAverage={deltaAverage}
        baseNoteName={getClosestNote(note1Frequency).name}
      />

      {/* STEP 3: Target Notes */}
      {effectiveLength && deltaAverage && (
        <Step3TargetNotes 
          targetNotes={targetNotes}
          minNotes={minNotes}
          maxNotes={maxNotes}
          physicalLength={physicalLength}
          onUpdateNote={updateTargetNote}
          onMeasureNote={addMeasuredNote}
          onRemoveNote={removeTargetNote}
          onAddNote={addTargetNote}
          onChangeNoteSemitone={changeNoteSemitone}
          onResetNote={resetNote}
        />
      )}

      {/* Measure Modal */}
      <MeasureModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setCurrentMeasureIndex(null)
        }}
        onConfirm={handleMeasureConfirm}
        initialFrequency={currentMeasureIndex !== null ? targetNotes[currentMeasureIndex]?.frequency : ''}
        initialDiameter={currentMeasureIndex !== null ? targetNotes[currentMeasureIndex]?.holeDiameter : ''}
      />
    </div>
  )
}

export default AcousticalPage
