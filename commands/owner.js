const config = require('../config');
const fs = require('fs');
const { exec } = require('child_process');

module.exports = {
    // Owner Info
    whoami: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            msg.reply(`👤 You are the owner: ${config.owner.name}`);
        }
    },
    mygroups: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            const chats = await client.getChats();
            const groups = chats.filter(c => c.isGroup);
            let text = `📋 ${groups.length} Groups:\n\n`;
            groups.forEach((g, i) => {
                text += `${i+1}. ${g.name} (${g.participants.length} members)\n`;
            });
            msg.reply(text);
        }
    },
    pp: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            if (msg.hasMedia) {
                const media = await msg.downloadMedia();
                await client.sendMessage(msg.from, media);
                msg.reply('✅ Profile picture updated!');
            } else {
                msg.reply('❌ Send image with !pp');
            }
        }
    },
    rpp: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            await client.setProfilePic(null); // Remove profile pic
            msg.reply('✅ Profile picture removed!');
        }
    },
    logout: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            msg.reply('🚪 Logging out...');
            await client.destroy();
        }
    },
    // Eval - Run JavaScript code
    eval: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            const code = args.slice(1).join(' ');
            if (!code) return msg.reply('❌ Provide code!');
            try {
                const result = eval(code);
                msg.reply(`✅ ${result}`);
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },
    // Shell - Run shell commands
    shell: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            const cmd = args.slice(1).join(' ');
            if (!cmd) return msg.reply('❌ Provide command!');
            exec(cmd, (error, stdout, stderr) => {
                if (error) return msg.reply(`❌ ${error.message}`);
                msg.reply(`✅ ${stdout || stderr || 'Done'}`);
            });
        }
    },
    restart: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            msg.reply('🔄 Restarting...');
            process.exit(0);
        }
    },
    uptime: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            const uptime = process.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            msg.reply(`🟢 Uptime: ${days}d ${hours}h ${minutes}m`);
        }
    },
    // Fetch - Fetch URL content
    fetch: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            const url = args[1];
            if (!url) return msg.reply('❌ Provide URL!');
            try {
                const response = await fetch(url);
                const text = await response.text();
                msg.reply(text.substring(0, 4000));
            } catch (e) {
                msg.reply(`❌ ${e.message}`);
            }
        }
    },
    save: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            const filename = args[1];
            if (!filename) return msg.reply('❌ Provide filename!');
            if (msg.hasMedia) {
                const media = await msg.downloadMedia();
                fs.writeFileSync(filename, media.data, 'base64');
                msg.reply(`✅ Saved to ${filename}`);
            } else {
                const text = args.slice(2).join(' ');
                fs.writeFileSync(filename, text);
                msg.reply(`✅ Saved to ${filename}`);
            }
        }
    },
    // JID - Get JID of user
    jid: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            const user = msg.mentionedIds[0] || msg.from;
            msg.reply(`📇 JID: ${user}`);
        }
    },
    setsudo: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            msg.reply('✅ Sudo feature coming soon...');
        }
    },
    delsudo: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            msg.reply('✅ Sudo removed (feature coming soon)');
        }
    },
    getsudo: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            msg.reply('📋 Sudo list coming soon...');
        }
    },
    profile: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            const user = msg.mentionedIds[0] || msg.from;
            const contact = await client.getContactById(user);
            msg.reply(`👤 Name: ${contact.name || contact.pushname || 'Unknown'}\n📱 Number: ${contact.number}\n🟢 Online: ${contact.isOnline || 'Unknown'}`);
        }
    },
    warn: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            const user = msg.mentionedIds[0];
            if (!user) return msg.reply('❌ Mention user!');
            const reason = args.slice(2).join(' ') || 'No reason';
            msg.reply(`⚠️ Warning sent to @${user.user}: ${reason}`);
        }
    },
    pdf: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            msg.reply('📄 PDF generation coming soon...');
        }
    },
    // Full profile picture
    fullpp: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            msg.reply('🖼️ Full profile picture coming soon...');
        }
    },
    createcall: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            msg.reply('📞 Call feature coming soon...');
        }
    },
    chunk: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            const text = args.slice(1).join(' ');
            if (!text) return msg.reply('❌ Provide text!');
            const chunks = text.match(/.{1,2000}/g) || [text];
            for (const chunk of chunks) {
                await msg.reply(chunk);
            }
        }
    },
    vv: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            msg.reply('📩 View once message feature coming soon...');
        }
    },
    vv2: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            msg.reply('📩 View once v2 coming soon...');
        }
    },
    gtcdd: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            msg.reply('📅 GTCDD feature coming soon...');
        }
    },
    note: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            const note = args.slice(1).join(' ');
            if (!note) return msg.reply('❌ Provide note!');
            fs.appendFileSync('notes.txt', `\n${note}`);
            msg.reply('✅ Note saved!');
        }
    },
    listnote: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            if (fs.existsSync('notes.txt')) {
                const notes = fs.readFileSync('notes.txt', 'utf8');
                msg.reply(`📋 Notes:\n${notes}`);
            } else {
                msg.reply('📋 No notes found.');
            }
        }
    },
    viewnote: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            const id = parseInt(args[1]);
            if (!id) return msg.reply('❌ Provide note ID!');
            if (fs.existsSync('notes.txt')) {
                const notes = fs.readFileSync('notes.txt', 'utf8').split('\n').filter(n => n);
                if (notes[id]) msg.reply(`📝 Note ${id}: ${notes[id]}`);
                else msg.reply('❌ Note not found.');
            } else {
                msg.reply('📋 No notes found.');
            }
        }
    },
    removenote: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            const id = parseInt(args[1]);
            if (!id) return msg.reply('❌ Provide note ID!');
            if (fs.existsSync('notes.txt')) {
                const notes = fs.readFileSync('notes.txt', 'utf8').split('\n').filter(n => n);
                if (notes[id]) {
                    notes.splice(id, 1);
                    fs.writeFileSync('notes.txt', notes.join('\n'));
                    msg.reply(`✅ Note ${id} removed!`);
                } else {
                    msg.reply('❌ Note not found.');
                }
            }
        }
    },
    clearnotes: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            fs.writeFileSync('notes.txt', '');
            msg.reply('✅ All notes cleared!');
        }
    },
    reshare: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            msg.reply('🔄 Reshare feature coming soon...');
        }
    },
    jidcount: {
        execute: async (client, msg, args) => {
            if (msg.from !== config.owner.number) return msg.reply('❌ Owner only!');
            const chats = await client.getChats();
            msg.reply(`📊 Total chats: ${chats.length}`);
        }
    }
};
