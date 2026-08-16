const fs = require('fs');
const path = require('path');
const config = require('../config');

// Simple in-memory settings store (replace with MongoDB in production)
const settings = {
    // Group settings (keyed by group JID)
    groups: {},
    
    // Global settings
    global: {
        antibot: false,
        antispam: false,
        anticall: false,
        autoblock: false,
        chatbot: false,
        events: false,
        antilink: false,
        autoread: false,
        autoviewstatus: false,
        autoreplystatus: false,
        autolikestatus: false,
        autobio: false,
        antidelete: false,
        prefix: '!',
        presence: 'online',
        mode: 'public',
        botname: 'ADEZ MD',
        author: 'Arnold Adez',
        packname: 'ADEZ MD',
        timezone: 'Africa/Nairobi',
        botpic: '',
        boturl: 'https://github.com/arnoldadez/ADEZ-MD'
    }
};

// Load settings from file if exists
const SETTINGS_FILE = './settings.json';
if (fs.existsSync(SETTINGS_FILE)) {
    try {
        const saved = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
        Object.assign(settings, saved);
    } catch (e) {}
}

// Save settings to file
function saveSettings() {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

// Helper: Get group settings
function getGroupSettings(groupId) {
    if (!settings.groups[groupId]) {
        settings.groups[groupId] = {
            antidemote: false,
            antipromote: false,
            antibot: false,
            antispam: false,
            anticall: false,
            autoblock: false,
            antibad: false,
            antitag: false,
            antisticker: false,
            antilink: false,
            greet: false,
            events: false,
            antistatusmention: false
        };
        saveSettings();
    }
    return settings.groups[groupId];
}

module.exports = {
    // --- ANTI FEATURES ---
    
    // Anti-demote
    antidemote: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !antidemote on/off');
            
            const groupSettings = getGroupSettings(chat.id._serialized);
            groupSettings.antidemote = status === 'on';
            saveSettings();
            msg.reply(`✅ Anti-demote ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Anti-promote
    antipromote: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !antipromote on/off');
            
            const groupSettings = getGroupSettings(chat.id._serialized);
            groupSettings.antipromote = status === 'on';
            saveSettings();
            msg.reply(`✅ Anti-promote ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Anti-link
    antilink: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !antilink on/off');
            
            const groupSettings = getGroupSettings(chat.id._serialized);
            groupSettings.antilink = status === 'on';
            saveSettings();
            msg.reply(`✅ Anti-link ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Anti-bot
    antibot: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !antibot on/off');
            
            const groupSettings = getGroupSettings(chat.id._serialized);
            groupSettings.antibot = status === 'on';
            saveSettings();
            msg.reply(`✅ Anti-bot ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Anti-spam
    antispam: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !antispam on/off');
            
            const groupSettings = getGroupSettings(chat.id._serialized);
            groupSettings.antispam = status === 'on';
            saveSettings();
            msg.reply(`✅ Anti-spam ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Anti-call
    anticall: {
        execute: async (client, msg, args) => {
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !anticall on/off');
            
            settings.global.anticall = status === 'on';
            saveSettings();
            msg.reply(`✅ Anti-call ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Auto-block
    autoblock: {
        execute: async (client, msg, args) => {
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !autoblock on/off');
            
            settings.global.autoblock = status === 'on';
            saveSettings();
            msg.reply(`✅ Auto-block ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Anti-bad words
    antibad: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !antibad on/off');
            
            const groupSettings = getGroupSettings(chat.id._serialized);
            groupSettings.antibad = status === 'on';
            saveSettings();
            msg.reply(`✅ Anti-bad words ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Anti-tag (anti @all spam)
    antitag: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !antitag on/off');
            
            const groupSettings = getGroupSettings(chat.id._serialized);
            groupSettings.antitag = status === 'on';
            saveSettings();
            msg.reply(`✅ Anti-tag ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Anti-sticker
    antisticker: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !antisticker on/off');
            
            const groupSettings = getGroupSettings(chat.id._serialized);
            groupSettings.antisticker = status === 'on';
            saveSettings();
            msg.reply(`✅ Anti-sticker ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Anti-status mention
    antistatusmention: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !antistatusmention on/off');
            
            const groupSettings = getGroupSettings(chat.id._serialized);
            groupSettings.antistatusmention = status === 'on';
            saveSettings();
            msg.reply(`✅ Anti-status mention ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Anti-delete (alert when messages are deleted)
    antidelete: {
        execute: async (client, msg, args) => {
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !antidelete on/off');
            
            settings.global.antidelete = status === 'on';
            saveSettings();
            msg.reply(`✅ Anti-delete ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // --- AUTO FEATURES ---
    
    // Auto-social download (auto-download media from social links)
    autosocialdl: {
        execute: async (client, msg, args) => {
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !autosocialdl on/off');
            
            settings.global.autosocialdl = status === 'on';
            saveSettings();
            msg.reply(`✅ Auto-social download ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Auto-read messages
    autoread: {
        execute: async (client, msg, args) => {
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !autoread on/off');
            
            settings.global.autoread = status === 'on';
            saveSettings();
            msg.reply(`✅ Auto-read ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Auto-view status
    autoviewstatus: {
        execute: async (client, msg, args) => {
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !autoviewstatus on/off');
            
            settings.global.autoviewstatus = status === 'on';
            saveSettings();
            msg.reply(`✅ Auto-view status ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Auto-reply to status
    autoreplystatus: {
        execute: async (client, msg, args) => {
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !autoreplystatus on/off');
            
            settings.global.autoreplystatus = status === 'on';
            saveSettings();
            msg.reply(`✅ Auto-reply status ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Auto-like status
    autolikestatus: {
        execute: async (client, msg, args) => {
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !autolikestatus on/off');
            
            settings.global.autolikestatus = status === 'on';
            saveSettings();
            msg.reply(`✅ Auto-like status ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Auto-bio (auto-update bio)
    autobio: {
        execute: async (client, msg, args) => {
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !autobio on/off');
            
            settings.global.autobio = status === 'on';
            saveSettings();
            msg.reply(`✅ Auto-bio ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // --- BOT CONFIGURATION ---
    
    // Chatbot (AI auto-reply)
    chatbot: {
        execute: async (client, msg, args) => {
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !chatbot on/off');
            
            settings.global.chatbot = status === 'on';
            saveSettings();
            msg.reply(`✅ Chatbot ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Events (event notifications)
    events: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !events on/off');
            
            const groupSettings = getGroupSettings(chat.id._serialized);
            groupSettings.events = status === 'on';
            saveSettings();
            msg.reply(`✅ Events ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Greet (welcome message)
    greet: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            
            const status = args[1]?.toLowerCase();
            if (!status || !['on', 'off'].includes(status)) 
                return msg.reply('❌ Usage: !greet on/off');
            
            const groupSettings = getGroupSettings(chat.id._serialized);
            groupSettings.greet = status === 'on';
            saveSettings();
            msg.reply(`✅ Greet ${status === 'on' ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Bot name
    botname: {
        execute: async (client, msg, args) => {
            const name = args.slice(1).join(' ');
            if (!name) return msg.reply('❌ Provide bot name!');
            
            settings.global.botname = name;
            saveSettings();
            msg.reply(`✅ Bot name set to: ${name}`);
        }
    },
    
    // Author name (for stickers)
    author: {
        execute: async (client, msg, args) => {
            const name = args.slice(1).join(' ');
            if (!name) return msg.reply('❌ Provide author name!');
            
            settings.global.author = name;
            saveSettings();
            msg.reply(`✅ Author set to: ${name}`);
        }
    },
    
    // Pack name (for stickers)
    packname: {
        execute: async (client, msg, args) => {
            const name = args.slice(1).join(' ');
            if (!name) return msg.reply('❌ Provide pack name!');
            
            settings.global.packname = name;
            saveSettings();
            msg.reply(`✅ Pack name set to: ${name}`);
        }
    },
    
    // Timezone
    timezone: {
        execute: async (client, msg, args) => {
            const tz = args[1];
            if (!tz) return msg.reply('❌ Provide timezone (e.g., Africa/Nairobi)');
            
            settings.global.timezone = tz;
            saveSettings();
            msg.reply(`✅ Timezone set to: ${tz}`);
        }
    },
    
    // Bot profile picture
    botpic: {
        execute: async (client, msg, args) => {
            if (!msg.hasMedia) return msg.reply('❌ Send an image with !botpic');
            
            msg.reply('🔄 Setting bot profile picture...');
            try {
                const media = await msg.downloadMedia();
                await client.setProfilePic(media.data, 'image/jpeg');
                settings.global.botpic = 'set';
                saveSettings();
                msg.reply('✅ Bot profile picture updated!');
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },
    
    // Bot URL
    boturl: {
        execute: async (client, msg, args) => {
            const url = args[1];
            if (!url) return msg.reply('❌ Provide URL!');
            
            settings.global.boturl = url;
            saveSettings();
            msg.reply(`✅ Bot URL set to: ${url}`);
        }
    },
    
    // Mode (public/private)
    mode: {
        execute: async (client, msg, args) => {
            const mode = args[1]?.toLowerCase();
            if (!mode || !['public', 'private'].includes(mode)) 
                return msg.reply('❌ Usage: !mode public/private');
            
            settings.global.mode = mode;
            saveSettings();
            msg.reply(`✅ Bot mode set to: ${mode}`);
        }
    },
    
    // Prefix
    prefix: {
        execute: async (client, msg, args) => {
            const prefix = args[1];
            if (!prefix) return msg.reply('❌ Provide prefix (e.g., ! or .)');
            
            settings.global.prefix = prefix;
            saveSettings();
            msg.reply(`✅ Prefix set to: ${prefix}`);
        }
    },
    
    // Presence (online/offline/typing)
    presence: {
        execute: async (client, msg, args) => {
            const status = args[1]?.toLowerCase();
            if (!status || !['online', 'offline', 'typing'].includes(status)) 
                return msg.reply('❌ Usage: !presence online/offline/typing');
            
            settings.global.presence = status;
            saveSettings();
            msg.reply(`✅ Presence set to: ${status}`);
        }
    },
    
    // --- BOT SETTINGS VIEWER ---
    
    // View all bot settings
    botsettings: {
        execute: async (client, msg, args) => {
            let text = `📋 ADEZ MD SETTINGS\n\n`;
            text += `📌 Prefix: ${settings.global.prefix}\n`;
            text += `🤖 Bot Name: ${settings.global.botname}\n`;
            text += `👤 Author: ${settings.global.author}\n`;
            text += `📦 Pack: ${settings.global.packname}\n`;
            text += `🌍 Timezone: ${settings.global.timezone}\n`;
            text += `🟢 Presence: ${settings.global.presence}\n`;
            text += `📡 Mode: ${settings.global.mode}\n`;
            text += `🌐 URL: ${settings.global.boturl}\n\n`;
            
            text += `🛡️ ANTI FEATURES:\n`;
            text += `  Anti-call: ${settings.global.anticall ? '✅ ON' : '❌ OFF'}\n`;
            text += `  Auto-block: ${settings.global.autoblock ? '✅ ON' : '❌ OFF'}\n`;
            text += `  Anti-delete: ${settings.global.antidelete ? '✅ ON' : '❌ OFF'}\n\n`;
            
            text += `🤖 AUTO FEATURES:\n`;
            text += `  Auto-read: ${settings.global.autoread ? '✅ ON' : '❌ OFF'}\n`;
            text += `  Auto-view status: ${settings.global.autoviewstatus ? '✅ ON' : '❌ OFF'}\n`;
            text += `  Auto-reply status: ${settings.global.autoreplystatus ? '✅ ON' : '❌ OFF'}\n`;
            text += `  Auto-like status: ${settings.global.autolikestatus ? '✅ ON' : '❌ OFF'}\n`;
            text += `  Auto-bio: ${settings.global.autobio ? '✅ ON' : '❌ OFF'}\n`;
            text += `  Chatbot: ${settings.global.chatbot ? '✅ ON' : '❌ OFF'}\n`;
            
            msg.reply(text);
        }
    },
    
    // --- BOT STATUS COMMANDS ---
    
    // Check bot status
    status: {
        execute: async (client, msg, args) => {
            const uptime = process.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            
            msg.reply(`🟢 ADEZ MD STATUS
            \n🤖 Bot: ${settings.global.botname}
            \n👤 Owner: ${config.owner.name}
            \n📞 ${config.owner.number}
            \n⏱️ Uptime: ${days}d ${hours}h ${minutes}m
            \n📡 Mode: ${settings.global.mode}
            \n🟢 Presence: ${settings.global.presence}
            \n📌 Prefix: ${settings.global.prefix}`);
        }
    }
};
