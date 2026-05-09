// Carbon Emission Factors (kg CO2e per unit)
const EMISSION_FACTORS = {
    // Transportation (per km)
    transportation: 0.21,  // Average car emissions
    publicTransit: 0.04,   // Bus/train per km
    
    // Food (per serving/portion)
    food: 1.5,             // Average meal (meat + vegan combined)
    meatServing: 2.5,      // Meat-based meal
    veganMeal: 0.5,        // Plant-based meal
    
    // Energy (per hour of usage)
    energy: 0.4,           // Combined heating/cooling/lights
    heating: 0.5,          // Per hour
    cooling: 0.6,          // Per hour (more energy intensive)
    lighting: 0.15,        // Per hour for full home
    
    // Waste & Water (per unit)
    wasteProduced: 0.5,    // Per kg of waste
    showerTaken: 0.8,      // Per shower (15 min average)
    
    // Shopping & Items
    shopping: 3.0,         // Per new item purchased (avg clothing, goods)
    onlineDelivery: 1.2    // Per delivery
};

// Activity mapping to multipliers based on intensity
const ACTIVITY_MULTIPLIERS = {
    transportation: {
        minimal: 0.5,      // 0-5 km
        moderate: 1.0,     // 5-15 km
        high: 1.5          // 15+ km
    },
    food: {
        minimal: 0.8,      // Mostly vegan
        moderate: 1.0,     // Mixed diet
        high: 1.5          // Meat-heavy
    },
    energy: {
        minimal: 0.6,      // Efficient usage
        moderate: 1.0,     // Average
        high: 1.5          // Heavy usage
    },
    waste: {
        minimal: 0.5,      // Low waste
        moderate: 1.0,     // Average
        high: 1.8          // High waste
    },
    shopping: {
        minimal: 0.3,      // Minimal purchases
        moderate: 1.0,     // Average
        high: 2.0          // High consumption
    }
};
