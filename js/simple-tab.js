// Xiao Flute - Sanfen Sunyi Method Tab

// State for interactive hole building
let holeFrequencies = [];
let selectedIntervals = [];
let preCalculatedPositions = []; // Store pre-calculated positions for all intervals
let currentSelectedModel = null; // Track currently selected model for auto-recalculation

// Model definitions for different hole configurations
const xiaoModels = {
    // 8 holes models
    pentatonic_8: {
        name: "Xiao Pentatonique Majeure Traditionnelle",
        holes: 8,
        description: `
            <h3 style="color: #6d5738; margin-bottom: 15px;">🟦 SCÉNARIO 1 — La xiao pentatonique majeure traditionnelle (la plus courante)</h3>
            <p><strong>Gamme :</strong> Gong – Shang – Jue – Zhi – Yu</p>
            <p>Pentatonique majeure chinoise → équivalent de la pentatonique majeure occidentale.</p>
            <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 Les 8 notes (avec intervalles) :</h4>
            <ul style="line-height: 1.8;">
                <li>Tonique (0)</li>
                <li>M2 (2)</li>
                <li>M2 (4)</li>
                <li>m3 (7)</li>
                <li>M2 (9)</li>
                <li>m3 (12)</li>
                <li>M2 (14) ← facultatif selon les modèles</li>
                <li>M2 (16)</li>
            </ul>
            <p><strong>✔ Résumé des intervalles :</strong> +2 – +2 – +3 – +2 – +3 – +2 – +2</p>
            <p style="margin-top: 10px; font-style: italic; color: #6d5738;">C'est la structure 90% des xiao du commerce. Elle donne une mélodie "flottante", typique de la musique chinoise.</p>
        `,
        intervals: [0, 2, 4, 7, 9, 12, 14, 16] // semitones from base
    },
    heptatonic_8: {
        name: "Xiao Heptatonique Traditionnelle",
        holes: 8,
        description: `
            <h3 style="color: #6d5738; margin-bottom: 15px;">🟦 SCÉNARIO 2 — Xiao heptatonique traditionnelle (moins courante)</h3>
            <p>Dans certaines musiques rituelles ou locales, la xiao est accordée avec une gamme heptatonique ancienne, proche du mode mixolydien ou dorien selon la région.</p>
            <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 Les 8 notes (avec intervalles) :</h4>
            <ul style="line-height: 1.8;">
                <li>Tonique (0)</li>
                <li>M2 (2)</li>
                <li>M2 (4)</li>
                <li>m2 (5)</li>
                <li>M2 (7)</li>
                <li>M2 (9)</li>
                <li>m2 (10)</li>
                <li>M2 (12)</li>
            </ul>
            <p><strong>✔ Résumé des intervalles :</strong> +2 – +2 – +1 – +2 – +2 – +1 – +2</p>
            <p style="margin-top: 10px; font-style: italic; color: #6d5738;">On est proche d'une gamme majeure mais avec une 4e augmentée et une 7e mineure. C'est rare mais historiquement authentique.</p>
        `,
        intervals: [0, 2, 4, 5, 7, 9, 10, 12]
    },
    diatonic_8: {
        name: "Xiao Diatonique Moderne",
        holes: 8,
        description: `
            <h3 style="color: #6d5738; margin-bottom: 15px;">🟦 SCÉNARIO 3 — Xiao diatonique moderne (occidentalisée)</h3>
            <p>Utilisée par certains musiciens contemporains pour jouer des mélodies occidentales. Ici on force une gamme majeure complète.</p>
            <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 Les 8 notes (avec intervalles) :</h4>
            <ul style="line-height: 1.8;">
                <li>Tonique (0)</li>
                <li>M2 (2)</li>
                <li>M2 (4)</li>
                <li>m2 (5)</li>
                <li>M2 (7)</li>
                <li>M2 (9)</li>
                <li>M2 (11)</li>
                <li>m2 (12)</li>
            </ul>
            <p><strong>✔ Résumé des intervalles :</strong> +2 – +2 – +1 – +2 – +2 – +2 – +1</p>
            <p style="margin-top: 10px; font-style: italic; color: #6d5738;">C'est jouable, mais ergonomiquement difficile. Les trous se superposent souvent.</p>
        `,
        intervals: [0, 2, 4, 5, 7, 9, 11, 12]
    },
    // 7 holes models
    pentatonic_7a: {
        name: "Xiao 7 trous - Pentatonique + 4e diatonique",
        holes: 7,
        description: `
            <h3 style="color: #6d5738; margin-bottom: 15px;">🟩 Xiao à 7 trous - Variante A (pentatonique + 4e diatonique)</h3>
            <p>Le 7e trou apporte une note de passage supplémentaire, enrichissant la gamme pentatonique traditionnelle.</p>
            <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 Les 7 notes (avec intervalles) :</h4>
            <ul style="line-height: 1.8;">
                <li>Tonique (0)</li>
                <li>M2 (2)</li>
                <li>M2 (4)</li>
                <li>m3 (7)</li>
                <li>m2 (8)</li>
                <li>M2 (10)</li>
                <li>m3 (13)</li>
            </ul>
            <p><strong>✔ Résumé des intervalles :</strong> +2 – +2 – +3 – +1 – +2 – +3</p>
            <p style="margin-top: 10px; font-style: italic; color: #6d5738;">Assez peu courant, mais attesté dans certains styles anciens.</p>
        `,
        intervals: [0, 2, 4, 7, 8, 10, 13]
    },
    pentatonic_7b: {
        name: "Xiao 7 trous - Pentatonique + 7e mineure",
        holes: 7,
        description: `
            <h3 style="color: #6d5738; margin-bottom: 15px;">🟩 Xiao à 7 trous - Variante B (pentatonique + 7e mineure)</h3>
            <p>Cette variante ajoute une 7e mineure à la gamme pentatonique, offrant un doigté alternatif pour stabiliser certains micro-intervalles.</p>
            <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 Les 7 notes (avec intervalles) :</h4>
            <ul style="line-height: 1.8;">
                <li>Tonique (0)</li>
                <li>M2 (2)</li>
                <li>M2 (4)</li>
                <li>m3 (7)</li>
                <li>M2 (9)</li>
                <li>m2 (10)</li>
                <li>m3 (13)</li>
            </ul>
            <p><strong>✔ Résumé des intervalles :</strong> +2 – +2 – +3 – +2 – +1 – +3</p>
            <p style="margin-top: 10px; font-style: italic; color: #6d5738;">Rare mais attesté dans certains styles anciens et musiques traditionnelles locales.</p>
        `,
        intervals: [0, 2, 4, 7, 9, 10, 13]
    },
    // 6 holes model
    pentatonic_6: {
        name: "Xiao 6 trous - Pentatonique traditionnelle",
        holes: 6,
        description: `
            <h3 style="color: #6d5738; margin-bottom: 15px;">🟦 Xiao à 6 trous (le plus traditionnel)</h3>
            <p>Pendant la plus grande partie de l'histoire, la xiao n'avait que 6 trous.</p>
            <p><strong>✔ Typiquement associés à la gamme pentatonique :</strong></p>
            <p>Gong – Shang – Jue – Zhi – Yu → donc : M2 – M2 – m3 – M2 – m3</p>
            <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 6 trous = 5 intervalles + octave</h4>
            <ul style="line-height: 1.8;">
                <li>Tonique (0)</li>
                <li>M2 (2)</li>
                <li>M2 (4)</li>
                <li>m3 (7)</li>
                <li>M2 (9)</li>
                <li>m3 (12)</li>
            </ul>
            <p><strong>✔ Résumé des intervalles :</strong> +2 – +2 – +3 – +2 – +3</p>
            <p style="margin-top: 10px; font-style: italic; color: #6d5738;">C'est le modèle le plus ancien, le plus ergonomique, celui des xiao du Sud (nanxiao), celui utilisé dans beaucoup de musiques traditionnelles. C'est le scénario le plus courant pour "moins de 8 trous".</p>
        `,
        intervals: [0, 2, 4, 7, 9, 12]
    },
    // 5 holes model
    pentatonic_5: {
        name: "Xiao 5 trous - Pentatonique pur",
        holes: 5,
        description: `
            <h3 style="color: #6d5738; margin-bottom: 15px;">🟥 Xiao à 5 trous (super traditionnel, le vrai pentatonique brut)</h3>
            <p>C'est une xiao primordiale, très épurée. Chaque trou correspond à une note de la pentatonique complète, sans "notes de passage".</p>
            <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 Structure exacte :</h4>
            <ul style="line-height: 1.8;">
                <li>Tonique (0)</li>
                <li>M2 (2)</li>
                <li>M2 (4)</li>
                <li>m3 (7)</li>
                <li>M2 (9)</li>
                <li>(+3 pour octave = 12)</li>
            </ul>
            <p><strong>✔ Résumé des intervalles :</strong> +2 – +2 – +3 – +2 (+ octave)</p>
            <p style="margin-top: 10px; font-style: italic; color: #6d5738;">On a vraiment que la pentatonique, rien d'autre. C'est courant dans certaines régions du Sichuan, dans les instruments de cérémonie, dans les flûtes anciennes en bambou massif. Très authentique, plus simple et très ergonomique. Beaucoup plus facile à fabriquer : les trous sont bien espacés.</p>
        `,
        intervals: [0, 2, 4, 7, 9]
    },
    // 4 holes model
    pentatonic_4: {
        name: "Xiao 4 trous - Ultra minimaliste",
        holes: 4,
        description: `
            <h3 style="color: #6d5738; margin-bottom: 15px;">🟧 Xiao à 4 trous (ultra minimaliste)</h3>
            <p>Rare mais attestée dans certaines traditions chamaniques, des flûtes de méditation ou funéraires, des instruments folkloriques dépouillés.</p>
            <h4 style="color: #8b6f47; margin-top: 15px; margin-bottom: 10px;">🎵 Structure :</h4>
            <p>C'est une pentatonique réduite, souvent :</p>
            <ul style="line-height: 1.8;">
                <li>Tonique (0)</li>
                <li>M2 (2)</li>
                <li>m3 (5)</li>
                <li>M2 (7)</li>
                <li>(+3 pour octave si besoin)</li>
            </ul>
            <p><strong>✔ Résumé des intervalles :</strong> +2 – +3 – +2</p>
            <p style="margin-top: 10px; font-style: italic; color: #6d5738;">On retire deux degrés de la pentatonique. Ce sont des flûtes "à rôle", pas mélodiques au sens occidental.</p>
        `,
        intervals: [0, 2, 5, 7]
    }
};

// Available interval ratios for Sanfen Sunyi method
const intervalRatios = [
    { name: 'Perfect Fifth (San Fen Sun Yi)', ratio: 3/2, semitones: 7 },
    { name: 'Perfect Fourth (San Fen Yi Yi)', ratio: 4/3, semitones: 5 },
    { name: 'Major Third', ratio: 5/4, semitones: 4 },
    { name: 'Minor Third', ratio: 6/5, semitones: 3 },
    { name: 'Major Second', ratio: 9/8, semitones: 2 },
    { name: 'Minor Second', ratio: 16/15, semitones: 1 },
    { name: 'Major Sixth', ratio: 5/3, semitones: 9 },
    { name: 'Minor Seventh', ratio: 16/9, semitones: 10 }
];

// Hole distance constraints (center to center) in mm
// Index 0 = hole 1→2, Index 1 = hole 2→3, etc.
const holeDistanceConstraints = [
    { comfortable: { min: 18, max: 22 }, difficult: { min: 23, max: 26 }, limit: 28 }, // Hole 1→2
    { comfortable: { min: 20, max: 25 }, difficult: { min: 26, max: 30 }, limit: 32 }, // Hole 2→3
    { comfortable: { min: 22, max: 28 }, difficult: { min: 29, max: 33 }, limit: 35 }, // Hole 3→4
    { comfortable: { min: 20, max: 25 }, difficult: { min: 26, max: 30 }, limit: 32 }, // Hole 4→5
    { comfortable: { min: 18, max: 23 }, difficult: { min: 24, max: 28 }, limit: 30 }, // Hole 5→6
    { comfortable: { min: 16, max: 20 }, difficult: { min: 21, max: 24 }, limit: 26 }, // Hole 6→7
    { comfortable: { min: 14, max: 18 }, difficult: { min: 19, max: 22 }, limit: 24 }  // Hole 7→8
];

// Update Simple inputs in real-time
function updateSimpleInputs() {
    document.getElementById('simple-input-frequency').textContent = document.getElementById('simple-base-frequency').value;
    document.getElementById('simple-input-diameter').textContent = document.getElementById('simple-diameter').value;
    document.getElementById('simple-input-temp').textContent = document.getElementById('simple-temp').value;
    document.getElementById('simple-input-holes').textContent = document.getElementById('simple-holes').value;
    
    // Auto-recalculate if a model is already selected
    if (currentSelectedModel !== null) {
        calculateWithModel(currentSelectedModel);
    }
}

// Handle hole number change
function onHoleNumberChange() {
    updateSimpleInputs();
    const numHoles = parseInt(document.getElementById('simple-holes').value);
    const calcButton = document.getElementById('simple-calculate-button');
    const modelSelection = document.getElementById('simple-model-selection');
    const modelSelect = document.getElementById('simple-model');
    const modelTitle = document.getElementById('model-selection-title');
    
    // Reset model selection
    modelSelect.innerHTML = `<option value="" data-i18n="select_model_placeholder">${i18n.t('select_model_placeholder')}</option>`;
    document.getElementById('model-description').style.display = 'none';
    document.getElementById('simple-interactive').style.display = 'none';
    document.getElementById('simple-results').classList.add('hidden');
    currentSelectedModel = null; // Reset current model
    
    // Populate model options based on number of holes
    let hasModels = false;
    
    if (numHoles === 8) {
        modelTitle.textContent = i18n.t('select_model_8');
        modelSelect.innerHTML += `<option value="pentatonic_8">${i18n.t('model_pentatonic_8')}</option>`;
        modelSelect.innerHTML += `<option value="heptatonic_8">${i18n.t('model_heptatonic_8')}</option>`;
        modelSelect.innerHTML += `<option value="diatonic_8">${i18n.t('model_diatonic_8')}</option>`;
        hasModels = true;
    } else if (numHoles === 7) {
        modelTitle.textContent = i18n.t('select_model_7');
        modelSelect.innerHTML += `<option value="pentatonic_7a">${i18n.t('model_pentatonic_7a')}</option>`;
        modelSelect.innerHTML += `<option value="pentatonic_7b">${i18n.t('model_pentatonic_7b')}</option>`;
        hasModels = true;
    } else if (numHoles === 6) {
        modelTitle.textContent = i18n.t('select_model_6');
        modelSelect.innerHTML += `<option value="pentatonic_6">${i18n.t('model_pentatonic_6')}</option>`;
        hasModels = true;
    } else if (numHoles === 5) {
        modelTitle.textContent = i18n.t('select_model_5');
        modelSelect.innerHTML += `<option value="pentatonic_5">${i18n.t('model_pentatonic_5')}</option>`;
        hasModels = true;
    } else if (numHoles === 4) {
        modelTitle.textContent = i18n.t('select_model_4');
        modelSelect.innerHTML += `<option value="pentatonic_4">${i18n.t('model_pentatonic_4')}</option>`;
        hasModels = true;
    }
    
    if (hasModels) {
        // Show model selection for these hole configurations
        modelSelection.style.display = 'block';
        calcButton.style.display = 'none';
    } else {
        // Hide model selection and show calculate button for other numbers
        modelSelection.style.display = 'none';
        calcButton.style.display = 'block';
    }
}

// Handle model change
function onModelChange() {
    const modelKey = document.getElementById('simple-model').value;
    const descDiv = document.getElementById('model-description');
    
    if (modelKey === '') {
        descDiv.style.display = 'none';
        document.getElementById('simple-results').classList.add('hidden');
        currentSelectedModel = null;
        return;
    }
    
    const model = xiaoModels[modelKey];
    currentSelectedModel = model; // Store current model
    descDiv.innerHTML = model.description;
    descDiv.style.display = 'block';
    
    // Automatically calculate when model is selected
    calculateWithModel(model);
}

// Check if a hole pair should be excluded from overlap warnings
// i is the index of the first hole in the pair (0-based)
function isSpecialHolePair(holeIndex, totalHoles) {
    // For 8 holes: 
    // - hole 1 (index 0) is for pinky (left or right)
    // - hole 8 (index 7) is back hole
    if (totalHoles === 8) {
        // Skip warning for hole 1 to hole 2 (index 0)
        if (holeIndex === 0) return true;
        // Skip warning for hole 7 to hole 8 (index 6)
        if (holeIndex === 6) return true;
    }
    
    // For 7 holes:
    // - hole 7 (index 6) is back hole
    if (totalHoles === 7) {
        // Skip warning for hole 6 to hole 7 (index 5)
        if (holeIndex === 5) return true;
    }
    
    return false;
}

// Calculate positions based on selected model
function calculateWithModel(model) {
    const baseFreq = parseFloat(document.getElementById('simple-base-frequency').value);
    const diameter = parseFloat(document.getElementById('simple-diameter').value);
    const temp = parseFloat(document.getElementById('simple-temp').value);
    
    // Speed of sound in air (temperature dependent)
    const speedOfSound = (331.3 + 0.606 * temp) * 1000; // mm/s
    const endCorrection = 0.6 * diameter;
    
    const tbody = document.getElementById('simple-tbody');
    tbody.innerHTML = '';
    
    // Calculate positions for each hole
    const positions = [];
    const frequencies = [];
    
    for (let i = 0; i < model.intervals.length; i++) {
        const semitone = model.intervals[i];
        const frequency = baseFreq * Math.pow(2, semitone / 12);
        frequencies.push(frequency);
        
        const effectiveLength = (speedOfSound / (2 * frequency)) - endCorrection;
        positions.push(effectiveLength);
    }
    
    // Build table rows with warnings about hole overlap
    let hasOverlapWarning = false;
    const numHoles = model.intervals.length;
    
    for (let i = 0; i < numHoles; i++) {
        const frequency = frequencies[i];
        const position = positions[i];
        const note = getNoteName(frequency);
        const semitone = model.intervals[i];
        
        // Calculate distance to next hole
        let distanceCell = '';
        let warningCell = '';
        if (i < numHoles - 1) {
            const distance = Math.abs(positions[i] - positions[i + 1]);
            distanceCell = distance.toFixed(2);
            
            // Determine if we should check for overlap warnings
            // Skip warning checks for special holes:
            // - For 8 holes: hole 1 is for pinky (left/right), hole 8 is back hole
            // - For 7 holes: hole 7 is back hole
            const shouldCheckOverlap = !isSpecialHolePair(i, numHoles);
            
            // Check for overlap risk (holes too close, less than 10mm)
            if (shouldCheckOverlap) {
                if (distance < 10) {
                    warningCell = '<span class="warning-indicator warning-limit">⚠ Risque de superposition</span>';
                    hasOverlapWarning = true;
                } else if (distance < 15) {
                    warningCell = '<span class="warning-indicator warning-difficult">⚠ Trous rapprochés</span>';
                } else {
                    warningCell = '';
                }
            } else {
                // For special holes, no warning needed
                warningCell = '';
            }
        } else {
            distanceCell = '—';
            warningCell = '';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${position.toFixed(2)}</td>
            <td>${distanceCell}</td>
            <td>+${semitone} demi-tons</td>
            <td>${note} ${warningCell}</td>
            <td>${frequency.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    }
    
    // Add empirical warning if there's overlap
    if (hasOverlapWarning) {
        const warningRow = document.createElement('tr');
        warningRow.innerHTML = `
            <td colspan="6" style="background: #fff3cd; color: #856404; font-weight: bold; padding: 15px;">
                ⚠️ <strong>Méthode empirique recommandée :</strong> En cas de risque de superposition des trous, 
                il faut remonter le prochain trou et l'élargir. Cette approche empirique permet d'ajuster 
                la position et le diamètre des trous pour éviter les chevauchements tout en maintenant l'accord souhaité.
            </td>
        `;
        tbody.appendChild(warningRow);
    }
    
    // Store data for visualization
    currentFluteData = {
        positions: positions,
        numHoles: numHoles,
        diameter: diameter
    };
    
    document.getElementById('simple-results').classList.remove('hidden');
}

// Simple Ratio Method (Xiao Flute - Sanfen Sunyi)
function calculateSimple() {
    const baseFreq = parseFloat(document.getElementById('simple-base-frequency').value);
    const diameter = parseFloat(document.getElementById('simple-diameter').value);
    const temp = parseFloat(document.getElementById('simple-temp').value);
    const numHoles = parseInt(document.getElementById('simple-holes').value);
    
    // For 8 holes, use model selection instead
    if (numHoles === 8) {
        alert(i18n.t('alert_select_model', { holes: '8' }));
        return;
    }
    
    // Initialize with base frequency
    holeFrequencies = [baseFreq];
    selectedIntervals = [];
    
    // Pre-calculate all possible positions for each interval
    preCalculatedPositions = calculateAllPossiblePositions(baseFreq, diameter, temp);
    
    // Clear results table
    const tbody = document.getElementById('simple-tbody');
    tbody.innerHTML = '';
    
    // Show interactive builder
    document.getElementById('simple-interactive').style.display = 'block';
    
    // Show results section (but empty initially)
    document.getElementById('simple-results').classList.remove('hidden');
    
    // Build the interactive interface starting from hole 1
    buildHoleSelector(0, numHoles);
}

// Pre-calculate positions for all possible interval choices
function calculateAllPossiblePositions(baseFreq, diameter, temp) {
    const speedOfSound = (331.3 + 0.606 * temp) * 1000; // mm/s
    const endCorrection = 0.6 * diameter;
    
    let positions = [];
    
    // For each hole level, calculate positions for all interval choices
    for (let holeLevel = 0; holeLevel < 8; holeLevel++) {
        positions[holeLevel] = [];
        
        for (let intervalIdx = 0; intervalIdx < intervalRatios.length; intervalIdx++) {
            const interval = intervalRatios[intervalIdx];
            const frequency = baseFreq * interval.ratio;
            const effectiveLength = (speedOfSound / (2 * frequency)) - endCorrection;
            positions[holeLevel][intervalIdx] = effectiveLength;
        }
    }
    
    return positions;
}

function buildHoleSelector(holeIndex, totalHoles) {
    const builder = document.getElementById('simple-hole-builder');
    builder.innerHTML = '';
    
    if (holeIndex >= totalHoles) {
        // All holes configured
        builder.innerHTML = `<p style="color: #6d5738; font-weight: bold;">${i18n.t('all_holes_configured')}</p>`;
        return;
    }
    
    const currentFreq = holeFrequencies[holeIndex];
    
    const div = document.createElement('div');
    div.innerHTML = `
        <div style="background: #fff8f0; padding: 20px; border-radius: 8px; border: 2px solid #d4b896;">
            <h4 style="color: #6d5738; margin-bottom: 15px;">${i18n.t('configure_hole', { number: holeIndex + 1 })}</h4>
            <p style="margin-bottom: 10px;"><strong>${i18n.t('current_frequency')}</strong> ${currentFreq.toFixed(2)} Hz (${getNoteName(currentFreq)})</p>
            <label style="display: block; margin-bottom: 8px; color: #5d4a37; font-weight: bold;">${i18n.t('choose_interval')}</label>
            <select id="interval-select-${holeIndex}" style="width: 100%; padding: 12px; border: 2px solid #d4b896; border-radius: 8px; font-size: 1em; background: #fffcf7; font-family: 'Georgia', 'Palatino', serif; margin-bottom: 15px;">
                ${intervalRatios.map((interval, idx) => {
                    const nextFreq = currentFreq * interval.ratio;
                    const warning = getWarningForInterval(holeIndex, idx);
                    return `<option value="${idx}">${interval.name} → ${nextFreq.toFixed(2)} Hz (${getNoteName(nextFreq)}) ${warning}</option>`;
                }).join('')}
            </select>
            <button onclick="selectInterval(${holeIndex}, ${totalHoles})" style="background: linear-gradient(135deg, #8b6f47 0%, #6d5738 100%); color: white; padding: 12px 30px; border: none; border-radius: 8px; font-size: 1em; font-weight: bold; cursor: pointer; font-family: 'Georgia', 'Palatino', serif;">
                ${holeIndex < totalHoles - 1 ? i18n.t('next_hole') : i18n.t('finish_scale')}
            </button>
        </div>
    `;
    builder.appendChild(div);
}

// Get warning text for an interval choice at a specific hole index
function getWarningForInterval(holeIndex, intervalIdx) {
    if (holeIndex === 0) {
        return ''; // No warning for first hole
    }
    
    // Get the position of the previous hole
    const diameter = parseFloat(document.getElementById('simple-diameter').value);
    const temp = parseFloat(document.getElementById('simple-temp').value);
    const speedOfSound = (331.3 + 0.606 * temp) * 1000;
    const endCorrection = 0.6 * diameter;
    
    const prevFreq = holeFrequencies[holeIndex];
    const prevPosition = (speedOfSound / (2 * prevFreq)) - endCorrection;
    
    // Get the position of current interval choice
    const interval = intervalRatios[intervalIdx];
    const nextFreq = prevFreq * interval.ratio;
    const nextPosition = (speedOfSound / (2 * nextFreq)) - endCorrection;
    
    const distance = Math.abs(prevPosition - nextPosition);
    
    // Use holeIndex - 1 because we're calculating distance from previous hole
    return getWarningText(holeIndex - 1, distance);
}

// Get warning text based on distance
function getWarningText(holeIndex, distance) {
    if (holeIndex >= holeDistanceConstraints.length) {
        return '';
    }
    
    const constraint = holeDistanceConstraints[holeIndex];
    const dist = Math.abs(distance);
    
    if (dist >= constraint.comfortable.min && dist <= constraint.comfortable.max) {
        return '✓';
    } else if (dist >= constraint.difficult.min && dist <= constraint.difficult.max) {
        return '⚠ Difficult';
    } else if (dist > constraint.limit) {
        return `⚠ Exceeds ${constraint.limit}mm`;
    } else {
        return '⚠ Too close';
    }
}

function selectInterval(holeIndex, totalHoles) {
    const selectElement = document.getElementById(`interval-select-${holeIndex}`);
    const selectedIdx = parseInt(selectElement.value);
    const interval = intervalRatios[selectedIdx];
    
    const currentFreq = holeFrequencies[holeIndex];
    const nextFreq = currentFreq * interval.ratio;
    
    holeFrequencies.push(nextFreq);
    selectedIntervals.push(interval);
    
    // Recalculate table with selected intervals
    updateTableWithCustomIntervals();
    
    // Build next hole selector or finish
    if (holeIndex + 1 < totalHoles) {
        buildHoleSelector(holeIndex + 1, totalHoles);
    } else {
        buildHoleSelector(totalHoles, totalHoles); // Show completion message
    }
}

function updateTableWithCustomIntervals() {
    const diameter = parseFloat(document.getElementById('simple-diameter').value);
    const temp = parseFloat(document.getElementById('simple-temp').value);
    const speedOfSound = (331.3 + 0.606 * temp) * 1000; // mm/s
    const endCorrection = 0.6 * diameter;
    
    const tbody = document.getElementById('simple-tbody');
    tbody.innerHTML = '';
    
    // Calculate all positions first
    const positions = [];
    for (let i = 0; i < selectedIntervals.length; i++) {
        const frequency = holeFrequencies[i + 1];
        const effectiveLength = (speedOfSound / (2 * frequency)) - endCorrection;
        positions.push(effectiveLength);
    }
    
    // Build table rows with distance calculations
    for (let i = 0; i < selectedIntervals.length; i++) {
        const frequency = holeFrequencies[i + 1];
        const interval = selectedIntervals[i];
        const position = positions[i].toFixed(2);
        const note = getNoteName(frequency);
        
        // Calculate distance to next hole (center to center)
        let distanceCell = '';
        if (i < selectedIntervals.length - 1) {
            const distance = Math.abs(positions[i] - positions[i + 1]);
            distanceCell = distance.toFixed(2);
        } else {
            distanceCell = '—';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${position}</td>
            <td>${distanceCell}</td>
            <td>${interval.name} (${interval.ratio.toFixed(3)})</td>
            <td>${note}</td>
            <td>${frequency.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    }
    
    document.getElementById('simple-results').classList.remove('hidden');
}
