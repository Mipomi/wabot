const Genius = require("genius-lyrics");
const fs = require('fs');

// Membaca konfigurasi dari file config.json
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const geniusClient = new Genius.Client(config.genius_api_key);

async function searchLyrics(query) {
    try {
        const searches = await geniusClient.songs.search(query);
        if (searches.length > 0) {
            const song = searches[0]; // Ambil hasil pencarian pertama
            const lyrics = await song.lyrics();
            return `Judul: ${song.title}\nArtis: ${song.artist.name}\n\n${lyrics}`;
        }
        return null;
    } catch (error) {
        throw error;
    }
}

module.exports = { searchLyrics };
