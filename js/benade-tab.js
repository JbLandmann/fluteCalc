// Benade's Formula Tab

// Update Benade inputs in real-time
function updateBenadeInputs() {
    document.getElementById('benade-input-length').textContent = document.getElementById('benade-length').value;
    document.getElementById('benade-input-bore').textContent = document.getElementById('benade-bore').value;
    document.getElementById('benade-input-hole-dia').textContent = document.getElementById('benade-hole-dia').value;
    document.getElementById('benade-input-wall').textContent = document.getElementById('benade-wall').value;
    document.getElementById('benade-input-holes').textContent = document.getElementById('benade-holes').value;
}

// Benade's Formula
function calculateBenade() {
    const length = parseFloat(document.getElementById('benade-length').value);
    const boreDiameter = parseFloat(document.getElementById('benade-bore').value);
    const holeDiameter = parseFloat(document.getElementById('benade-hole-dia').value);
    const wallThickness = parseFloat(document.getElementById('benade-wall').value);
    const numHoles = parseInt(document.getElementById('benade-holes').value);
    
    const tbody = document.getElementById('benade-tbody');
    tbody.innerHTML = '';
    
    // Correction factor based on hole-to-bore ratio
    const K = 0.25; // Empirical constant
    const holeRatio = holeDiameter / boreDiameter;
    const correctionFactor = 1 + K * Math.pow(holeRatio, 2);
    
    // Wall thickness correction (chimney effect)
    const chimneyCorrection = 0.75 * wallThickness;
    
    const semitones = [2, 4, 5, 7, 9, 11, 12, 14];
    
    for (let i = 0; i < numHoles; i++) {
        const semitone = semitones[i];
        const ratio = 1 - Math.pow(2, -semitone / 12);
        const basicPosition = length * ratio;
        
        // Apply Benade's corrections
        const correctedPosition = (basicPosition * correctionFactor + chimneyCorrection).toFixed(2);
        const note = getNoteFromSemitones(2, semitone);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${basicPosition.toFixed(2)}</td>
            <td>${correctedPosition}</td>
            <td>${note}</td>
        `;
        tbody.appendChild(row);
    }
    
    document.getElementById('benade-results').classList.remove('hidden');
}
