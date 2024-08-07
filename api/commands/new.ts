import {
  InteractionResponseType,
} from 'discord-interactions';
import { MessageComponentTypes, TextInputStyles } from '../util';

export const data = {
  name: 'new',
  description: "Create a new ticket",
  options: [
    {
      type: MessageComponentTypes.STRING_SELECT,
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
      type: MessageComponentTypes.MENTIONABLE_SELECT,
      name: "assignees",
      custom_id: "assignees",
      description: "Members responsible for the task",
      required: true,
      max_values: 15,
    },
    {
      type: MessageComponentTypes.STRING_SELECT,
      label: "title",
      custom_id: "title",
      required: true,
      style: TextInputStyles.SHORT,
    },
    {
      type: MessageComponentTypes.STRING_SELECT,
      label: "description",
      custom_id: "description",
      required: true,
      style: TextInputStyles.PARAGRAPH,
    },
    {
      type: MessageComponentTypes.STRING_SELECT,
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
      ].map((type) => {
        return {
          name: type,
          value: type,
        };
      })
    },
  ]
};

export const getResponse = () => {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'Ticket created!',
    },
  };
};
