import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('test')
  .setDescription('Replies with working!');

export async function execute(interaction) {
  return interaction.reply('Working!');
}
