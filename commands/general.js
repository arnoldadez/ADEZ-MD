const config = require('../config');

module.exports = {
    vcard: {
        execute: async (client, msg, args) => {
            const name = args[1] || 'Contact';
            const number = args[2] || config.owner.number;
            const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;type=VOICE;waid=${number}:${number}\nEND:VCARD`;
            await client.sendMessage(msg.from, {
                contacts: {
                    displayName: name,
                    contacts: [{ vcard: vcard }]
                }
            });
            msg.reply('✅ VCard sent!');
        }
    },
    gitclone: {
        execute: async (client, msg, args) => {
            const url = args[1];
            if (!url) return msg.reply('❌ Provide GitHub URL!');
            msg.reply(`📦 Cloning: ${url} (Coming soon)`);
        }
    },
    report: {
        execute: async (client, msg, args) => {
            const issue = args.slice(1).join(' ');
            if (!issue) return msg.reply('❌ Describe the issue!');
            msg.reply(`📝 Report sent to owner!`);
        }
    },
    checkbotexpiry: {
        execute: async (client, msg, args) => {
            msg.reply('🟢 Bot expires: Never (Owned by Arnold Adez)');
        }
    },
    owner: {
        execute: async (client, msg, args) => {
            msg.reply(`👤 Owner: ${config.owner.name}\n📞 ${config.owner.number}`);
        }
    },
    developer: {
        execute: async (client, msg, args) => {
            msg.reply(`👨‍💻 Developer: Arnold Adez`);
        }
    },
    readmore: {
        execute: async (client, msg, args) => {
            const text = args.slice(1).join(' ');
            if (!text) return msg.reply('❌ Provide text!');
            const parts = text.match(/.{1,200}/g) || [text];
            msg.reply(parts[0] + (parts[1] ? '\n\nRead more...' : ''));
        }
    },
    screenshot: {
        execute: async (client, msg, args) => {
            msg.reply('📸 Screenshot feature coming soon...');
        }
    },
    menu: {
        execute: async (client, msg, args) => {
            const menu = `📌 ADEZ MD MENU

🤖 AI: mistral, claudeai, bard, perplexity, venice, adezai, hd, vision, vocalremover, transcribe, shazam, aimusic, imageedit, imageedit2, rc, bing, removebg

📚 EDUCATION: speechwriter, fruit, poem, dictionary

👥 GROUP: tagall, kick, promote, demote, grouplink, poll, open, close

📥 DOWNLOADER: play, video, instagram, tiktok, twitter, facebook

🎨 STICKER: sticker, tgs, attp, brat, qc, emomix

⚙️ SETTINGS: antibot, antispam, anticall, antilink, chatbot

👑 OWNER: eval, shell, restart, uptime, logout

📦 Use !help <command> for details`;
            msg.reply(menu);
        }
    },
    menu2: {
        execute: async (client, msg, args) => {
            msg.reply('📌 ADEZ MD MENU V2 - Coming soon!');
        }
    },
    getdesc: {
        execute: async (client, msg, args) => {
            msg.reply('📝 Description feature coming soon...');
        }
    },
    getcategory: {
        execute: async (client, msg, args) => {
            msg.reply('📂 Category feature coming soon...');
        }
    },
    getalias: {
        execute: async (client, msg, args) => {
            msg.reply('🔗 Alias feature coming soon...');
        }
    },
    keithsite: {
        execute: async (client, msg, args) => {
            msg.reply('🌐 KeithSite: https://keithkeith.com (Coming soon)');
        }
    },
    pair: {
        execute: async (client, msg, args) => {
            msg.reply('🔗 Pair code feature coming soon...');
        }
    },
    location: {
        execute: async (client, msg, args) => {
            msg.reply('📍 Location sharing coming soon...');
        }
    },
    copy: {
        execute: async (client, msg, args) => {
            msg.reply('📋 Copy feature coming soon...');
        }
    },
    repo: {
        execute: async (client, msg, args) => {
            msg.reply('📦 ADEZ MD Repo: https://github.com/arnoldadez/ADEZ-MD');
        }
    },
    repo2: {
        execute: async (client, msg, args) => {
            msg.reply('📦 Secondary repo coming soon...');
        }
    }
};
