import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import AlgorithmExplanation from '../components/AlgorithmExplanation/AlgorithmExplanation'
import Step1CalculationMethod from '../components/AcousticalSteps/Step1CalculationMethod'
import Step2PhysicalMeasurements from '../components/AcousticalSteps/Step2PhysicalMeasurements'
import Step3TargetNotes from '../components/AcousticalSteps/Step3TargetNotes'
import MeasureModal from '../components/MeasureModal/MeasureModal'
import { 
  calculateEffectiveLength, 
  calculateHolePosition,
  shiftFollowingNotes,
  generateTargetNotes,
  getClosestNote,
  calculateFrequencyFromNote,
  calculateSemitoneInterval,
  analyzeFrequencyAccuracy,
  validateStep2Parameters,
  chromaticScale,
  calculateSpeedOfSound
} from '../utils/calculations'

function AcousticalPage() {
  const { t } = useTranslation()
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentMeasureIndex, setCurrentMeasureIndex] = useState(null)
  
  // Step 1: Calculation method selection
  const [calculationMethod, setCalculationMethod] = useState('half-wave') // 'half-wave' or 'quarter-wave'
  
  // Step 2: Physical measurements
  const [physicalLength, setPhysicalLength] = useState(450) // Lphys - typical bamboo flute length
  const [innerDiameter, setInnerDiameter] = useState(20) // Dinner - common bore diameter
  const [wallThickness, setWallThickness] = useState(3) // Wall thickness (mm) - bamboo average
  const [temperature, setTemperature] = useState(20) // Standard room temperature
  const [note1Frequency, setNote1Frequency] = useState(392.00) // G4 - matches 450mm flute
  
  // Step 3: Target notes (structure de base: notes, frequences, diametres)
  const [targetNotesBase, setTargetNotesBase] = useState(generateTargetNotes(392.00, 5))
  
  const minNotes = 5
  const maxNotes = calculationMethod === 'half-wave' ? 10 : 7

  // Regenerer les notes de base quand la frequence change
  useEffect(() => {
    setTargetNotesBase(generateTargetNotes(note1Frequency, targetNotesBase.length))
  }, [note1Frequency])

  // Calculer effectiveLength automatiquement
  const effectiveLength = useMemo(() => {
    return calculateEffectiveLength(note1Frequency, temperature, calculationMethod)
  }, [note1Frequency, temperature, calculationMethod])

  // Calculer deltaAverage automatiquement depuis les mesures physiques
  // Delta = Lphys - Leff (correction de bout réelle basée sur les mesures)
  const deltaAverage = useMemo(() => {
    if (!effectiveLength) return 0
    return physicalLength - effectiveLength
  }, [physicalLength, effectiveLength])

  // Calculer les positions des notes automatiquement
  const targetNotes = useMemo(() => {
    if (!effectiveLength || !deltaAverage) return targetNotesBase

    return targetNotesBase.map((note, index) => {
      // If note is measured and has a stored position, keep it
      if (note.isMeasured && note.position) {
        return note
      }
      
      // Calculate position for unmeasured notes or measured notes without stored position
      const position = calculateHolePosition(
        note.frequency,
        note.holeDiameter,
        innerDiameter,
        temperature,
        calculationMethod,
        deltaAverage,
        wallThickness,
        physicalLength
      )
      
      const shifted = shiftFollowingNotes(position, index, targetNotesBase)
      
      return { ...note, position: shifted }
    })
  }, [targetNotesBase, effectiveLength, deltaAverage, innerDiameter, temperature, calculationMethod, physicalLength, wallThickness])

  // Validate Step 2 parameters - check if first 5 notes have valid positions
  const step2ValidationError = useMemo(() => {
    if (!effectiveLength || targetNotes.length === 0) return false
    return !validateStep2Parameters(targetNotes, physicalLength)
  }, [targetNotes, physicalLength, effectiveLength])

  // Memoiser baseNoteName
  const baseNoteName = useMemo(() => {
    return getClosestNote(note1Frequency).name
  }, [note1Frequency])

  // Add new target note
  const addTargetNote = () => {
    if (targetNotesBase.length < maxNotes) {
      const newNotes = generateTargetNotes(note1Frequency, targetNotesBase.length + 1)
      setTargetNotesBase(newNotes)
    }
  }

  // Update target note
  const updateTargetNote = (index, field, value) => {
    const updated = [...targetNotesBase]
    updated[index][field] = value
    setTargetNotesBase(updated)
  }

  // Adjust note interval by snapping to 0.125-tone grid (0.25 semitone)
  const adjustNoteInterval = (index, direction) => {
    const updated = [...targetNotesBase]
    const currentNote = updated[index]
    
    // Determine reference frequency (base note for first hole, previous note otherwise)
    const refFreq = index === 0 ? note1Frequency : updated[index - 1].frequency
    
    // Calculate current interval in TONES (not semitones)
    const currentInterval = calculateSemitoneInterval(refFreq, currentNote.frequency)
    
    // Snap to nearest 0.25 multiple in the specified direction (quarter-tone)
    let newInterval
    if (direction > 0) {
      // Round up to next 0.25 multiple
      newInterval = Math.ceil(currentInterval * 4) / 4
      // If already on a 0.25 multiple, add 0.25
      if (Math.abs(newInterval - currentInterval) < 0.001) {
        newInterval += 0.25
      }
    } else {
      // Round down to previous 0.25 multiple
      newInterval = Math.floor(currentInterval * 4) / 4
      // If already on a 0.25 multiple, subtract 0.25
      if (Math.abs(newInterval - currentInterval) < 0.001) {
        newInterval -= 0.25
      }
    }
    
    // Ensure minimum interval of 0.25 tones (quarter-tone)
    if (newInterval < 0.25) {
      newInterval = 0.25
    }
    
    // Calculate new frequency (newInterval is in TONES, 6 tones = 1 octave)
    const newFreq = refFreq * Math.pow(2, newInterval / 6)
    
    // Update frequency and note name
    updated[index].frequency = parseFloat(newFreq.toFixed(2))
    updated[index].noteName = getClosestNote(newFreq).name
    
    setTargetNotesBase(updated)
  }

  // Add measured note (gain precision)
  const addMeasuredNote = (index) => {
    setCurrentMeasureIndex(index)
    setIsModalOpen(true)
  }

  const handleMeasureConfirm = (freq, diam) => {
    if (currentMeasureIndex !== null) {
      // Marquer la note comme mesuree avec les valeurs réelles
      const updated = [...targetNotesBase]
      updated[currentMeasureIndex].isMeasured = true
      updated[currentMeasureIndex].frequency = freq
      updated[currentMeasureIndex].holeDiameter = diam
      // Store the calculated position where the hole was drilled
      updated[currentMeasureIndex].position = targetNotes[currentMeasureIndex].position
      
      setTargetNotesBase(updated)
      setCurrentMeasureIndex(null)
    }
  }

  // Remove target note
  const removeTargetNote = (index) => {
    const updated = targetNotesBase.filter((_, i) => i !== index)
    setTargetNotesBase(updated)
  }

  // Change note by semitone (+1 or -1)
  const changeNoteSemitone = (index, direction) => {
    const updated = [...targetNotesBase]
    const currentNote = updated[index]
    
    // Find current note index in chromatic scale
    const currentNoteIndex = chromaticScale.indexOf(currentNote.noteName)
    
    // Calculate new note index (wraps around)
    const newNoteIndex = (currentNoteIndex + direction + 12) % 12
    const newNoteName = chromaticScale[newNoteIndex]
    
    // Calculate new frequency
    const currentOffset = index + 1
    const newOffset = currentOffset + direction
    const newFrequency = calculateFrequencyFromNote(note1Frequency, newOffset)
    
    // Update note
    updated[index] = {
      ...currentNote,
      noteName: newNoteName,
      frequency: parseFloat(newFrequency.toFixed(2))
    }
    setTargetNotesBase(updated)
  }

  // Reset note to default (5mm diameter, +1 semitone from previous)
  const resetNote = (index) => {
    const updated = [...targetNotesBase]
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
    setTargetNotesBase(updated)
  }

  // Current inputs display for algorithm explanation
  const currentInputs = effectiveLength ? (
    <>
      <strong>{t('algo_current_inputs')}</strong><br />
      <br />
      <em>{t('algo_speed_of_sound')}</em><br />
      v = {(calculateSpeedOfSound(temperature) / 1000).toFixed(1)} m/s<br />
      <br />
      <em>{t('algo_end_correction')}</em><br />
      Δ = {physicalLength.toFixed(2)} - L_eff = {deltaAverage.toFixed(2)} mm<br />
      <br />
      <em>{t('algo_effective_length')}</em><br />
      L_eff = v / ({calculationMethod === 'half-wave' ? '2' : '4'} × {note1Frequency.toFixed(2)}) = {effectiveLength.toFixed(2)} mm
    </>
  ) : null

  return (
    <div>
      <AlgorithmExplanation 
        title={t('algo_acoustical_title')}
        inputs={currentInputs}
      >
        <p>{t('algo_acoustical_intro')}</p>
        <ul>
          <li>{t('algo_acoustical_how_1')}</li>
          <li>{t('algo_acoustical_how_2')}</li>
          <li>{t('algo_acoustical_how_4')} <br/> <i>{t('algo_acoustical_how_3')}</i></li>
          <li>{t('algo_acoustical_how_5')}</li>
          <li>{t('algo_acoustical_how_6')}</li>
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
        wallThickness={wallThickness}
        setWallThickness={setWallThickness}
        temperature={temperature}
        setTemperature={setTemperature}
        note1Frequency={note1Frequency}
        setNote1Frequency={setNote1Frequency}
        effectiveLength={effectiveLength}
        deltaAverage={deltaAverage}
        baseNoteName={baseNoteName}
        validationError={step2ValidationError}
      />

      {/* STEP 3: Target Notes */}
      <Step3TargetNotes
        targetNotes={targetNotes}
        minNotes={minNotes}
        maxNotes={maxNotes}
        physicalLength={physicalLength}
        baseFrequency={note1Frequency}
        onUpdateNote={updateTargetNote}
        onMeasureNote={addMeasuredNote}
        onRemoveNote={removeTargetNote}
        onAddNote={addTargetNote}
        onChangeNoteSemitone={changeNoteSemitone}
        onResetNote={resetNote}
        onAdjustInterval={adjustNoteInterval}
      />

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
        targetFrequency={currentMeasureIndex !== null ? targetNotes[currentMeasureIndex]?.frequency : ''}
        targetDiameter={currentMeasureIndex !== null ? targetNotes[currentMeasureIndex]?.holeDiameter : ''}
      />
    </div>
  )
}

export default AcousticalPage
