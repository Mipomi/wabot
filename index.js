const { Client, LocalAuth } = require('whatsapp-web.js');
const blockCalls = require('./functions/blockCalls');
const confess = require('./functions/consfess');
const truthOrDare = require('./games/tod');
const qrcode = require('qrcode-terminal');
const { translateText, bahasaDidukung } = require('./functions/translate');
const sendMenu = require('./functions/menu');
const fs = require('fs');
const { tagAll, hiddenTag } = require('./functions/tagall');
const removeBackground = require('./gambar/removebg');
const { createRoom, joinRoom, startGameInRoom, endGameInRoom, handleEmojiInRoom, listRooms } = require('./games/kekompakan');
const prayerSchedule = require('./islami/prayerSchedule');
const hijriCalendar = require('./islami/hijriCalender');
const quran = require('./islami/quran');
const { cckga, apakah } = require('./games/cocok');
const { endGame, startGame, handleGuess } = require('./games/tebakAngka');
const { endWordGuessGame, handleWordGuess, startWordGuessGame } = require('./games/tebaKata');
const { startRouletteGame, endRouletteGame } = require('./functions/roulatte');
const { searchLyrics } = require('./functions/lirikLagu');

const config = JSON.parse(fs.readFileSync('config.json'));
const menu = config.menu;
const sub = config.subMenu;

function isGroup(chat) {
    return chat.isGroup;
}

// Inisialisasi WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

let gameStarted = false; // Flag untuk mengecek apakah game sudah dimulai

client.on('message', async (message) => {
    const prefix = config.prefix;
    const lowerCaseMessage = message.body.toLowerCase();
    const chat = await message.getChat();

    //game tebak angka
    if (lowerCaseMessage.startsWith(`${prefix}${menu[9]}`)) {
        startGame(chat.id._serialized, client);
        message.reply(`Permainan Tebak Angka dimulai! Ketik ${prefix}tbkangka [angka 1 - 100].\nKetik ${prefix}udhangka untuk mengakhiri game`);
    } else if (lowerCaseMessage.startsWith(`${prefix}*${prefix}${sub[3]}`)) {
        const guess = parseInt(message.body.split(' ')[1]);
        if (isNaN(guess)) {
            message.reply('Silakan kirimkan angka yang valid.');
            return;
        }
        handleGuess(chat.id._serialized, guess, client, message);
    } else if (lowerCaseMessage.startsWith(`${prefix}${prefix}${sub[3]}`)) {
        endGame(chat.id._serialized, client, message);
    }

    //tebak kata game
    if (lowerCaseMessage.startsWith(`${prefix}${menu[10]}`)) {
        startWordGuessGame(chat.id._serialized, client);
        message.reply(`Permainan Tebak Kata dimulai! Ketik ${prefix}tbkta [jawabannya].\nKetik ${prefix}udhkata untuk mengakhiri game`);
    } else if (lowerCaseMessage.startsWith(`${prefix}${sub[4]}`)) {
        const guess = message.body.split(' ').slice(1).join(' ');
        if (!guess) {
            message.reply('Silakan kirimkan kata yang valid.');
            return;
        }
        handleWordGuess(chat.id._serialized, guess, client, message);
    } else if (lowerCaseMessage.startsWith(`${prefix}${sub[5]}`)) {
        endWordGuessGame(chat.id._serialized, client, message);
    }

    // Panggil fungsi Truth or Dare
    if (lowerCaseMessage === `${prefix}${menu[5]}`) {
        gameStarted = true;
        message.reply(`Permainan Truth or Dare sudah dimulai! Silakan pilih dengan mengetikkan ${prefix}truth atau ${prefix}dare.`);
    }

    if (gameStarted) {
        if (lowerCaseMessage === `${prefix}truth`) {
            // Ambil pertanyaan Truth
            const truth = truthOrDare.getTruthQuestion(); // Fungsi untuk mengambil pertanyaan truth
            message.reply(`Truth: ${truth}`);
        }

        if (lowerCaseMessage === `${prefix}dare`) {
            // Ambil tantangan Dare
            const dare = truthOrDare.getDareChallenge(); // Fungsi untuk mengambil tantangan dare
            message.reply(`Dare: ${dare}`);
        }
    } else {
        if (lowerCaseMessage === `${prefix}truth` || lowerCaseMessage === `${prefix}dare`) {
            message.reply(`Permainan belum dimulai! Ketikkan ${prefix}mulaitod untuk memulai.`);
        }
    }

    // Panggil fungsi Confess
    if (lowerCaseMessage.startsWith(`${prefix}${menu[4]}`)) {
        confess(client, message);
    }

    //sticker
    if (lowerCaseMessage.startsWith(`${prefix}${menu[16]}`) && message.type === 'image') {
        const args = message.body.split(' ').map(arg => arg.trim());
        const media = await message.downloadMedia();

        if (args.length < 1) {
            client.sendMessage(message.from, `Silahkan tulis: ${prefix}sticker [nama pembuat] [nama stiker]`);
            return;
        }

        const stickerAuthor = args[1];
        const stickerName = args[2];

        client.sendMessage(message.from, media, {
            sendMediaAsSticker: true,
            stickerAuthor: stickerAuthor,
            stickerName: stickerName,
        });
    }

    //google translate
    if (lowerCaseMessage.startsWith(`${prefix}${menu[18]}`)) {
        const args = message.body.slice(11).trim().split(' ');
        const kodeBahasa = args.shift();
        const teksUntukDiterjemahkan = args.join(' ');

        // Pengecekan jika kode bahasa atau teks tidak ada
        if (!kodeBahasa || !teksUntukDiterjemahkan) {
            message.reply(`Harap berikan kode bahasa dan teks yang akan diterjemahkan. Contoh: ${prefix}${menu[19]} en Halo\n\nBahasa yang didukung:\n${Object.entries(bahasaDidukung).map(([code, name]) => `${code} - ${name}`).join('\n')}`);
            return;
        }

        // Pengecekan jika bahasa tidak didukung
        if (!bahasaDidukung[kodeBahasa]) {
            message.reply(`Kode bahasa tidak didukung. Silakan gunakan salah satu dari yang berikut:\n${Object.entries(bahasaDidukung).map(([code, name]) => `${code} - ${name}`).join('\n')}`);
            return;
        }

        try {
            const teksTerjemahan = await translateText(teksUntukDiterjemahkan, kodeBahasa);
            message.reply(`Diterjemahkan ke ${bahasaDidukung[kodeBahasa]}: ${teksTerjemahan}`);
        } catch (error) {
            message.reply('Maaf, saya tidak dapat menerjemahkan teks tersebut.');
        }
    }

    // Pengecekan untuk perintah !kodebhs
    if (lowerCaseMessage === `${prefix}${menu[17]}`) {
        const daftarBahasa = Object.entries(bahasaDidukung)
            .map(([code, name]) => `${code} - ${name}`)
            .join('\n');
        message.reply(`Bahasa yang didukung:\n${daftarBahasa}`);
    }

    if (lowerCaseMessage === `${prefix}${menu[1]}`) {
        const infoMessage = `Ini adalah bot yang dimiliki oleh ${config.ownerName} dengan fitur seadanya`;
        await client.sendMessage(message.from, infoMessage);
    }

    //untuk random persen
    if (lowerCaseMessage.startsWith(`${prefix}${menu[19]}`)) {
        apakah(message);
    } else if (lowerCaseMessage.startsWith(`${prefix}${menu[20]}`)) {
        cckga(message);
    }

    //remove bg
    if (message.hasMedia && lowerCaseMessage.includes(`${prefix}${menu[14]}`)) {
        const media = await message.downloadMedia();

        if (media.mimetype.startsWith('image/')) {
            // Panggil fungsi untuk menghapus latar belakang
            removeBackground(media, message, client);
        } else {
            message.reply('Harap kirim file gambar saja.');
        }
    } else if (lowerCaseMessage.includes(`${prefix}${menu[14]}`)) {
        message.reply(`Harap kirim gambar bersama dengan perintah ${prefix}${menu[15]} untuk menghapus latar belakang.`);
    }

    //cari lirik lagu
    if (lowerCaseMessage.startsWith(`${prefix}${menu[15]}`)) {
        const query = message.body.slice(7).trim();
        if (!query) {
            message.reply(`Silakan masukkan sebagian lirik atau judul lagu setelah perintah ${prefix}${menu[25]}`);
            return;
        }

        try {
            const lyrics = await searchLyrics(query);
            if (lyrics) {
                message.reply(lyrics);
            } else {
                message.reply('Lirik tidak ditemukan.');
            }
        } catch (error) {
            if (error.response && error.response.status === 429) {
                // Status code 429 menandakan limit API terlampaui
                message.reply('Limit API Genius telah habis. Silakan coba lagi nanti.');
            } else {
                // Menangani kesalahan lain
                console.error(error);
                message.reply('Terjadi kesalahan saat mencari lirik.');
            }
        }
    }

    //menu
    if (lowerCaseMessage === `${prefix}${menu[0]}`) {
        sendMenu(client, message.from);
    }
});

//fitus islami
client.on('message', async message => {
    const prefix = config.prefix;
    const lowerCaseMessage = message.body.toLowerCase();
    const userId = message.from;
    const args = message.body.split(' ');
    let userLocations = {};
if (fs.existsSync('userLocations.json')) {
    userLocations = JSON.parse(fs.readFileSync('userLocations.json', 'utf-8'));
} else {
    fs.writeFileSync('userLocations.json', JSON.stringify(userLocations));
}


    if (lowerCaseMessage.startsWith(`${prefix}${menu[12]}`)) {
        const location = userLocations[userId];
        if (location) {
            const times = await prayerSchedule.getJadwalShalat(location);
            const responseText = `
Jadwal Shalat untuk ${location}:
- Fajr: ${times.Fajr}
- Dhuhr: ${times.Dhuhr}
- Asr: ${times.Asr}
- Maghrib: ${times.Maghrib}
- Isha: ${times.Isha}`;
            await message.reply(responseText);
        } else {
            await message.reply(`Anda belum memasukkan lokasi. Silakan gunakan perintah ${prefix}${menu[13]} [nama kota] untuk memasukkan lokasi Anda.`);
        }
    } else if (args[0] === `${prefix}${menu[11]}`) {
        const hijriDate = await hijriCalendar.getHijriDate();
        await message.reply(`Tanggal Hijriah hari ini adalah: ${hijriDate}`);
    } else if (lowerCaseMessage.startsWith(`${prefix}${menu[23]}`)) {
        const params = message.body.split(' ')[1];
        if (params) {
            const [surah, ayat] = params.split(':');
            if (surah && ayat) {
                const ayatText = await quran.getQuranReading(surah, ayat);
                await message.reply(ayatText);
            } else {
                await message.reply(`Format yang benar: ${prefix}${menu[23]} [surah]:[ayat]`);
            }
        } else {
            await message.reply(`Silakan masukkan perintah dengan format yang benar: ${prefix}${menu[23]} [surah]:[ayat]`);
        }
    } 
    if (message.body.startsWith(`${prefix}${menu[13]}`)) {
        const location = message.body.split(' ')[1];
        if (location) {
            userLocations[userId] = location;
            fs.writeFileSync('userLocations.json', JSON.stringify(userLocations));
            await message.reply(`Lokasi Anda berhasil disimpan: ${location}`);
        } else {
            await message.reply(`Silakan masukkan nama kota dengan format: ${prefix}setlok [nama kota]`);
        }
    }

    if (lowerCaseMessage.startsWith(`${prefix}${menu[24]}`)) {
        const parts = message.body.split(' ');
        const surahNumber = parseInt(parts[1]);

        if (!isNaN(surahNumber)) {
            const surahText = await quran.getFullSurah(surahNumber);
            await message.reply(surahText);
        } else {
            await message.reply(`Silakan masukkan nomor surah dengan format: ${prefix}${menu[24]} [nomor surah]\nContoh: ${prefix}${menu[24]} 2`);
        }
    }
});

//untuk grup
client.on('message', async message => {
    const prefix = config.prefix;
    const lowerCaseMessage = message.body.toLowerCase();

    const chat = await message.getChat();
    const isGrup = chat.isGroup;

    const groupId = chat.id._serialized;
    const from = message.from;

    if (lowerCaseMessage === `${prefix}${menu[2]}` && isGrup) {
        await tagAll(chat, client);
    }

    if(lowerCaseMessage === `${prefix}${menu[3]}` && isGrup){
        await hiddenTag(chat);
    }

    if (lowerCaseMessage === `${prefix}${menu[2]}` || lowerCaseMessage === `${prefix}${menu[3]}` && !isGrup) {
        message.reply('Perintah ini hanya bisa digunakan di grup!');
    }
    
    //untuk game kecocokan
    if (lowerCaseMessage.startsWith(`${prefix}${menu[6]}`) && isGroup) {
        createRoom(groupId, from, message);
    } else if (lowerCaseMessage.startsWith(`${prefix}${menu[7]}`) && isGroup) {
        joinRoom(groupId, from, message);
    } else if (lowerCaseMessage === `${prefix}${sub[0]}` && isGroup) {
        startGameInRoom(groupId, from, message);
    } else if (lowerCaseMessage === `${prefix}${sub[1]}` && isGroup) {
        endGameInRoom(groupId, from, message);
    } else if (lowerCaseMessage === `${prefix}${menu[8]}` && isGroup) {
        listRooms(groupId, message);
    } else if (!isGroup && (lowerCaseMessage.startsWith(`${prefix}${menu[6]}`) || 
                            lowerCaseMessage.startsWith(`${prefix}${menu[7]}`) ||
                            lowerCaseMessage === `${prefix}${sub[0]}` ||
                            lowerCaseMessage === `${prefix}${sub[1]}` ||
                            lowerCaseMessage === `${prefix}${menu[8]}`)) {
        message.reply('Perintah ini hanya bisa digunakan di dalam grup.');
    } else {
        handleEmojiInRoom(groupId, from, message);
    }

    //untuk roulatte
    if (chat.isGroup) {
        if (lowerCaseMessage.startsWith(`${prefix}${menu[21]}`)) {
            startRouletteGame(chat.id._serialized, client);
        } else if (lowerCaseMessage.startsWith(`${prefix}${menu[22]}`)) {
            endRouletteGame(chat.id._serialized, client, message);
        }
    } else if (!isGroup && lowerCaseMessage.startsWith(`${prefix}${menu[21]}`) || lowerCaseMessage.startsWith(`${prefix}${menu[22]}`)){
        message.reply('Permainan Roulette hanya bisa dimainkan di grup.');
    }

});

//welcome
client.on('group_join', async (notification) => {
    const chat = await notification.getChat();
    const participantId = notification.id.participant;
    const contact = await client.getContactById(participantId);
    const groupName = chat.name;
    
    await chat.sendMessage(`Selamat datang di *${groupName}* @${contact.number}`, {
        mentions: [contact]
    });
});

//bye-bye
client.on('group_leave', async (notification) => {
    const chat = await notification.getChat();
    const participantId = notification.id.participant;
    const contact = await client.getContactById(participantId);

    await chat.sendMessage(`Selamat tinggal, @${contact.number}. Semoga sukses di tempat yang baru!`, {
        mentions: [contact]
    });
});

// Panggil fungsi untuk memblokir panggilan
blockCalls(client);
client.initialize();
