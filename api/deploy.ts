import { Routes } from 'discord-api-types/v10';
import { REST } from 'discord.js';
import { Client } from 'discord.js';

import commands from './commands';
import { config } from './config';

const data = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

export async function deploy(guildId) {
  try {
    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CID, guildId),
      {
        body: data,
      },
    );
  } catch (error) {
    console.error(error);
  }
}

const client = new Client({
  intents: ['Guilds'],
});

client.once('ready', () => {
  console.log('COMING WITH VENGEANCE');
});

client.once('guildAvailable', async (guild) => {
  await deploy(guild.id);

  process.exit();
});

client.login(config.DISCORD_TOKEN);
