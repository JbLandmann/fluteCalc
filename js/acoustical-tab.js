// Acoustical Physics Method Tab

// Update Acoustical inputs in real-time
function updateAcousticalInputs() {
    document.getElementById('acoustical-input-frequency').textContent = document.getElementById('acoustical-frequency').value;
    document.getElementById('acoustical-input-diameter').textContent = document.getElementById('acoustical-diameter').value;
    document.getElementById('acoustical-input-temp').textContent = document.getElementById('acoustical-temp').value;
    document.getElementById('acoustical-input-holes').textContent = document.getElementById('acoustical-holes').value;
}

// Acoustical Physics Method
function calculateAcoustical() {
    const baseFreq = parseFloat(document.getElementById('acoustical-frequency').value);
    const diameter = parseFloat(document.getElementById('acoustical-diameter').value);
    const temp = parseFloat(document.getElementById('acoustical-temp').value);
    const numHoles = parseInt(document.getElementById('acoustical-holes').value);
    
    // Speed of sound in air (temperature dependent)
    const speedOfSound = (331.3 + 0.606 * temp) * 1000; // mm/s
    
    // End correction
    const endCorrection = 0.6 * diameter;
    
    const tbody = document.getElementById('acoustical-tbody');
    tbody.innerHTML = '';
    
    // Calculate for chromatic scale
    const semitones = [2, 4, 5, 7, 9, 11, 12, 14];
    
    for (let i = 0; i < numHoles; i++) {
        const semitone = semitones[i];
        const frequency = (baseFreq * Math.pow(2, semitone / 12)).toFixed(2);
        const effectiveLength = (speedOfSound / (2 * frequency)) - endCorrection;
        const position = effectiveLength.toFixed(2);
        const note = getNoteFromSemitones(2, semitone);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${position}</td>
            <td>${note}</td>
            <td>${frequency}</td>
        `;
        tbody.appendChild(row);
    }
    
    document.getElementById('acoustical-results').classList.remove('hidden');
}
