// handlers/imageHandler.js
const sharp = require('sharp');
const { MessageMedia } = require('whatsapp-web.js');

const processImage = async (media, message) => {
    const buffer = Buffer.from(media.data, 'base64');
    const imageSize = Buffer.byteLength(buffer);

    const maxSize = 5 * 1024 * 1024;

    if (imageSize > maxSize) {
        await message.reply('Ukuran gambar terlalu besar. Maksimal ukuran adalah 5MB.');
        return;
    }

    try {
        const processedImage = await sharp(buffer)
            .sharpen()
            .toBuffer();

        const processedMedia = new MessageMedia(media.mimetype, processedImage.toString('base64'), media.filename);
        await message.reply(processedMedia, null, { caption: 'Gambar telah dijernihkan!' });
    } catch (error) {
        console.error('Gagal memproses gambar:', error);
        await message.reply('Terjadi kesalahan saat memproses gambar.');
    }
};

module.exports = {
    processImage,
};
