const mineflayer = require('mineflayer');

const HOST = 'Singhking_77.aternos.me';
const PORT = 59005;
const USERNAME = 'GULAAM';

let bot = null;

function createBot() {
  console.log('Spawning bot...');
  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
  });

  bot.on('login', () => {
    console.log('GULAAM has joined the server.');
  });

  bot.on('end', () => {
    console.log('GULAAM has left the server.');
  });

  bot.on('error', (err) => {
    console.error('Bot encountered an error:', err.message);
  });

  // Leave after 3 minutes
  setTimeout(() => {
    if (bot) {
      bot.quit('Leaving after 3 minutes...');
      bot = null;
      setTimeout(createBot, 20 * 1000); // Wait 20 seconds before rejoining
    }
  }, 3 * 60 * 1000); // 3 minutes
}

// Start the loop
createBot();
