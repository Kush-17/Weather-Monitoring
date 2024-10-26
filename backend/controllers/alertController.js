const { db } = require('../db/firebase');
const config = require('../config/config');

// Check for alerts based on temperature threshold
const checkForAlerts = async () => {
    const weatherRef = db.collection('weather');
    const snapshot = await weatherRef.orderBy('time', 'desc').limit(2).get();

    if (snapshot.size === 2) {
        const [latest, previous] = snapshot.docs.map(doc => doc.data());

        if (latest.temp > config.alertThresholds.temperature &&
            previous.temp > config.alertThresholds.temperature) {
            const alert = `ALERT: High temperature of ${latest.temp}°C in ${latest.city}`;
            await db.collection('alerts').add({ message: alert, time: new Date() });
            console.log(alert);
        }
    } else {
        console.log("Not enough data to check alerts.");
    }
};

module.exports = { checkForAlerts };
