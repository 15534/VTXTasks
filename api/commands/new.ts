import { InteractionResponseType, MessageComponentTypes, TextStyleTypes } from 'discord-interactions';

export const data = {
  name: 'new',
  description: "Create a new ticket",
};

export const getResponse = () => {
  return {
    type: InteractionResponseType.MODAL,
    data: {
      title: 'Test',
      custom_id: 'test-modal',
      components: [
        {
          type: 1,
          components: [
            {
              type: MessageComponentTypes.INPUT_TEXT,
              style: TextStyleTypes.SHORT,
              label: 'Short Input',
              custom_id: 'short-input',
              placeholder: 'Short Input',
            },
          ],
        },
      ],
    },
  };
};
