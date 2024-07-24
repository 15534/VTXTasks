import { Client } from 'discord.js';

import commands from './commands';
import { config } from './config';
import { deploy } from './deploy';

const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
});

client.once('ready', () => {
  console.log('COMING WITH VENGEANCE');
});

client.once('guildAvailable', async (guild) => {
  await deploy(guild.id);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName } = interaction;

  if (commands[commandName as keyof typeof commands]) {
    await commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);
