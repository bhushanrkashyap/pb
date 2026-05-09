// Local storage management for EcoSnap
const Storage = {
    STORAGE_KEY: 'ecosnap_history',

    saveDay: function(dayRecord) {
        let history = this.loadHistory();
        
        // Check if today already exists, if so replace it
        const today = dayRecord.date;
        history = history.filter(day => day.date !== today);
        history.push(dayRecord);

        // Keep only last 90 days
        if (history.length > 90) {
            history = history.slice(-90);
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        return history;
    },

    loadHistory: function() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    getDayRecord: function(date) {
        const history = this.loadHistory();
        return history.find(day => day.date === date) || null;
    },

    getWeeklyAverage: function() {
        const history = this.loadHistory();
        const week = history.slice(-7);
        
        if (week.length === 0) return 0;
        
        const total = week.reduce((sum, day) => sum + day.footprint, 0);
        return total / week.length;
    },

    getStreak: function() {
        const history = this.loadHistory();
        if (history.length === 0) return 0;

        let streak = 0;
        let currentDate = new Date();

        for (let i = history.length - 1; i >= 0; i--) {
            const historyDate = new Date(history[i].date);
            const daysDiff = Math.floor((currentDate - historyDate) / (1000 * 60 * 60 * 24));

            if (daysDiff === streak) {
                streak++;
                currentDate = historyDate;
            } else {
                break;
            }
        }

        return streak;
    },

    clearAllData: function() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    exportData: function() {
        const history = this.loadHistory();
        return JSON.stringify(history, null, 2);
    },

    importData: function(jsonData) {
        try {
            const history = JSON.parse(jsonData);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
            return true;
        } catch (e) {
            console.error('Invalid JSON data:', e);
            return false;
        }
    }
};
