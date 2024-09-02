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

async function getFullSurah(surahNumber) {
    try {
        const url = `https://api.alquran.cloud/v1/surah/${surahNumber}`;
        const response = await axios.get(url);
        const surah = response.data.data;

        // Periksa apakah 'ayahs' ada dan valid
        if (!surah || !surah.ayahs || surah.ayahs.length === 0) {
            return 'Data surah tidak ditemukan atau kosong. Pastikan nomor surah benar.';
        }

        // Menggabungkan semua ayat dalam surah menjadi satu string
        let surahText = `Surah ${surah.englishName} (${surah.name}):\n\n`;
        surah.ayahs.forEach(ayah => {
            surahText += `${ayah.numberInSurah}. ${ayah.text}\n`;
        });

        return surahText;
    } catch (error) {
        console.error('Error fetching surah:', error.message);
        return 'Tidak dapat mengambil surah tersebut. Pastikan nomor surah yang dimasukkan benar.';
    }
}


module.exports = { getQuranReading, getFullSurah };
