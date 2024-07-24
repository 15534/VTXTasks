import dotenv from 'dotenv';

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CID) {
  throw new Error('Missing environment variables');
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CID,
};
