import { Routes } from 'discord-api-types/v10';
import { REST } from 'discord.js';

import commands from './commands';
import { config } from './config';

const data = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

export async function deploy(guildId) {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CID, guildId),
      {
        body: data,
      },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}
