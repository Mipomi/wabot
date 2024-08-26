module.exports = async function(client, message) {
    const [command, number, ...msg] = message.body.split(' ');
    const confessionMessage = msg.join(' ');

    // Ambil nomor bot
    const botNumber = client.info.wid._serialized; // Ambil nomor bot dalam format serialized

    // Cek apakah nomor tujuan tidak sama dengan nomor bot
    if (number + '@c.us' !== botNumber) {
        try {
            await client.sendMessage(number + '@c.us', `*Kamu memiliki pesan:* ${confessionMessage}`);
            message.reply('Berhasil confess secara anonim.');
        } catch (error) {
            console.error('Failed to send message:', error);
            message.reply('Failed to send your confession. Please try again later.');
        }
    } else {
        message.reply('You cannot send a confession to the bot number.');
    }
};
