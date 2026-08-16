const axios = require('axios');
const qrcode = require('qrcode');
const fs = require('fs');
const config = require('../config');

module.exports = {
    // Translate text
    translate: {
        execute: async (client, msg, args) => {
            const text = args.slice(1).join(' ');
            if (!text) return msg.reply('❌ Provide text to translate!');
            
            try {
                const response = await axios.get(
                    `https://api.maher-zubair.tech/translate?text=${encodeURIComponent(text)}&lang=en`
                );
                const result = response.data?.result || response.data?.translation || 'Translation failed';
                msg.reply(`🌍 Translation: ${result}`);
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Scan QR code
    scan: {
        execute: async (client, msg, args) => {
            if (!msg.hasMedia) return msg.reply('❌ Send an image with QR code!');
            
            msg.reply('🔍 Scanning QR...');
            try {
                const media = await msg.downloadMedia();
                const filename = `./qr_${Date.now()}.png`;
                fs.writeFileSync(filename, Buffer.from(media.data, 'base64'));
                
                // Use a QR scanning API
                const response = await axios.post(
                    'https://api.qrserver.com/v1/read-qr-code/',
                    { file: fs.createReadStream(filename) },
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                fs.unlinkSync(filename);
                
                const result = response.data?.[0]?.symbol?.[0]?.data || 'No QR data found';
                msg.reply(`📱 QR Content: ${result}`);
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Get IP info
    ip: {
        execute: async (client, msg, args) => {
            const ip = args[1] || '8.8.8.8';
            try {
                const response = await axios.get(`http://ip-api.com/json/${ip}`);
                const data = response.data;
                if (data.status === 'success') {
                    msg.reply(`🌐 IP Info:
📍 IP: ${data.query}
🏙️ City: ${data.city}
🌍 Country: ${data.country}
📍 ISP: ${data.isp}
📍 Region: ${data.regionName}`);
                } else {
                    msg.reply('❌ Invalid IP or location not found.');
                }
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Text-to-Speech (TTS)
    tts: {
        execute: async (client, msg, args) => {
            const text = args.slice(1).join(' ');
            if (!text) return msg.reply('❌ Provide text!');
            
            msg.reply('🔊 Generating speech...');
            try {
                const response = await axios.get(
                    `https://api.maher-zubair.tech/tts?text=${encodeURIComponent(text)}`,
                    { responseType: 'arraybuffer' }
                );
                
                const filename = `./tts_${Date.now()}.mp3`;
                fs.writeFileSync(filename, Buffer.from(response.data));
                
                await client.sendMessage(msg.from, {
                    audio: fs.readFileSync(filename),
                    mimetype: 'audio/mpeg',
                    fileName: 'tts.mp3'
                });
                fs.unlinkSync(filename);
                msg.reply('✅ Audio sent!');
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // QR Generator
    qrgenerator: {
        execute: async (client, msg, args) => {
            const text = args.slice(1).join(' ');
            if (!text) return msg.reply('❌ Provide text or URL!');
            
            try {
                const qrBuffer = await qrcode.toBuffer(text);
                const filename = `./qr_${Date.now()}.png`;
                fs.writeFileSync(filename, qrBuffer);
                
                await client.sendMessage(msg.from, {
                    image: fs.readFileSync(filename),
                    caption: `📱 QR Code for: ${text}`
                });
                fs.unlinkSync(filename);
                msg.reply('✅ QR Code sent!');
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Currency Converter
    currency: {
        execute: async (client, msg, args) => {
            const amount = parseFloat(args[1]);
            const from = args[2]?.toUpperCase() || 'USD';
            const to = args[3]?.toUpperCase() || 'KES';
            
            if (!amount) return msg.reply('❌ Usage: !currency 100 USD KES');
            
            try {
                const response = await axios.get(
                    `https://api.exchangerate-api.com/v4/latest/${from}`
                );
                const rate = response.data.rates[to];
                if (!rate) return msg.reply('❌ Invalid currency code!');
                
                const converted = (amount * rate).toFixed(2);
                msg.reply(`💱 ${amount} ${from} = ${converted} ${to}`);
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Check if user is on WhatsApp
    onwhatsapp: {
        execute: async (client, msg, args) => {
            const number = args[1];
            if (!number) return msg.reply('❌ Provide phone number!');
            
            try {
                const formatted = number.replace(/[^0-9]/g, '');
                const contact = await client.getContactById(formatted + '@c.us');
                if (contact) {
                    msg.reply(`✅ ${number} is on WhatsApp`);
                } else {
                    msg.reply(`❌ ${number} is NOT on WhatsApp`);
                }
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Generate random email
    genemail: {
        execute: async (client, msg, args) => {
            const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'protonmail.com'];
            const random = Math.random().toString(36).substring(2, 10);
            const domain = domains[Math.floor(Math.random() * domains.length)];
            msg.reply(`📧 Generated: ${random}@${domain}`);
        }
    },

    // Check if email exists (placeholder)
    checkmail: {
        execute: async (client, msg, args) => {
            const email = args[1];
            if (!email) return msg.reply('❌ Provide email!');
            msg.reply(`📧 Checking ${email}... (placeholder - requires API)`);
        }
    },

    // Generate WhatsApp link
    walink: {
        execute: async (client, msg, args) => {
            const number = args[1] || config.owner.number;
            const clean = number.replace(/[^0-9]/g, '');
            msg.reply(`📱 WhatsApp Link: https://wa.me/${clean}`);
        }
    },

    // Inspect URL
    inspect: {
        execute: async (client, msg, args) => {
            const url = args[1];
            if (!url) return msg.reply('❌ Provide URL!');
            
            try {
                const response = await axios.head(url);
                msg.reply(`🔍 URL Info:
🌐 URL: ${url}
✅ Status: ${response.status}
📦 Content-Type: ${response.headers['content-type'] || 'Unknown'}
📏 Size: ${response.headers['content-length'] || 'Unknown'} bytes`);
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Share phone contact
    sharephone: {
        execute: async (client, msg, args) => {
            const number = args[1] || config.owner.number;
            const name = args[2] || 'ADEZ MD';
            
            const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;type=CELL;type=VOICE;waid=${number}:${number}
END:VCARD`;
            
            await client.sendMessage(msg.from, {
                contacts: {
                    displayName: name,
                    contacts: [{ vcard: vcard }]
                }
            });
            msg.reply('✅ Contact shared!');
        }
    },

    // Fancy text (stylized)
    fancy: {
        execute: async (client, msg, args) => {
            const text = args.slice(1).join(' ');
            if (!text) return msg.reply('❌ Provide text!');
            
            const fancy = text.split('').map(c => 
                String.fromCharCode(c.charCodeAt(0) + 0x1D400)
            ).join('');
            msg.reply(`✨ ${fancy}`);
        }
    },

    // Language codes
    langcodes: {
        execute: async (client, msg, args) => {
            msg.reply(`🌍 Language Codes:
🇬🇧 en - English
🇪🇸 es - Spanish
🇫🇷 fr - French
🇩🇪 de - German
🇮🇹 it - Italian
🇯🇵 ja - Japanese
🇰🇷 ko - Korean
🇨🇳 zh - Chinese
🇷🇺 ru - Russian
🇦🇷 ar - Arabic
🇮🇳 hi - Hindi
🇰🇪 sw - Swahili`);
        }
    }
};
