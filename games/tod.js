const fs = require('fs');
const path = require('path');

// Fungsi untuk membaca file JSON
function loadTodData() {
    const dataPath = path.join(__dirname, 'data', 'tod.json');
    const rawData = fs.readFileSync(dataPath);
    return JSON.parse(rawData);
}

// Memuat data Truth or Dare dari file JSON
const todData = loadTodData();

function getTruthQuestion() {
    const truths = todData.truths;
    return truths[Math.floor(Math.random() * truths.length)];
}

function getDareChallenge() {
    const dares = todData.dares;
    return dares[Math.floor(Math.random() * dares.length)];
}

module.exports = {getTruthQuestion, getDareChallenge}