// Common utilities and shared functions

// Toggle algorithm explanation
function toggleAlgorithm(algoId) {
    const content = document.getElementById(algoId + '-content');
    const toggle = document.getElementById(algoId + '-toggle');
    
    content.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
}

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Deactivate all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Activate corresponding button
    event.target.classList.add('active');
}

// Note names for reference
const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getNoteFromSemitones(baseSemitones, offset) {
    const totalSemitones = (baseSemitones + offset) % 12;
    return noteNames[totalSemitones];
}

function getNoteName(frequency) {
    // A4 = 440 Hz
    const A4 = 440;
    const C0 = A4 * Math.pow(2, -4.75); // C0 frequency
    
    const halfSteps = 12 * Math.log2(frequency / C0);
    const noteIndex = Math.round(halfSteps) % 12;
    const octave = Math.floor(Math.round(halfSteps) / 12);
    
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return `${noteNames[noteIndex]}${octave}`;
}

// Show visualization modal
function showVisualization() {
    if (!currentFluteData) {
        alert(i18n.t('alert_calculate_first'));
        return;
    }
    
    // Generate SVG
    const svg = generateFluteSVG(currentFluteData);
    document.getElementById('flute-drawing-container').innerHTML = svg;
    
    // Show modal
    document.getElementById('visualization-modal').classList.add('active');
}

// Close visualization modal
function closeVisualization() {
    document.getElementById('visualization-modal').classList.remove('active');
}

// Close if clicking on backdrop
function closeVisualizationIfBackdrop(event) {
    if (event.target.id === 'visualization-modal') {
        closeVisualization();
    }
}

// Global variable to store current flute data for visualization
let currentFluteData = null;
