module.exports = {
    tagall: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            let text = '📢 @all\n';
            chat.participants.forEach(p => text += `@${p.id.user} `);
            await msg.reply(text);
        }
    },
    kick: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            const user = msg.mentionedIds[0];
            if (!user) return msg.reply('❌ Mention user!');
            await chat.removeParticipants([user]);
            msg.reply(`✅ Removed @${user.user}`);
        }
    },
    promote: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            const user = msg.mentionedIds[0];
            if (!user) return msg.reply('❌ Mention user!');
            await chat.promoteParticipants([user]);
            msg.reply(`✅ Promoted @${user.user}`);
        }
    },
    demote: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            const user = msg.mentionedIds[0];
            if (!user) return msg.reply('❌ Mention user!');
            await chat.demoteParticipants([user]);
            msg.reply(`✅ Demoted @${user.user}`);
        }
    },
    grouplink: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            const inviteCode = await chat.getInviteCode();
            msg.reply(`🔗 Group link: https://chat.whatsapp.com/${inviteCode}`);
        }
    },
    poll: {
        execute: async (client, msg, args) => {
            const question = args.slice(1).join(' ');
            if (!question) return msg.reply('❌ Provide question!');
            const chat = await msg.getChat();
            await chat.sendMessage(question);
            msg.reply('📊 Poll sent!');
        }
    },
    open: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            await chat.setMessagesAdminsOnly(false);
            msg.reply('✅ Group opened!');
        }
    },
    close: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            await chat.setMessagesAdminsOnly(true);
            msg.reply('✅ Group closed!');
        }
    },
    add: {
        execute: async (client, msg, args) => {
            const number = args[1];
            if (!number) return msg.reply('❌ Provide number!');
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            await chat.addParticipants([number + '@c.us']);
            msg.reply(`✅ Added ${number}`);
        }
    },
    delete: {
        execute: async (client, msg, args) => {
            msg.reply('❌ Delete message feature coming soon...');
        }
    },
    join: {
        execute: async (client, msg, args) => {
            const link = args[1];
            if (!link) return msg.reply('❌ Provide group link!');
            try {
                await client.acceptInvite(link.split('/').pop());
                msg.reply('✅ Joined group!');
            } catch (e) {
                msg.reply('❌ Failed to join group');
            }
        }
    },
    left: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            await chat.leave();
            msg.reply('👋 Left group!');
        }
    },
    groupname: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            const name = args.slice(1).join(' ');
            if (!name) return msg.reply('❌ Provide name!');
            await chat.setSubject(name);
            msg.reply(`✅ Group name changed to: ${name}`);
        }
    },
    gcdesc: {
        execute: async (client, msg, args) => {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ Group only!');
            const desc = args.slice(1).join(' ');
            if (!desc) return msg.reply('❌ Provide description!');
            await chat.setDescription(desc);
            msg.reply(`✅ Description updated!`);
        }
    },
    setgpp: {
        execute: async (client, msg, args) => {
            msg.reply('🖼️ Group profile picture coming soon...');
        }
    },
    // Add remaining group commands...
    demoteall: { execute: async (client, msg) => msg.reply('Coming soon...') },
    kickall: { execute: async (client, msg) => msg.reply('Coming soon...') },
    hidetag: { execute: async (client, msg) => msg.reply('Coming soon...') },
    all: { execute: async (client, msg) => msg.reply('Coming soon...') }
};
