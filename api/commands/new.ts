import { InteractionResponseType } from 'discord-interactions';

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
              type: 4,
              style: 1,
              label: 'Short Input',
              custom_id: 'short-input',
              placeholder: 'Short Input',
            },
          ],
        },
        {
          type: 1,
          components: [
            {
              type: 4,
              style: 1,
              label: 'Paragraph Input',
              custom_id: 'paragraph-input',
              placeholder: 'Paragraph Input',
              required: false,
            },
          ],
        },
      ],
    },
  };
};
