async function tagAll(chat, client) {
    let text = `Muncul lah kalian:\n`;
    let mentions = [];

    for (let participant of chat.participants) {
        const contact = await client.getContactById(participant.id._serialized);
        mentions.push(contact);
        text += `@${contact.number}\n`;
        
    }
    chat.sendMessage(text, { mentions });
}

async function hiddenTag(chat) {
    const groupName = chat.name; // Mendapatkan nama grup
    const mentions = chat.participants.map(participant => participant.id._serialized);

    // Mengirimkan pesan pemberitahuan di dalam grup
    const notificationText = `Anda telah dipanggil oleh grup *${groupName}*.`;
    await chat.sendMessage(notificationText, { mentions });
}

module.exports = {tagAll, hiddenTag};