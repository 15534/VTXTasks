import { InteractionResponseType } from 'discord-interactions';

export interface ResponseType {
  type: InteractionResponseType,
  data: {
    content: string,
  }
}