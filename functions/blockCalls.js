module.exports = function(client) {
    client.on('incoming_call', async (call) => {
        // Blokir kontak yang mencoba menelepon
        await client.blockContact(call.from);
        console.log(`Blocked contact: ${call.from}`);

        // Kirim pesan peringatan kepada kontak yang diblokir
        await client.sendMessage(call.from, 'You have been blocked because calls to this bot are not allowed.');
    });
};