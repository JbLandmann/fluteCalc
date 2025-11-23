// Reverse Engineering Acoustics Tab - Step-based Implementation

// Global state for the acoustic calculations
const acousticState = {
    fluteType: 'native',
    temperature: 20,
    speedOfSound: 343.4,
    physicalLength: 400,
    freqLow: 220,
    freqHigh: 225,
    L_eff_low: 0,
    L_eff_high: 0,
    breathMode: 'medium',
    delta: 0,
    referenceFreq: 440,
    notes: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4'],
    holeDiameters: [8, 8, 8, 8, 8, 8],
    wallThickness: 3,
    handSize: 'medium',
    rawPositions: [],
    correctedPositions: [],
    warnings: []
};

// Flute type configurations
const fluteConfigs = {
    native: { waveType: 'quarter', formula: 4, name: 'Native American Flute' },
    transverse: { waveType: 'half', formula: 2, name: 'Transverse Flute' },
    bansuri: { waveType: 'half', formula: 2, name: 'Bansuri' },
    xiao: { waveType: 'half', formula: 2, name: 'Xiao (Conical)' },
    shakuhachi: { waveType: 'half', formula: 2, name: 'Shakuhachi' },
    piccolo: { waveType: 'half', formula: 2, name: 'Piccolo' },
    recorder: { waveType: 'half', formula: 2, name: 'Recorder' },
    didgeridoo: { waveType: 'quarter', formula: 4, name: 'Didgeridoo' }
};

// Toggle step visibility
function toggleStep(stepId) {
    const step = document.getElementById(stepId);
    const content = step.querySelector('.step-content');
    const toggle = step.querySelector('.step-toggle');
    
    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        toggle.textContent = '▼';
    } else {
        content.style.display = 'none';
        toggle.textContent = '▶';
    }
}

// Navigate to next step
function nextAcousticalStep(stepNumber) {
    // Hide current step content
    const allSteps = document.querySelectorAll('.step-section');
    allSteps.forEach(step => {
        const content = step.querySelector('.step-content');
        const toggle = step.querySelector('.step-toggle');
        if (content) {
            content.style.display = 'none';
            toggle.textContent = '▶';
        }
    });
    
    // Show next step
    const nextStep = document.getElementById(`step-${stepNumber}`);
    if (nextStep) {
        nextStep.style.display = 'block';
        const content = nextStep.querySelector('.step-content');
        const toggle = nextStep.querySelector('.step-toggle');
        if (content) {
            content.style.display = 'block';
            toggle.textContent = '▼';
        }
        nextStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Navigate to previous step
function prevAcousticalStep(stepNumber) {
    nextAcousticalStep(stepNumber);
}

// Step 1: Calculate Speed of Sound
function calculateSpeed() {
    const temp = parseFloat(document.getElementById('temperature').value);
    acousticState.temperature = temp;
    acousticState.speedOfSound = 331.4 + 0.6 * temp;
    
    document.getElementById('speed-value').textContent = acousticState.speedOfSound.toFixed(2);
    document.getElementById('speed-result').style.display = 'block';
}

// Step 2: Calculate Effective Lengths
function calculateLengths() {
    const fluteType = document.getElementById('flute-type').value;
    acousticState.fluteType = fluteType;
    
    const config = fluteConfigs[fluteType];
    const c = acousticState.speedOfSound * 1000; // Convert to mm/s
    
    acousticState.physicalLength = parseFloat(document.getElementById('physical-length').value);
    acousticState.freqLow = parseFloat(document.getElementById('freq-low').value);
    acousticState.freqHigh = parseFloat(document.getElementById('freq-high').value);
    
    // Calculate effective lengths based on flute type
    acousticState.L_eff_low = c / (config.formula * acousticState.freqLow);
    acousticState.L_eff_high = c / (config.formula * acousticState.freqHigh);
    
    document.getElementById('l-eff-low').textContent = acousticState.L_eff_low.toFixed(2);
    document.getElementById('l-eff-high').textContent = acousticState.L_eff_high.toFixed(2);
    document.getElementById('length-result').style.display = 'block';
}

// Step 3: Calculate Node Shift
function calculateNodeShift() {
    const mode = document.getElementById('breath-mode').value;
    acousticState.breathMode = mode;
    
    const deltaLow = acousticState.L_eff_low - acousticState.physicalLength;
    const deltaHigh = acousticState.L_eff_high - acousticState.physicalLength;
    
    if (mode === 'low') {
        acousticState.delta = deltaLow;
    } else if (mode === 'high') {
        acousticState.delta = deltaHigh;
    } else {
        acousticState.delta = (deltaLow + deltaHigh) / 2;
    }
    
    document.getElementById('delta-value').textContent = acousticState.delta.toFixed(2);
    document.getElementById('shift-result').style.display = 'block';
}

// Helper: Convert note to frequency
function noteToFreq(note, A4 = 440) {
    const noteRegex = /^([A-G])(#|b)?(\d)$/;
    const semitones = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
    
    const match = note.trim().match(noteRegex);
    if (!match) return null;
    
    let [_, letter, accidental, octave] = match;
    octave = parseInt(octave);
    
    let n = semitones[letter];
    if (accidental === '#') n += 1;
    if (accidental === 'b') n -= 1;
    
    const semitoneDistance = n + (octave - 4) * 12;
    return A4 * Math.pow(2, semitoneDistance / 12);
}

// Step 5: Calculate Raw Hole Positions
function calculateRawPositions() {
    // Parse notes and reference frequency
    const notesInput = document.getElementById('notes-list').value;
    acousticState.notes = notesInput.split(',').map(n => n.trim());
    acousticState.referenceFreq = parseFloat(document.getElementById('reference-freq').value);
    
    const c = acousticState.speedOfSound * 1000; // mm/s
    const config = fluteConfigs[acousticState.fluteType];
    
    acousticState.rawPositions = acousticState.notes.map(note => {
        const freq = noteToFreq(note, acousticState.referenceFreq);
        if (!freq) return null;
        
        const L_eff = c / (config.formula * freq);
        const x0 = L_eff - acousticState.delta;
        
        return {
            note: note,
            f: freq,
            L_eff: L_eff,
            x0: x0
        };
    }).filter(p => p !== null);
    
    // Display results
    const tbody = document.getElementById('raw-positions-tbody');
    tbody.innerHTML = '';
    
    acousticState.rawPositions.forEach(pos => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding: 5px; border: 1px solid #ccc;">${pos.note}</td>
            <td style="padding: 5px; border: 1px solid #ccc;">${pos.f.toFixed(2)}</td>
            <td style="padding: 5px; border: 1px solid #ccc;">${pos.x0.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('raw-positions-result').style.display = 'block';
}

// Step 6: Calculate Corrected Positions
function calculateCorrectedPositions() {
    const diametersInput = document.getElementById('hole-diameters').value;
    acousticState.holeDiameters = diametersInput.split(',').map(d => parseFloat(d.trim()));
    acousticState.wallThickness = parseFloat(document.getElementById('wall-thickness').value);
    
    const wallThickness = acousticState.wallThickness;
    
    acousticState.correctedPositions = acousticState.rawPositions.map((pos, i) => {
        const d = acousticState.holeDiameters[i] || 8;
        const r = d / 2;
        
        // Heuristic correction coefficient based on wall thickness
        let alpha = 1.0;
        if (wallThickness >= 3 && wallThickness <= 5) alpha = 0.9;
        if (wallThickness > 5) alpha = 0.7;
        
        const C = alpha * r;
        const x = pos.x0 - C;
        
        return {
            ...pos,
            d: d,
            correction: C,
            x: x
        };
    });
    
    // Display results
    const tbody = document.getElementById('corrected-positions-tbody');
    tbody.innerHTML = '';
    
    acousticState.correctedPositions.forEach(pos => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding: 5px; border: 1px solid #ccc;">${pos.note}</td>
            <td style="padding: 5px; border: 1px solid #ccc;">${pos.x.toFixed(2)}</td>
            <td style="padding: 5px; border: 1px solid #ccc;">${pos.correction.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('corrected-positions-result').style.display = 'block';
}

// Step 7: Ergonomic Check
function calculateErgonomics() {
    const handSize = document.getElementById('hand-size').value;
    acousticState.handSize = handSize;
    
    const minDist = {
        small: 16,
        medium: 18,
        large: 20
    }[handSize];
    
    acousticState.warnings = [];
    
    for (let i = 1; i < acousticState.correctedPositions.length; i++) {
        const dist = Math.abs(acousticState.correctedPositions[i].x - acousticState.correctedPositions[i - 1].x);
        
        if (dist < minDist) {
            acousticState.warnings.push(
                `Holes ${i} and ${i + 1} (${acousticState.correctedPositions[i - 1].note} - ${acousticState.correctedPositions[i].note}) are too close: ${dist.toFixed(1)} mm`
            );
        }
    }
    
    // Display warnings
    const warningsList = document.getElementById('warnings-list');
    if (acousticState.warnings.length === 0) {
        warningsList.innerHTML = '<p style="color: green; margin-top: 10px;">✓ All holes are adequately spaced</p>';
    } else {
        warningsList.innerHTML = '<ul style="margin-top: 10px; color: #d9534f;">' +
            acousticState.warnings.map(w => `<li>${w}</li>`).join('') +
            '</ul>';
    }
    
    document.getElementById('ergonomic-result').style.display = 'block';
}

// Step 8: Generate Drilling Plan
function generateDrillingPlan() {
    const tbody = document.getElementById('drilling-plan-tbody');
    tbody.innerHTML = '';
    
    acousticState.correctedPositions.forEach(hole => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding: 5px; border: 1px solid #ccc;">${hole.note}</td>
            <td style="padding: 5px; border: 1px solid #ccc;">${hole.x.toFixed(2)}</td>
            <td style="padding: 5px; border: 1px solid #ccc;">${(hole.d - 1).toFixed(2)}</td>
            <td style="padding: 5px; border: 1px solid #ccc;">${hole.d.toFixed(2)}</td>
            <td style="padding: 5px; border: 1px solid #ccc;">${hole.f.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('drilling-plan-result').style.display = 'block';
}
