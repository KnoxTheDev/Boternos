const mineflayer = require('mineflayer');
const express = require('express');
const axios = require('axios');

const HOST = 'warforsmp2025.aternos.me';
const PORT = 13216;
const USERNAME = 'GULAAM';
const JOIN_TIME = 3 * 60 * 1000;
const LEAVE_TIME = 20 * 1000;
const SELF_URL = 'https://boternos.onrender.com'; // your Render URL

let bot = null;
const app = express();
app.get('/', (req, res) => res.send('AFK Bot is alive'));
app.listen(10000, () => console.log('[HTTP] Keep-alive server listening on port 10000'));

function safeLog(...args) {
  try { console.log(...args); } catch (_) {}
}

function createBot() {
  safeLog('[INFO] Attempting to spawn GULAAM...');

  try {
    bot = mineflayer.createBot({
      host: HOST,
      port: PORT,
      username: USERNAME,
    });

    bot.on('login', () => safeLog('[INFO] GULAAM joined the server.'));
    bot.on('spawn', () => safeLog('[INFO] GULAAM is now active.'));
    bot.on('end', () => {
      safeLog('[INFO] Disconnected from server.');
      setTimeout(createBot, LEAVE_TIME);
    });
    bot.on('error', (err) => {
      safeLog('[ERROR] Bot error:', err.message);
    });

    // Leave after JOIN_TIME
    setTimeout(() => {
      if (bot && typeof bot.quit === 'function') {
        safeLog('[INFO] Leaving server after 3 minutes...');
        bot.quit(); // triggers 'end' and restart
        bot = null;
      }
    }, JOIN_TIME);

  } catch (err) {
    safeLog('[ERROR] Bot crashed during setup:', err.message);
    setTimeout(createBot, LEAVE_TIME);
  }
}

// Self-ping loop to stay alive
setInterval(() => {
  axios.get(SELF_URL).then(() => {
    safeLog('[HTTP] Self-ping successful.');
  }).catch((err) => {
    safeLog('[HTTP] Self-ping failed:', err.message);
  });
}, 4 * 60 * 1000); // ping every 4 minutes

// Global protection
process.on('uncaughtException', (err) => safeLog('[FATAL] Uncaught Exception:', err.message));
process.on('unhandledRejection', (reason) => safeLog('[FATAL] Unhandled Rejection:', reason));

// Start bot
createBot();
