import {
  InteractionResponseType,
} from 'discord-interactions';
import { MessageComponentTypes, TextInputStyles } from '../util';

export const data = {
  name: 'new',
  description: "Create a new ticket",
  options: [
    {
      type: MessageComponentTypes.STRING,
      name: "type",
      custom_id: "type",
      description: "Task category",
      required: true,
      choices: [
        'feature',
        'fix',
        'part',
        'documentation',
        'product',
        'media',
        'other',
      ].map((type) => {
        return {
          name: type,
          value: type,
        };
      })
    },
    {
      type: MessageComponentTypes.STRING,
      name: "assignees",
      description: "Task assignees",
      label: "assignees",
      custom_id: "assignees",
      required: true,
      min_length: 1,
      max_length: 256,
      style: TextInputStyles.SHORT,
    },
    {
      type: MessageComponentTypes.STRING,
      name: "title",
      description: "Task title",
      label: "title",
      custom_id: "title",
      required: true,
      min_length: 1,
      max_length: 128,
      style: TextInputStyles.SHORT,
    },
    {
      type: MessageComponentTypes.STRING,
      name: "description",
      description: "Task description",
      label: "description",
      custom_id: "description",
      min_length: 1,
      max_length: 2048,
      required: true,
      style: TextInputStyles.PARAGRAPH,
    },
    {
      type: MessageComponentTypes.STRING,
      name: "priority",
      custom_id: "priority",
      description: "Task priority",
      required: true,
      choices: [
        'extreme',
        'high',
        'medium',
        'low',
        'minimal',
      ].map((priority) => {
        return {
          name: priority,
          value: priority,
        };
      })
    },
  ]
};

export const getResponse = (message) => {
  console.log(message.data.options)

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'Ticket created!',
    },
  };
};
