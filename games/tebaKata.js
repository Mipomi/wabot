const activeWordGames = new Map();
const fs = require('fs');
const path = require('path');
const config = JSON.parse(fs.readFileSync('./config.json'));
const prefix = config.prefix;
const questions = JSON.parse(fs.readFileSync(path.join(__dirname, './data/tebakkata.json'), 'utf8'));

function startWordGuessGame(chatId, client) {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];
    // Simpan data game
    activeWordGames.set(chatId, {
        question: selectedQuestion.question,
        answer: selectedQuestion.answer,
        attempts: 0,
    });

    client.sendMessage(chatId, `Permainan Tebak Kata dimulai! Petunjuk: ${selectedQuestion.question}`);
}

function handleWordGuess(chatId, guess, client, message) {
    if (!activeWordGames.has(chatId)) {
        message.reply(`Permainan belum dimulai. Gunakan ${prefix}gamekata untuk memulai.`);
        return;
    }

    const game = activeWordGames.get(chatId);
    game.attempts++;

    if (guess.toLowerCase() === game.answer.toLowerCase()) {
        client.sendMessage(message.from, `Selamat! Kamu menebak kata "${game.answer}" dengan ${game.attempts} percobaan.`);
        activeWordGames.delete(chatId);
    } else {
        client.sendMessage(message.from, 'Tebakan salah. Coba lagi!');
    }
}

function endWordGuessGame(chatId, client, message) {
    if (!activeWordGames.has(chatId)) {
        message.reply('Permainan belum dimulai atau sudah selesai.');
        return;
    }

    const game = activeWordGames.get(chatId);
    client.sendMessage(message.from, `Permainan berakhir! Jawaban yang benar adalah "${game.answer}". Total percobaan: ${game.attempts}.`);
    activeWordGames.delete(chatId);
}

module.exports = { startWordGuessGame, handleWordGuess, endWordGuessGame };
