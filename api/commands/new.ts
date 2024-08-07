import { InteractionResponseType, MessageComponentTypes, TextStyleTypes, ActionRow } from 'discord-interactions';

export const data = {
  name: 'new',
  description: "Create a new ticket",
};

export const getResponse = () => {
  return {
    type: InteractionResponseType.MODAL,
    data: {
      title: 'New Ticket',
      custom_id: 'new-ticket',
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.STRING_SELECT,
              custom_id: 'subgroup-select',
              options: [
                {
                  label: 'Mechanical',
                  value: 'mechanical',
                },
                {
                  label: 'Programming',
                  value: 'programming',
                },
                {
                  label: 'Outreach',
                  value: 'outreach',
                },
              ]
            },
          ],
        }
      ]
    },
  };
};
