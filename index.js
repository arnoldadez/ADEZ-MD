// Simplified index.js - just for Render
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './session' }),
    puppeteer: {
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', async (qr) => {
    const qrImage = await qrcode.toDataURL(qr);
    fs.writeFileSync('./qr.html', `
    <html><body style="text-align:center">
        <h1>ADEZ MD</h1>
        <img src="${qrImage}" style="width:300px"/>
    </body></html>
    `);
});

client.on('ready', () => console.log('✅ ADEZ MD ONLINE'));

client.on('message', async (msg) => {
    if (msg.body === '!ping') msg.reply('Pong! 🏓');
});

app.get('/', (req, res) => res.sendFile(__dirname + '/qr.html'));
app.listen(PORT, () => console.log(`Web UI: http://localhost:${PORT}`));

client.initialize();
