const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('./config');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Force Puppeteer to use Render's Chrome
const chromePath = '/opt/render/.cache/puppeteer/chrome/linux-146.0.7680.31/chrome-linux64/chrome';

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './session'
    }),
    puppeteer: {
        headless: true,
        executablePath: chromePath,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

client.on('qr', async (qr) => {
    console.log('📱 QR Code Generated - Scan with WhatsApp');
    const qrImage = await qrcode.toDataURL(qr);
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>ADEZ MD WhatsApp Bot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; text-align: center; background: #f0f0f0; padding: 20px; }
            .container { max-width: 400px; margin: auto; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            img { width: 100%; max-width: 300px; border: 5px solid #25D366; border-radius: 10px; margin: 20px 0; }
            h1 { color: #25D366; }
            .status { background: #25D366; color: white; padding: 10px; border-radius: 5px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔴 ADEZ MD</h1>
            <div class="status">📱 Scan QR to Connect</div>
            <img src="${qrImage}" alt="QR Code"/>
            <p><strong>Owner:</strong> Arnold Adez</p>
            <p><strong>Number:</strong> +254111783552</p>
        </div>
        <script>
            setTimeout(() => { location.reload(); }, 30000);
        </script>
    </body>
    </html>
    `;
    fs.writeFileSync('./qr.html', html);
});

client.on('ready', () => {
    console.log('✅ ADEZ MD is ONLINE!');
    console.log(`👤 Owner: ${config.owner.name}`);
    console.log(`📞 ${config.owner.number}`);
});

client.on('message', async (msg) => {
    const body = msg.body;
    const args = body.split(' ');
    const cmd = args[0].toLowerCase().replace(config.prefix, '');

    if (body.startsWith(config.prefix)) {
        if (cmd === 'ping') msg.reply('Pong! 🏓');
        if (cmd === 'menu') {
            msg.reply(`📌 ADEZ MD MENU

🤖 AI: mistral, claudeai, bard, perplexity
👥 GROUP: tagall, kick, promote, demote
📥 DOWNLOADER: play, video, instagram, tiktok
👑 OWNER: eval, restart, uptime, logout
⚙️ SETTINGS: antibot, antispam, anticall
📦 Use !help <command> for details`);
        }
        if (cmd === 'owner') msg.reply(`👤 Owner: ${config.owner.name}\n📞 ${config.owner.number}`);
        if (cmd === 'uptime') {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            msg.reply(`🟢 Bot Uptime: ${hours}h ${minutes}m`);
        }
        if (cmd === 'restart' && msg.from === config.owner.number) {
            msg.reply('🔄 Restarting...');
            process.exit(0);
        }
    }
});

app.get('/', (req, res) => {
    if (fs.existsSync('./qr.html')) {
        res.sendFile(__dirname + '/qr.html');
    } else {
        res.send('🔴 ADEZ MD - Waiting for QR... Refresh in 10s');
    }
});

app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        owner: config.owner.name,
        uptime: process.uptime()
    });
});

app.listen(PORT, () => {
    console.log(`🌐 Web UI: http://localhost:${PORT}`);
});

client.initialize();
