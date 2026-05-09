// Calculator utility for carbon footprint calculations
const Calculator = {
    calculate: function(activities) {
        let total = 0;

        // Transportation: 0.21 kg CO2e per km
        total += activities.transportation.value * EMISSION_FACTORS.transportation;

        // Food: 1.5 kg CO2e per meal average
        total += activities.food.value * EMISSION_FACTORS.food;

        // Energy: 0.4 kg CO2e per hour
        total += activities.energy.value * EMISSION_FACTORS.energy;

        // Waste: 0.5 kg CO2e per kg waste
        total += activities.waste.value * EMISSION_FACTORS.wasteProduced;

        // Shopping: 3.0 kg CO2e per item (clothing, goods, etc)
        total += activities.shopping.value * EMISSION_FACTORS.shopping;

        return Math.max(0, total); // Ensure non-negative
    },

    calculateByCategory: function(activities) {
        return {
            transportation: activities.transportation.value * EMISSION_FACTORS.transportation,
            food: activities.food.value * EMISSION_FACTORS.food,
            energy: activities.energy.value * EMISSION_FACTORS.energy,
            waste: activities.waste.value * EMISSION_FACTORS.wasteProduced,
            shopping: activities.shopping.value * EMISSION_FACTORS.shopping
        };
    },

    getAverageFootprint: function() {
        // Average person in developed country: 11 kg CO2e per day
        // Global average: 4 kg CO2e per day
        return 11;
    },

    getEmissionLevel: function(footprint) {
        const avg = this.getAverageFootprint();
        if (footprint <= avg * 0.6) return 'excellent';
        if (footprint <= avg * 0.8) return 'good';
        if (footprint <= avg * 1.2) return 'average';
        if (footprint <= avg * 1.5) return 'high';
        return 'very-high';
    },

    getEmissionColor: function(level) {
        const colors = {
            excellent: '#10b981', // emerald
            good: '#3b82f6',      // blue
            average: '#eab308',   // yellow
            high: '#f97316',      // orange
            'very-high': '#ef4444' // red
        };
        return colors[level] || '#6b7280';
    },

    getReductionPotential: function(activities) {
        // Calculate how much could be reduced with lifestyle changes
        let potential = 0;

        // If driving a lot, could reduce by 50% with carpooling/transit
        if (activities.transportation.value > 5) {
            potential += activities.transportation.value * 0.5 * EMISSION_FACTORS.transportation;
        }

        // If food high, could reduce by 60% with plant-based
        if (activities.food.value > 3) {
            potential += activities.food.value * 0.6 * EMISSION_FACTORS.food;
        }

        // If energy high, could reduce by 40% with efficiency
        if (activities.energy.value > 8) {
            potential += activities.energy.value * 0.4 * EMISSION_FACTORS.energy;
        }

        // If shopping high, could reduce by 70% with mindful consumption
        if (activities.shopping.value > 2) {
            potential += activities.shopping.value * 0.7 * EMISSION_FACTORS.shopping;
        }

        // If waste high, could reduce by 50% with zero-waste practices
        if (activities.waste.value > 2) {
            potential += activities.waste.value * 0.5 * EMISSION_FACTORS.waste;
        }

        return Math.round(potential * 10) / 10;
    },

    getDailyTrend: function(history) {
        if (history.length === 0) return 0;
        
        const recent = history.slice(-7);
        const average = recent.reduce((sum, day) => sum + day.footprint, 0) / recent.length;
        return Math.round(average * 10) / 10;
    },

    getMonthlyReduction: function(history) {
        if (history.length < 2) return 0;
        
        const firstDay = history[0].footprint;
        const lastDay = history[history.length - 1].footprint;
        return Math.round((firstDay - lastDay) * 10) / 10;
    },

    getYearlyProjection: function(dailyFootprint) {
        return Math.round(dailyFootprint * 365);
    },

    getCarbonEquivalents: function(footprint) {
        return {
            gallonsOfGas: Math.round(footprint / 0.0088 * 10) / 10,
            milesOfDriving: Math.round(footprint / 0.21 * 10) / 10,
            treesPerYear: Math.round(footprint * 365 / 21 * 10) / 10, // Trees absorb ~21kg CO2/year
            streamsPerYear: Math.round(footprint * 365 / 1.5) // Streaming 1 hour = ~1.5g CO2
        };
    }
};
