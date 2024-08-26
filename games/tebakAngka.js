const fs = require('fs');
const activeGames = new Map();
const config = JSON.parse(fs.readFileSync('./config.json'));
const prefix = config.prefix;

function startGame(chatId, client) {
    // Randomkan angka dari 1 sampai 100
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    // Simpan data game
    activeGames.set(chatId, {
        number: randomNumber,
        attempts: 0,
        startedAt: new Date()
    });
}

function handleGuess(chatId, guess, client, message) {
    if (!activeGames.has(chatId)) {
        message.reply(`Permainan belum dimulai. Gunakan ${prefix}gameangka untuk memulai`);
        return;
    }

    const game = activeGames.get(chatId);
    game.attempts++;

    if (guess === game.number) {
        client.sendMessage(message.from, `Selamat! Kamu menebak angka ${game.number} dengan ${game.attempts} percobaan.`);
        activeGames.delete(chatId);
    } else if (guess < game.number) {
        client.sendMessage(message.from, 'Terlalu rendah. Coba lagi!');
    } else {
        client.sendMessage(message.from, 'Terlalu tinggi. Coba lagi!');
    }
}

function endGame(chatId, client, message) {
    if (!activeGames.has(chatId)) {
        message.reply('Permainan belum dimulai atau sudah selesai.');
        return;
    }

    const game = activeGames.get(chatId);
    const endTime = new Date();
    const duration = Math.floor((endTime - game.startedAt) / 1000); // durasi dalam detik
    client.sendMessage(message.from, `Permainan berakhir! Angka yang benar adalah ${game.number}. Total percobaan: ${game.attempts}. Durasi permainan: ${duration} detik.`);
    activeGames.delete(chatId);
}

module.exports = { startGame, handleGuess, endGame };
