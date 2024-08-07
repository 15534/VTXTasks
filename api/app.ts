import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';

import commands from './commands';
import { config } from './config';

module.exports = async (request, response) => {
  if (request.method === 'POST') {
    const signature = request.headers['x-signature-ed25519'];
    const timestamp = request.headers['x-signature-timestamp'];

    const rawBody = JSON.stringify(request.body);

    const isValidRequest = verifyKey(
      rawBody,
      signature,
      timestamp,
      config.DISCORD_PID,
    );

    if (!isValidRequest) {
      return response.status(401).send({ error: 'Invalid Request' });
    }

    const message = request.body;

    if (message.type === InteractionType.PING) {
      response.send({
        type: InteractionResponseType.PONG,
      });
    } else if (message.type === InteractionType.APPLICATION_COMMAND) {
      const commandName = message.data.name.toLowerCase();
      const command = commands[commandName as keyof typeof commands];

      response.status(200).send(command.getResponse());
    } else if (message.type === InteractionType.MESSAGE_COMPONENT) {
      console.log(message)
    } else {
      response.status(400).send({ error: 'Unknown Type' });
    }
  }
};
