const activeRouletteGames = new Map();

async function startRouletteGame(chatId, client) {
    const chat = await client.getChatById(chatId);

    if (chat.isGroup) {
        const participants = chat.participants; // Mengambil daftar peserta grup
        if (participants.length < 2) {
            client.sendMessage(chatId, 'Grup harus memiliki setidaknya dua peserta untuk memulai permainan.');
            return;
        }

        // Pilih pemenang secara acak
        const winnerIndex = Math.floor(Math.random() * participants.length);
        const winner = participants[winnerIndex].id._serialized;

        // Simpan data game
        activeRouletteGames.set(chatId, {
            winner: winner
        });

        client.sendMessage(chatId, `Permainan Roulette dimulai! Tunggu sebentar untuk hasilnya...`);
        setTimeout(() => {
            client.sendMessage(chatId, `Pemenang Roulette adalah @${winner}! Selamat!`);
        }, 3000); // Menampilkan hasil pemenang setelah 3 detik
    } else {
        client.sendMessage(chatId, 'Perintah ini hanya dapat digunakan dalam grup.');
    }
}

function endRouletteGame(chatId, client, message) {
    if (!activeRouletteGames.has(chatId)) {
        message.reply('Permainan Roulette belum dimulai atau sudah selesai.');
        return;
    }

    const game = activeRouletteGames.get(chatId);
    client.sendMessage(chatId, `Permainan Roulette sudah dihentikan. Pemenang sebelumnya adalah @${game.winner}.`);
    activeRouletteGames.delete(chatId);
}

module.exports = { startRouletteGame, endRouletteGame };
