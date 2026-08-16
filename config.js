require('dotenv').config();

module.exports = {
    owner: {
        name: "Arnold Adez",
        number: "+254111783552"
    },
    prefix: "!",
    mongodb: process.env.MONGODB_URI || "mongodb://localhost:27017/adez-md",
    apikeys: {
        openai: process.env.OPENAI_API_KEY || "",
        gemini: process.env.GEMINI_API_KEY || "",
        anthropic: process.env.ANTHROPIC_API_KEY || ""
    },
    autoJoin: true,
    autoFollow: true,
    channelForward: true
};
