const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Express server taaki Render 24/7 active rakhe
app.get('/', (req, res) => {
  res.send('WINDS Bot Status: 24/7 Active & Running');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running and listening on port ${PORT}`);
});

// Keep-alive ping har 5 minute mein
setInterval(() => {
  http.get(`http://localhost:${PORT}`, (res) => {}).on('error', (err) => {
    // ignore error
  });
}, 5 * 60 * 1000);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

const PREFIX = '!';

client.once('ready', () => {
  console.log(`[+] Logged in successfully as ${client.user.tag}!`);

  // Plain status: 'dnd' (Do Not Disturb) ya 'online' rakha hai bina kisi risky rich presence ke
  client.user.setPresence({
    status: 'dnd', 
    activities: []
  });
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // 1. EMBED COMMAND (!embed <message>)
    if (command === 'embed') {
      const embedText = args.join(' ') || 'WINDS Development Embed Message';
      const embed = new EmbedBuilder()
        .setColor('#ff0000') // Red theme
        .setTitle('THE BLACK MARKET')
        .setDescription(embedText)
        .setImage('https://i.imgur.com/your-banner-image.png') // Yahan apni banner photo ka direct URL daal dena
        .setFooter({ text: 'THE BLACK MARKET' });

      await message.channel.send({ embeds: [embed] });
      await message.delete().catch(() => {});
    }

    // 2. DM COMMAND (!dm @username <message>)
    if (command === 'dm') {
      const targetUser = message.mentions.users.first();
      const dmText = args.slice(1).join(' ');

      if (!targetUser) {
        return message.reply('Kripya user mention karein! Usage: `!dm @username Hello message`');
      }
      if (!dmText) {
        return message.reply('Kripya sath mein message bhi likhein!');
      }

      try {
        await targetUser.send(dmText);
        await message.reply(`Successfully DM bhej diya ${targetUser.tag} ko!`);
      } catch (err) {
        await message.reply('DM nahi ja saka (shayad user ke DMs closed hain).');
      }
    }

    // 3. REVIEW / FEEDBACK COMMAND (Purane style ka review embed with photo & all details)
    if (command === 'review') {
      const reviewEmbed = new EmbedBuilder()
        .setColor('#ff0000') // Red neon accent theme
        .setTitle('New Feedback Recorded!')
        .addFields(
          { name: 'Buyer', value: `<@${message.author.id}>`, inline: false },
          { name: 'Product / Category', value: 'Server Boost / Nitro', inline: false },
          { name: 'Rating', value: '5/5 ⭐', inline: false },
          { name: 'Price', value: '40m / 38$', inline: false },
          { name: 'Reason', value: 'Very good service and you guys can trust on seller 100%', inline: false }
        )
        .setImage('https://i.imgur.com/your-banner-image.png') // Screenshots wali red banner photo ka link yahan aayega
        .setFooter({ text: 'THE BLACK MARKET' })
        .setTimestamp();

      await message.channel.send({ embeds: [reviewEmbed] });
      await message.delete().catch(() => {});
    }
  }
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('DISCORD_TOKEN environment variable is missing!');
  process.exit(1);
}

client.login(token);
