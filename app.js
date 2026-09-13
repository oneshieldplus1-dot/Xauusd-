// --- State Management ---
// We use Local Storage so your data persists even if you refresh the page.
// In a real app, this would be replaced by API calls to your backend.

const STORAGE_KEY = 'gold_signals_data';

// --- DOM Elements ---
const signalForm = document.getElementById('signalForm');
const signalFeed = document.getElementById('signalFeed');

// --- Functions ---

// 1. Get Signals from Local Storage
function getSignals() {
    const signals = localStorage.getItem(STORAGE_KEY);
    return signals ? JSON.parse(signals) : [];
}

// 2. Save Signals to Local Storage
function saveSignals(signals) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
}

// 3. Format Time
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.round(diffMins/60)}h ago`;
}

// 4. Render Signals to the UI
function renderSignals() {
    const signals = getSignals();
    
    if (signals.length === 0) {
        signalFeed.innerHTML = `
            <div class="empty-state">
                <h3>No signals yet</h3>
                <p>Be the first to publish a Gold signal using the form.</p>
            </div>
        `;
        return;
    }

    signalFeed.innerHTML = '';
    
    // Sort by newest first
    signals.sort((a, b) => b.timestamp - a.timestamp).forEach(signal => {
        const card = document.createElement('div');
        card.className = 'signal-card';
        
        card.innerHTML = `
            <div class="signal-left">
                <div class="badge ${signal.direction.toLowerCase()}">${signal.direction}</div>
                <div class="signal-info">
                    <h3>${signal.pair}</h3>
                    <p>Lot Size: ${signal.lot}</p>
                </div>
            </div>
            
            <div class="signal-levels">
                <div class="level-item">
                    <span>Entry</span>
                    <span class="entry">${parseFloat(signal.entry).toFixed(2)}</span>
                </div>
                <div class="level-item">
                    <span>Take Profit</span>
                    <span class="tp">${parseFloat(signal.tp).toFixed(2)}</span>
                </div>
                <div class="level-item">
                    <span>Stop Loss</span>
                    <span class="sl">${parseFloat(signal.sl).toFixed(2)}</span>
                </div>
            </div>
            
            <div class="signal-meta">
                <span class="author">You</span>
                <span>${formatTime(signal.timestamp)}</span>
            </div>
        `;
        
        signalFeed.appendChild(card);
    });
}

// 5. Handle Form Submission
signalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get values from form
    const newSignal = {
        id: Date.now(), // Unique ID
        pair: document.getElementById('pair').value,
        direction: document.querySelector('input[name="direction"]:checked').value,
        entry: document.getElementById('entry').value,
        tp: document.getElementById('tp').value,
        sl: document.getElementById('sl').value,
        lot: document.getElementById('lot').value,
        timestamp: Date.now()
    };

    // Save to local storage
    const signals = getSignals();
    signals.push(newSignal);
    saveSignals(signals);

    // Reset form and re-render
    signalForm.reset();
    renderSignals();
});

// 6. Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderSignals();
});
