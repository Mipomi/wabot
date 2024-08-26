const axios = require('axios');

async function getQuranReading(surah, ayat) {
    try {
        const url = `https://api.alquran.cloud/v1/ayah/${surah}:${ayat}`;
        const response = await axios.get(url);
        return response.data.data.text;
    } catch (error) {
        console.error('Error fetching Quran ayat:', error.message);
        if (error.response && error.response.status === 404) {
            return 'Ayat tidak ditemukan. Periksa kembali surah dan ayat yang Anda masukkan.';
        } else {
            return 'Terjadi kesalahan saat mengambil ayat. Silakan coba lagi.';
        }
    }
}

module.exports = { getQuranReading };
