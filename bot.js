const mineflayer = require('mineflayer');
const express = require('express');
const axios = require('axios');

const HOST = 'Singhking_77.aternos.me';
const PORT = 59005;
const USERNAME = 'GULAAM';
const JOIN_TIME = 3 * 60 * 1000; // 3 minutes
const LEAVE_TIME = 20 * 1000;    // 20 seconds
const SELF_URL = 'https://boternos.onrender.com';

let bot = null;

function safeLog(...args) {
  try {
    console.log(...args);
  } catch (_) {}
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
    bot.on('end', () => safeLog('[INFO] Disconnected from server.'));
    bot.on('error', (err) => safeLog('[ERROR] Bot error:', err.message));

    // Force quit after JOIN_TIME
    setTimeout(() => {
      try {
        if (bot) {
          safeLog('[INFO] Leaving server after 3 minutes...');
          bot.quit();
          bot = null;
        }
      } catch (e) {
        safeLog('[ERROR] Error while quitting:', e.message);
      }

      // Rejoin after LEAVE_TIME
      setTimeout(() => {
        createBot(); // Recursively restart loop
      }, LEAVE_TIME);

    }, JOIN_TIME);

  } catch (err) {
    safeLog('[ERROR] Bot crashed during setup:', err.message);
    // Wait and retry
    setTimeout(createBot, LEAVE_TIME);
  }
}

// Self-ping server setup
const app = express();
app.get('/', (req, res) => {
  res.send('GULAAM is awake 🟢');
});
const PORT_HTTP = process.env.PORT || 3000;
app.listen(PORT_HTTP, () => {
  safeLog(`[HTTP] Keep-alive server listening on port ${PORT_HTTP}`);
});

// Self-ping every 4 minutes
setInterval(() => {
  axios.get(SELF_URL)
    .then(() => safeLog('[PING] Self-pinged to stay awake.'))
    .catch(err => safeLog('[PING ERROR]', err.message));
}, 4 * 60 * 1000); // Every 4 minutes

// Global protection from unhandled crashes
process.on('uncaughtException', (err) => {
  safeLog('[FATAL] Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  safeLog('[FATAL] Unhandled Promise Rejection:', reason);
});

// Start bot loop
createBot();
