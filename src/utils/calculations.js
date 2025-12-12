// Acoustic calculation utilities

// Note names for reference with semitones
const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Chromatic scale (index = semitones from C)
export const chromaticScale = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

// Get note name from frequency
export function getNoteName(frequency) {
  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75);
  
  const halfSteps = 12 * Math.log2(frequency / C0);
  const noteIndex = Math.round(halfSteps) % 12;
  const octave = Math.floor(Math.round(halfSteps) / 12);
  
  return `${noteNames[noteIndex < 0 ? noteIndex + 12 : noteIndex]}${octave}`;
}

// Get the closest note (without octave) from a frequency
// Returns { name: 'D', index: 2 }
export function getClosestNote(frequency) {
  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75);
  
  const halfSteps = 12 * Math.log2(frequency / C0);
  const noteIndex = Math.round(halfSteps) % 12;
  const adjustedIndex = noteIndex < 0 ? noteIndex + 12 : noteIndex;
  
  return {
    name: chromaticScale[adjustedIndex],
    index: adjustedIndex
  };
}

// Calculate frequency for a note at given semitone offset from base frequency
export function calculateFrequencyFromNote(baseFrequency, semitoneOffset) {
  return baseFrequency * Math.pow(2, semitoneOffset / 12);
}

// Generate array of target notes starting from base frequency
// Each note is +1 semitone from the previous (chromatic scale)
export function generateTargetNotes(baseFrequency, numberOfNotes = 5) {
  const baseNote = getClosestNote(baseFrequency);
  const targetNotes = [];
  
  for (let i = 1; i <= numberOfNotes; i++) {
    // Get next note in chromatic scale (+i semitones from base)
    const nextNoteIndex = (baseNote.index + i) % 12;
    const nextNoteName = chromaticScale[nextNoteIndex];
    
    // Calculate frequency: +i semitones from base frequency
    const frequency = calculateFrequencyFromNote(baseFrequency, i);
    
    targetNotes.push({
      id: i,
      frequency: parseFloat(frequency.toFixed(2)),
      holeDiameter: 5,
      position: null,
      isMeasured: false,
      noteName: nextNoteName
    });
  }
  
  return targetNotes;
}

// Get note from semitones offset
export function getNoteFromSemitones(baseSemitones, offset) {
  const totalSemitones = (baseSemitones + offset) % 12;
  return noteNames[totalSemitones < 0 ? totalSemitones + 12 : totalSemitones];
}

// Calculate speed of sound based on temperature
export function calculateSpeedOfSound(temperature) {
  return (331.3 + 0.606 * temperature) * 1000; // mm/s
}

// Calculate end correction
export function calculateEndCorrection(diameter) {
  return 0.6 * diameter;
}

// Calculate effective length for a frequency
export function XcalculateEffectiveLength(frequency, speedOfSound, endCorrection) {
  return (speedOfSound / (2 * frequency)) - endCorrection;
}

// Calculate frequency from semitone offset
export function calculateFrequencyFromSemitone(baseFrequency, semitone) {
  return baseFrequency * Math.pow(2, semitone / 12);
}

// Available interval ratios for Sanfen Sunyi method
export const intervalRatios = [
  { name: 'Perfect Fifth (San Fen Sun Yi)', ratio: 3/2, semitones: 7 },
  { name: 'Perfect Fourth (San Fen Yi Yi)', ratio: 4/3, semitones: 5 },
  { name: 'Major Third', ratio: 5/4, semitones: 4 },
  { name: 'Minor Third', ratio: 6/5, semitones: 3 },
  { name: 'Major Second', ratio: 9/8, semitones: 2 },
  { name: 'Minor Second', ratio: 16/15, semitones: 1 },
  { name: 'Major Sixth', ratio: 5/3, semitones: 9 },
  { name: 'Minor Seventh', ratio: 16/9, semitones: 10 }
];

// Check if a hole pair should be excluded from overlap warnings
export function isSpecialHolePair(holeIndex, totalHoles) {
  if (totalHoles === 8) {
    if (holeIndex === 0) return true;
    if (holeIndex === 6) return true;
  }
  if (totalHoles === 7) {
    if (holeIndex === 5) return true;
  }
  return false;
}

// Calculate hole positions for a model
export function calculateHolePositions(model, baseFreq, diameter, temp) {
  const speedOfSound = calculateSpeedOfSound(temp);
  const endCorrection = calculateEndCorrection(diameter);
  
  const positions = [];
  const frequencies = [];
  
  for (let i = 0; i < model.intervals.length; i++) {
    const semitone = model.intervals[i];
    const frequency = calculateFrequencyFromSemitone(baseFreq, semitone);
    frequencies.push(frequency);
    
    const effectiveLength = XcalculateEffectiveLength(frequency, speedOfSound, endCorrection);
    positions.push(effectiveLength);
  }
  
  return { positions, frequencies };
}

// Calculate acoustical method positions
export function calculateAcousticalPositions(baseFreq, diameter, temp, numHoles) {
  const speedOfSound = calculateSpeedOfSound(temp);
  const endCorrection = calculateEndCorrection(diameter);
  
  const semitones = [2, 4, 5, 7, 9, 11, 12, 14];
  const results = [];
  
  for (let i = 0; i < numHoles; i++) {
    const semitone = semitones[i];
    const frequency = calculateFrequencyFromSemitone(baseFreq, semitone);
    const effectiveLength = XcalculateEffectiveLength(frequency, speedOfSound, endCorrection);
    const note = getNoteFromSemitones(2, semitone);
    
    results.push({
      hole: i + 1,
      position: effectiveLength,
      note,
      frequency
    });
  }
  
  return results;
}

// Calculate Benade method positions
export function calculateBenadePositions(length, boreDiameter, holeDiameter, wallThickness, numHoles) {
  const K = 0.25; // Empirical constant
  const holeRatio = holeDiameter / boreDiameter;
  const correctionFactor = 1 + K * Math.pow(holeRatio, 2);
  const chimneyCorrection = 0.75 * wallThickness;
  
  const semitones = [2, 4, 5, 7, 9, 11, 12, 14];
  const results = [];
  
  for (let i = 0; i < numHoles; i++) {
    const semitone = semitones[i];
    const ratio = 1 - Math.pow(2, -semitone / 12);
    const basicPosition = length * ratio;
    const correctedPosition = basicPosition * correctionFactor + chimneyCorrection;
    const note = getNoteFromSemitones(2, semitone);
    
    results.push({
      hole: i + 1,
      basicPosition,
      correctedPosition,
      note
    });
  }
  
  return results;
}

// ===== REVERSE ENGINEERING METHOD (Acoustical Page) =====

// Calculate effective length from measured frequency
// calculationMethod: 'half-wave' or 'quarter-wave'
export function calculateEffectiveLength(frequency, temperature, calculationMethod) {
  // TODO: Implement actual calculation
  // For now, return a constant
  const speedOfSound = calculateSpeedOfSound(temperature);
  
  if (calculationMethod === 'half-wave') {
    // L_eff = c / (2 * f0)
    return speedOfSound / (2 * frequency);
  } else {
    // quarter-wave: L_eff = c / (4 * f0)
    return speedOfSound / (4 * frequency);
  }
}

// Calculate Delta (end correction) from two notes (normal and strong breath)
export function calculateDeltaFromTwoNotes(note1Freq, note2Freq, temperature, calculationMethod) {
  // TODO: Implement actual calculation based on two measured frequencies
  // For now, return a constant
  return 10.0; // mm
}

// Calculate hole position for a target note
export function calculateHolePosition(
  targetFrequency,
  holeDiameter,
  innerDiameter,
  temperature,
  calculationMethod,
  delta,
  effectiveLength
) {
  // TODO: Implement actual calculation
  // For now, return a simple constant based on frequency ratio
  const speedOfSound = calculateSpeedOfSound(temperature);
  const baseLength = calculationMethod === 'half-wave' 
    ? speedOfSound / (2 * targetFrequency)
    : speedOfSound / (4 * targetFrequency);
  
  return baseLength - delta;
}

// Recalculate all positions after a measurement
export function recalculatePositionsAfterMeasurement(
  measurementIndex,
  targetNotes,
  newDelta,
  effectiveLength,
  innerDiameter,
  temperature,
  calculationMethod
) {
  // TODO: Implement actual recalculation logic with new Delta
  // For now, just log the operation
  console.log('Recalculating positions after measurement at index:', measurementIndex);
  console.log('New Delta:', newDelta);
  return targetNotes;
}

// Shift following note positions based on previous holes
export function shiftFollowingNotes(basePosition, noteIndex, allNotes) {
  // TODO: Implement actual shift calculation based on hole interactions
  // For now, return the base position with a small shift per previous hole
  const shift = noteIndex * 2; // 2mm shift per previous hole (placeholder)
  return basePosition + shift;
}

