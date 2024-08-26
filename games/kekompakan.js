const rooms = {};

function isGroup(chat) {
    return chat.isGroup;
}

function createRoom(groupId, userId, msg) {
    if (!rooms[groupId]) {
        rooms[groupId] = [];
    }

    const roomId = `room${rooms[groupId].length + 1}`;
    rooms[groupId].push({
        roomId: roomId,
        players: [userId],
        player1Emoji: null,
        player2Emoji: null,
        score: 0,
        gameActive: false
    });

    msg.reply(`Room ${roomId} berhasil dibuat. Silakan ajak satu orang lagi untuk bergabung dengan menggunakan perintah .joinroom ${roomId}`);
}

function joinRoom(groupId, userId, msg) {
    const roomId = msg.body.split(' ')[1];

    if (!rooms[groupId]) {
        msg.reply('Tidak ada room yang tersedia di grup ini.');
        return;
    }

    const room = rooms[groupId].find(room => room.roomId === roomId);

    if (!room) {
        msg.reply(`Room ${roomId} tidak ditemukan.`);
    } else if (room.players.length >= 2) {
        msg.reply(`Room ${roomId} sudah penuh.`);
    } else {
        room.players.push(userId);
        msg.reply(`Kamu berhasil bergabung ke room ${roomId}. Ketik .mulai untuk memulai permainan.`);
    }
}

function startGameInRoom(groupId, userId, msg) {
    const room = findRoomByUser(groupId, userId);

    if (!room) {
        msg.reply('Kamu belum bergabung dalam room mana pun.');
    } else if (room.players.length < 2) {
        msg.reply('Room ini membutuhkan 2 pemain untuk memulai.');
    } else if (room.gameActive) {
        msg.reply('Permainan sudah dimulai di room ini.');
    } else {
        room.gameActive = true;
        msg.reply('Permainan dimulai! Silakan kirimkan emoji kalian.');
    }
}

function endGameInRoom(groupId, userId, msg) {
    const room = findRoomByUser(groupId, userId);

    if (room && room.gameActive) {
        msg.reply(`Permainan di room ${room.roomId} berakhir! Skor akhir: ${room.score}`);
        room.gameActive = false;
    } else {
        msg.reply('Tidak ada permainan yang sedang berlangsung di room ini.');
    }
}

function handleEmojiInRoom(groupId, userId, msg) {
    const room = findRoomByUser(groupId, userId);

    if (room && room.gameActive) {
        const emoji = msg.body;

        if (!room.player1Emoji && room.players[0] === userId) {
            room.player1Emoji = emoji;
            msg.reply('Emoji telah diterima, menunggu pemain lain.');
        } else if (!room.player2Emoji && room.players[1] === userId) {
            room.player2Emoji = emoji;

            if (room.player1Emoji) {
                if (room.player1Emoji === room.player2Emoji) {
                    room.score++;
                    msg.reply(`Selamat! Kalian cocok dengan emoji: ${room.player1Emoji}. Skor saat ini: ${room.score}`);
                } else {
                    msg.reply(`Sayang sekali, emoji tidak cocok. Emoji yang kalian kirim: ${room.player1Emoji} dan ${room.player2Emoji}`);
                }

                // Tampilkan emoji secara bersamaan setelah keduanya sudah mengirim
                room.player1Emoji = null;
                room.player2Emoji = null;
            }
        }
    }
}

function listRooms(groupId, msg) {
    if (!rooms[groupId] || rooms[groupId].length === 0) {
        msg.reply('Tidak ada room yang tersedia di grup ini.');
        return;
    }

    const roomList = rooms[groupId].map(room => {
        const playerCount = room.players.length;
        return `Room ID: ${room.roomId}, Jumlah pemain: ${playerCount}/2, Status: ${room.gameActive ? 'Aktif' : 'Tidak Aktif'}`;
    }).join('\n');

    msg.reply(`Daftar room yang tersedia di grup ini:\n${roomList}`);
}

function findRoomByUser(groupId, userId) {
    if (!rooms[groupId]) return null;
    return rooms[groupId].find(room => room.players.includes(userId));
}

module.exports = {
    isGroup,
    createRoom,
    joinRoom,
    startGameInRoom,
    endGameInRoom,
    handleEmojiInRoom,
    listRooms
};
