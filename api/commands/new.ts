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
     
      ]
    },
  };
};
