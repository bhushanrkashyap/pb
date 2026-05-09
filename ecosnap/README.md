# EcoSnap 🌱

**Track your daily carbon footprint in 60 seconds. Make greener choices instantly.**

A beautiful, instant carbon footprint calculator that helps individuals understand and reduce their daily environmental impact — no sign-up, no backend, works completely offline.

## ✨ Features

### Core Features
- **Quick Activity Logger** - One-click cards for common daily activities with easy-to-use sliders
- **Instant Carbon Dashboard** - Real-time CO₂e calculations with visual breakdown
- **AI-Powered Tips** - Personalized reduction suggestions based on your logged activities
- **7-Day History** - Track your footprint over time with localStorage persistence
- **Shareable Snapshots** - Download beautiful PNG summaries to share on social media

### Tech Stack
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Charts**: Chart.js for data visualization
- **Storage**: Browser localStorage for 100% offline functionality
- **Export**: html2canvas + jsPDF for snapshots
- **No Backend**: All calculations happen client-side

## 🚀 Quick Start

1. **Open the app**: Simply open `index.html` in a modern web browser
2. **Log your activities**: Adjust sliders for your daily habits (transportation, food, energy, waste, shopping)
3. **See your footprint**: Get instant CO₂e calculations with beautiful visualizations
4. **Get tips**: Receive AI-generated reduction suggestions tailored to your activities
5. **Track progress**: Your history is saved locally in your browser

## 📊 How It Works

### Emission Factors
Each activity category has scientifically-based carbon emission factors:
- **Transportation**: 0.21 kg CO₂e per km (average car)
- **Food**: 1.5 kg CO₂e per meal (average)
- **Energy**: 0.4 kg CO₂e per hour (heating/cooling/lights)
- **Waste**: 0.5 kg CO₂e per kg of waste
- **Shopping**: 3.0 kg CO₂e per new item

### Daily Comparison
Your footprint is compared against the average person (11 kg CO₂e/day in developed countries):
- 🟢 **Green** (≤7.7 kg CO₂e): Excellent - Below average
- 🟡 **Yellow** (7.7-13.2 kg CO₂e): Good - Average
- 🔴 **Red** (>13.2 kg CO₂e): High - Above average

## 💾 Data & Privacy

- **100% Local Storage**: All your data stays on your device
- **No Server**: Works completely offline - no internet required after first load
- **Opt-in Sync**: You control when and what data is shared
- **30-90 Day History**: Stored in browser localStorage, visible only to you

## 🎨 Design Philosophy

Clean, modern, nature-inspired aesthetics with:
- Soft greens and earth tones
- Minimal, spacious UI
- Hopeful, empowering tone
- Beautiful data visualizations
- Smooth animations and transitions

## 📝 User Flow

1. **Landing** → Hero with CTA "Calculate My Footprint"
2. **Activity Logger** → Select and adjust 5 main categories
3. **Live Results** → See total CO₂e with charts and tips
4. **Save & History** → Track progress over time

## 🔧 File Structure

```
ecosnap/
├── index.html                 # Main HTML file with Tailwind + Chart.js
├── app.js                     # Main application logic
├── data/
│   └── emissionFactors.js     # Carbon emission data
├── utils/
│   ├── calculator.js          # Footprint calculation logic
│   ├── storage.js             # localStorage management
│   └── tips.js                # AI-inspired tip generation
└── README.md                  # This file
```

## 🌍 Real-World Impact

- Average person: ~11 kg CO₂e/day
- If you reduce by 2 kg/day: **730 kg CO₂e saved/year** (equivalent to 160 gallons of gas)
- If 1,000 people use EcoSnap and each reduces by 1 kg/day: **365,000 kg CO₂e saved/year**

## 🎯 Future Enhancements

- [ ] Monthly carbon reports
- [ ] Comparison with friends/teams
- [ ] Integration with real carbon offset programs
- [ ] Dark mode
- [ ] Multiple languages
- [ ] Mobile app version
- [ ] Real API for emission factors (vs. local hardcoded)
- [ ] Premium features: detailed analysis, goal setting, achievement badges

## 📱 Browser Support

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

This is a demo project for educational and impact purposes. Feel free to fork and adapt for your own use case!

## 📄 License

MIT - Feel free to use for any purpose

---

**Made with 💚 for a sustainable future**

*EcoSnap: Because small actions create big impact.*
