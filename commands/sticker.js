const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const axios = require('axios');

module.exports = {
    // Create sticker from image/video
    sticker: {
        execute: async (client, msg, args) => {
            if (!msg.hasMedia) return msg.reply('❌ Send an image/video with !sticker');
            
            msg.reply('🔄 Creating sticker...');
            try {
                const media = await msg.downloadMedia();
                const buffer = Buffer.from(media.data, 'base64');
                const filename = `./sticker_${Date.now()}.webp`;
                
                // Convert to WebP (sticker format)
                await sharp(buffer)
                    .resize(512, 512, { fit: 'contain' })
                    .webp()
                    .toFile(filename);
                
                await client.sendMessage(msg.from, {
                    sticker: fs.readFileSync(filename)
                });
                fs.unlinkSync(filename);
                msg.reply('✅ Sticker sent!');
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Animated Text to Sticker (ATTp)
    attp: {
        execute: async (client, msg, args) => {
            const text = args.slice(1).join(' ');
            if (!text) return msg.reply('❌ Provide text!');
            
            msg.reply('🔄 Creating animated text sticker...');
            try {
                // Generate ATTp using a free API
                const response = await axios.get(
                    `https://api.erdwpe.com/api/attp?text=${encodeURIComponent(text)}`,
                    { responseType: 'arraybuffer' }
                );
                
                const filename = `./attp_${Date.now()}.webp`;
                fs.writeFileSync(filename, Buffer.from(response.data));
                
                await client.sendMessage(msg.from, {
                    sticker: fs.readFileSync(filename)
                });
                fs.unlinkSync(filename);
                msg.reply('✅ Animated sticker sent!');
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // ATTp v2 (alternative API)
    attp2: {
        execute: async (client, msg, args) => {
            const text = args.slice(1).join(' ');
            if (!text) return msg.reply('❌ Provide text!');
            
            msg.reply('🔄 Creating animated sticker v2...');
            try {
                const response = await axios.get(
                    `https://api.maher-zubair.tech/attp?text=${encodeURIComponent(text)}`,
                    { responseType: 'arraybuffer' }
                );
                
                const filename = `./attp2_${Date.now()}.webp`;
                fs.writeFileSync(filename, Buffer.from(response.data));
                
                await client.sendMessage(msg.from, {
                    sticker: fs.readFileSync(filename)
                });
                fs.unlinkSync(filename);
                msg.reply('✅ Animated sticker v2 sent!');
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // TGS Sticker (Telegram animated sticker)
    tgs: {
        execute: async (client, msg, args) => {
            if (!msg.hasMedia) return msg.reply('❌ Send a video with !tgs');
            
            msg.reply('🔄 Creating TGS sticker...');
            try {
                const media = await msg.downloadMedia();
                const buffer = Buffer.from(media.data, 'base64');
                const inputFile = `./tgs_input_${Date.now()}.mp4`;
                const outputFile = `./tgs_${Date.now()}.webp`;
                
                fs.writeFileSync(inputFile, buffer);
                
                // Convert to WebP using ffmpeg
                exec(`ffmpeg -i ${inputFile} -vcodec libwebp -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${outputFile}`, 
                async (error) => {
                    if (error) {
                        fs.unlinkSync(inputFile);
                        return msg.reply(`❌ Error: ${error.message}`);
                    }
                    
                    if (fs.existsSync(outputFile)) {
                        await client.sendMessage(msg.from, {
                            sticker: fs.readFileSync(outputFile)
                        });
                        fs.unlinkSync(inputFile);
                        fs.unlinkSync(outputFile);
                        msg.reply('✅ TGS sticker sent!');
                    }
                });
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // TGS v2
    tgs2: {
        execute: async (client, msg, args) => {
            if (!msg.hasMedia) return msg.reply('❌ Send a video with !tgs2');
            msg.reply('🔄 Creating TGS v2 sticker...');
            // Same logic as tgs but with different parameters
            await module.exports.tgs.execute(client, msg, args);
        }
    },

    // Sticker Search
    stickersearch: {
        execute: async (client, msg, args) => {
            const query = args.slice(1).join(' ');
            if (!query) return msg.reply('❌ Provide search term!');
            
            msg.reply(`🔍 Searching stickers for: ${query}`);
            try {
                const response = await axios.get(
                    `https://api.maher-zubair.tech/sticker?q=${encodeURIComponent(query)}`
                );
                
                if (response.data && response.data.result) {
                    const stickerUrl = response.data.result;
                    const filename = `./sticker_search_${Date.now()}.webp`;
                    
                    const mediaResponse = await axios({
                        method: 'get',
                        url: stickerUrl,
                        responseType: 'arraybuffer'
                    });
                    
                    fs.writeFileSync(filename, Buffer.from(mediaResponse.data));
                    await client.sendMessage(msg.from, {
                        sticker: fs.readFileSync(filename)
                    });
                    fs.unlinkSync(filename);
                    msg.reply('✅ Sticker found!');
                } else {
                    msg.reply('❌ No stickers found.');
                }
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Sticker Search v2
    stickersearch2: {
        execute: async (client, msg, args) => {
            const query = args.slice(1).join(' ');
            if (!query) return msg.reply('❌ Provide search term!');
            msg.reply(`🔍 Searching stickers v2 for: ${query}`);
            // Alternative API
            await module.exports.stickersearch.execute(client, msg, args);
        }
    },

    // Convert video to sticker
    tovideo: {
        execute: async (client, msg, args) => {
            if (!msg.hasMedia) return msg.reply('❌ Send a sticker with !tovideo');
            
            msg.reply('🔄 Converting sticker to video...');
            try {
                const media = await msg.downloadMedia();
                const buffer = Buffer.from(media.data, 'base64');
                const inputFile = `./sticker_${Date.now()}.webp`;
                const outputFile = `./video_${Date.now()}.mp4`;
                
                fs.writeFileSync(inputFile, buffer);
                
                exec(`ffmpeg -i ${inputFile} -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${outputFile}`,
                async (error) => {
                    if (error) {
                        fs.unlinkSync(inputFile);
                        return msg.reply(`❌ Error: ${error.message}`);
                    }
                    
                    if (fs.existsSync(outputFile)) {
                        await client.sendMessage(msg.from, {
                            video: fs.readFileSync(outputFile),
                            caption: '🔄 Converted sticker to video'
                        });
                        fs.unlinkSync(inputFile);
                        fs.unlinkSync(outputFile);
                        msg.reply('✅ Video sent!');
                    }
                });
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Quote Creator (QC) — Create quote image
    qc: {
        execute: async (client, msg, args) => {
            const text = args.slice(1).join(' ');
            if (!text) return msg.reply('❌ Provide quote text!');
            
            msg.reply('🔄 Creating quote image...');
            try {
                const response = await axios.get(
                    `https://api.maher-zubair.tech/quote?text=${encodeURIComponent(text)}`,
                    { responseType: 'arraybuffer' }
                );
                
                const filename = `./quote_${Date.now()}.jpg`;
                fs.writeFileSync(filename, Buffer.from(response.data));
                
                await client.sendMessage(msg.from, {
                    image: fs.readFileSync(filename),
                    caption: `📝 "${text}"`
                });
                fs.unlinkSync(filename);
                msg.reply('✅ Quote image sent!');
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Emoji Mix — Combine emojis
    emomix: {
        execute: async (client, msg, args) => {
            const emojis = args.slice(1).join(' ');
            if (!emojis) return msg.reply('❌ Provide emojis (e.g., !emomix 😂❤️)');
            
            msg.reply('🔄 Creating emoji mix...');
            try {
                const response = await axios.get(
                    `https://api.maher-zubair.tech/emojimix?emoji=${encodeURIComponent(emojis)}`,
                    { responseType: 'arraybuffer' }
                );
                
                const filename = `./emomix_${Date.now()}.png`;
                fs.writeFileSync(filename, Buffer.from(response.data));
                
                await client.sendMessage(msg.from, {
                    image: fs.readFileSync(filename),
                    caption: `🎨 ${emojis}`
                });
                fs.unlinkSync(filename);
                msg.reply('✅ Emoji mix sent!');
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Brat Sticker
    brat: {
        execute: async (client, msg, args) => {
            const text = args.slice(1).join(' ');
            if (!text) return msg.reply('❌ Provide text!');
            
            msg.reply('🔄 Creating Brat sticker...');
            try {
                const response = await axios.get(
                    `https://api.maher-zubair.tech/brat?text=${encodeURIComponent(text)}`,
                    { responseType: 'arraybuffer' }
                );
                
                const filename = `./brat_${Date.now()}.webp`;
                fs.writeFileSync(filename, Buffer.from(response.data));
                
                await client.sendMessage(msg.from, {
                    sticker: fs.readFileSync(filename)
                });
                fs.unlinkSync(filename);
                msg.reply('✅ Brat sticker sent!');
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Brat Video
    bratvideo: {
        execute: async (client, msg, args) => {
            const text = args.slice(1).join(' ');
            if (!text) return msg.reply('❌ Provide text!');
            
            msg.reply('🔄 Creating Brat video...');
            try {
                const response = await axios.get(
                    `https://api.maher-zubair.tech/bratvideo?text=${encodeURIComponent(text)}`,
                    { responseType: 'arraybuffer' }
                );
                
                const filename = `./bratvideo_${Date.now()}.mp4`;
                fs.writeFileSync(filename, Buffer.from(response.data));
                
                await client.sendMessage(msg.from, {
                    video: fs.readFileSync(filename),
                    caption: `🎬 ${text}`
                });
                fs.unlinkSync(filename);
                msg.reply('✅ Brat video sent!');
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // Take — Take a sticker from a message
    take: {
        execute: async (client, msg, args) => {
            if (!msg.hasQuotedMsg) return msg.reply('❌ Reply to a sticker with !take');
            
            msg.reply('🔄 Taking sticker...');
            try {
                const quoted = await msg.getQuotedMessage();
                if (!quoted.hasMedia) return msg.reply('❌ Quoted message has no media!');
                
                const media = await quoted.downloadMedia();
                if (media.mimetype !== 'image/webp' && !media.mimetype.includes('sticker')) {
                    return msg.reply('❌ Quoted message is not a sticker!');
                }
                
                const buffer = Buffer.from(media.data, 'base64');
                const filename = `./taken_${Date.now()}.webp`;
                
                // Resize and optimize
                await sharp(buffer)
                    .resize(512, 512, { fit: 'contain' })
                    .webp()
                    .toFile(filename);
                
                await client.sendMessage(msg.from, {
                    sticker: fs.readFileSync(filename)
                });
                fs.unlinkSync(filename);
                msg.reply('✅ Sticker taken!');
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    },

    // EGIF — Convert video to GIF sticker
    egif: {
        execute: async (client, msg, args) => {
            if (!msg.hasMedia) return msg.reply('❌ Send a video with !egif');
            
            msg.reply('🔄 Creating GIF sticker...');
            try {
                const media = await msg.downloadMedia();
                const buffer = Buffer.from(media.data, 'base64');
                const inputFile = `./video_${Date.now()}.mp4`;
                const outputFile = `./gif_${Date.now()}.webp`;
                
                fs.writeFileSync(inputFile, buffer);
                
                exec(`ffmpeg -i ${inputFile} -vf "fps=10,scale=512:-1" -c:v libwebp -lossless 1 -loop 0 -an -vsync 0 ${outputFile}`,
                async (error) => {
                    if (error) {
                        fs.unlinkSync(inputFile);
                        return msg.reply(`❌ Error: ${error.message}`);
                    }
                    
                    if (fs.existsSync(outputFile)) {
                        await client.sendMessage(msg.from, {
                            sticker: fs.readFileSync(outputFile)
                        });
                        fs.unlinkSync(inputFile);
                        fs.unlinkSync(outputFile);
                        msg.reply('✅ GIF sticker sent!');
                    }
                });
            } catch (e) {
                msg.reply(`❌ Error: ${e.message}`);
            }
        }
    }
};
