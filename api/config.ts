import dotenv from 'dotenv';

dotenv.config();

const { DISCORD_PID, DISCORD_CID, DISCORD_TOKEN, DATABASE_URL } = process.env;

if (!DISCORD_PID || !DISCORD_CID || !DISCORD_TOKEN || !DATABASE_URL) {
  throw new Error('Missing environment variables');
}

export const config = {
  DISCORD_PID,
  DISCORD_CID,
  DISCORD_TOKEN,
  DATABASE_URL,
};
