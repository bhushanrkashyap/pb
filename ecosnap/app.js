// EcoSnap - Main Application Logic
class EcoSnap {
    constructor() {
        this.currentScreen = 'landing';
        this.activities = {
            transportation: { value: 0, multiplier: 1 },
            food: { value: 0, multiplier: 1 },
            energy: { value: 0, multiplier: 1 },
            waste: { value: 0, multiplier: 1 },
            shopping: { value: 0, multiplier: 1 }
        };
        this.dailyFootprint = 0;
        this.history = Storage.loadHistory();
        this.chart = null;
        this.animationFrames = [];
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    setState(screen) {
        this.currentScreen = screen;
        this.render();
        this.attachEventListeners();
    }

    calculateFootprint() {
        this.dailyFootprint = Calculator.calculate(this.activities);
        return this.dailyFootprint;
    }

    saveDay() {
        const today = new Date().toISOString().split('T')[0];
        const tips = Tips.generateTips(this.activities);
        
        const dayRecord = {
            date: today,
            footprint: this.dailyFootprint,
            activities: { ...this.activities },
            tips: tips
        };

        this.history = Storage.saveDay(dayRecord);
    }

    render() {
        const app = document.getElementById('app');
        
        switch (this.currentScreen) {
            case 'landing':
                app.innerHTML = this.renderLanding();
                break;
            case 'logger':
                app.innerHTML = this.renderLogger();
                break;
            case 'results':
                app.innerHTML = this.renderResults();
                break;
            case 'history':
                app.innerHTML = this.renderHistory();
                break;
            default:
                app.innerHTML = this.renderLanding();
        }
    }

    renderLanding() {
        return `
            <div class="min-h-screen flex flex-col items-center justify-center px-4">
                <div class="text-center max-w-2xl fade-in">
                    <div class="mb-8">
                        <span class="text-8xl leaf-icon">🌱</span>
                    </div>
                    <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        EcoSnap
                    </h1>
                    <p class="text-xl md:text-2xl text-gray-600 mb-6 leading-relaxed">
                        Track your daily carbon footprint in 60 seconds
                    </p>
                    <p class="text-lg text-gray-500 mb-10">
                        Make greener choices instantly. No sign-up. No backend. Works offline.
                    </p>
                    <button onclick="app.setState('logger')" class="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all">
                        Calculate My Footprint →
                    </button>
                    <div class="mt-12 text-sm text-gray-500">
                        <p>🔒 All data stays on your device • ⚡ Works completely offline</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderLogger() {
        const categories = [
            {
                id: 'transportation',
                name: 'Transportation',
                icon: '🚗',
                color: 'from-blue-400 to-blue-600',
                options: [
                    { label: 'Car (km driven)', unit: 'km' },
                    { label: 'Public transit', unit: 'km' }
                ]
            },
            {
                id: 'food',
                name: 'Food & Meals',
                icon: '🍽️',
                color: 'from-orange-400 to-orange-600',
                options: [
                    { label: 'Meat servings', unit: 'portions' },
                    { label: 'Vegan meals', unit: 'portions' }
                ]
            },
            {
                id: 'energy',
                name: 'Energy & Home',
                icon: '⚡',
                color: 'from-yellow-400 to-yellow-600',
                options: [
                    { label: 'Hours heating/cooling', unit: 'hrs' },
                    { label: 'Hours lights on', unit: 'hrs' }
                ]
            },
            {
                id: 'waste',
                name: 'Waste & Water',
                icon: '♻️',
                color: 'from-green-400 to-green-600',
                options: [
                    { label: 'Waste produced', unit: 'kg' },
                    { label: 'Showers taken', unit: 'count' }
                ]
            },
            {
                id: 'shopping',
                name: 'Shopping & Items',
                icon: '🛍️',
                color: 'from-pink-400 to-pink-600',
                options: [
                    { label: 'New items purchased', unit: 'count' },
                    { label: 'Online deliveries', unit: 'count' }
                ]
            }
        ];

        let cardsHTML = '';
        categories.forEach(cat => {
            const value = this.activities[cat.id].value;
            cardsHTML += `
                <div class="category-card card-hover bg-white rounded-2xl p-6 shadow-md border-b-4 border-transparent hover:border-emerald-500">
                    <div class="text-4xl mb-3">${cat.icon}</div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">${cat.name}</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-600 mb-2 font-medium">Quick Estimate</label>
                            <div class="flex items-center gap-3">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="20" 
                                    value="${value}"
                                    class="slider-input flex-1 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg appearance-none cursor-pointer"
                                    onchange="app.updateActivity('${cat.id}', this.value); app.calculateFootprint(); app.render();"
                                    oninput="app.updateActivity('${cat.id}', this.value); app.calculateFootprint(); app.updateFootprintDisplay();"
                                >
                                <span class="text-xl font-bold text-emerald-600 min-w-12 text-right tabular-nums">${value}</span>
                            </div>
                            <p class="text-xs text-gray-500 mt-2">${cat.options[0].label} (${cat.options[0].unit})</p>
                        </div>
                    </div>
                </div>
            `;
        });

        const streak = Storage.getStreak();
        const weeklyAvg = Storage.getWeeklyAverage();

        return `
            <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8 px-4">
                <div class="max-w-6xl mx-auto">
                    <div class="mb-8 screen-transition">
                        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Log Your Day</h2>
                        <p class="text-gray-600">Adjust sliders to match your daily activities</p>
                        ${streak > 0 ? `<p class="text-sm text-emerald-600 font-semibold mt-3">🔥 ${streak} day streak!</p>` : ''}
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        ${cardsHTML}
                    </div>

                    <div class="fixed bottom-8 left-8 right-8 md:relative md:bottom-auto md:left-auto md:right-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 screen-transition">
                        <div>
                            <p class="text-sm text-gray-600 mb-1">Today's Footprint</p>
                            <p class="text-4xl font-bold text-emerald-600 counter tabular-nums" id="footprintDisplay">${this.dailyFootprint.toFixed(2)} kg CO₂e</p>
                            ${weeklyAvg > 0 ? `<p class="text-xs text-gray-500 mt-2">Weekly avg: ${weeklyAvg.toFixed(2)} kg</p>` : ''}
                        </div>
                        <div class="flex gap-3">
                            <button onclick="app.setState('landing')" class="px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition transform hover:scale-105">
                                Back
                            </button>
                            <button onclick="app.proceedToResults()" class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105">
                                See Results →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    updateFootprintDisplay() {
        const display = document.getElementById('footprintDisplay');
        if (display) {
            display.textContent = this.dailyFootprint.toFixed(2) + ' kg CO₂e';
            display.classList.add('counter');
            // Force reflow to restart animation
            void display.offsetWidth;
        }
    }

    renderResults() {
        const footprint = this.dailyFootprint;
        const averagePerson = 11; // kg CO2e per day
        const comparison = (footprint / averagePerson * 100).toFixed(0);
        const history = this.history;
        const weeklyAvg = Storage.getWeeklyAverage();
        const streak = Storage.getStreak();
        const trend = weeklyAvg > 0 ? ((footprint - weeklyAvg) / weeklyAvg * 100).toFixed(0) : 0;
        
        const tips = Tips.generateTips(this.activities);
        
        let tipsHTML = tips.map((tip, idx) => `
            <div class="tip-card bg-emerald-50 rounded-lg p-4 mb-4 hover:bg-emerald-100 transition cursor-pointer shadow-sm hover:shadow-md" style="animation-delay: ${idx * 0.1}s">
                <p class="text-sm font-semibold text-emerald-900 mb-1">✨ ${tip.title}</p>
                <p class="text-sm text-emerald-700 leading-relaxed">${tip.description}</p>
            </div>
        `).join('');

        // Determine emoji level and color
        let levelEmoji = '🟢';
        let levelColor = 'text-emerald-600';
        let levelBg = 'bg-emerald-50';
        let levelMessage = 'Great! Below average';
        if (footprint > averagePerson * 1.2) {
            levelEmoji = '🔴';
            levelColor = 'text-red-600';
            levelBg = 'bg-red-50';
            levelMessage = 'Room for improvement';
        } else if (footprint > averagePerson * 0.8) {
            levelEmoji = '🟡';
            levelColor = 'text-yellow-600';
            levelBg = 'bg-yellow-50';
            levelMessage = 'Average footprint';
        }

        // Weekly comparison cards
        const weeklyHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 screen-transition">
                <div class="bg-white rounded-xl p-5 shadow-sm border-l-4 border-emerald-500 hover:shadow-md transition">
                    <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">7-Day Average</p>
                    <p class="text-3xl font-bold text-emerald-600 mt-3 tabular-nums">${weeklyAvg > 0 ? weeklyAvg.toFixed(2) : '—'}</p>
                    <p class="text-xs text-gray-500 mt-1">kg CO₂e</p>
                </div>
                <div class="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-500 hover:shadow-md transition">
                    <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Days Logged</p>
                    <p class="text-3xl font-bold text-blue-600 mt-3 tabular-nums">${history.length}</p>
                    <p class="text-xs text-gray-500 mt-1">total</p>
                </div>
                <div class="bg-white rounded-xl p-5 shadow-sm border-l-4 ${trend > 0 ? 'border-red-500' : 'border-emerald-500'} hover:shadow-md transition">
                    <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Today vs Avg</p>
                    <p class="text-3xl font-bold ${trend > 0 ? 'text-red-600' : 'text-emerald-600'} mt-3 tabular-nums">${trend > 0 ? '+' : ''}${trend}%</p>
                    <p class="text-xs text-gray-500 mt-1">${trend > 0 ? 'above' : 'below'}</p>
                </div>
            </div>
        `;

        return `
            <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8 px-4">
                <div class="max-w-4xl mx-auto">
                    <button onclick="app.setState('logger')" class="text-emerald-600 font-semibold mb-6 hover:text-emerald-700 hover:underline transition">← Adjust</button>

                    <div class="bg-white rounded-3xl shadow-lg p-8 mb-8 screen-transition">
                        <div class="text-center mb-8 gauge-container">
                            <span class="text-8xl bounce-in inline-block">${levelEmoji}</span>
                            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mt-4">Your Carbon Footprint</h2>
                            <div class="mt-6 mb-4">
                                <p class="text-5xl font-bold ${levelColor} counter tabular-nums">${footprint.toFixed(2)}</p>
                                <p class="text-2xl text-gray-600 mt-2">kg CO₂e Today</p>
                            </div>
                        </div>

                        <div class="comparison-card ${levelBg} rounded-2xl p-6 mb-8 screen-transition">
                            <div class="flex items-center justify-between mb-5">
                                <div>
                                    <p class="text-sm text-gray-600 font-semibold">vs. Average Person</p>
                                    <p class="text-4xl font-bold ${levelColor} mt-1 tabular-nums">${comparison}%</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm text-gray-600 font-semibold">Daily Average</p>
                                    <p class="text-3xl font-bold text-gray-900 mt-1 tabular-nums">${averagePerson}</p>
                                    <p class="text-xs text-gray-500">kg CO₂e</p>
                                </div>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2.5">
                                <div class="h-2.5 rounded-full transition-all duration-700 ${levelColor === 'text-emerald-600' ? 'bg-emerald-500' : levelColor === 'text-yellow-600' ? 'bg-yellow-500' : 'bg-red-500'}" style="width: ${Math.min(comparison, 200)}%"></div>
                            </div>
                            <p class="text-sm font-semibold mt-3 ${levelColor}">
                                ${comparison <= 100 ? '✓ You\'re doing better than average!' : '⚠ Try the tips below to reduce your impact!'}
                            </p>
                        </div>

                        ${weeklyHTML}

                        <div class="chart-container mb-8">
                            <div id="breakdownChart" class="relative h-64 md:h-80 w-full"></div>
                        </div>

                        <div class="mt-8">
                            <h3 class="text-2xl font-bold text-gray-900 mb-4">💡 Your AI-Generated Tips</h3>
                            <div class="space-y-0">
                                ${tipsHTML}
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 screen-transition">
                        <button onclick="app.saveAndContinue()" class="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105 hover:-translate-y-1">
                            ✓ Save & Continue
                        </button>
                        <button onclick="app.downloadSnapshot()" class="px-6 py-4 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition transform hover:scale-105 hover:-translate-y-1">
                            📸 Share Snapshot
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderHistory() {
        if (this.history.length === 0) {
            return `
                <div class="min-h-screen flex flex-col items-center justify-center px-4">
                    <div class="text-center bounce-in">
                        <p class="text-6xl mb-4">📅</p>
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">No History Yet</h2>
                        <p class="text-gray-600 mb-6">Start logging your activities to build your history</p>
                        <button onclick="app.setState('logger')" class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105">
                            Start Logging
                        </button>
                    </div>
                </div>
            `;
        }

        const streak = Storage.getStreak();
        const weeklyAvg = Storage.getWeeklyAverage();
        const maxFootprint = Math.max(...this.history.map(d => d.footprint));
        const minFootprint = Math.min(...this.history.map(d => d.footprint));

        const historyHTML = this.history.slice().reverse().map((day, idx) => {
            const intensity = (day.footprint - minFootprint) / (maxFootprint - minFootprint);
            const color = intensity < 0.4 ? 'bg-emerald-100 border-emerald-500' : intensity < 0.7 ? 'bg-yellow-100 border-yellow-500' : 'bg-red-100 border-red-500';
            
            return `
                <div class="tip-card ${color} rounded-lg p-4 shadow-sm border-l-4 hover:shadow-md transition cursor-pointer" style="animation-delay: ${idx * 0.05}s">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-semibold text-gray-900">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                            <p class="text-xs text-gray-600 mt-1">
                                ${day.activities.transportation.value > 0 ? '🚗 ' : ''}${day.activities.food.value > 0 ? '🍽️ ' : ''}${day.activities.energy.value > 0 ? '⚡ ' : ''}${day.activities.waste.value > 0 ? '♻️ ' : ''}${day.activities.shopping.value > 0 ? '🛍️ ' : ''}
                            </p>
                        </div>
                        <div class="text-right">
                            <p class="text-2xl font-bold ${intensity < 0.4 ? 'text-emerald-600' : intensity < 0.7 ? 'text-yellow-600' : 'text-red-600'} tabular-nums">${day.footprint.toFixed(2)}</p>
                            <p class="text-xs text-gray-500 mt-1">kg CO₂e</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8 px-4">
                <div class="max-w-2xl mx-auto">
                    <button onclick="app.setState('landing')" class="text-emerald-600 font-semibold mb-6 hover:text-emerald-700 hover:underline transition">← Home</button>
                    
                    <div class="screen-transition mb-8">
                        <h2 class="text-3xl font-bold text-gray-900 mb-6">📊 Your History</h2>
                        
                        <div class="grid grid-cols-3 gap-4 mb-8">
                            <div class="bg-white rounded-xl p-4 shadow-sm border-l-4 border-emerald-500">
                                <p class="text-xs text-gray-600 font-semibold">Days Logged</p>
                                <p class="text-3xl font-bold text-emerald-600 mt-2">${this.history.length}</p>
                            </div>
                            <div class="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
                                <p class="text-xs text-gray-600 font-semibold">Weekly Average</p>
                                <p class="text-3xl font-bold text-blue-600 mt-2">${weeklyAvg.toFixed(1)}</p>
                            </div>
                            <div class="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
                                <p class="text-xs text-gray-600 font-semibold">🔥 Streak</p>
                                <p class="text-3xl font-bold text-orange-600 mt-2">${streak}</p>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        ${historyHTML}
                    </div>

                    <div class="mt-8 pt-6 border-t border-gray-200 text-center">
                        <button onclick="if(confirm('Clear all history?')) { Storage.clearAllData(); app.history = []; app.setState('landing'); }" class="text-sm text-gray-500 hover:text-red-600 transition">
                            Clear History
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    updateActivity(category, value) {
        this.activities[category].value = parseFloat(value);
    }

    proceedToResults() {
        this.setState('results');
        setTimeout(() => this.drawBreakdownChart(), 0);
    }

    saveAndContinue() {
        this.saveDay();
        this.resetActivities();
        this.setState('landing');
    }

    resetActivities() {
        this.activities = {
            transportation: { value: 0, multiplier: 1 },
            food: { value: 0, multiplier: 1 },
            energy: { value: 0, multiplier: 1 },
            waste: { value: 0, multiplier: 1 },
            shopping: { value: 0, multiplier: 1 }
        };
        this.dailyFootprint = 0;
    }

    drawBreakdownChart() {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            const container = document.getElementById('breakdownChart');
            if (!container) return;

            // Destroy previous chart if exists
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }

            // Create canvas if it doesn't exist
            if (!container.querySelector('canvas')) {
                const canvas = document.createElement('canvas');
                container.appendChild(canvas);
            }

            const ctx = container.querySelector('canvas').getContext('2d');
            if (!ctx) {
                console.warn('Could not get canvas context');
                return;
            }

            const categories = ['Transportation', 'Food', 'Energy', 'Waste', 'Shopping'];
            const emissions = [
                this.activities.transportation.value * EMISSION_FACTORS.transportation,
                this.activities.food.value * EMISSION_FACTORS.food,
                this.activities.energy.value * EMISSION_FACTORS.energy,
                this.activities.waste.value * EMISSION_FACTORS.wasteProduced,
                this.activities.shopping.value * EMISSION_FACTORS.shopping
            ];

            const total = emissions.reduce((a, b) => a + b, 0);
            const percentages = emissions.map(e => total > 0 ? (e / total * 100).toFixed(0) : 0);

            try {
                this.chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: categories.map((cat, idx) => `${cat} ${percentages[idx]}%`),
                        datasets: [{
                            data: emissions,
                            backgroundColor: [
                                '#3b82f6',
                                '#fb923c',
                                '#eab308',
                                '#10b981',
                                '#ec4899'
                            ],
                            borderColor: '#ffffff',
                            borderWidth: 3,
                            borderRadius: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    font: { size: 13, weight: '600' },
                                    padding: 15,
                                    usePointStyle: true,
                                    pointStyle: 'circle'
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return context.label + ': ' + context.parsed.toFixed(2) + ' kg CO₂e';
                                    }
                                }
                            }
                        },
                        animation: {
                            animateRotate: true,
                            animateScale: true
                        }
                    }
                });
            } catch (e) {
                console.warn('Chart rendering issue:', e);
            }
        }, 100);
    }

    downloadSnapshot() {
        const element = document.querySelector('.bg-white.rounded-3xl');
        html2canvas(element, { scale: 2 }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = `ecosnap-${new Date().toISOString().split('T')[0]}.png`;
            link.click();
        });
    }

    attachEventListeners() {
        // Event listeners are attached inline in render methods
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new EcoSnap();
});
