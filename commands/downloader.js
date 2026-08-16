const axios = require('axios');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

module.exports = {
    // YouTube Audio Download
    play: {
        execute: async (client, msg, args) => {
            const url = args[1];
            if (!url) return msg.reply('❌ Provide YouTube link!');
            if (!ytdl.validateURL(url)) return msg.reply('❌ Invalid YouTube URL!');
            
            msg.reply('🎵 Downloading audio...');
            try {
                const info = await ytdl.getInfo(url);
                const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
                const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
                const filename = `./${title}.mp3`;
                
                stream.pipe(fs.createWriteStream(filename));
                stream.on('end', async () => {
                    await client.sendMessage(msg.from, {
                        audio: fs.readFileSync(filename),
                        mimetype: 'audio/mpeg',
                        fileName: `${title}.mp3`
                    });
                    fs.unlinkSync(filename);
                    msg.reply('✅ Audio sent!');
                });
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // YouTube Video Download
    video: {
        execute: async (client, msg, args) => {
            const url = args[1];
            if (!url) return msg.reply('❌ Provide YouTube link!');
            if (!ytdl.validateURL(url)) return msg.reply('❌ Invalid YouTube URL!');
            
            msg.reply('🎬 Downloading video...');
            try {
                const info = await ytdl.getInfo(url);
                const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
                const stream = ytdl(url, { filter: 'videoandaudio', quality: 'highest' });
                const filename = `./${title}.mp4`;
                
                stream.pipe(fs.createWriteStream(filename));
                stream.on('end', async () => {
                    await client.sendMessage(msg.from, {
                        video: fs.readFileSync(filename),
                        mimetype: 'video/mp4',
                        fileName: `${title}.mp4`,
                        caption: `🎬 ${title}`
                    });
                    fs.unlinkSync(filename);
                    msg.reply('✅ Video sent!');
                });
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Instagram Downloader
    instagram: {
        execute: async (client, msg, args) => {
            const url = args[1];
            if (!url) return msg.reply('❌ Provide Instagram link!');
            if (!url.includes('instagram.com')) return msg.reply('❌ Not an Instagram link!');
            
            msg.reply('📸 Downloading Instagram media...');
            try {
                // Using a free API for Instagram download
                const response = await axios.get(`https://api.instagram.com/oembed?url=${url}`);
                const mediaUrl = response.data.thumbnail_url || response.data.url;
                
                if (mediaUrl) {
                    const filename = `./instagram_${Date.now()}.jpg`;
                    const writer = fs.createWriteStream(filename);
                    const mediaResponse = await axios({ method: 'get', url: mediaUrl, responseType: 'stream' });
                    mediaResponse.data.pipe(writer);
                    
                    writer.on('finish', async () => {
                        await client.sendMessage(msg.from, {
                            image: fs.readFileSync(filename),
                            caption: '📸 Instagram media'
                        });
                        fs.unlinkSync(filename);
                        msg.reply('✅ Sent!');
                    });
                } else {
                    msg.reply('❌ Could not fetch media.');
                }
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // TikTok Downloader
    tiktok: {
        execute: async (client, msg, args) => {
            const url = args[1];
            if (!url) return msg.reply('❌ Provide TikTok link!');
            if (!url.includes('tiktok.com')) return msg.reply('❌ Not a TikTok link!');
            
            msg.reply('🎵 Downloading TikTok video...');
            try {
                // Using a free API
                const response = await axios.get(`https://www.tiktok.com/oembed?url=${url}`);
                const videoUrl = response.data.thumbnail_url || response.data.url;
                
                if (videoUrl) {
                    const filename = `./tiktok_${Date.now()}.mp4`;
                    const writer = fs.createWriteStream(filename);
                    const mediaResponse = await axios({ method: 'get', url: videoUrl, responseType: 'stream' });
                    mediaResponse.data.pipe(writer);
                    
                    writer.on('finish', async () => {
                        await client.sendMessage(msg.from, {
                            video: fs.readFileSync(filename),
                            caption: '🎵 TikTok video'
                        });
                        fs.unlinkSync(filename);
                        msg.reply('✅ Sent!');
                    });
                } else {
                    msg.reply('❌ Could not fetch video.');
                }
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Twitter/X Downloader
    twitter: {
        execute: async (client, msg, args) => {
            const url = args[1];
            if (!url) return msg.reply('❌ Provide Twitter link!');
            if (!url.includes('twitter.com') && !url.includes('x.com')) 
                return msg.reply('❌ Not a Twitter/X link!');
            
            msg.reply('🐦 Downloading Twitter media...');
            try {
                // Using a free API
                const response = await axios.get(`https://api.twitter.com/oembed?url=${url}`);
                const mediaUrl = response.data.thumbnail_url || response.data.url;
                
                if (mediaUrl) {
                    const filename = `./twitter_${Date.now()}.jpg`;
                    const writer = fs.createWriteStream(filename);
                    const mediaResponse = await axios({ method: 'get', url: mediaUrl, responseType: 'stream' });
                    mediaResponse.data.pipe(writer);
                    
                    writer.on('finish', async () => {
                        await client.sendMessage(msg.from, {
                            image: fs.readFileSync(filename),
                            caption: '🐦 Twitter media'
                        });
                        fs.unlinkSync(filename);
                        msg.reply('✅ Sent!');
                    });
                } else {
                    msg.reply('❌ Could not fetch media.');
                }
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Facebook Downloader
    facebook: {
        execute: async (client, msg, args) => {
            const url = args[1];
            if (!url) return msg.reply('❌ Provide Facebook link!');
            if (!url.includes('facebook.com')) return msg.reply('❌ Not a Facebook link!');
            
            msg.reply('📘 Downloading Facebook video...');
            try {
                // Using a free API
                const response = await axios.get(`https://www.facebook.com/plugins/video/oembed.json?url=${url}`);
                const videoUrl = response.data.thumbnail_url || response.data.url;
                
                if (videoUrl) {
                    const filename = `./facebook_${Date.now()}.mp4`;
                    const writer = fs.createWriteStream(filename);
                    const mediaResponse = await axios({ method: 'get', url: videoUrl, responseType: 'stream' });
                    mediaResponse.data.pipe(writer);
                    
                    writer.on('finish', async () => {
                        await client.sendMessage(msg.from, {
                            video: fs.readFileSync(filename),
                            caption: '📘 Facebook video'
                        });
                        fs.unlinkSync(filename);
                        msg.reply('✅ Sent!');
                    });
                } else {
                    msg.reply('❌ Could not fetch video.');
                }
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Spotify Downloader (Placeholder - requires API)
    spotify: {
        execute: async (client, msg, args) => {
            const url = args[1];
            if (!url) return msg.reply('❌ Provide Spotify link!');
            if (!url.includes('spotify.com')) return msg.reply('❌ Not a Spotify link!');
            
            msg.reply('🎵 Spotify download requires API key (coming soon)');
        }
    },

    // Pinterest Downloader
    pinterest: {
        execute: async (client, msg, args) => {
            const url = args[1];
            if (!url) return msg.reply('❌ Provide Pinterest link!');
            if (!url.includes('pinterest.com')) return msg.reply('❌ Not a Pinterest link!');
            
            msg.reply('📌 Downloading Pinterest image...');
            try {
                // Using a free API
                const response = await axios.get(`https://api.pinterest.com/v3/pidgets/pins/info/?url=${url}`);
                const mediaUrl = response.data?.resource_response?.data?.image_original_url || response.data?.url;
                
                if (mediaUrl) {
                    const filename = `./pinterest_${Date.now()}.jpg`;
                    const writer = fs.createWriteStream(filename);
                    const mediaResponse = await axios({ method: 'get', url: mediaUrl, responseType: 'stream' });
                    mediaResponse.data.pipe(writer);
                    
                    writer.on('finish', async () => {
                        await client.sendMessage(msg.from, {
                            image: fs.readFileSync(filename),
                            caption: '📌 Pinterest image'
                        });
                        fs.unlinkSync(filename);
                        msg.reply('✅ Sent!');
                    });
                } else {
                    msg.reply('❌ Could not fetch image.');
                }
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // SoundCloud Downloader (Placeholder)
    soundcloud: {
        execute: async (client, msg, args) => {
            const url = args[1];
            if (!url) return msg.reply('❌ Provide SoundCloud link!');
            if (!url.includes('soundcloud.com')) return msg.reply('❌ Not a SoundCloud link!');
            
            msg.reply('🎵 SoundCloud download coming soon...');
        }
    },

    // Instagram Story Downloader
    igstory: {
        execute: async (client, msg, args) => {
            const url = args[1];
            if (!url) return msg.reply('❌ Provide Instagram story link!');
            if (!url.includes('instagram.com/stories/')) 
                return msg.reply('❌ Not an Instagram story link!');
            
            msg.reply('📸 Downloading Instagram story...');
            try {
                // Using a free API
                const response = await axios.get(`https://api.instagram.com/oembed?url=${url}`);
                const mediaUrl = response.data.thumbnail_url || response.data.url;
                
                if (mediaUrl) {
                    const filename = `./igstory_${Date.now()}.jpg`;
                    const writer = fs.createWriteStream(filename);
                    const mediaResponse = await axios({ method: 'get', url: mediaUrl, responseType: 'stream' });
                    mediaResponse.data.pipe(writer);
                    
                    writer.on('finish', async () => {
                        await client.sendMessage(msg.from, {
                            image: fs.readFileSync(filename),
                            caption: '📸 Instagram story'
                        });
                        fs.unlinkSync(filename);
                        msg.reply('✅ Sent!');
                    });
                } else {
                    msg.reply('❌ Could not fetch story.');
                }
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // APK Downloader (from APKMirror, etc.)
    apk: {
        execute: async (client, msg, args) => {
            const app = args.slice(1).join(' ');
            if (!app) return msg.reply('❌ Provide app name!');
            
            msg.reply(`📱 Searching for ${app} APK... (coming soon)`);
        }
    },

    // MediaFire Downloader
    mfire: {
        execute: async (client, msg, args) => {
            const url = args[1];
            if (!url) return msg.reply('❌ Provide MediaFire link!');
            if (!url.includes('mediafire.com')) return msg.reply('❌ Not a MediaFire link!');
            
            msg.reply('📁 Downloading from MediaFire... (coming soon)');
        }
    }
};
