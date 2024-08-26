const fs = require('fs');

// Load config
const config = JSON.parse(fs.readFileSync('config.json'));
const prefix = config.prefix;
const menu = config.menu;
const sub = config.subMenu;

// Fungsi untuk menampilkan menu
function sendMenu(client, chatId) {
    const menuMessage = `
*HALO BOT ZEROPJT DISINI*
\n
*MENU BOT*
*${prefix}${menu[0]}* - Menampilkan menu ini
*${prefix}${menu[1]}* - Menampilkan informasi bot
*${prefix}${menu[2]}* - untuk memanggil semua orang di grup
*${prefix}${menu[3]}* - untuk memanggil semua orang di grup secara tersembunyi
*${prefix}${menu[4]}* - untuk melakukan confess ke seseorang secara anonim
\n
*MENU GAME*
*${prefix}${menu[5]}* - untuk memulai game Truth or Dare
*${prefix}${menu[6]}* - untuk membuat room game tes kompak
*${prefix}${menu[7]}* - untuk masuk room game tes kompak
*${prefix}${menu[8]}* - untuk melihat room game tes kompak yang ada
_sub menu_ -> *${prefix}${sub[0]}* - mengetes kekompakan dengan oranglain
_sub menu_ -> *${prefix}${sub[1]}* - untuk menyelesaikan permainan
*${prefix}${menu[9]}* - untuk memulai permainan tebak angka
_sub menu_ -> *${prefix}${sub[2]}* - untuk menebak angka
_sub menu_ -> *${prefix}${sub[3]}* - untuk menyelesaikan permainan tebak angka
*${prefix}${menu[10]}* - untuk memulai permainan tebak kata
_sub menu_ -> *${prefix}${sub[4]}* - untuk menebak kata
_sub menu_ -> *${prefix}${sub[5]}* - untuk menyelesaikan permainan tebak kata
\n
*MENU ISLAMI*
*${prefix}${menu[11]}* - melihat kalender hijriah
*${prefix}${menu[12]}* - melihat jadwal shalat
*${prefix}${menu[13]}* - mengatur lokasi untuk jadwal shalat
\n
*MENU EDIT*
*${prefix}${menu[14]}* - untuk menghapus background dari gambar
*${prefix}${menu[15]}* - untuk menjernihkan gambar
\n
*LAINNYA*
*${prefix}${menu[16]}* - untuk mengubah foto menjadi stiker
*${prefix}${menu[17]}* - melihat kode bahasa
*${prefix}${menu[18]}* - menerjemahkan bahasa
*${prefix}${menu[19]}* - mungkin tidak mungkin dari pertanyaan
*${prefix}${menu[20]}* - melakukan presentase, bisa juga liat kelo deket sama seseorang ~*tidak untuk serius*~
*${prefix}${menu[21]}* - memutar roulate
*${prefix}${menu[22]}* - menghentikan roulate
\n
Owner: ${config.ownerName}
Thanks to *${config.support}* unutk penamaannya
Owner Number: ${config.ownerNumber}
    `;

    client.sendMessage(chatId, menuMessage);
}

module.exports = sendMenu;
