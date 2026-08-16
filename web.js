const express = require('express');
const qrcode = require('qrcode');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve QR page
app.get('/', async (req, res) => {
    // Check if session exists
    const sessionExists = fs.existsSync('./session/creds.json');
    
    if (sessionExists) {
        res.send(`
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
                <div class="status online">🟢 ONLINE (Session Found)</div>
                <p><strong>Owner:</strong> Arnold Adez</p>
                <p><strong>Number:</strong> +254111783552</p>
                <p>Bot is already connected!</p>
                <p>Send <code>!ping</code> to test.</p>
            </div>
        </body>
        </html>
        `);
    } else {
        // Generate a placeholder QR (since bot isn't running yet)
        const placeholderQR = await qrcode.toDataURL('https://adez-md-jhwk.onrender.com');
        res.send(`
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
                <div class="status">📱 Waiting for QR...</div>
                <p>Bot is starting up. Please wait 30 seconds.</p>
                <p><strong>Owner:</strong> Arnold Adez</p>
                <p><strong>Number:</strong> +254111783552</p>
                <p>Or use Pair Code: <code>!pair 254111783552</code></p>
            </div>
            <script>
                setTimeout(() => { location.reload(); }, 10000);
            </script>
        </body>
        </html>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`🌐 Web UI: http://localhost:${PORT}`);
});
