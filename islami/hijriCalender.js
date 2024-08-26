const { default: axios } = require("axios");

async function getHijriDate() {
    try {
        const url = `https://api.aladhan.com/v1/gToH`;
        const response = await axios.get(url);
        return response.data.data.hijri.date;
    } catch (error) {
        console.error('Error fetching Hijri date:', error.message);
        return 'Tidak dapat mengambil tanggal Hijriah. Silakan coba lagi.';
    }
}

module.exports = {getHijriDate};
