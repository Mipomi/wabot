const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');
const config = require('../config.json'); // Memuat konfigurasi dari file

const removeBackground = async (media, msg, client) => {
    if (media.data.length > 2 * 1024 * 1024) {
        return msg.reply('Ukuran gambar terlalu besar. Harap kirim gambar yang ukurannya kurang dari 2MB.');
    }

    const buffer = Buffer.from(media.data, 'base64');
    const formData = new FormData();
    formData.append('image_file', buffer, {
        filename: 'image.png',
        contentType: media.mimetype
    });

    try {
        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': config.removeBgApiKey // Menggunakan API key dari file konfigurasi
            },
            responseType: 'arraybuffer'
        });

        if (response.headers['x-ratelimit-remaining'] === '0') {
            return msg.reply('Anda sudah mencapai batas limit penggunaan API. Silakan coba lagi nanti atau upgrade akun Anda.');
        }

        const outputBuffer = Buffer.from(response.data, 'binary');
        const outputFilePath = `./output/${msg.from}.png`;
        fs.writeFileSync(outputFilePath, outputBuffer);

        const outputMedia = MessageMedia.fromFilePath(outputFilePath);
        await client.sendMessage(msg.from, outputMedia, { caption: 'Berikut gambar dengan latar belakang yang dihapus.' });

        // Hapus file setelah dikirim
        fs.unlinkSync(outputFilePath);
    } catch (error) {
        console.error(error);

        if (error.response && error.response.status === 402) {
            msg.reply('Limit API Anda telah habis. Silakan upgrade akun Anda atau tunggu hingga limit diperbarui.');
        } else {
            msg.reply('Terjadi kesalahan saat mencoba menghapus latar belakang. Silakan coba lagi nanti.');
        }
    }
};

module.exports = removeBackground;
