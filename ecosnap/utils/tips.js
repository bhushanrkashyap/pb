// AI-inspired tip generation system
const Tips = {
    generateTips: function(activities) {
        const tips = [];
        const potential = Calculator.getReductionPotential(activities);
        const total = Calculator.calculate(activities);

        // Prioritize highest impact areas
        const impacts = [
            { category: 'shopping', value: activities.shopping.value, factor: EMISSION_FACTORS.shopping },
            { category: 'transportation', value: activities.transportation.value, factor: EMISSION_FACTORS.transportation },
            { category: 'food', value: activities.food.value, factor: EMISSION_FACTORS.food },
            { category: 'energy', value: activities.energy.value, factor: EMISSION_FACTORS.energy },
            { category: 'waste', value: activities.waste.value, factor: EMISSION_FACTORS.waste }
        ].sort((a, b) => (b.value * b.factor) - (a.value * a.factor));

        // Transportation tips
        if (activities.transportation.value > 8) {
            tips.push({
                title: 'Consider Carpooling or Public Transit',
                description: 'You drove quite a bit today (≈' + (activities.transportation.value * EMISSION_FACTORS.transportation).toFixed(1) + ' kg CO₂e). Sharing rides or using public transport could cut this by 50% tomorrow.'
            });
        } else if (activities.transportation.value > 3) {
            tips.push({
                title: 'Try One Car-Free Day Per Week',
                description: 'Your driving is moderate. One carpool day per week could save 100kg CO₂e yearly!'
            });
        } else if (activities.transportation.value > 0) {
            tips.push({
                title: 'Excellent Transportation Choices! 🚴',
                description: 'You kept driving minimal. Keep biking or walking when possible!'
            });
        } else {
            tips.push({
                title: 'Zero-Emission Travel Today! 🌟',
                description: 'Perfect! You\'ve completely eliminated transport emissions. That\'s amazing!'
            });
        }

        // Food tips
        if (activities.food.value > 4) {
            tips.push({
                title: 'Try "Meat-Free Monday" Challenge',
                description: 'Each plant-based meal produces 60% less CO₂ than meat. Your ' + (activities.food.value * EMISSION_FACTORS.food).toFixed(1) + ' kg from food could drop to ~' + (activities.food.value * 0.4).toFixed(1) + ' kg with veggie swaps!'
            });
        } else if (activities.food.value > 2) {
            tips.push({
                title: 'Balance Your Plate More',
                description: 'Good diet choices overall. Try replacing 1 meat meal per week with plant-based options.'
            });
        } else if (activities.food.value > 0) {
            tips.push({
                title: 'You\'re Eating Sustainably! 🥬',
                description: 'Your food choices are climate-friendly. Keep up the plant-forward eating!'
            });
        }

        // Energy tips
        if (activities.energy.value > 12) {
            tips.push({
                title: 'Optimize Your Home Temperature',
                description: 'You\'re using significant energy (' + (activities.energy.value * EMISSION_FACTORS.energy).toFixed(1) + ' kg CO₂e). Adjusting thermostat by 1-2°C could save 0.2-0.4 kg daily!'
            });
        } else if (activities.energy.value > 6) {
            tips.push({
                title: 'Switch to LED Bulbs',
                description: 'LED lighting uses 75% less energy than incandescent. Your lighting could drop emissions by 0.1kg daily!'
            });
        } else if (activities.energy.value > 0) {
            tips.push({
                title: 'Excellent Energy Efficiency! 💡',
                description: 'You\'re being mindful with heating, cooling, and lights. Maintain these great habits!'
            });
        }

        // Shopping & Consumption tips
        if (activities.shopping.value > 3) {
            tips.push({
                title: 'Practice the "30-Day Rule"',
                description: 'Each purchase has embedded carbon. Wait 30 days before non-essential buys. Your ' + (activities.shopping.value * EMISSION_FACTORS.shopping).toFixed(1) + ' kg could drop by 70% with mindful consumption!'
            });
        } else if (activities.shopping.value > 1) {
            tips.push({
                title: 'Shop Secondhand First',
                description: 'Thrift, swap, or borrow before buying new. You\'ll save money AND carbon!'
            });
        } else if (activities.shopping.value > 0) {
            tips.push({
                title: 'Smart Shopping Choices! 🛍️',
                description: 'You\'re being mindful with purchases. Quality over quantity is the way!'
            });
        }

        // Waste tips
        if (activities.waste.value > 3) {
            tips.push({
                title: 'Go Zero-Waste Where You Can',
                description: 'Your waste (' + (activities.waste.value * EMISSION_FACTORS.wasteProduced).toFixed(1) + ' kg CO₂e) includes decomposition emissions. Compost and reduce packaging!'
            });
        } else if (activities.waste.value > 1) {
            tips.push({
                title: 'Compost Food Scraps',
                description: 'Composting reduces methane emissions from landfills. Start with a small bin!'
            });
        } else {
            tips.push({
                title: 'You\'re Keeping Waste Low! ♻️',
                description: 'Your waste minimization is making a real difference!'
            });
        }

        // Overall motivation/celebration
        if (potential > 10) {
            tips.push({
                title: '🎯 Your Biggest Opportunities',
                description: 'By optimizing your top activities, you could reduce by ' + potential.toFixed(1) + ' kg CO₂e tomorrow. That\'s like taking ' + (potential * 2.5).toFixed(0) + ' cars off the road for 1 day!'
            });
        } else if (total < 8) {
            tips.push({
                title: '🌟 You\'re an EcoChampion!',
                description: 'Your footprint (' + total.toFixed(1) + ' kg) is 27% below average! Inspire others with your sustainable choices.'
            });
        } else {
            tips.push({
                title: '💚 Small Changes, Big Impact',
                description: 'Even reducing by 10% tomorrow (1 more sustainable choice) = 36.5 kg CO₂e saved per year!'
            });
        }

        // Return top 5 tips
        return tips.slice(0, 5);
    },

    getTipForCategory: function(category, value) {
        const tips = {
            transportation: [
                '🚗 Consider biking or walking for trips under 2km',
                '🚌 Carpool to cut carbon emissions by 50%',
                '🚄 Use public transit for longer distances',
                '🔧 Maintain your vehicle for better fuel efficiency',
                '🛴 Try e-bikes or scooters for short trips'
            ],
            food: [
                '🥗 Try Meatless Mondays - save 2kg CO₂e per meal',
                '🌱 Local and seasonal produce has 40% fewer emissions',
                '📦 Reduce food waste through meal planning',
                '🥜 Choose plant-based proteins more often',
                '🍎 Buy from farmers markets to reduce transport'
            ],
            energy: [
                '💡 Switch to LED bulbs - save 0.08kg CO₂e per bulb/year',
                '🌡️ Lower thermostat 1°C in winter, raise 1°C in summer',
                '📱 Use smart power strips to eliminate phantom loads',
                '🪟 Seal air leaks to reduce heating/cooling needs',
                '♻️ Use renewable energy programs when available'
            ],
            waste: [
                '🛍️ Use reusable bags and containers',
                '🌿 Compost food scraps - save 0.2kg CO₂e per day',
                '🚿 Take shorter showers (5 min saves 0.8kg CO₂e/shower)',
                '🔧 Repair items instead of replacing them',
                '📚 Buy secondhand and sell used items'
            ],
            shopping: [
                '👖 Buy secondhand clothing first - 90% less carbon',
                '⏰ Apply the "30-day rule" before purchases',
                '🎁 Borrow or rent instead of buying',
                '♻️ Choose sustainable/certified brands',
                '💭 One less item per week = 156kg CO₂e saved/year'
            ]
        };

        const categoryTips = tips[category] || [];
        return categoryTips[Math.floor(Math.random() * categoryTips.length)] || '💚 Great effort!';
    }
};
