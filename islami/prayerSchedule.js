const fs = require('fs');
const axios = require('axios');

// Membaca file lokasi jika sudah ada, atau membuat file baru

async function getJadwalShalat(location) {
    try {
        const url = `https://api.aladhan.com/v1/timingsByCity?city=${location}&country=Indonesia&method=2`;
        const response = await axios.get(url);
        return response.data.data.timings;
    } catch (error) {
        console.error('Error fetching prayer times:', error.message);
        return 'Tidak dapat mengambil jadwal shalat. Coba periksa lokasi atau koneksi Anda.';
    }
}
module.exports = {getJadwalShalat}