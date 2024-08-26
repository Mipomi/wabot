function cckga(message) {
    const percent = Math.floor(Math.random() * 101);
    let response;
    
    if (percent < 30) {
        response = `Kecocokan: ${percent}%.\nUdahlah pasrah aja.`;
    } else if (percent < 60) {
        response = `Kecocokan: ${percent}%.\nLumayan lahh.`;
    } else if (percent < 90) {
        response = `Kecocokan: ${percent}%.\nGass aja lah ini`;
    } else {
        response = `Kecocokan: ${percent}%.\nTidak perlu basa basi lagi inimah`;
    }
    
    message.reply(response);
};

function apakah(message) {
    const responses = [
        'mungkin',
        'bisa jadi',
        'tidak mungkin',
        'hah? Maksudnya?',
        'mustahil'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    message.reply(randomResponse);
};

module.exports = {apakah, cckga};