import { InteractionResponseType, MessageComponentTypes, TextStyleTypes } from 'discord-interactions';

export const data = {
  name: 'new',
  description: "Create a new ticket",
};

export const getResponse = () => {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      title: 'Test',
      custom_id: 'test-modal',
      components: [
        {
          type: 1,
          components: [
            {
              type: MessageComponentTypes.STRING_SELECT,
              label: 'Short Input',
              custom_id: 'short-input',
              placeholder: 'Short Input',
              options: [
                {
                  label: 'Option 1',
                  value: 'option1',
                },
                {
                  label: 'Option 2',
                  value: 'option2',
                }
              ]
            },
          ],
        },
      ],
    },
  };
};
