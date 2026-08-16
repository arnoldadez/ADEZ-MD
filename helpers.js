const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Download media
async function downloadMedia(url, filename) {
    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    });
    const writer = fs.createWriteStream(filename);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

// Format time
function formatTime(date) {
    return date.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' });
}

// Extract URL from text
function extractUrl(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches ? matches[0] : null;
}

module.exports = { downloadMedia, formatTime, extractUrl };
