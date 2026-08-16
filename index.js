const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const express = require('express');
const fs = require('fs');
const path = require('path');
const pino = require('pino');
const { Buffer } = require('buffer');

const app = express();
const PORT = process.env.PORT || 3000;

// Session folder
const SESSION_DIR = './session';
if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR);

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['ADEZ MD', 'Chrome', '2.0.0']
    });

    // QR Code Handler
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
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
        }

        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.message || 'unknown';
            console.log(`❌ Disconnected: ${reason}. Reconnecting in 5s...`);
            
            // If QR not scanned, keep trying
            setTimeout(startBot, 5000);
        }

        if (connection === 'open') {
            console.log('✅ ADEZ MD is ONLINE!');
            console.log('👤 Owner: Arnold Adez');
            console.log('📞 +254111783552');
            
            // Update QR page to show connected
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>ADEZ MD WhatsApp Bot</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; background: #f0f0f0; padding: 20px; }
                    .container { max-width: 400px; margin: auto; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                    h1 { color: #25D366; }
                    .status { background: #25D366; color: white; padding: 10px; border-radius: 5px; margin: 10px 0; }
                    .online { background: #25D366; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🔴 ADEZ MD</h1>
                    <div class="status online">🟢 ONLINE</div>
                    <p><strong>Owner:</strong> Arnold Adez</p>
                    <p><strong>Number:</strong> +254111783552</p>
                </div>
            </body>
            </html>
            `;
            fs.writeFileSync('./qr.html', html);
        }
    });

    // Message Handler
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message) {
            const body = msg.message.conversation || 
                         msg.message.extendedTextMessage?.text || 
                         msg.message.imageMessage?.caption ||
                         '';
            const from = msg.key.remoteJid;
            const args = body.split(' ');
            const cmd = args[0].toLowerCase().replace('!', '');

            if (body.startsWith('!')) {
                // Basic commands
                if (cmd === 'ping') {
                    await sock.sendMessage(from, { text: 'Pong! 🏓' });
                }
                if (cmd === 'menu') {
                    await sock.sendMessage(from, { text: `📌 ADEZ MD MENU

🤖 AI: mistral, claudeai, bard
👥 GROUP: tagall, kick, promote
📥 DOWNLOADER: play, video, instagram
👑 OWNER: eval, restart, uptime
⚙️ SETTINGS: antibot, antispam

📦 Use !help <command> for details` });
                }
                if (cmd === 'owner') {
                    await sock.sendMessage(from, { text: '👤 Owner: Arnold Adez\n📞 +254111783552' });
                }
                if (cmd === 'uptime') {
                    const uptime = process.uptime();
                    const hours = Math.floor(uptime / 3600);
                    const minutes = Math.floor((uptime % 3600) / 60);
                    await sock.sendMessage(from, { text: `🟢 Uptime: ${hours}h ${minutes}m` });
                }
            }
        }
    });

    // Save credentials on update
    sock.ev.on('creds.update', saveCreds);
}

// Express Web UI
app.get('/', (req, res) => {
    if (fs.existsSync('./qr.html')) {
        res.sendFile(__dirname + '/qr.html');
    } else {
        res.send('🔴 ADEZ MD - Waiting for QR... Refresh in 10s');
    }
});

app.listen(PORT, () => {
    console.log(`🌐 Web UI: http://localhost:${PORT}`);
    startBot();
});
