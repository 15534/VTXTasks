import {
  InteractionResponseFlags,
  InteractionResponseType
} from 'discord-interactions';
import { MessageComponentTypes, TextInputStyles } from '../util';

export const data = {
  name: 'register',
  description: 'Add yourself as a member',
  options: [
    {
      type: MessageComponentTypes.STRING,
      name: 'email',
      description: 'Your Exeter email',
      label: 'email',
      custom_id: 'email',
      required: true,
      min_length: 1,
      max_length: 128,
      style: TextInputStyles.SHORT
    },
  ]
};

export const getResponse = async (message) => {
  console.log(message)

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.EPHEMERAL,
      content: 'Ticket created!'
    }
  };
};
