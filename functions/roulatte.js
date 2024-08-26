const activeRouletteGames = new Map();

function startRouletteGame(chatId, client) {
    const groupChat = client.getChatById(chatId);
    groupChat.getParticipants().then(participants => {
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

        client.sendMessage(chatId, `Permainan Roulette dimulai! Siapakah yang akan menang?`);
        setTimeout(() => {
            client.sendMessage(chatId, `<@${winner}> adalah pemenangnya! Selamat!`);
        }, 3000); // Menampilkan hasil pemenang setelah 3 detik
    });
}

function endRouletteGame(chatId, client, message) {
    if (!activeRouletteGames.has(chatId)) {
        message.reply('Permainan Roulette belum dimulai atau sudah selesai.');
        return;
    }

    const game = activeRouletteGames.get(chatId);
    client.sendMessage(chatId, `Permainan Roulette sudah dihentikan. Pemenang sebelumnya adalah <@${game.winner}>.`);
    activeRouletteGames.delete(chatId);
}

module.exports = { startRouletteGame, endRouletteGame };
