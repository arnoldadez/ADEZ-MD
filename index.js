const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const fs = require('fs');
const config = require('./config');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ NO PUPPETEER CONFIG - uses default Chrome from package
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './session'
    })
});

// QR Handler
client.on('qr', async (qr) => {
    console.log('📱 QR Code Generated');
    const qrImage = await qrcode.toDataURL(qr);
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head><title>ADEZ MD</title></head>
    <body style="text-align:center;font-family:sans-serif;">
        <h1>🔴 ADEZ MD</h1>
        <div style="background:#25D366;color:white;padding:10px;">📱 Scan QR to Connect</div>
        <img src="${qrImage}" style="width:300px;border:5px solid #25D366;border-radius:10px;"/>
        <p><strong>Owner:</strong> Arnold Adez</p>
        <p><strong>Number:</strong> +254111783552</p>
    </body>
    </html>
    `;
    fs.writeFileSync('./qr.html', html);
});

// Bot Ready
client.on('ready', () => {
    console.log('✅ ADEZ MD is ONLINE!');
    console.log(`👤 Owner: ${config.owner.name}`);
});

// Message Handler
client.on('message', async (msg) => {
    const body = msg.body;
    const args = body.split(' ');
    const cmd = args[0].toLowerCase().replace(config.prefix, '');

    if (body.startsWith(config.prefix)) {
        if (cmd === 'ping') msg.reply('Pong! 🏓');
        if (cmd === 'menu') {
            msg.reply(`📌 ADEZ MD MENU

🤖 AI: mistral, claudeai, bard
👥 GROUP: tagall, kick, promote
📥 DOWNLOADER: play, video, instagram
👑 OWNER: eval, restart, uptime
⚙️ SETTINGS: antibot, antispam
📦 Use !help <command> for details`);
        }
        if (cmd === 'owner') msg.reply(`👤 Owner: ${config.owner.name}\n📞 ${config.owner.number}`);
        if (cmd === 'uptime') {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            msg.reply(`🟢 Uptime: ${hours}h ${minutes}m`);
        }
    }
});

// Web UI
app.get('/', (req, res) => {
    if (fs.existsSync('./qr.html')) {
        res.sendFile(__dirname + '/qr.html');
    } else {
        res.send('🔴 Waiting for QR... Refresh in 10s');
    }
});

app.listen(PORT, () => {
    console.log(`🌐 Web UI: http://localhost:${PORT}`);
});

client.initialize();
